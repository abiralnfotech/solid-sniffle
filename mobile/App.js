import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { healthCheck } from './src/api/client';
import Config from './src/constants/Config';

export default function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkBackend() {
      try {
        const data = await healthCheck();
        setHealthStatus(data);
        setError(null);
      } catch (err) {
        setError('Could not connect to backend. Make sure it is running.');
        console.log('Error details:', err);
      } finally {
        setLoading(false);
      }
    }

    checkBackend();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mutual Aid Ride-Sharing</Text>
      <Text style={styles.subtitle}>Mobile App</Text>

      <View style={styles.statusContainer}>
        <Text>Backend URL: {Config.API_URL}</Text>
        <View style={styles.spacer} />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View>
            <Text style={styles.successText}>Backend Connected!</Text>
            <Text style={styles.statusData}>{JSON.stringify(healthStatus, null, 2)}</Text>
          </View>
        )}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
  },
  statusContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    width: '100%',
    alignItems: 'center',
  },
  spacer: {
    height: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusData: {
    fontFamily: 'monospace',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
  },
});
