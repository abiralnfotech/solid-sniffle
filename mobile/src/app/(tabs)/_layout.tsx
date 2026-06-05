import { Tabs } from 'expo-router';
import { Home, User } from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: SahayatriTheme.colors.primaryContainer,
      tabBarInactiveTintColor: SahayatriTheme.colors.onSurfaceVariant,
      tabBarStyle: {
        backgroundColor: SahayatriTheme.colors.surface,
        borderTopWidth: 0,
        height: 64,
        paddingBottom: 8,
        paddingTop: 8,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
