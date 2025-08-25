import React from "react";
import { type DetectionMap, type Dims } from "react-native-mediapipe";
export interface ObjectDetectionFrame {
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare const ObjectFrame: React.FC<{
    frame: ObjectDetectionFrame;
    index: number;
}>;
export declare function convertObjectDetectionFrame(detection: DetectionMap, frameSize: {
    width: number;
    height: number;
}, viewSize: Dims, mirrored?: boolean): ObjectDetectionFrame;
//# sourceMappingURL=Drawing.d.ts.map