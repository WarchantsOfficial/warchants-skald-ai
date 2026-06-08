import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { DEALS, SHOPS } from '../../constants/mockData';

const CATEGORIES = [
  { key: 'all', label: 'Alle' },
  { key: 'mystery', label: '🎁 Mystery' },
  { key: 'food', label: '🍔 Food' },
  { key: 'tech', label: '💻 Tech' },
  { key: 'mode', label: '👗 Mode' },
  { key: 'toy', label: '🧸 Spielzeug' },
];

const RECENT_SEARCHES = ['Mariahilfer Str.', 'Wien 1010', 'LEGO Sale', 'Samsung'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredDeals = DEALS.filter((d) => {
    const matchesQuery =
      query.trim().length === 0 ||
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.store.toLowerCase().includes(query.toLowerCase()) ||
      d.desc.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || d.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const shopEntries = Object.entries(SHOPS).filter(([, shop]) =>
    query.trim().length === 0 ||
    shop.name.toLowerCase().includes(query.toLowerCase()) ||
    shop.category.toLowerCase().includes(query.toLowerCase())
  );

  const showResults = query.trim().length > 0 || activeCategory !== 'all';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suchen</Text>
      </View>

      {/* Search input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Deals, Shops, Kategorien..."
            placeholderTextColor={Colors.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.chip, activeCategory === cat.key && styles.chipActive]}
            onPress={() => setActiveCategory(cat.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, activeCategory === cat.key && styles.chipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!showResults ? (
          <>
            {/* Recent searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Zuletzt gesucht</Text>
              {RECENT_SEARCHES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.recentItem}
                  onPress={() => setQuery(s)}
                  activeOpacity={0.7}
                >
                  <View style={styles.recentLeft}>
                    <Ionicons name="time-outline" size={16} color={Colors.muted} />
                    <Text style={styles.recentText}>{s}</Text>
                  </View>
                  <Ionicons name="arrow-forward-outline" size={14} color={Colors.muted} />
                </TouchableOpacity>
              ))}
            </View>

            {/* City placeholder */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nach Standort suchen</Text>
              <View style={styles.locationPrompt}>
                <Ionicons name="location-outline" size={32} color={Colors.muted} />
                <Text style={styles.locationPromptText}>
                  Suche nach Stadt oder PLZ...
                </Text>
                <Text style={styles.locationPromptSub}>
                  z.B. "Wien", "1010", "Graz"
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Shop results */}
            {shopEntries.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shops</Text>
                {shopEntries.map(([id, shop]) => (
                  <View key={id} style={styles.shopItem}>
                    <View style={styles.shopIconCircle}>
                      <Text style={styles.shopIconText}>{shop.icon}</Text>
                    </View>
                    <View style={styles.shopInfo}>
                      <Text style={styles.shopName}>{shop.name}</Text>
                      <Text style={styles.shopCategory}>{shop.category}</Text>
                      <Text style={styles.shopAddress}>{shop.address}</Text>
                    </View>
                    {shop.verified && (
                      <Ionicons name="checkmark-circle" size={18} color={Colors.green} />
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Deal results */}
            {filteredDeals.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Deals ({filteredDeals.length})
                </Text>
                {filteredDeals.map((deal) => (
                  <View key={deal.id} style={styles.dealItem}>
                    <View style={styles.dealLeft}>
                      <Text style={styles.dealIcon}>{deal.icon}</Text>
                    </View>
                    <View style={styles.dealInfo}>
                      <Text style={styles.dealTitle}>{deal.title}</Text>
                      <Text style={styles.dealStore}>{deal.store} · {deal.location}</Text>
                    </View>
                    {deal.price && (
                      <Text style={styles.dealPrice}>{deal.price}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {filteredDeals.length === 0 && shopEntries.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>Keine Ergebnisse</Text>
                <Text style={styles.emptyText}>
                  Keine Deals oder Shops für "{query}" gefunden
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
    paddingBottom: 8,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  chipsScroll: {
    marginBottom: 8,
  },
  chipsContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: 'rgba(255,92,53,0.15)',
    borderColor: Colors.accent,
  },
  chipText: {
    color: Colors.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recentText: {
    color: Colors.text,
    fontSize: 15,
  },
  locationPrompt: {
    backgroundColor: Colors.surface,
    borderRadius: Colors.cardRadius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  locationPromptText: {
    color: Colors.muted,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  locationPromptSub: {
    color: Colors.muted,
    fontSize: 13,
    opacity: 0.7,
  },
  shopItem: {
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
  shopIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shopIconText: {
    fontSize: 22,
  },
  shopInfo: {
    flex: 1,
    gap: 2,
  },
  shopName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  shopCategory: {
    color: Colors.muted,
    fontSize: 12,
  },
  shopAddress: {
    color: Colors.muted,
    fontSize: 12,
  },
  dealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  dealLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dealIcon: {
    fontSize: 20,
  },
  dealInfo: {
    flex: 1,
    gap: 3,
  },
  dealTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  dealStore: {
    color: Colors.muted,
    fontSize: 12,
  },
  dealPrice: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
