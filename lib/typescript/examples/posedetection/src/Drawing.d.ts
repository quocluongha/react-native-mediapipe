import React from "react";
import { type SkPoint } from "@shopify/react-native-skia";
import { type StyleProp, type ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
export interface PoseDrawFrameProps {
    connections: SharedValue<SkPoint[]>;
    style?: StyleProp<ViewStyle>;
}
export declare const PoseDrawFrame: React.FC<PoseDrawFrameProps>;
declare const COLOR_NAMES: readonly ["Coral", "DarkCyan", "DeepSkyBlue", "ForestGreen", "GoldenRod", "MediumOrchid", "SteelBlue", "Tomato", "Turquoise", "SlateGray", "DodgerBlue", "FireBrick", "Gold", "HotPink", "LimeGreen", "Navy", "OrangeRed", "RoyalBlue", "SeaGreen", "Violet"];
export type ColorName = (typeof COLOR_NAMES)[number];
export {};
//# sourceMappingURL=Drawing.d.ts.map