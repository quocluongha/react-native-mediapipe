"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectDetectionOnImage = objectDetectionOnImage;
exports.useObjectDetection = useObjectDetection;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeVisionCamera = require("react-native-vision-camera");
var _types = require("../shared/types");
var _reactNativeWorkletsCore = require("react-native-worklets-core");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  ObjectDetection
} = _reactNative.NativeModules;
const eventEmitter = new _reactNative.NativeEventEmitter(ObjectDetection);
const plugin = _reactNativeVisionCamera.VisionCameraProxy.initFrameProcessorPlugin("objectDetection", {});
if (!plugin) {
  throw new Error("Failed to initialize objectdetection plugin");
}
function getObjectDetectionModule() {
  if (ObjectDetection === undefined || ObjectDetection === null) {
    throw new Error("ObjectDetection module is not available");
  }
  return ObjectDetection;
}
// TODO setup the general event callbacks
const detectorMap = new Map();
eventEmitter.addListener("onResults", args => {
  const callbacks = detectorMap.get(args.handle);
  if (callbacks) {
    callbacks.onResults(args, callbacks.viewSize, callbacks.mirrored);
  }
});
eventEmitter.addListener("onError", args => {
  const callbacks = detectorMap.get(args.handle);
  if (callbacks) {
    callbacks.onError(args);
  }
});
function useObjectDetection(onResults, onError, runningMode, model, options) {
  const [detectorHandle, setDetectorHandle] = _react.default.useState();
  const [cameraViewDimensions, setCameraViewDimensions] = _react.default.useState({
    width: 1,
    height: 1
  });
  const outputOrientation = (0, _reactNativeWorkletsCore.useSharedValue)("portrait");
  const cameraViewLayoutChangeHandler = _react.default.useCallback(event => {
    setCameraViewDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width
    });
  }, []);
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
  // Remember the latest callback if it changes.
  _react.default.useLayoutEffect(() => {
    if (detectorHandle !== undefined) {
      detectorMap.set(detectorHandle, {
        onResults,
        onError,
        viewSize: cameraViewDimensions,
        mirrored
      });
    }
  }, [onResults, onError, detectorHandle, cameraViewDimensions, mirrored]);
  _react.default.useEffect(() => {
    let newHandle;
    console.log(`getObjectDetectionModule: delegate = ${options?.delegate}, maxResults= ${options?.maxResults}, runningMode = ${runningMode}, threshold = ${options?.threshold}, model= ${model}`);
    getObjectDetectionModule().createDetector(options?.threshold ?? 0.5, options?.maxResults ?? 3, options?.delegate ?? _types.Delegate.GPU, model, runningMode).then(handle => {
      console.log("useObjectDetection.createDetector", runningMode, model, handle);
      setDetectorHandle(handle);
      newHandle = handle;
    });
    return () => {
      console.log("useObjectDetection.useEffect.unsub", "releaseDetector", newHandle);
      if (newHandle !== undefined) {
        getObjectDetectionModule().releaseDetector(newHandle);
      }
    };
  }, [options?.delegate, options?.maxResults, runningMode, options?.threshold, model]);
  const frameProcessor = (0, _reactNativeVisionCamera.useFrameProcessor)(frame => {
    "worklet";

    // console.log(frame.orientation, frame.width, frame.height);
    plugin?.call(frame, {
      detectorHandle
    });
  }, [detectorHandle]);
  return _react.default.useMemo(() => ({
    cameraViewLayoutChangeHandler,
    cameraDeviceChangeHandler: setCameraDevice,
    cameraOrientationChangedHandler: o => {
      outputOrientation.value = o;
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resizeModeChangeHandler: () => {},
    cameraViewDimensions,
    frameProcessor
  }), [cameraViewDimensions, cameraViewLayoutChangeHandler, frameProcessor, outputOrientation]);
}
function objectDetectionOnImage(imagePath, model, options) {
  return getObjectDetectionModule().detectOnImage(imagePath, options?.threshold ?? 0.5, options?.maxResults ?? 3, options?.delegate ?? _types.Delegate.GPU, model);
}
//# sourceMappingURL=index.js.map