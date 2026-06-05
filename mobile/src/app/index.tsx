import { Redirect } from 'expo-router';

export default function Index() {
  // Simple auth check simulation
  const isAuthenticated = false; // Set to false to show login first

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
