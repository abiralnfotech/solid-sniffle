import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';
import { Spacing } from '@/constants/theme';
import { RouteRead } from '@/types/api';

export default function SearchRouteScreen() {
  const { user } = useAuth();
  const [lon, setLon] = useState('85.3240');
  const [lat, setLat] = useState('27.7172');
  const [radius, setRadius] = useState('5000');
  const [routes, setRoutes] = useState<RouteRead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const data = await api.routes.search(parseFloat(lon), parseFloat(lat), parseInt(radius));
      setRoutes(data);
    } catch (error: any) {
      Alert.alert('Search Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestRide = async (routeId: string) => {
    if (!user) return;
    try {
      await api.rides.request(user.user_id, { route_id: routeId, seat_count: 1 });
      Alert.alert('Success', 'Ride requested successfully!', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error: any) {
      Alert.alert('Request Failed', error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.searchSection}>
        <ThemedText type="default">Search Area (Lon, Lat, Radius m)</ThemedText>
        <ThemedView style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={lon}
            onChangeText={setLon}
            keyboardType="numeric"
            placeholder="Lon"
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={lat}
            onChangeText={setLat}
            keyboardType="numeric"
            placeholder="Lat"
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={radius}
            onChangeText={setRadius}
            keyboardType="numeric"
            placeholder="Radius"
          />
        </ThemedView>
        <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Search</ThemedText>}
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={routes}
        keyExtractor={(item) => item.route_id}
        renderItem={({ item }) => (
          <ThemedView style={styles.routeCard}>
            <ThemedView>
              <ThemedText type="default">Route ID: {item.route_id.substring(0, 8)}...</ThemedText>
              <ThemedText type="small">Seats: {item.available_seats}</ThemedText>
              <ThemedText type="small">Time: {new Date(item.departure_time).toLocaleString()}</ThemedText>
            </ThemedView>
            <TouchableOpacity style={styles.requestButton} onPress={() => handleRequestRide(item.route_id)}>
              <ThemedText style={styles.requestButtonText}>Request</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
        ListEmptyComponent={
          !isLoading ? <ThemedText style={styles.emptyText}>No routes found in this area.</ThemedText> : null
        }
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    padding: Spacing.four,
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: Spacing.two,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: Spacing.three,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: Spacing.four,
  },
  routeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: '#eee',
  },
  requestButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: 8,
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.six,
    opacity: 0.5,
  },
});
