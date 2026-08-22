import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.lovable.slashprompt",
  appName: "SlashAI",
  webDir: "android-web",
  bundledWebRuntime: false,
  // matches the app's dark background so launch never flashes black/white
  backgroundColor: "#12161c",
  server: {
    androidScheme: "https",
    url: "https://slashai.lovable.app",
  },
  android: {
    backgroundColor: "#12161c",
    webContentsDebuggingEnabled: false,
  },
};

export default config;
