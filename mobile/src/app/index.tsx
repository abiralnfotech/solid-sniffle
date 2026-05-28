import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';
import { Spacing } from '@/constants/theme';
import { CreditBalance } from '@/types/api';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [mode, setMode] = useState<'passenger' | 'driver'>('passenger');
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const fetchBalance = async () => {
    if (!user) return;
    try {
      const data = await api.credits.getBalance(user.user_id);
      setBalance(data);
    } catch (error) {
      console.error('Failed to fetch balance', error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchBalance();
    setIsRefreshing(false);
  };

  if (!user) return null;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView>
          <ThemedText type="default">Namaste, {user.full_name}</ThemedText>
          <ThemedText type="small">Balance: {balance?.balance ?? 0} Credits</ThemedText>
        </ThemedView>
        <TouchableOpacity onPress={logout}>
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, mode === 'passenger' && styles.toggleActive]}
          onPress={() => setMode('passenger')}
        >
          <ThemedText style={[styles.toggleText, mode === 'passenger' && styles.toggleTextActive]}>
            Passenger
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, mode === 'driver' && styles.toggleActive]}
          onPress={() => setMode('driver')}
        >
          <ThemedText style={[styles.toggleText, mode === 'driver' && styles.toggleTextActive]}>
            Driver
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {mode === 'passenger' ? (
          <ThemedView style={styles.modeSection}>
            <ThemedText type="subtitle">Find a Ride</ThemedText>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/passenger/search')}>
              <ThemedText type="default">Search for Routes</ThemedText>
              <ThemedText type="small">Find drivers going your way</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <ThemedView style={styles.modeSection}>
            <ThemedText type="subtitle">Share a Ride</ThemedText>
            {user.role !== 'driver' && (
              <ThemedView style={styles.warningCard}>
                <ThemedText type="small">You need to be verified as a driver to publish routes.</ThemedText>
                <TouchableOpacity onPress={() => router.push('/kyc/submit')}>
                  <ThemedText style={styles.linkText}>Complete KYC</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}
            <TouchableOpacity
              style={[styles.actionCard, user.role !== 'driver' && styles.cardDisabled]}
              onPress={() => router.push('/driver/publish')}
              disabled={user.role !== 'driver'}
            >
              <ThemedText type="default">Publish Route</ThemedText>
              <ThemedText type="small">Offer seats on your next trip</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutText: {
    color: '#FF3B30',
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: Spacing.two,
    backgroundColor: '#f0f0f0',
    margin: Spacing.four,
    borderRadius: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  toggleText: {
    color: '#666',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#007AFF',
  },
  content: {
    paddingHorizontal: Spacing.four,
  },
  modeSection: {
    gap: Spacing.four,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: Spacing.four,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    gap: Spacing.one,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  warningCard: {
    backgroundColor: '#FFFBE6',
    padding: Spacing.three,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE58F',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '600',
    marginTop: Spacing.one,
  },
});
