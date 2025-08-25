import { Delegate, type Landmark, type MediaPipeSolution, type RunningMode, type TransformMatrix, type DetectionCallbacks, type ImageOrientation } from "../shared/types";
export interface FaceLandmarkConnection {
    start: number;
    end: number;
}
interface KnownLandmarks {
    lips: FaceLandmarkConnection[];
    leftEye: FaceLandmarkConnection[];
    leftEyebrow: FaceLandmarkConnection[];
    leftIris: FaceLandmarkConnection[];
    rightEye: FaceLandmarkConnection[];
    rightEyebrow: FaceLandmarkConnection[];
    rightIris: FaceLandmarkConnection[];
    faceOval: FaceLandmarkConnection[];
    connectors: FaceLandmarkConnection[];
    tesselation: FaceLandmarkConnection[];
}
export interface FaceLandmarksModuleConstants {
    knownLandmarks: KnownLandmarks;
}
export declare function faceLandmarkDetectionModuleConstants(): FaceLandmarksModuleConstants;
export interface FaceLandmarkDetectionResultBundle {
    results: FaceLandmarkerResult[];
    inferenceTime: number;
    inputImageHeight: number;
    inputImageWidth: number;
}
interface Category {
    categoryName?: string;
    displayName?: string;
    score: number;
}
interface Classifications {
    headIndex: number;
    headName?: string;
    categories: Category[];
}
export interface FaceLandmarkerResult {
    faceLandmarks: Landmark[][];
    faceBlendshapes: Classifications[];
    facialTransformationMatrixes: TransformMatrix[];
}
type FpsMode = "none" | number;
export interface FaceLandmarkDetectionOptions {
    numFaces: number;
    minFaceDetectionConfidence: number;
    minFacePresenceConfidence: number;
    minTrackingConfidence: number;
    delegate: Delegate;
    mirrorMode: "no-mirror" | "mirror" | "mirror-front-only";
    forceOutputOrientation?: ImageOrientation;
    forceCameraOrientation?: ImageOrientation;
    fpsMode?: FpsMode;
}
export declare function useFaceLandmarkDetection(callbacks: DetectionCallbacks<FaceLandmarkDetectionResultBundle>, runningMode: RunningMode, model: string, options?: Partial<FaceLandmarkDetectionOptions>): MediaPipeSolution;
export declare function faceLandmarkDetectionOnImage(imagePath: string, model: string, options?: Partial<FaceLandmarkDetectionOptions>): Promise<FaceLandmarkDetectionResultBundle>;
export {};
//# sourceMappingURL=index.d.ts.map