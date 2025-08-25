import React from "react";
import { NativeEventEmitter, NativeModules, Platform } from "react-native";
import { VisionCameraProxy, useFrameProcessor } from "react-native-vision-camera";
import { Delegate } from "../shared/types";
import { useSharedValue } from "react-native-worklets-core";
const {
  ObjectDetection
} = NativeModules;
const eventEmitter = new NativeEventEmitter(ObjectDetection);
const plugin = VisionCameraProxy.initFrameProcessorPlugin("objectDetection", {});
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
export function useObjectDetection(onResults, onError, runningMode, model, options) {
  const [detectorHandle, setDetectorHandle] = React.useState();
  const [cameraViewDimensions, setCameraViewDimensions] = React.useState({
    width: 1,
    height: 1
  });
  const outputOrientation = useSharedValue("portrait");
  const cameraViewLayoutChangeHandler = React.useCallback(event => {
    setCameraViewDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width
    });
  }, []);
  const mirrorMode = options?.mirrorMode ?? Platform.select({
    android: "mirror-front-only",
    default: "no-mirror"
  });
  const [cameraDevice, setCameraDevice] = React.useState(undefined);
  const mirrored = React.useMemo(() => {
    if (mirrorMode === "mirror-front-only" && cameraDevice?.position === "front" || mirrorMode === "mirror") {
      return true;
    } else {
      return false;
    }
  }, [cameraDevice?.position, mirrorMode]);
  // Remember the latest callback if it changes.
  React.useLayoutEffect(() => {
    if (detectorHandle !== undefined) {
      detectorMap.set(detectorHandle, {
        onResults,
        onError,
        viewSize: cameraViewDimensions,
        mirrored
      });
    }
  }, [onResults, onError, detectorHandle, cameraViewDimensions, mirrored]);
  React.useEffect(() => {
    let newHandle;
    console.log(`getObjectDetectionModule: delegate = ${options?.delegate}, maxResults= ${options?.maxResults}, runningMode = ${runningMode}, threshold = ${options?.threshold}, model= ${model}`);
    getObjectDetectionModule().createDetector(options?.threshold ?? 0.5, options?.maxResults ?? 3, options?.delegate ?? Delegate.GPU, model, runningMode).then(handle => {
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
  const frameProcessor = useFrameProcessor(frame => {
    "worklet";

    // console.log(frame.orientation, frame.width, frame.height);
    plugin?.call(frame, {
      detectorHandle
    });
  }, [detectorHandle]);
  return React.useMemo(() => ({
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
export function objectDetectionOnImage(imagePath, model, options) {
  return getObjectDetectionModule().detectOnImage(imagePath, options?.threshold ?? 0.5, options?.maxResults ?? 3, options?.delegate ?? Delegate.GPU, model);
}
//# sourceMappingURL=index.js.map