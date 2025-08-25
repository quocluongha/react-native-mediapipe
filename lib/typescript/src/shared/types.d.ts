import type { LayoutChangeEvent } from "react-native";
import type { CameraDevice, Orientation, ReadonlyFrameProcessor } from "react-native-vision-camera";
export type Dims = {
    width: number;
    height: number;
};
export type Point = {
    x: number;
    y: number;
};
export type RectXYWH = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type RectLTRB = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
export type ResizeMode = "cover" | "contain";
export type ImageOrientation = Orientation;
export interface MediaPipeSolution {
    frameProcessor: ReadonlyFrameProcessor;
    cameraViewLayoutChangeHandler: (event: LayoutChangeEvent) => void;
    cameraDeviceChangeHandler: (device: CameraDevice | undefined) => void;
    cameraOrientationChangedHandler: (orientation: Orientation) => void;
    cameraViewDimensions: {
        width: number;
        height: number;
    };
    resizeModeChangeHandler: (resizeMode: ResizeMode) => void;
}
export declare enum Delegate {
    CPU = 0,
    GPU = 1
}
export declare enum RunningMode {
    IMAGE = 0,
    VIDEO = 1,
    LIVE_STREAM = 2
}
export interface DetectionError {
    code: number;
    message: string;
}
export interface FrameProcessInfo {
    inferenceTime: number;
    inputImageHeight: number;
    inputImageWidth: number;
}
export interface DetectionResultBundle<TResult> extends FrameProcessInfo {
    results: TResult[];
}
export interface ViewCoordinator {
    getFrameDims: (info: FrameProcessInfo) => Dims;
    convertPoint: (frame: Dims, p: Point) => Point;
}
export interface DetectionCallbacks<TResultBundle> {
    onResults: (result: TResultBundle, vc: ViewCoordinator) => void;
    onError: (error: DetectionError) => void;
}
export interface DetectionCallbackState<TResultBundle> extends DetectionCallbacks<TResultBundle> {
    viewCoordinator: ViewCoordinator;
}
export interface Landmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
    presence?: number;
}
export interface TransformMatrix {
    rows: number;
    columns: number;
    data: number[];
}
export declare enum MaskDataType {
    UINT8 = 0,
    FLOAT32 = 1
}
export type Mask = {
    width: number;
    height: number;
} & ({
    dataType: MaskDataType.UINT8;
    uint8Data: Uint8Array;
} | {
    dataType: MaskDataType.FLOAT32;
    float32Data: Float32Array;
});
export declare function rotateClockwise(orientation: Orientation): Orientation;
export declare function rotateCounterclockwise(orientation: Orientation): Orientation;
export declare function mirror(orientation: Orientation): Orientation;
export declare function orientationToRotation(orientation: Orientation): number;
export declare function dimsByOrientation(orientation: Orientation, width: number, height: number): Dims;
//# sourceMappingURL=types.d.ts.map