import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  Search,
  MapPin,
  Users,
  Clock,
  Plus,
  Info,
  X,
  Bike
} from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { apiClient } from '@/api/client';

export default function Dashboard() {
  const [mode, setMode] = useState<'passenger' | 'driver'>('passenger');
  const [rides, setRides] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = useCallback(async () => {
    if (mode === 'passenger') {
      const data = await apiClient.rides.discover();
      setRides(data);
    } else {
      const data = await apiClient.rides.getRequests('current');
      setRequests(data);
    }
  }, [mode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        var map = L.map('map').setView([27.7172, 85.3240], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        L.marker([27.7172, 85.3240]).addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Namaste,</Text>
            <Text style={styles.userName}>Siddhartha</Text>
          </View>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Goodwill</Text>
            <Text style={styles.balanceValue}>545 CC</Text>
          </View>
        </View>

        <View style={styles.modeSwitcher}>
          <View style={[
            styles.modeSlider,
            { transform: [{ translateX: mode === 'passenger' ? 0 : (Dimensions.get('window').width - 48) / 2 }] }
          ]} />
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => setMode('passenger')}
          >
            <Text style={[styles.modeText, mode === 'passenger' && styles.activeModeText]}>Passenger</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => setMode('driver')}
          >
            <Text style={[styles.modeText, mode === 'driver' && styles.activeModeText]}>Driver</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mode === 'passenger' ? (
          <>
            <View style={styles.mapContainer}>
              <WebView
                originWhitelist={['*']}
                source={{ html: osmHtml }}
                style={styles.map}
              />
              <View style={styles.searchOverlay}>
                <Search size={20} color={SahayatriTheme.colors.onSurfaceVariant} />
                <Text style={styles.searchText}>Where are you going?</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Rides</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Filter</Text>
              </TouchableOpacity>
            </View>

            {rides.map((ride) => (
              <TouchableOpacity
                key={ride.id}
                style={styles.rideCard}
                onPress={() => {
                  setSelectedRide(ride);
                  setShowModal(true);
                }}
              >
                <View style={styles.rideCardHeader}>
                  <View style={styles.rideDriverInfo}>
                    <View style={styles.driverAvatarSmall} />
                    <View>
                      <Text style={styles.driverName}>{ride.driver_name}</Text>
                      <Text style={styles.vehicleName}>{ride.vehicle_details}</Text>
                    </View>
                  </View>
                  <Text style={styles.rideCost}>{ride.cost} CC</Text>
                </View>

                <View style={styles.routeContainer}>
                  <View style={styles.routePoint}>
                    <MapPin size={16} color={SahayatriTheme.colors.primaryContainer} />
                    <Text style={styles.routeText}>{ride.origin}</Text>
                  </View>
                  <View style={styles.routeLine} />
                  <View style={styles.routePoint}>
                    <MapPin size={16} color={SahayatriTheme.colors.secondaryContainer} />
                    <Text style={styles.routeText}>{ride.destination}</Text>
                  </View>
                </View>

                <View style={styles.rideFooter}>
                  <View style={styles.rideBadge}>
                    <Users size={14} color={SahayatriTheme.colors.onSurfaceVariant} />
                    <Text style={styles.badgeText}>{ride.seats_left} Seats left</Text>
                  </View>
                  <View style={styles.rideBadge}>
                    <Clock size={14} color={SahayatriTheme.colors.onSurfaceVariant} />
                    <Text style={styles.badgeText}>Leaves in 2m</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <View style={styles.driverActionCard}>
              <Text style={styles.actionTitle}>Active Route</Text>
              <View style={styles.activeRouteDetails}>
                <View style={styles.routePoint}>
                  <MapPin size={18} color={SahayatriTheme.colors.onPrimary} />
                  <Text style={styles.activeRouteText}>Koteshwor ➔ Thapathali</Text>
                </View>
                <TouchableOpacity style={styles.editRouteButton}>
                  <Plus size={20} color={SahayatriTheme.colors.onPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Request Queue</Text>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            {requests.map((req) => (
              <View key={req.request_id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <Image source={{ uri: req.avatar_url }} style={styles.passengerAvatar} />
                  <View style={styles.passengerInfo}>
                    <View style={styles.passengerNameRow}>
                      <Text style={styles.passengerName}>{req.passenger_name}</Text>
                      <Text style={styles.requestReward}>+{req.seats_requested * 50} CC</Text>
                    </View>
                    <View style={styles.passengerMeta}>
                      <Users size={14} color={SahayatriTheme.colors.onSurfaceVariant} />
                      <Text style={styles.metaText}>{req.mutual_friends} Mutual Friends</Text>
                    </View>
                    <View style={styles.passengerMeta}>
                      <MapPin size={14} color={SahayatriTheme.colors.onSurfaceVariant} />
                      <Text style={styles.metaText}>Pickup: {req.pickup_location}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity style={styles.declineButton}>
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.acceptButton}>
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Seat Request Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request a Seat</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color={SahayatriTheme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {selectedRide && (
              <View style={styles.modalBody}>
                <View style={styles.modalRideSummary}>
                  <View style={styles.rideIconCircle}>
                    <Bike size={32} color={SahayatriTheme.colors.secondary} />
                  </View>
                  <View>
                    <Text style={styles.modalRideName}>{selectedRide.driver_name}&apos;s Ride</Text>
                    <Text style={styles.modalRideMeta}>{selectedRide.vehicle_details}</Text>
                  </View>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Your Balance</Text>
                  <Text style={styles.modalValue}>545 CC</Text>
                </View>
                <View style={[styles.modalRow, styles.borderTop]}>
                  <Text style={styles.modalLabel}>Seat Cost</Text>
                  <Text style={[styles.modalValue, { color: SahayatriTheme.colors.error }]}>-{selectedRide.cost} CC</Text>
                </View>

                <View style={styles.infoBox}>
                  <Info size={20} color={SahayatriTheme.colors.secondary} />
                  <Text style={styles.infoText}>
                    Goodwill Credits are non-monetary and facilitate mutual trust within the Sahayatri network.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    setShowModal(false);
                    alert("Request Sent!");
                  }}
                >
                  <Text style={styles.confirmText}>Confirm Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SahayatriTheme.colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: SahayatriTheme.colors.surface,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileInfo: {},
  greeting: {
    fontSize: 14,
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  balanceCard: {
    backgroundColor: SahayatriTheme.colors.surfaceContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 10,
    color: SahayatriTheme.colors.primaryContainer,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.primaryContainer,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: SahayatriTheme.colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 6,
    position: 'relative',
  },
  modeSlider: {
    position: 'absolute',
    top: 6,
    left: 6,
    bottom: 6,
    width: '48%',
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    borderRadius: 12,
  },
  modeButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
  activeModeText: {
    color: SahayatriTheme.colors.onPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  mapContainer: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 24,
    marginBottom: 24,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  searchOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    height: 48,
    backgroundColor: SahayatriTheme.colors.surface,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchText: {
    color: SahayatriTheme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  seeAll: {
    fontSize: 14,
    color: SahayatriTheme.colors.primaryContainer,
    fontWeight: '600',
  },
  rideCard: {
    backgroundColor: SahayatriTheme.colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rideCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  rideDriverInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  driverAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SahayatriTheme.colors.surfaceContainer,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  vehicleName: {
    fontSize: 12,
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
  rideCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.primaryContainer,
  },
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 14,
    color: SahayatriTheme.colors.onSurface,
    fontWeight: '500',
  },
  routeLine: {
    width: 1,
    height: 12,
    backgroundColor: SahayatriTheme.colors.outlineVariant,
    marginLeft: 8,
    marginVertical: 2,
  },
  rideFooter: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: SahayatriTheme.colors.outlineVariant,
    paddingTop: 12,
  },
  rideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
  driverActionCard: {
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
    marginBottom: 24,
  },
  actionTitle: {
    color: SahayatriTheme.colors.onPrimary,
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  activeRouteDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeRouteText: {
    color: SahayatriTheme.colors.onPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  editRouteButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SahayatriTheme.colors.onPrimaryContainer + '22',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SahayatriTheme.colors.primaryContainer,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.primaryContainer,
  },
  requestCard: {
    backgroundColor: SahayatriTheme.colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: SahayatriTheme.colors.secondaryContainer,
  },
  requestHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  passengerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passengerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  requestReward: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.primaryContainer,
  },
  passengerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.error + '22',
    backgroundColor: SahayatriTheme.colors.error + '11',
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineText: {
    color: SahayatriTheme.colors.error,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    color: SahayatriTheme.colors.onPrimary,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: SahayatriTheme.colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.primaryContainer,
  },
  modalBody: {
    gap: 16,
  },
  modalRideSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SahayatriTheme.colors.surfaceContainerLow,
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  rideIconCircle: {
    width: 64,
    height: 64,
    backgroundColor: SahayatriTheme.colors.secondaryContainer + '22',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalRideName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  modalRideMeta: {
    fontSize: 14,
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalLabel: {
    fontSize: 16,
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
  modalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: SahayatriTheme.colors.outlineVariant,
    paddingTop: 16,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: SahayatriTheme.colors.secondary,
    lineHeight: 18,
  },
  confirmButton: {
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: SahayatriTheme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmText: {
    color: SahayatriTheme.colors.onPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
