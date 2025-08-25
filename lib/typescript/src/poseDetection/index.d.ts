import { Delegate, type MediaPipeSolution, RunningMode, type Landmark, type Mask, type DetectionResultBundle, type DetectionCallbacks, type ImageOrientation } from "../shared/types";
export interface PoseLandmarkerResult {
    landmarks: Landmark[][];
    worldLandmarks: Landmark[][];
    segmentationMasks: Mask[];
}
export type PoseDetectionResultBundle = DetectionResultBundle<PoseLandmarkerResult>;
type FpsMode = "none" | number;
export interface PoseDetectionOptions {
    numPoses: number;
    minPoseDetectionConfidence: number;
    minPosePresenceConfidence: number;
    minTrackingConfidence: number;
    shouldOutputSegmentationMasks: boolean;
    delegate: Delegate;
    mirrorMode: "no-mirror" | "mirror" | "mirror-front-only";
    forceOutputOrientation: ImageOrientation;
    forceCameraOrientation: ImageOrientation;
    fpsMode: FpsMode;
}
export declare function usePoseDetection(callbacks: DetectionCallbacks<PoseDetectionResultBundle>, runningMode: RunningMode, model: string, options?: Partial<PoseDetectionOptions>): MediaPipeSolution;
export declare function PoseDetectionOnImage(imagePath: string, model: string, options?: Partial<PoseDetectionOptions>): Promise<PoseDetectionResultBundle>;
export declare const KnownPoseLandmarks: {
    nose: number;
    leftEyeInner: number;
    leftEye: number;
    leftEyeOuter: number;
    rightEyeInner: number;
    rightEye: number;
    rightEyeOuter: number;
    leftEar: number;
    rightEar: number;
    mouthLeft: number;
    mouthRight: number;
    leftShoulder: number;
    rightShoulder: number;
    leftElbow: number;
    rightElbow: number;
    leftWrist: number;
    rightWrist: number;
    leftPinky: number;
    rightPinky: number;
    leftIndex: number;
    rightIndex: number;
    leftThumb: number;
    rightThumb: number;
    leftHip: number;
    rightHip: number;
    leftKnee: number;
    rightKnee: number;
    leftAnkle: number;
    rightAnkle: number;
    leftHeel: number;
    rightHeel: number;
    leftFootIndex: number;
    rightFootIndex: number;
};
export declare const KnownPoseLandmarkConnections: number[][];
export {};
//# sourceMappingURL=index.d.ts.map