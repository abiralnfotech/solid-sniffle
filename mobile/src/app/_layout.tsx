import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import '@/global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/onboarding" />
        <Stack.Screen name="(auth)/verify-identity" />
        <Stack.Screen name="(main)/dashboard" />
        <Stack.Screen name="ride/live" />
        <Stack.Screen name="ride/feedback" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="safety/suspended" />
      </Stack>
    </AuthProvider>
  );
}
