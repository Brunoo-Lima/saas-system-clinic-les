import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../styles/global.css';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
export default function Layout() {
  const queryClient = new QueryClient();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Slot />
        <Toast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
