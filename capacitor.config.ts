
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b92f4c445aef4ee98dce75cf32b6b129',
  appName: 'circle-scribe-giotto',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://b92f4c44-5aef-4ee9-8dce-75cf32b6b129.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    // iOS-specific configuration would go here
  },
  ios: {
    // iOS-specific configuration
    contentInset: "always"
  }
};

export default config;
