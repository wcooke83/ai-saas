import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'VocUI Agent',
  slug: 'vocui-agent',
  scheme: 'vocui-agent',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    bundleIdentifier: 'com.vocui.agent',
    supportsTablet: true,
    infoPlist: {
      NSFaceIDUsageDescription: 'Unlock VocUI Agent with Face ID',
    },
  },
  android: {
    package: 'com.vocui.agent',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: ['RECEIVE_BOOT_COMPLETED', 'VIBRATE'],
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#6366f1',
      },
    ],
    'expo-local-authentication',
  ],
  extra: {
    eas: {
      projectId: 'PLACEHOLDER',
    },
  },
});
