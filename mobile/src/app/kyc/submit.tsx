import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';
import { Spacing } from '@/constants/theme';

export default function KYCSubmitScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    document_type: 'nagarikta',
    document_number: '',
    driver_license_number: '',
    identity_front_url: 'https://example.com/front.jpg', // Placeholder as we don't have image upload logic yet
    identity_back_url: 'https://example.com/back.jpg',
    driver_license_url: '',
  });

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.document_number) {
      Alert.alert('Error', 'Document number is required');
      return;
    }

    setIsLoading(true);
    try {
      await api.kyc.submit(user.user_id, {
        ...form,
        driver_license_number: form.driver_license_number || null,
        driver_license_url: form.driver_license_url || null,
      });
      Alert.alert('Success', 'KYC documents submitted for review.', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error: any) {
      Alert.alert('Submission Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="subtitle">Identity Verification</ThemedText>
        <ThemedText style={styles.description}>
          Please provide your identity details to use the platform. Driver license is optional but required to drive.
        </ThemedText>

        <ThemedView style={styles.formGroup}>
          <ThemedText type="default">Document Type (nagarikta / rashtriya_parichayapatra)</ThemedText>
          <TextInput
            style={styles.input}
            value={form.document_type}
            onChangeText={(val) => setForm({ ...form, document_type: val })}
            placeholder="nagarikta / rashtriya_parichayapatra"
          />
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText type="default">Document Number</ThemedText>
          <TextInput
            style={styles.input}
            value={form.document_number}
            onChangeText={(val) => setForm({ ...form, document_number: val })}
            placeholder="Enter ID number"
          />
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText type="default">Driver License Number (Optional)</ThemedText>
          <TextInput
            style={styles.input}
            value={form.driver_license_number}
            onChangeText={(val) => setForm({ ...form, driver_license_number: val })}
            placeholder="Enter license number if you want to drive"
          />
        </ThemedView>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Submit for Verification</ThemedText>
          )}
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
    gap: Spacing.four,
  },
  description: {
    opacity: 0.7,
    marginBottom: Spacing.two,
  },
  formGroup: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: Spacing.three,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: Spacing.four,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
