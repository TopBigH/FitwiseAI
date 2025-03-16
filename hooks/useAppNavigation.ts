import { useRouter, useNavigation } from 'expo-router';
import { Platform } from 'react-native';

export function useAppNavigation() {
  const router = useRouter();
  const navigation = useNavigation();

  const navigateBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace('/(tabs)');
    }
  };

  return {
    navigateBack,
  };
}