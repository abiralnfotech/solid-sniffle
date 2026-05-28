import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';
import { Spacing } from '@/constants/theme';
import { LocationUpdateRead, RideRead } from '@/types/api';
import { OSMMap } from '@/components/map/osm-map';

export default function ActiveRideScreen() {
  const { ride_id } = useLocalSearchParams<{ ride_id: string }>();
  const { user } = useAuth();
  const [ride, setRide] = useState<RideRead | null>(null);
  const [latestLocation, setLatestLocation] = useState<LocationUpdateRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // In a real app we'd use a real map component, here we simulate with text for tracking
  useEffect(() => {
    let interval: any;

    const fetchRideDetails = async () => {
      try {
        if (ride_id) {
          const rideData = await api.rides.get(ride_id);
          setRide(rideData);
          const loc = await api.location.getLatest(ride_id);
          setLatestLocation(loc);
        }
      } catch (error) {
        console.error('Failed to fetch ride/location', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRideDetails();
    interval = setInterval(fetchRideDetails, 5000);

    return () => clearInterval(interval);
  }, [ride_id]);

  const handleEndRide = async () => {
    if (!user || !ride_id) return;
    try {
      await api.rides.end(ride_id, user.user_id);
      Alert.alert('Ride Ended', 'Please provide feedback.');
      router.replace({ pathname: '/feedback/submit', params: { ride_id } });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleConfirmArrival = async () => {
    if (!user || !ride_id) return;
    try {
      await api.rides.confirm(ride_id, user.user_id);
      Alert.alert('Arrival Confirmed', 'Please provide feedback.');
      router.replace({ pathname: '/feedback/submit', params: { ride_id } });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSOS = async () => {
    if (!user || !ride_id) return;
    try {
      await api.location.triggerSos(user.user_id, {
        ride_id,
        location: [85.3240, 27.7172], // Kathmandu fallback
      });
      Alert.alert('SOS Triggered', 'Emergency services and contacts have been notified.');
    } catch (error: any) {
      Alert.alert('SOS Failed', error.message);
    }
  };

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  const getCoords = (loc: any): [number, number] | null => {
    if (!loc) return null;
    if (Array.isArray(loc)) return [loc[1], loc[0]];
    if (loc.coordinates) return [loc.coordinates[1], loc.coordinates[0]];
    return null;
  };

  const currentCoords = getCoords(latestLocation?.location);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.mapPlaceholder}>
        <OSMMap
          center={currentCoords || [27.7172, 85.3240]}
          markers={currentCoords ? [{ lat: currentCoords[0], lon: currentCoords[1], title: 'Driver' }] : []}
        />
      </ThemedView>

      <ThemedView style={styles.controls}>
        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <ThemedText style={styles.buttonText}>SOS</ThemedText>
        </TouchableOpacity>

        {user?.user_id === ride?.passenger_id ? (
             <TouchableOpacity style={styles.endButton} onPress={handleConfirmArrival}>
                <ThemedText style={styles.buttonText}>Confirm Arrival</ThemedText>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity style={styles.endButton} onPress={handleEndRide}>
                <ThemedText style={styles.buttonText}>End Ride</ThemedText>
            </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    margin: Spacing.four,
    borderRadius: 20,
  },
  controls: {
    padding: Spacing.four,
    flexDirection: 'row',
    gap: Spacing.four,
  },
  sosButton: {
    backgroundColor: '#FF3B30',
    flex: 1,
    padding: Spacing.four,
    borderRadius: 12,
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: '#007AFF',
    flex: 2,
    padding: Spacing.four,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
