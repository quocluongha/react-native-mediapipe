"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KnownPoseLandmarks = exports.KnownPoseLandmarkConnections = void 0;
exports.PoseDetectionOnImage = PoseDetectionOnImage;
exports.usePoseDetection = usePoseDetection;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeVisionCamera = require("react-native-vision-camera");
var _types = require("../shared/types");
var _convert = require("../shared/convert");
var _reactNativeWorkletsCore = require("react-native-worklets-core");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  PoseDetection
} = _reactNative.NativeModules;
const eventEmitter = new _reactNative.NativeEventEmitter(PoseDetection);
const plugin = _reactNativeVisionCamera.VisionCameraProxy.initFrameProcessorPlugin("poseDetection", {});
if (!plugin) {
  throw new Error("Failed to initialize posedetection plugin");
}
function getPoseDetectionModule() {
  if (PoseDetection === undefined || PoseDetection === null) {
    throw new Error("PoseDetection module is not available");
  }
  return PoseDetection;
}
const detectorMap = new Map();
eventEmitter.addListener("onResults", args => {
  const callbacks = detectorMap.get(args.handle);
  if (callbacks) {
    callbacks.onResults(args, callbacks.viewCoordinator);
  }
});
eventEmitter.addListener("onError", args => {
  const callbacks = detectorMap.get(args.handle);
  if (callbacks) {
    callbacks.onError(args);
  }
});
function usePoseDetection(callbacks, runningMode, model, options) {
  const [detectorHandle, setDetectorHandle] = _react.default.useState();
  const [cameraViewDimensions, setCameraViewDimensions] = _react.default.useState({
    width: 1,
    height: 1
  });
  const cameraViewLayoutChangeHandler = _react.default.useCallback(event => {
    setCameraViewDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width
    });
  }, []);
  const outputOrientation = (0, _reactNativeWorkletsCore.useSharedValue)("portrait");
  const frameOrientation = (0, _reactNativeWorkletsCore.useSharedValue)("portrait");
  const forceOutputOrientation = (0, _reactNativeWorkletsCore.useSharedValue)(undefined);
  const forceCameraOrientation = (0, _reactNativeWorkletsCore.useSharedValue)(undefined);
  _react.default.useEffect(() => {
    forceCameraOrientation.value = options?.forceCameraOrientation;
    forceOutputOrientation.value = options?.forceOutputOrientation;
  }, [forceCameraOrientation, forceOutputOrientation, options?.forceCameraOrientation, options?.forceOutputOrientation]);
  const mirrorMode = options?.mirrorMode ?? _reactNative.Platform.select({
    android: "mirror-front-only",
    default: "no-mirror"
  });
  const [cameraDevice, setCameraDevice] = _react.default.useState(undefined);
  const mirrored = _react.default.useMemo(() => {
    if (mirrorMode === "mirror-front-only" && cameraDevice?.position === "front" || mirrorMode === "mirror") {
      return true;
    } else {
      return false;
    }
  }, [cameraDevice?.position, mirrorMode]);
  const [resizeMode, setResizeMode] = _react.default.useState("cover");
  const {
    onResults,
    onError
  } = callbacks;
  const updateDetectorMap = _react.default.useCallback(() => {
    if (detectorHandle !== undefined) {
      const viewCoordinator = new _convert.BaseViewCoordinator(cameraViewDimensions, mirrored, forceCameraOrientation.value ?? frameOrientation.value, forceOutputOrientation.value ?? outputOrientation.value, resizeMode);
      detectorMap.set(detectorHandle, {
        onResults,
        onError,
        viewCoordinator
      });
    }
  }, [cameraViewDimensions, detectorHandle, forceCameraOrientation.value, forceOutputOrientation.value, frameOrientation.value, mirrored, onError, onResults, outputOrientation.value, resizeMode]);

  // Remember the latest callback if it changes.
  _react.default.useLayoutEffect(() => {
    updateDetectorMap();
  }, [updateDetectorMap]);
  _react.default.useEffect(() => {
    let newHandle;
    console.log(`getPoseDetectionModule: delegate = ${options?.delegate}, runningMode = ${runningMode}, model= ${model}`);
    getPoseDetectionModule().createDetector(options?.numPoses ?? 1, options?.minPoseDetectionConfidence ?? 0.5, options?.minPosePresenceConfidence ?? 0.5, options?.minTrackingConfidence ?? 0.5, options?.shouldOutputSegmentationMasks ?? false, model, options?.delegate ?? _types.Delegate.GPU, runningMode).then(handle => {
      console.log("usePoseDetection.createDetector", runningMode, model, handle);
      setDetectorHandle(handle);
      newHandle = handle;
    }).catch(e => {
      console.error(`Failed to create detector: ${e}`);
    });
    return () => {
      console.log("usePoseDetection.useEffect.unsub", "releaseDetector", newHandle);
      if (newHandle !== undefined) {
        getPoseDetectionModule().releaseDetector(newHandle);
      }
    };
  }, [options?.delegate, runningMode, model, options?.numPoses, options?.minPoseDetectionConfidence, options?.minPosePresenceConfidence, options?.minTrackingConfidence, options?.shouldOutputSegmentationMasks]);
  const updateDetectorMapFromWorklet = (0, _reactNativeWorkletsCore.useRunOnJS)(updateDetectorMap, [updateDetectorMap]);
  const frameProcessor = (0, _reactNativeVisionCamera.useFrameProcessor)(frame => {
    "worklet";

    // console.log(
    //   `frameProcessor: ${frame.orientation}: ${frame.width}x${frame.height}:${outputOrientation.value}`
    // );
    // const orientation = frame.orientation;
    if (frame.orientation !== frameOrientation.value) {
      console.log("changing frame orientation", frame.orientation);
      frameOrientation.value = frame.orientation;
      updateDetectorMapFromWorklet();
    }
    // const orientation: ImageOrientation = worklet_relativeTo(
    //   outputOrientation.value,
    //   frameOrientation.value
    // );
    const orientation = forceOutputOrientation.value ?? outputOrientation.value;
    // const orientation: ImageOrientation = frameOrientation.value;
    const fpsMode = options?.fpsMode ?? "none";
    if (fpsMode === "none") {
      plugin?.call(frame, {
        detectorHandle,
        orientation
      });
    } else {
      (0, _reactNativeVisionCamera.runAtTargetFps)(fpsMode, () => {
        plugin?.call(frame, {
          detectorHandle,
          orientation
        });
      });
    }
  }, [detectorHandle, forceOutputOrientation.value, frameOrientation, options?.fpsMode, outputOrientation.value, updateDetectorMapFromWorklet]);
  return _react.default.useMemo(() => ({
    cameraViewLayoutChangeHandler,
    cameraDeviceChangeHandler: d => {
      setCameraDevice(d);
      console.log(`camera device change. sensorOrientation:${d?.sensorOrientation}`);
    },
    cameraOrientationChangedHandler: o => {
      outputOrientation.value = o;
      console.log(`output orientation change:${o}`);
    },
    resizeModeChangeHandler: setResizeMode,
    cameraViewDimensions,
    frameProcessor
  }), [cameraViewDimensions, cameraViewLayoutChangeHandler, frameProcessor, outputOrientation]);
}
function PoseDetectionOnImage(imagePath, model, options) {
  return getPoseDetectionModule().detectOnImage(imagePath, options?.numPoses ?? 1, options?.minPoseDetectionConfidence ?? 0.5, options?.minPosePresenceConfidence ?? 0.5, options?.minTrackingConfidence ?? 0.5, options?.shouldOutputSegmentationMasks ?? false, model, options?.delegate ?? _types.Delegate.GPU);
}
const KnownPoseLandmarks = exports.KnownPoseLandmarks = {
  nose: 0,
  leftEyeInner: 1,
  leftEye: 2,
  leftEyeOuter: 3,
  rightEyeInner: 4,
  rightEye: 5,
  rightEyeOuter: 6,
  leftEar: 7,
  rightEar: 8,
  mouthLeft: 9,
  mouthRight: 10,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftPinky: 17,
  rightPinky: 18,
  leftIndex: 19,
  rightIndex: 20,
  leftThumb: 21,
  rightThumb: 22,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
  leftHeel: 29,
  rightHeel: 30,
  leftFootIndex: 31,
  rightFootIndex: 32
};
const KnownPoseLandmarkConnections = exports.KnownPoseLandmarkConnections = [[0, 5], [5, 8], [0, 2], [2, 7], [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20], [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [27, 29], [27, 31], [29, 31], [26, 28], [28, 30], [28, 32], [30, 32]];
//# sourceMappingURL=index.js.map