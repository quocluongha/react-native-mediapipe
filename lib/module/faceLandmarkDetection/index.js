import React from "react";
import { NativeEventEmitter, NativeModules, Platform } from "react-native";
import { VisionCameraProxy, runAtTargetFps, useFrameProcessor } from "react-native-vision-camera";
import { Delegate } from "../shared/types";
import { BaseViewCoordinator } from "../shared/convert";
import { useRunOnJS, useSharedValue } from "react-native-worklets-core";
const {
  FaceLandmarkDetection
} = NativeModules;
const eventEmitter = new NativeEventEmitter(FaceLandmarkDetection);
const plugin = VisionCameraProxy.initFrameProcessorPlugin("faceLandmarkDetection", {});
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
export function faceLandmarkDetectionModuleConstants() {
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
export function useFaceLandmarkDetection(callbacks, runningMode, model, options) {
  const [detectorHandle, setDetectorHandle] = React.useState();
  const [cameraViewDimensions, setCameraViewDimensions] = React.useState({
    width: 1,
    height: 1
  });
  const outputOrientation = useSharedValue("portrait");
  const frameOrientation = useSharedValue("portrait");
  const forceOutputOrientation = useSharedValue(undefined);
  const forceCameraOrientation = useSharedValue(undefined);
  const cameraViewLayoutChangeHandler = React.useCallback(event => {
    setCameraViewDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width
    });
  }, []);
  React.useEffect(() => {
    forceCameraOrientation.value = options?.forceCameraOrientation;
    forceOutputOrientation.value = options?.forceOutputOrientation;
  }, [forceCameraOrientation, forceOutputOrientation, options?.forceCameraOrientation, options?.forceOutputOrientation]);
  const mirrorMode = options?.mirrorMode ?? Platform.select({
    android: "mirror-front-only",
    default: "no-mirror"
  });
  const [cameraDevice, setCameraDevice] = React.useState();
  const [resizeMode, setResizeMode] = React.useState("cover");
  const mirrored = React.useMemo(() => {
    return mirrorMode === "mirror-front-only" && cameraDevice?.position === "front" || mirrorMode === "mirror";
  }, [cameraDevice?.position, mirrorMode]);
  const updateDetectorMap = React.useCallback(() => {
    if (detectorHandle !== undefined) {
      const viewCoordinator = new BaseViewCoordinator(cameraViewDimensions, mirrored, forceCameraOrientation.value ?? frameOrientation.value, forceOutputOrientation.value ?? outputOrientation.value, resizeMode);
      detectorMap.set(detectorHandle, {
        onResults: callbacks.onResults,
        onError: callbacks.onError,
        viewCoordinator
      });
    }
  }, [cameraViewDimensions, detectorHandle, forceCameraOrientation.value, forceOutputOrientation.value, frameOrientation.value, mirrored, callbacks.onError, callbacks.onResults, outputOrientation.value, resizeMode]);
  React.useLayoutEffect(() => {
    updateDetectorMap();
  }, [updateDetectorMap]);
  React.useEffect(() => {
    let newHandle;
    getFaceLandmarkDetectionModule().createDetector(options?.numFaces ?? 1, options?.minFaceDetectionConfidence ?? 0.5, options?.minFacePresenceConfidence ?? 0.5, options?.minTrackingConfidence ?? 0.5, model, options?.delegate ?? Delegate.GPU, runningMode).then(handle => {
      setDetectorHandle(handle);
      newHandle = handle;
    });
    return () => {
      if (newHandle !== undefined) {
        getFaceLandmarkDetectionModule().releaseDetector(newHandle);
      }
    };
  }, [options?.delegate, runningMode, model, options?.numFaces, options?.minFaceDetectionConfidence, options?.minFacePresenceConfidence, options?.minTrackingConfidence]);
  const updateDetectorMapFromWorklet = useRunOnJS(updateDetectorMap, [updateDetectorMap]);
  const frameProcessor = useFrameProcessor(frame => {
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
      runAtTargetFps(fpsMode, () => {
        plugin?.call(frame, {
          detectorHandle,
          orientation
        });
      });
    }
  }, [detectorHandle, forceOutputOrientation.value, frameOrientation, options?.fpsMode, outputOrientation.value, updateDetectorMapFromWorklet]);
  return React.useMemo(() => ({
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
export function faceLandmarkDetectionOnImage(imagePath, model, options) {
  return getFaceLandmarkDetectionModule().detectOnImage(imagePath, options?.numFaces ?? 1, options?.minFaceDetectionConfidence ?? 0.5, options?.minFacePresenceConfidence ?? 0.5, options?.minTrackingConfidence ?? 0.5, model, options?.delegate ?? Delegate.GPU);
}
//# sourceMappingURL=index.js.map