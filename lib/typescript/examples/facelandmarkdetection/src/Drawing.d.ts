import React from "react";
import { type SkPoint } from "@shopify/react-native-skia";
import { type StyleProp, type ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
export interface FaceDrawFrameProps {
    connections: SharedValue<SkPoint[]>;
    style?: StyleProp<ViewStyle>;
}
export declare const FaceDrawFrame: React.FC<FaceDrawFrameProps>;
//# sourceMappingURL=Drawing.d.ts.map