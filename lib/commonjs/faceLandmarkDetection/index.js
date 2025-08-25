"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.faceLandmarkDetectionModuleConstants = faceLandmarkDetectionModuleConstants;
exports.faceLandmarkDetectionOnImage = faceLandmarkDetectionOnImage;
exports.useFaceLandmarkDetection = useFaceLandmarkDetection;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeVisionCamera = require("react-native-vision-camera");
var _types = require("../shared/types");
var _convert = require("../shared/convert");
var _reactNativeWorkletsCore = require("react-native-worklets-core");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  FaceLandmarkDetection
} = _reactNative.NativeModules;
const eventEmitter = new _reactNative.NativeEventEmitter(FaceLandmarkDetection);
const plugin = _reactNativeVisionCamera.VisionCameraProxy.initFrameProcessorPlugin("faceLandmarkDetection", {});
if (!plugin) {
  throw new Error("Failed to initialize faceLandmarkDetection plugin");
}

// Defines a connector with start and end points

// Defines landmarks as arrays of connectors

function getFaceLandmarkDetectionModule() {
  if (FaceLandmarkDetection === undefined || FaceLandmarkDetection === null) {
    throw new Error("FaceLandmarkDetection module is not available");
  }
  return FaceLandmarkDetection;
}
function faceLandmarkDetectionModuleConstants() {
  if (FaceLandmarkDetection === undefined || FaceLandmarkDetection === null) {
    throw new Error("FaceLandmarkDetection module is not available");
  }
  return FaceLandmarkDetection.getConstants();
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
function useFaceLandmarkDetection(callbacks, runningMode, model, options) {
  const [detectorHandle, setDetectorHandle] = _react.default.useState();
  const [cameraViewDimensions, setCameraViewDimensions] = _react.default.useState({
    width: 1,
    height: 1
  });
  const outputOrientation = (0, _reactNativeWorkletsCore.useSharedValue)("portrait");
  const frameOrientation = (0, _reactNativeWorkletsCore.useSharedValue)("portrait");
  const forceOutputOrientation = (0, _reactNativeWorkletsCore.useSharedValue)(undefined);
  const forceCameraOrientation = (0, _reactNativeWorkletsCore.useSharedValue)(undefined);
  const cameraViewLayoutChangeHandler = _react.default.useCallback(event => {
    setCameraViewDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width
    });
  }, []);
  _react.default.useEffect(() => {
    forceCameraOrientation.value = options?.forceCameraOrientation;
    forceOutputOrientation.value = options?.forceOutputOrientation;
  }, [forceCameraOrientation, forceOutputOrientation, options?.forceCameraOrientation, options?.forceOutputOrientation]);
  const mirrorMode = options?.mirrorMode ?? _reactNative.Platform.select({
    android: "mirror-front-only",
    default: "no-mirror"
  });
  const [cameraDevice, setCameraDevice] = _react.default.useState();
  const [resizeMode, setResizeMode] = _react.default.useState("cover");
  const mirrored = _react.default.useMemo(() => {
    return mirrorMode === "mirror-front-only" && cameraDevice?.position === "front" || mirrorMode === "mirror";
  }, [cameraDevice?.position, mirrorMode]);
  const updateDetectorMap = _react.default.useCallback(() => {
    if (detectorHandle !== undefined) {
      const viewCoordinator = new _convert.BaseViewCoordinator(cameraViewDimensions, mirrored, forceCameraOrientation.value ?? frameOrientation.value, forceOutputOrientation.value ?? outputOrientation.value, resizeMode);
      detectorMap.set(detectorHandle, {
        onResults: callbacks.onResults,
        onError: callbacks.onError,
        viewCoordinator
      });
    }
  }, [cameraViewDimensions, detectorHandle, forceCameraOrientation.value, forceOutputOrientation.value, frameOrientation.value, mirrored, callbacks.onError, callbacks.onResults, outputOrientation.value, resizeMode]);
  _react.default.useLayoutEffect(() => {
    updateDetectorMap();
  }, [updateDetectorMap]);
  _react.default.useEffect(() => {
    let newHandle;
    getFaceLandmarkDetectionModule().createDetector(options?.numFaces ?? 1, options?.minFaceDetectionConfidence ?? 0.5, options?.minFacePresenceConfidence ?? 0.5, options?.minTrackingConfidence ?? 0.5, model, options?.delegate ?? _types.Delegate.GPU, runningMode).then(handle => {
      setDetectorHandle(handle);
      newHandle = handle;
    });
    return () => {
      if (newHandle !== undefined) {
        getFaceLandmarkDetectionModule().releaseDetector(newHandle);
      }
    };
  }, [options?.delegate, runningMode, model, options?.numFaces, options?.minFaceDetectionConfidence, options?.minFacePresenceConfidence, options?.minTrackingConfidence]);
  const updateDetectorMapFromWorklet = (0, _reactNativeWorkletsCore.useRunOnJS)(updateDetectorMap, [updateDetectorMap]);
  const frameProcessor = (0, _reactNativeVisionCamera.useFrameProcessor)(frame => {
    "worklet";

    if (frame.orientation !== frameOrientation.value) {
      frameOrientation.value = frame.orientation;
      updateDetectorMapFromWorklet();
    }
    const orientation = forceOutputOrientation.value ?? outputOrientation.value;
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
    },
    cameraOrientationChangedHandler: o => {
      outputOrientation.value = o;
    },
    resizeModeChangeHandler: setResizeMode,
    cameraViewDimensions,
    frameProcessor
  }), [cameraViewDimensions, cameraViewLayoutChangeHandler, frameProcessor, outputOrientation]);
}
function faceLandmarkDetectionOnImage(imagePath, model, options) {
  return getFaceLandmarkDetectionModule().detectOnImage(imagePath, options?.numFaces ?? 1, options?.minFaceDetectionConfidence ?? 0.5, options?.minFacePresenceConfidence ?? 0.5, options?.minTrackingConfidence ?? 0.5, model, options?.delegate ?? _types.Delegate.GPU);
}
//# sourceMappingURL=index.js.map