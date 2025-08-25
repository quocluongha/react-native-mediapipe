"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _objectDetection = require("./objectDetection");
Object.keys(_objectDetection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _objectDetection[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _objectDetection[key];
    }
  });
});
var _poseDetection = require("./poseDetection");
Object.keys(_poseDetection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _poseDetection[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _poseDetection[key];
    }
  });
});
var _faceLandmarkDetection = require("./faceLandmarkDetection");
Object.keys(_faceLandmarkDetection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _faceLandmarkDetection[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _faceLandmarkDetection[key];
    }
  });
});
var _mediapipeCamera = require("./shared/mediapipeCamera");
Object.keys(_mediapipeCamera).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _mediapipeCamera[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mediapipeCamera[key];
    }
  });
});
var _convert = require("./shared/convert");
Object.keys(_convert).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _convert[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _convert[key];
    }
  });
});
var _types = require("./shared/types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
//# sourceMappingURL=index.js.map