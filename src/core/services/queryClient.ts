import { QueryClient, onlineManager, focusManager } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Refetch on app foreground
focusManager.setEventListener((handleFocus) => {
  if (Platform.OS === 'web') {
    const onFocus = () => handleFocus();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }
  const sub = AppState.addEventListener('change', (state) => {
    if (state === 'active') handleFocus();
  });
  return () => sub.remove();
});

// Pause queries when offline
if (typeof NetInfo?.addEventListener === 'function') {
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 min
      gcTime: 30 * 60 * 1000,     // 30 min (garbage collection)
      retry: 2,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
