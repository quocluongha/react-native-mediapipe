import { Delegate, type Dims, type MediaPipeSolution, RunningMode } from "../shared/types";
export interface ObjectDetectionResultBundle {
    results: ObjectDetectionResultMap[];
    inferenceTime: number;
    inputImageHeight: number;
    inputImageWidth: number;
}
export interface ObjectDetectionResultMap {
    timestampMs: number;
    detections: DetectionMap[];
}
export interface DetectionMap {
    boundingBox: RectFMap;
    categories: CategoryMap[];
    keypoints?: KeypointMap[];
}
interface RectFMap {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
interface CategoryMap {
    score: number;
    index: number;
    categoryName: string;
    displayName: string;
}
interface KeypointMap {
    x: number;
    y: number;
    label?: string;
    score?: number;
}
interface ObjectDetectionError {
    code: number;
    message: string;
}
export interface ObjectDetectionOptions {
    threshold: number;
    maxResults: number;
    delegate: Delegate;
    mirrorMode: "no-mirror" | "mirror" | "mirror-front-only";
}
export interface ObjectDetectionCallbacks {
    onResults: (result: ObjectDetectionResultBundle, viewSize: Dims, mirrored: boolean) => void;
    onError: (error: ObjectDetectionError) => void;
    viewSize: Dims;
    mirrored: boolean;
}
export declare function useObjectDetection(onResults: ObjectDetectionCallbacks["onResults"], onError: ObjectDetectionCallbacks["onError"], runningMode: RunningMode, model: string, options?: Partial<ObjectDetectionOptions>): MediaPipeSolution;
export declare function objectDetectionOnImage(imagePath: string, model: string, options?: Partial<ObjectDetectionOptions>): Promise<ObjectDetectionResultBundle>;
export {};
//# sourceMappingURL=index.d.ts.map