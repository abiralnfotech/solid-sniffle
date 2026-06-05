import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  ShieldAlert,
  Phone,
  MessageSquare,
  MapPin,
  Navigation,
  ChevronLeft
} from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useRouter } from 'expo-router';

export default function LiveRideTracking() {
  const router = useRouter();
  const [status, setStatus] = useState('En Route');

  const osmHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([27.7, 85.32], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        var driverIcon = L.divIcon({
          className: 'driver-marker',
          html: '<div style="background: #065F46; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>'
        });
        L.marker([27.7, 85.32], {icon: driverIcon}).addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: osmHtml }}
        style={styles.map}
      />

      <SafeAreaView style={styles.overlay}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={SahayatriTheme.colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{status}</Text>
          </View>
          <TouchableOpacity style={styles.sosButton}>
            <ShieldAlert size={20} color="#FFF" />
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomCard}>
          <View style={styles.driverSection}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8WwWQd5tr4fUiuaNuevdCggJX0_jHrC_SbnLtf9Y-4JGIowahUALhMAvkITkqFuYxjVbEb2KKJWeyFtocMbHqzEg4pi8mG4jwEgcp1ukyFpAdgDo-OcNlbA47WO_KhWitO34YfyhQn31k0RA1JM1RxugYTr7PVG_EPpcFROuTh0aOrptcT0aWsgX3kQwuDW7K8r12XXot4KJJCkCB79sb23xCyKdG7Ac9OdXHVGQqvLSTi_ZyIjXwNYdJVWuHUpIi6HAan_u6TGI' }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Binod Thapa</Text>
              <Text style={styles.vehicleInfo}>Suzuki Gixxer • BA 97 PA 4567</Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity style={styles.contactButton}>
                <Phone size={20} color={SahayatriTheme.colors.primaryContainer} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <MessageSquare size={20} color={SahayatriTheme.colors.primaryContainer} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.tripRow}>
              <View style={styles.tripPoint}>
                <Navigation size={16} color={SahayatriTheme.colors.primaryContainer} />
                <View>
                  <Text style={styles.pointLabel}>Current Location</Text>
                  <Text style={styles.pointValue}>Near Maitighar Mandala</Text>
                </View>
              </View>
              <Text style={styles.eta}>4 min</Text>
            </View>
            <View style={styles.tripRow}>
              <View style={styles.tripPoint}>
                <MapPin size={16} color={SahayatriTheme.colors.secondaryContainer} />
                <View>
                  <Text style={styles.pointLabel}>Destination</Text>
                  <Text style={styles.pointValue}>Thapathali Engineering Campus</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.viewRideButton} onPress={() => router.push('/ride/feedback')}>
            <Text style={styles.viewRideText}>I have arrived</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SahayatriTheme.colors.primaryContainer,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SahayatriTheme.colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sosText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  vehicleInfo: {
    fontSize: 12,
    color: SahayatriTheme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    width: 44,
    height: 44,
    backgroundColor: SahayatriTheme.colors.surfaceContainerLow,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripDetails: {
    backgroundColor: SahayatriTheme.colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 16,
    gap: 16,
    marginBottom: 24,
  },
  tripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripPoint: {
    flexDirection: 'row',
    gap: 12,
  },
  pointLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  pointValue: {
    fontSize: 14,
    fontWeight: '600',
    color: SahayatriTheme.colors.onSurface,
  },
  eta: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.primaryContainer,
  },
  viewRideButton: {
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewRideText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
