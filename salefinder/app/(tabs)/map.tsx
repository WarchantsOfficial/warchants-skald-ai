import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { MAP_PINS, SHOPS, DEALS } from '../../constants/mockData';
import ShopSheet from '../../components/ShopSheet';
import type { Shop } from '../../constants/mockData';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = 280;
const MAP_WIDTH = width - 32;

export default function MapScreen() {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [shopSheetVisible, setShopSheetVisible] = useState(false);

  const handlePinPress = (storeId: string) => {
    const shop = SHOPS[storeId] ?? null;
    if (shop) {
      setSelectedShop(shop);
      setShopSheetVisible(true);
    }
  };

  // Near list: first 4 deals sorted by distance (mock)
  const nearbyDeals = DEALS.slice(0, 4);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📍 Deals in deiner Nähe</Text>
          <Text style={styles.headerSubtitle}>Wien, 1., Innere Stadt</Text>
        </View>

        {/* Mock Map */}
        <View style={styles.mapContainer}>
          <View style={styles.map}>
            {/* Grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((frac) => (
              <View
                key={`h-${frac}`}
                style={[styles.gridLineH, { top: frac * MAP_HEIGHT }]}
              />
            ))}
            {[0.2, 0.4, 0.6, 0.8].map((frac) => (
              <View
                key={`v-${frac}`}
                style={[styles.gridLineV, { left: frac * MAP_WIDTH }]}
              />
            ))}

            {/* Street-like lines */}
            <View style={[styles.streetH, { top: MAP_HEIGHT * 0.45 }]} />
            <View style={[styles.streetV, { left: MAP_WIDTH * 0.5 }]} />
            <View style={[styles.streetH, { top: MAP_HEIGHT * 0.72, opacity: 0.5 }]} />
            <View style={[styles.streetV, { left: MAP_WIDTH * 0.25, opacity: 0.5 }]} />
            <View style={[styles.streetV, { left: MAP_WIDTH * 0.75, opacity: 0.5 }]} />

            {/* Map Pins */}
            {MAP_PINS.map((pin) => (
              <TouchableOpacity
                key={pin.id}
                style={[
                  styles.pin,
                  {
                    left: pin.x * MAP_WIDTH - 36,
                    top: pin.y * MAP_HEIGHT - 16,
                    borderColor: pin.color,
                  },
                ]}
                onPress={() => handlePinPress(pin.storeId)}
                activeOpacity={0.8}
              >
                <Text style={styles.pinText}>{pin.label}</Text>
              </TouchableOpacity>
            ))}

            {/* User location dot */}
            <View style={styles.userDotOuter}>
              <View style={styles.userDotInner} />
            </View>
          </View>

          {/* Map controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapControlBtn}>
              <Ionicons name="add" size={20} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapControlBtn}>
              <Ionicons name="remove" size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nearby list */}
        <View style={styles.nearbySection}>
          <Text style={styles.sectionTitle}>In der Nähe</Text>
          {nearbyDeals.map((deal) => (
            <TouchableOpacity
              key={deal.id}
              style={styles.nearbyItem}
              onPress={() => handlePinPress(deal.storeId)}
              activeOpacity={0.7}
            >
              <View style={styles.nearbyIconCircle}>
                <Text style={styles.nearbyIcon}>{deal.icon}</Text>
              </View>
              <View style={styles.nearbyInfo}>
                <Text style={styles.nearbyStore}>{deal.store}</Text>
                <Text style={styles.nearbyTitle}>{deal.title}</Text>
                <View style={styles.nearbyMeta}>
                  <Ionicons name="location-outline" size={12} color={Colors.muted} />
                  <Text style={styles.nearbyLocation}>{deal.location}</Text>
                </View>
              </View>
              {deal.price && (
                <Text style={styles.nearbyPrice}>{deal.price}</Text>
              )}
              {deal.discount && (
                <View style={styles.discountPill}>
                  <Text style={styles.discountText}>{deal.discount}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ShopSheet
        shop={selectedShop}
        visible={shopSheetVisible}
        onClose={() => setShopSheetVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 3,
  },
  mapContainer: {
    marginHorizontal: 16,
    borderRadius: Colors.cardRadius,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  map: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    backgroundColor: Colors.surface2,
    position: 'relative',
    overflow: 'hidden',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.4,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: Colors.border,
    opacity: 0.4,
  },
  streetH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.border,
  },
  streetV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.border,
  },
  pin: {
    position: 'absolute',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  pinText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  userDotOuter: {
    position: 'absolute',
    left: MAP_WIDTH * 0.5 - 12,
    top: MAP_HEIGHT * 0.5 - 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(74,158,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4a9eff',
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapControls: {
    position: 'absolute',
    right: 10,
    top: 10,
    gap: 4,
  },
  mapControlBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbySection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Colors.cardRadius,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  nearbyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nearbyIcon: {
    fontSize: 22,
  },
  nearbyInfo: {
    flex: 1,
    gap: 2,
  },
  nearbyStore: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  nearbyTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  nearbyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  nearbyLocation: {
    color: Colors.muted,
    fontSize: 12,
  },
  nearbyPrice: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  discountPill: {
    backgroundColor: Colors.accent,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
