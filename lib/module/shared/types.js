// eslint-disable-next-line no-restricted-syntax
export let Delegate = /*#__PURE__*/function (Delegate) {
  Delegate[Delegate["CPU"] = 0] = "CPU";
  Delegate[Delegate["GPU"] = 1] = "GPU";
  return Delegate;
}({});

// eslint-disable-next-line no-restricted-syntax
export let RunningMode = /*#__PURE__*/function (RunningMode) {
  RunningMode[RunningMode["IMAGE"] = 0] = "IMAGE";
  RunningMode[RunningMode["VIDEO"] = 1] = "VIDEO";
  RunningMode[RunningMode["LIVE_STREAM"] = 2] = "LIVE_STREAM";
  return RunningMode;
}({});

// Interface for a normalized landmark point in 3D space

// Interface for the transformation matrix

// eslint-disable-next-line no-restricted-syntax
export let MaskDataType = /*#__PURE__*/function (MaskDataType) {
  MaskDataType[MaskDataType["UINT8"] = 0] = "UINT8";
  MaskDataType[MaskDataType["FLOAT32"] = 1] = "FLOAT32";
  return MaskDataType;
}({});
export function rotateClockwise(orientation) {
  switch (orientation) {
    case "landscape-left":
      return "portrait";
    case "portrait":
      return "landscape-right";
    case "landscape-right":
      return "portrait-upside-down";
    case "portrait-upside-down":
      return "landscape-left";
  }
}
export function rotateCounterclockwise(orientation) {
  switch (orientation) {
    case "landscape-left":
      return "portrait-upside-down";
    case "portrait":
      return "landscape-left";
    case "landscape-right":
      return "portrait";
    case "portrait-upside-down":
      return "landscape-right";
  }
}
export function mirror(orientation) {
  switch (orientation) {
    case "landscape-left":
      return "landscape-right";
    case "portrait":
      return "portrait";
    case "landscape-right":
      return "landscape-left";
    case "portrait-upside-down":
      return "portrait-upside-down";
  }
}
export function orientationToRotation(orientation) {
  switch (orientation) {
    case "landscape-left":
      return -90;
    case "portrait":
      return 0;
    case "landscape-right":
      return 90;
    case "portrait-upside-down":
      return 180;
  }
}
export function dimsByOrientation(orientation, width, height) {
  return orientation === "portrait" || orientation === "portrait-upside-down" ? {
    width,
    height
  } : {
    width: height,
    height: width
  };
}
//# sourceMappingURL=types.js.map