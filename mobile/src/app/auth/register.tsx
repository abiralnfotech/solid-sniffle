import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { Spacing } from '@/constants/theme';

export default function RegisterScreen() {
  const [phoneNumber, setPhoneNumber] = useState('+9779');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    setError(null);
    if (!phoneNumber.startsWith('+9779') || phoneNumber.length !== 14) {
      setError('Please enter a valid Nepalese phone number (+977 98/97...)');
      return;
    }
    if (fullName.trim().length < 3) {
      setError('Please enter your full name');
      return;
    }

    try {
      await login(phoneNumber, fullName);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Register</ThemedText>
      <ThemedText style={styles.subtitle}>Join the Mutual Aid Ride Sharing network</ThemedText>

      <ThemedView style={styles.form}>
        <ThemedText type="default">Full Name</ThemedText>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="John Doe"
          placeholderTextColor="#999"
        />

        <ThemedText type="default">Phone Number</ThemedText>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="+97798XXXXXXXX"
          placeholderTextColor="#999"
        />

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: Spacing.six,
    opacity: 0.7,
  },
  form: {
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: Spacing.three,
    fontSize: 16,
    color: 'inherit', // Note: themed components might be better but for now standard TextInput
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: Spacing.four,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.two,
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
