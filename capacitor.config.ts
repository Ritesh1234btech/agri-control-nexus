
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.91ceb598a95e4255bac7831b3ded8790',
  appName: 'AgriBot Controller',
  webDir: 'dist',
  server: {
    url: 'https://91ceb598-a95e-4255-bac7-831b3ded8790.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // Capacitor plugin configurations can be added here
  }
};

export default config;
