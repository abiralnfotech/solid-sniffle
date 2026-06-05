import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="kyc/verify" options={{ presentation: 'modal' }} />
      <Stack.Screen name="ride/track" />
      <Stack.Screen name="ride/feedback" options={{ presentation: 'modal' }} />
      <Stack.Screen name="suspended" />
    </Stack>
  );
}
