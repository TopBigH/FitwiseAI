import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GymBuddy',
  slug: 'gymbuddy',
  scheme: 'gymbuddy',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#000000'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.gymbuddy.app',
    infoPlist: {
      NSCameraUsageDescription: 'GymBuddy needs access to your camera to scan gym equipment and provide proper form guidance.'
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#000000'
    },
    package: 'com.gymbuddy.app',
    permissions: ['CAMERA']
  },
  extra: {
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
  plugins: [
    'expo-router',
    [
      'expo-camera',
      {
        cameraPermission: 'Allow GymBuddy to access your camera to scan gym equipment.'
      }
    ]
  ]
});