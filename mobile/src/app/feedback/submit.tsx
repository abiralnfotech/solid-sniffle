import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';
import { Spacing } from '@/constants/theme';
import { FlagReason } from '@/types/api';

export default function FeedbackSubmitScreen() {
  const { ride_id } = useLocalSearchParams<{ ride_id: string }>();
  const { user } = useAuth();
  const [isGood, setIsGood] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [flagReason, setFlagReason] = useState<FlagReason | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user || !ride_id || isGood === null) {
      Alert.alert('Selection Required', 'Please select 👍 or 👎');
      return;
    }

    setIsLoading(true);
    try {
      await api.feedback.submit(user.user_id, {
        ride_id,
        is_good: isGood,
        comment: comment || null,
        flag_reason: flagReason,
      });
      Alert.alert('Thank You', 'Your feedback helps the community.');
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Submission Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="subtitle">How was your ride?</ThemedText>

        <ThemedView style={styles.ratingRow}>
          <TouchableOpacity
            style={[styles.rateButton, isGood === true && styles.rateButtonActive]}
            onPress={() => { setIsGood(true); setFlagReason(null); }}
          >
            <ThemedText style={styles.emoji}>👍</ThemedText>
            <ThemedText>Good</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rateButton, isGood === false && styles.rateButtonActiveNeg]}
            onPress={() => setIsGood(false)}
          >
            <ThemedText style={styles.emoji}>👎</ThemedText>
            <ThemedText>Bad</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {isGood === false && (
          <ThemedView style={styles.flagSection}>
            <ThemedText type="default">What went wrong?</ThemedText>
            {(['reckless_driving', 'unpunctual', 'inappropriate_behavior', 'asked_for_cash', 'other'] as FlagReason[]).map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[styles.flagItem, flagReason === reason && styles.flagItemActive]}
                onPress={() => setFlagReason(reason)}
              >
                <ThemedText>{reason.replace(/_/g, ' ')}</ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}

        <ThemedView style={styles.formGroup}>
          <ThemedText type="default">Comment (Optional)</ThemedText>
          <TextInput
            style={styles.input}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            placeholder="Tell us more about your experience..."
          />
        </ThemedView>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          <ThemedText style={styles.submitButtonText}>Submit Feedback</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.six,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  rateButton: {
    flex: 1,
    padding: Spacing.four,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rateButtonActive: {
    borderColor: '#34C759',
    backgroundColor: '#E8F5E9',
  },
  rateButtonActiveNeg: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFEBEE',
  },
  emoji: {
    fontSize: 32,
  },
  flagSection: {
    gap: Spacing.two,
  },
  flagItem: {
    padding: Spacing.three,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  flagItemActive: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFEBEE',
  },
  formGroup: {
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: Spacing.three,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: Spacing.four,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
