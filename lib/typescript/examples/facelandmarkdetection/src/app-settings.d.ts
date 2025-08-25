import type { Delegate } from "react-native-mediapipe";
import * as React from "react";
export type AppSettings = {
    maxResults: number;
    threshold: number;
    processor: Delegate;
    model: string;
};
export declare const SettingsContext: React.Context<{
    settings: AppSettings;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
} | undefined>;
export declare const useSettings: () => {
    settings: AppSettings;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
};
//# sourceMappingURL=app-settings.d.ts.map