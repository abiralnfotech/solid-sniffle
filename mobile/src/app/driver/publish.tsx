import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';
import { Spacing } from '@/constants/theme';
import { OSMMap } from '@/components/map/osm-map';

export default function PublishRouteScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    start_lat: '27.7172', // Kathmandu
    start_lon: '85.3240',
    dest_lat: '27.6710', // Lalitpur
    dest_lon: '85.3240',
    available_seats: '1',
    departure_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
  });

  const handlePublish = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await api.routes.create(user.user_id, {
        start_location: [parseFloat(form.start_lon), parseFloat(form.start_lat)],
        destination_location: [parseFloat(form.dest_lon), parseFloat(form.dest_lat)],
        available_seats: parseInt(form.available_seats),
        departure_time: form.departure_time,
      });
      Alert.alert('Success', 'Route published successfully!', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error: any) {
      Alert.alert('Failed to publish route', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="subtitle">Publish a Route</ThemedText>

        <ThemedView style={styles.mapContainer}>
          <OSMMap
            onLocationSelect={(lat, lon) => {
              setForm(prev => ({ ...prev, start_lat: lat.toFixed(6), start_lon: lon.toFixed(6) }));
            }}
          />
        </ThemedView>
        <ThemedText type="small">Tap on map to select Start Location</ThemedText>

        <ThemedView style={styles.formGroup}>
          <ThemedText type="default">Start Location (Lon, Lat)</ThemedText>
          <ThemedView style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={form.start_lon}
              onChangeText={(v) => setForm({ ...form, start_lon: v })}
              keyboardType="numeric"
              placeholder="Longitude"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={form.start_lat}
              onChangeText={(v) => setForm({ ...form, start_lat: v })}
              keyboardType="numeric"
              placeholder="Latitude"
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText type="default">Destination Location (Lon, Lat)</ThemedText>
          <ThemedView style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={form.dest_lon}
              onChangeText={(v) => setForm({ ...form, dest_lon: v })}
              keyboardType="numeric"
              placeholder="Longitude"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={form.dest_lat}
              onChangeText={(v) => setForm({ ...form, dest_lat: v })}
              keyboardType="numeric"
              placeholder="Latitude"
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText type="default">Available Seats</ThemedText>
          <TextInput
            style={styles.input}
            value={form.available_seats}
            onChangeText={(v) => setForm({ ...form, available_seats: v })}
            keyboardType="numeric"
            placeholder="Number of seats"
          />
        </ThemedView>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handlePublish}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Publish Route</ThemedText>
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
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  formGroup: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
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
