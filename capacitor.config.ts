
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.giotto.app',
  appName: 'Giotto',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: "http://localhost:8080",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false,
    },
  },
};

export default config;
