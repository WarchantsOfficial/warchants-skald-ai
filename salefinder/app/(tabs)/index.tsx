import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { DEALS, Deal } from '../../constants/mockData';
import DealCard from '../../components/DealCard';
import Toast from '../../components/Toast';
import { useToast } from '../../context/ToastContext';

const FEED_TABS = ['Für dich', 'Following'];
const FILTER_CHIPS = [
  { key: 'all', label: 'Alle' },
  { key: 'mystery', label: '🎁 Mystery' },
  { key: 'food', label: '🍔 Food' },
  { key: 'tech', label: '💻 Tech' },
  { key: 'mode', label: '👗 Mode' },
  { key: 'toy', label: '🧸 Spielzeug' },
];

const FOLLOWING_POSTERS = ['LisaShops', 'MaxTechDeals'];

export default function FeedScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [deals, setDeals] = useState<Deal[]>(DEALS);
  const { toastMessage, toastVisible } = useToast();

  const handleLike = (id: number) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, liked: !d.liked, likes: d.liked ? d.likes - 1 : d.likes + 1 }
          : d
      )
    );
  };

  const filteredDeals = deals.filter((d) => {
    const matchesTab =
      activeTab === 0 || FOLLOWING_POSTERS.includes(d.poster);
    const matchesFilter =
      activeFilter === 'all' || d.category === activeFilter;
    return matchesTab && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Aktuelle Deals 🔥</Text>
          <Text style={styles.headerSubtitle}>Wien & Umgebung</Text>
        </View>
      </View>

      {/* Feed Tabs */}
      <View style={styles.feedTabs}>
        {FEED_TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.feedTab, activeTab === i && styles.feedTabActive]}
            onPress={() => setActiveTab(i)}
            activeOpacity={0.7}
          >
            <Text style={[styles.feedTabText, activeTab === i && styles.feedTabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScrollView}
        contentContainerStyle={styles.chipsContent}
      >
        {FILTER_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip.key}
            style={[styles.chip, activeFilter === chip.key && styles.chipActive]}
            onPress={() => setActiveFilter(chip.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, activeFilter === chip.key && styles.chipTextActive]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Deal List */}
      <FlatList
        data={filteredDeals}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <DealCard deal={item} onLike={handleLike} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Keine Deals gefunden 🔍</Text>
          </View>
        }
      />

      <Toast message={toastMessage} visible={toastVisible} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 3,
  },
  feedTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
  },
  feedTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feedTabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  feedTabText: {
    color: Colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  feedTabTextActive: {
    color: '#fff',
  },
  chipsScrollView: {
    marginBottom: 12,
  },
  chipsContent: {
    paddingHorizontal: 20,
    gap: 8,
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 16,
  },
});
