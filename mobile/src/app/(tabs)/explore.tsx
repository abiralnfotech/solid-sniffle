import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Settings,
  ChevronRight,
  Wallet,
  History,
  ShieldCheck,
  LogOut,
  Car,
  Bell
} from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const menuItems = [
    { icon: <Wallet size={22} color={SahayatriTheme.colors.primaryContainer} />, label: 'My Wallet', value: '545 CC' },
    { icon: <History size={22} color={SahayatriTheme.colors.primaryContainer} />, label: 'Ride History' },
    { icon: <ShieldCheck size={22} color={SahayatriTheme.colors.primaryContainer} />, label: 'Identity Verification', status: 'Verified' },
    { icon: <Car size={22} color={SahayatriTheme.colors.primaryContainer} />, label: 'Driver Dashboard' },
    { icon: <Bell size={22} color={SahayatriTheme.colors.primaryContainer} />, label: 'Notifications' },
    { icon: <Settings size={22} color={SahayatriTheme.colors.primaryContainer} />, label: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <LogOut size={24} color={SahayatriTheme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8WwWQd5tr4fUiuaNuevdCggJX0_jHrC_SbnLtf9Y-4JGIowahUALhMAvkITkqFuYxjVbEb2KKJWeyFtocMbHqzEg4pi8mG4jwEgcp1ukyFpAdgDo-OcNlbA47WO_KhWitO34YfyhQn31k0RA1JM1RxugYTr7PVG_EPpcFROuTh0aOrptcT0aWsgX3kQwuDW7K8r12XXot4KJJCkCB79sb23xCyKdG7Ac9OdXHVGQqvLSTi_ZyIjXwNYdJVWuHUpIi6HAan_u6TGI' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Siddhartha Thapa</Text>
          <Text style={styles.phone}>+977 9841234567</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>124</Text>
              <Text style={styles.statLabel}>Rides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>545</Text>
              <Text style={styles.statLabel}>Credits</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/ride/feedback')} // Placeholder for edit profile
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>{item.icon}</View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                {item.status && <Text style={styles.menuStatus}>{item.status}</Text>}
                <ChevronRight size={20} color={SahayatriTheme.colors.outline} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Sahayatri v1.0.0 (Beta)</Text>
          <Text style={styles.footerInfo}>Made with ❤️ for the Nepal Community</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SahayatriTheme.colors.background,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  profileCard: {
    backgroundColor: SahayatriTheme.colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: SahayatriTheme.colors.surfaceContainer,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  phone: {
    fontSize: 14,
    color: SahayatriTheme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 24,
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: SahayatriTheme.colors.surfaceContainerLow,
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  statLabel: {
    fontSize: 12,
    color: SahayatriTheme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: SahayatriTheme.colors.outlineVariant,
    alignSelf: 'center',
  },
  editButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: SahayatriTheme.colors.primaryContainer,
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContainer: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SahayatriTheme.colors.surface,
    padding: 16,
    borderRadius: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: SahayatriTheme.colors.primaryContainer + '11',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: SahayatriTheme.colors.onSurface,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.primaryContainer,
  },
  menuStatus: {
    fontSize: 14,
    color: SahayatriTheme.colors.primaryContainer,
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 4,
    marginBottom: 40,
  },
  version: {
    fontSize: 12,
    color: SahayatriTheme.colors.onSurfaceVariant,
    fontWeight: 'bold',
  },
  footerInfo: {
    fontSize: 12,
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
});
