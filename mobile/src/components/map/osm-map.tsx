import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface OSMMapProps {
  center?: [number, number]; // [lat, lon]
  zoom?: number;
  markers?: Array<{
    lat: number;
    lon: number;
    title?: string;
  }>;
  onLocationSelect?: (lat: number, lon: number) => void;
}

export function OSMMap({ center = [27.7172, 85.3240], zoom = 13, markers = [], onLocationSelect }: OSMMapProps) {
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Leaflet Map</title>
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
        var map = L.map('map').setView([${center[0]}, ${center[1]}], ${zoom});
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var markers = ${JSON.stringify(markers)};
        markers.forEach(function(m) {
          L.marker([m.lat, m.lon]).addTo(map).bindPopup(m.title || '');
        });

        if (${!!onLocationSelect}) {
          map.on('click', function(e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'LOCATION_SELECT',
              lat: e.latlng.lat,
              lon: e.latlng.lng
            }));
          });
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'LOCATION_SELECT' && onLocationSelect) {
            onLocationSelect(data.lat, data.lon);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
