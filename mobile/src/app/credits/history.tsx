import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';
import { Spacing } from '@/constants/theme';
import { CreditLedgerRead } from '@/types/api';

export default function CreditHistoryScreen() {
  const { user } = useAuth();
  const [history, setHistory] = useState<CreditLedgerRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const data = await api.credits.getHistory(user.user_id);
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Transaction History</ThemedText>
      <FlatList
        data={history}
        keyExtractor={(item) => item.ledger_id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.ledgerItem}>
            <ThemedView style={{ flex: 1 }}>
              <ThemedText type="default">{item.description}</ThemedText>
              <ThemedText type="small">{new Date(item.created_at).toLocaleString()}</ThemedText>
            </ThemedView>
            <ThemedText style={[styles.amount, item.amount > 0 ? styles.positive : styles.negative]}>
              {item.amount > 0 ? '+' : ''}{item.amount}
            </ThemedText>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>No transactions yet.</ThemedText>}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
  },
  title: {
    marginBottom: Spacing.four,
  },
  list: {
    gap: Spacing.three,
  },
  ledgerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#FF3B30',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.six,
    opacity: 0.5,
  },
});
