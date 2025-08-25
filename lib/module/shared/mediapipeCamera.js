import React, { useEffect, forwardRef } from "react";
import { Text } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
export const MediapipeCamera = /*#__PURE__*/forwardRef(({
  style,
  solution: {
    cameraDeviceChangeHandler,
    cameraViewLayoutChangeHandler,
    cameraOrientationChangedHandler,
    resizeModeChangeHandler,
    frameProcessor
  },
  activeCamera = "front",
  resizeMode = "cover"
}, ref) => {
  const device = useCameraDevice(activeCamera);
  useEffect(() => {
    if (device) {
      cameraDeviceChangeHandler(device);
    }
  }, [cameraDeviceChangeHandler, device]);
  useEffect(() => {
    resizeModeChangeHandler(resizeMode);
  }, [resizeModeChangeHandler, resizeMode]);
  if (device == null) {
    return /*#__PURE__*/React.createElement(Text, null, "Loading...");
  }
  return /*#__PURE__*/React.createElement(Camera, {
    ref: ref,
    resizeMode: resizeMode,
    style: style,
    device: device,
    pixelFormat: "rgb",
    isActive: true,
    frameProcessor: frameProcessor,
    onLayout: cameraViewLayoutChangeHandler,
    onOutputOrientationChanged: cameraOrientationChangedHandler,
    photo: true
  });
});
//# sourceMappingURL=mediapipeCamera.js.map