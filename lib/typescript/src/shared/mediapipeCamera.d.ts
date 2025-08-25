import React from "react";
import { type ViewStyle } from "react-native";
import { Camera, type CameraPosition, type CameraProps } from "react-native-vision-camera";
import type { MediaPipeSolution } from "./types";
export type MediapipeCameraProps = {
    style: ViewStyle;
    solution: MediaPipeSolution;
    activeCamera?: CameraPosition;
    resizeMode?: CameraProps["resizeMode"];
};
export declare const MediapipeCamera: React.ForwardRefExoticComponent<MediapipeCameraProps & React.RefAttributes<Camera>>;
//# sourceMappingURL=mediapipeCamera.d.ts.map