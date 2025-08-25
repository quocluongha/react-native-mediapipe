import { type Dims, type FrameProcessInfo, type ImageOrientation, type Point, type RectLTRB, type RectXYWH, type ResizeMode, type ViewCoordinator } from "./types";
export declare function denormalizePoint(p: Point, dims: Dims): Point;
export declare function rotateNormalizedPoint(point: Point, rotation: number): Point;
export declare function framePointToView(pointOrig: Point, frameDims: Dims, viewDims: Dims, mode: ResizeMode, mirrored: boolean): Point;
export declare function frameRectLTRBToView(rect: RectLTRB, frameDims: Dims, viewDims: Dims, mode: ResizeMode, mirrored: boolean): RectLTRB;
export declare function frameRectXYWHToView(rect: RectXYWH, frameDims: Dims, viewDims: Dims, mode: ResizeMode, mirrored: boolean): RectXYWH;
export declare function frameRectToView<TRect extends RectLTRB | RectXYWH>(rect: TRect, frameDims: Dims, viewDims: Dims, mode: ResizeMode, mirrored: boolean): TRect;
export declare function ltrbToXywh(rect: RectLTRB): RectXYWH;
export declare function clampToDims<TRect extends RectLTRB | RectXYWH>(rect: TRect, dims: Dims): TRect;
export declare function worklet_getDegrees(orientation: ImageOrientation): number;
export declare function worklet_getOrientation(degrees: number): ImageOrientation;
export declare function worklet_relativeTo(a: ImageOrientation, b: ImageOrientation): ImageOrientation;
export declare class BaseViewCoordinator implements ViewCoordinator {
    private viewSize;
    private mirrored;
    private resizeMode;
    private rotation;
    private orientation;
    constructor(viewSize: Dims, mirrored: boolean, sensorOrientation: ImageOrientation, outputOrientation: ImageOrientation, resizeMode: ResizeMode);
    getFrameDims(info: FrameProcessInfo): Dims;
    convertPoint(frame: Dims, p: Point): Point;
}
//# sourceMappingURL=convert.d.ts.map