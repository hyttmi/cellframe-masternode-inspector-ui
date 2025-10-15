import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cellframe.masternode.inspector',
  appName: 'Cellframe Masternode Inspector',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    // Allow cleartext (HTTP) traffic for connecting to backend APIs
    cleartext: true
  }
};

export default config;
