import '../styles/global.css';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
export default function Layout() {
  return (
    <SafeAreaProvider>
      <Slot />
      <Toast />
    </SafeAreaProvider>
  );
}
