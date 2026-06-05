import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { ShieldAlert, HelpCircle, PhoneCall, ChevronRight } from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useRouter } from 'expo-router';

export default function AccountSuspended() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <ShieldAlert size={64} color={SahayatriTheme.colors.error} />
        </View>

        <Text style={styles.title}>Account Restricted</Text>
        <Text style={styles.subtitle}>
          Your access to Sahayatri has been temporarily suspended due to multiple negative reports regarding community safety.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Why was I suspended?</Text>
          <Text style={styles.cardText}>
            Our automated moderation system flagged a high ratio of safety-related feedback on your recent rides. To maintain the integrity of our mutual aid network, your account is under manual review.
          </Text>
        </View>

        <View style={styles.actionList}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionLeft}>
              <HelpCircle size={24} color={SahayatriTheme.colors.primaryContainer} />
              <Text style={styles.actionLabel}>Appeal this decision</Text>
            </View>
            <ChevronRight size={20} color={SahayatriTheme.colors.outline} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionLeft}>
              <PhoneCall size={24} color={SahayatriTheme.colors.primaryContainer} />
              <Text style={styles.actionLabel}>Contact Support</Text>
            </View>
            <ChevronRight size={20} color={SahayatriTheme.colors.outline} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SahayatriTheme.colors.background,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: SahayatriTheme.colors.error + '11',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: SahayatriTheme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  infoCard: {
    width: '100%',
    backgroundColor: SahayatriTheme.colors.surface,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.error + '22',
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.error,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: SahayatriTheme.colors.onSurfaceVariant,
    lineHeight: 22,
  },
  actionList: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SahayatriTheme.colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.outlineVariant,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: SahayatriTheme.colors.onSurface,
  },
  logoutButton: {
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.error,
  },
});
