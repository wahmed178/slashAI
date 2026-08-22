import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.lovable.slashprompt",
  appName: "SlashAI",
  webDir: "android-web",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
    url: "https://slashai.lovable.app",
  },
};

export default config;
