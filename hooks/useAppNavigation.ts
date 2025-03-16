import { router } from 'expo-router';

export function useAppNavigation() {
  const navigateBack = () => {
    try {
      router.back();
    } catch (error) {
      // Fallback to the main tab route if back navigation fails
      router.replace('/(tabs)');
    }
  };

  return {
    navigateBack,
  };
}