import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Shop } from '../constants/mockData';

interface ShopSheetProps {
  shop: Shop | null;
  visible: boolean;
  onClose: () => void;
}

export default function ShopSheet({ shop, visible, onClose }: ShopSheetProps) {
  if (!shop) return null;

  const handleRoute = () => {
    Alert.alert('Route starten', `Navigation zu ${shop.name} wird gestartet...`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Shop Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>{shop.icon}</Text>
            </View>
            <View style={styles.headerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.shopName}>{shop.name}</Text>
                {shop.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.green} />
                    <Text style={styles.verifiedText}>Verifiziert</Text>
                  </View>
                )}
              </View>
              <Text style={styles.category}>{shop.category}</Text>
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={14} color={Colors.muted} />
                <Text style={styles.address}>{shop.address}</Text>
              </View>
            </View>
          </View>

          {/* Deals */}
          <Text style={styles.sectionTitle}>Aktuelle Angebote</Text>
          {shop.deals.map((deal, index) => (
            <View key={index} style={styles.dealRow}>
              <View style={styles.dealBorder} />
              <View style={styles.dealContent}>
                <Text style={styles.dealName}>{deal.name}</Text>
                <Text style={styles.dealPrice}>{deal.price}</Text>
              </View>
            </View>
          ))}

          {/* Route Button */}
          <TouchableOpacity style={styles.routeButton} onPress={handleRoute} activeOpacity={0.8}>
            <Ionicons name="navigate" size={18} color="#fff" />
            <Text style={styles.routeButtonText}>Route starten 🗺️</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '75%',
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 14,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconText: {
    fontSize: 28,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  shopName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(46,204,113,0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedText: {
    color: Colors.green,
    fontSize: 11,
    fontWeight: '600',
  },
  category: {
    color: Colors.muted,
    fontSize: 13,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  address: {
    color: Colors.muted,
    fontSize: 13,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  dealRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 12,
  },
  dealBorder: {
    width: 3,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  dealContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface2,
    borderRadius: 10,
  },
  dealName: {
    color: Colors.text,
    fontSize: 14,
    flex: 1,
  },
  dealPrice: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  routeButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  routeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
