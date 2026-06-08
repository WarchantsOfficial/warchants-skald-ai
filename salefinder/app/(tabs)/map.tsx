import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal, SafeAreaView, ActivityIndicator, Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#0d0d0f', surface: '#16161a', surface2: '#1e1e24',
  border: '#2a2a35', accent: '#ff5c35', accent2: '#ffb800',
  text: '#f0f0f0', muted: '#888899', green: '#2ecc71',
};

const SHOPS = [
  { id: 'ravensburger', icon: '🎲', name: 'Ravensburger Shop', address: 'Mariahilfer Str. 85, Wien', category: 'Spielzeug', verified: false, deals: 2, dist: '180m', lat: 48.1972, lng: 16.3491, items: [{ n: '🎁 Mystery Box S', p: '€14,99' }, { n: '🎁 Mystery Box L', p: '€29,99' }], pinColor: '#ffb800', label: '🎲 Mystery!' },
  { id: 'saturn', icon: '📱', name: 'Saturn', address: 'Mariahilfer Str. 2, Wien', category: 'Elektronik', verified: true, deals: 5, dist: '320m', lat: 48.1985, lng: 16.3520, items: [{ n: '📱 Samsung S25', p: '€699 (−30%)' }, { n: '🎧 Sony WH-1000XM5', p: '€249' }], pinColor: '#ff5c35', label: '📱 −30%' },
  { id: 'billa', icon: '🛒', name: 'Billa Plus', address: 'Neubaugasse 12, Wien', category: 'Lebensmittel', verified: true, deals: 4, dist: '410m', lat: 48.1955, lng: 16.3468, items: [{ n: '🥩 Ribeye Steak', p: '−40%' }, { n: '🍦 Ben & Jerrys', p: '2+1 gratis' }], pinColor: '#ff5c35', label: '🛒 4 Deals' },
  { id: 'zara', icon: '👗', name: 'Zara', address: 'Kärntner Str. 28, Wien', category: 'Mode', verified: true, deals: 3, dist: '600m', lat: 48.2020, lng: 16.3695, items: [{ n: '👖 Jeans', p: 'ab €19,99' }, { n: '👗 Kleider', p: '−50%' }], pinColor: '#ff5c35', label: '👗 Sale' },
];

function buildMapHTML(userLat: number, userLng: number) {
  const markersJS = SHOPS.map(s => `
    var icon${s.id} = L.divIcon({
      html: '<div style="background:${s.pinColor};color:white;padding:5px 10px;border-radius:8px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,0.4)">${s.label}</div>',
      className: '',
      iconAnchor: [40, 40]
    });
    L.marker([${s.lat}, ${s.lng}], {icon: icon${s.id}})
      .addTo(map)
      .on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({type:'shopClick',id:'${s.id}'}));
      });
  `).join('\n');

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body, #map { width:100%; height:100%; }
  .leaflet-container { background: #1e1e24; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', {
    center: [${userLat}, ${userLng}],
    zoom: 15,
    zoomControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    maxZoom: 19
  }).addTo(map);

  var userIcon = L.divIcon({
    html: '<div style="width:16px;height:16px;background:#4a9eff;border:3px solid white;border-radius:50%;box-shadow:0 0 0 8px rgba(74,158,255,0.2)"></div>',
    className: '',
    iconAnchor: [8, 8]
  });
  L.marker([${userLat}, ${userLng}], {icon: userIcon}).addTo(map);

  ${markersJS}
</script>
</body>
</html>`;
}

export default function MapScreen() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<typeof SHOPS[0] | null>(null);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        setLocation({ lat: 48.1985, lng: 16.3520 }); // Vienna fallback
        setLoading(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } catch {
        setLocation({ lat: 48.1985, lng: 16.3520 });
      }
      setLoading(false);
    })();
  }, []);

  function onWebViewMessage(event: any) {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'shopClick') {
        const found = SHOPS.find(s => s.id === data.id);
        if (found) setShop(found);
      }
    } catch {}
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>📍 Deals in deiner Nähe</Text>
        {permissionDenied && (
          <View style={s.permBanner}>
            <Ionicons name="location-outline" size={14} color={C.accent2} />
            <Text style={s.permText}>Standort nicht freigegeben — Wien als Fallback</Text>
          </View>
        )}
      </View>

      {/* Map */}
      <View style={s.mapContainer}>
        {loading ? (
          <View style={s.loadingBox}>
            <ActivityIndicator size="large" color={C.accent} />
            <Text style={s.loadingText}>Standort wird ermittelt...</Text>
          </View>
        ) : location ? (
          <WebView
            ref={webviewRef}
            source={{ html: buildMapHTML(location.lat, location.lng) }}
            style={{ flex: 1 }}
            onMessage={onWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
            mixedContentMode="always"
          />
        ) : null}
      </View>

      {/* Nearby list */}
      <ScrollView style={s.nearbyList} contentContainerStyle={{ padding: 12, gap: 10, paddingBottom: 100 }}>
        <Text style={s.sectionTitle}>IN DER NÄHE</Text>
        {SHOPS.map(n => (
          <TouchableOpacity key={n.id} style={s.nearbyItem} onPress={() => setShop(n)}>
            <Text style={{ fontSize: 24 }}>{n.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.nearbyName}>{n.name}</Text>
              <Text style={s.nearbySub}>{n.address}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={s.nearbyDist}>{n.dist}</Text>
              <View style={s.dealsPill}>
                <Text style={s.dealsPillText}>{n.deals} Deals</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Shop Modal */}
      <Modal visible={!!shop} transparent animationType="slide" onRequestClose={() => setShop(null)}>
        <TouchableOpacity style={s.modalBg} activeOpacity={1} onPress={() => setShop(null)} />
        {shop && (
          <View style={s.sheet}>
            <View style={s.handle} />
            <View style={s.sheetHeader}>
              <Text style={{ fontSize: 32 }}>{shop.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.sheetName}>{shop.name}</Text>
                <Text style={s.sheetAddr}>📍 {shop.address}</Text>
                {shop.verified && (
                  <View style={s.verifiedBadge}>
                    <Text style={s.verifiedText}>✓ Verifizierter Händler</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={s.sectionTitle}>AKTUELLE DEALS</Text>
            {shop.items.map((item, i) => (
              <View key={i} style={s.dealItem}>
                <Text style={s.dealItemName}>{item.n}</Text>
                <Text style={s.dealItemPrice}>{item.p}</Text>
              </View>
            ))}
            <TouchableOpacity style={s.routeBtn} onPress={() => setShop(null)}>
              <Text style={s.routeBtnText}>Route starten 🗺️</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { padding: 16, paddingBottom: 8 },
  headerTitle: { color: C.text, fontSize: 18, fontWeight: '700' },
  permBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  permText: { color: C.accent2, fontSize: 12 },
  mapContainer: { height: 280, margin: 12, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  loadingBox: { flex: 1, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: C.muted, fontSize: 14 },
  nearbyList: { flex: 1 },
  sectionTitle: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  nearbyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: C.border },
  nearbyName: { color: C.text, fontSize: 14, fontWeight: '600' },
  nearbySub: { color: C.muted, fontSize: 12, marginTop: 2 },
  nearbyDist: { color: C.accent, fontSize: 13, fontWeight: '700' },
  dealsPill: { backgroundColor: C.accent, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  dealsPillText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: C.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  handle: { width: 36, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', marginBottom: 16 },
  sheetName: { color: C.text, fontSize: 18, fontWeight: '700' },
  sheetAddr: { color: C.muted, fontSize: 13, marginTop: 2 },
  verifiedBadge: { backgroundColor: '#2ecc7122', borderWidth: 1, borderColor: '#2ecc7155', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6, alignSelf: 'flex-start' },
  verifiedText: { color: C.green, fontSize: 12, fontWeight: '600' },
  dealItem: { backgroundColor: C.surface2, borderRadius: 10, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: C.accent },
  dealItemName: { color: C.text, fontSize: 14, fontWeight: '600' },
  dealItemPrice: { color: C.accent, fontSize: 13, fontWeight: '700', marginTop: 2 },
  routeBtn: { backgroundColor: C.accent, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  routeBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
