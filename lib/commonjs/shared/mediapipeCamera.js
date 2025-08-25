"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediapipeCamera = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeVisionCamera = require("react-native-vision-camera");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const MediapipeCamera = exports.MediapipeCamera = /*#__PURE__*/(0, _react.forwardRef)(({
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
  const device = (0, _reactNativeVisionCamera.useCameraDevice)(activeCamera);
  (0, _react.useEffect)(() => {
    if (device) {
      cameraDeviceChangeHandler(device);
    }
  }, [cameraDeviceChangeHandler, device]);
  (0, _react.useEffect)(() => {
    resizeModeChangeHandler(resizeMode);
  }, [resizeModeChangeHandler, resizeMode]);
  if (device == null) {
    return /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, "Loading...");
  }
  return /*#__PURE__*/_react.default.createElement(_reactNativeVisionCamera.Camera, {
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