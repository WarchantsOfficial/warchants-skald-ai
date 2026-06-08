import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { TOP_SHOPPERS, DEALS } from '../../constants/mockData';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [followState, setFollowState] = useState<Record<string, boolean>>({
    sandra: false,
    max: true,
    lisa: true,
    karl: false,
  });

  const myDeals = DEALS.filter((d) => d.poster === 'nico_deals').slice(0, 2);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const toggleFollow = (id: string) => {
    setFollowState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color={Colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>N</Text>
            </View>
          </View>

          {/* Name and handle */}
          <Text style={styles.displayName}>Nico</Text>
          <Text style={styles.handle}>@nico_deals</Text>

          {/* VielShopper badge */}
          <View style={styles.vielShopperBadge}>
            <Text style={styles.vielShopperStar}>⭐</Text>
            <Text style={styles.vielShopperText}>VielShopper</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Deals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>312</Text>
              <Text style={styles.statLabel}>Follower</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>89</Text>
              <Text style={styles.statLabel}>Folge ich</Text>
            </View>
          </View>
        </View>

        {/* Top VielShopper section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top VielShopper folgen</Text>
          {TOP_SHOPPERS.map((shopper) => (
            <View key={shopper.id} style={styles.shopperRow}>
              <View style={[styles.shopperAvatar, { backgroundColor: shopper.color + '33' }]}>
                <Text style={[styles.shopperAvatarText, { color: shopper.color }]}>
                  {shopper.name[0]}
                </Text>
              </View>
              <View style={styles.shopperInfo}>
                <Text style={styles.shopperName}>{shopper.name}</Text>
                <Text style={styles.shopperHandle}>{shopper.handle}</Text>
                <Text style={styles.shopperMeta}>
                  {shopper.deals} Deals · {shopper.followers} Follower
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.followBtn,
                  followState[shopper.id] && styles.followingBtn,
                ]}
                onPress={() => toggleFollow(shopper.id)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.followBtnText,
                  followState[shopper.id] && styles.followingBtnText,
                ]}>
                  {followState[shopper.id] ? 'Gefolgt' : 'Folgen'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* My recent deals */}
        {myDeals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meine letzten Deals</Text>
            {myDeals.map((deal) => (
              <View key={deal.id} style={styles.myDealItem}>
                <View style={styles.myDealIconCircle}>
                  <Text style={styles.myDealIcon}>{deal.icon}</Text>
                </View>
                <View style={styles.myDealInfo}>
                  <Text style={styles.myDealTitle}>{deal.title}</Text>
                  <Text style={styles.myDealMeta}>
                    {deal.store} · {deal.time}
                  </Text>
                </View>
                <View style={styles.myDealStats}>
                  <Ionicons name="heart" size={14} color={Colors.accent} />
                  <Text style={styles.myDealLikes}>{deal.likes}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Settings shortcuts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Einstellungen</Text>
          {[
            { icon: 'notifications-outline', label: 'Benachrichtigungen' },
            { icon: 'shield-outline', label: 'Datenschutz' },
            { icon: 'help-circle-outline', label: 'Hilfe & Support' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.settingsItem} activeOpacity={0.7}>
              <Ionicons name={item.icon as any} size={20} color={Colors.muted} />
              <Text style={styles.settingsItemText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPad} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: Colors.cardRadius,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
  },
  displayName: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  handle: {
    color: Colors.muted,
    fontSize: 14,
    marginBottom: 12,
  },
  vielShopperBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,184,0,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accent2,
    marginBottom: 20,
  },
  vielShopperStar: {
    fontSize: 14,
  },
  vielShopperText: {
    color: Colors.accent2,
    fontSize: 13,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: Colors.muted,
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  shopperRow: {
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
  shopperAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopperAvatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  shopperInfo: {
    flex: 1,
    gap: 2,
  },
  shopperName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  shopperHandle: {
    color: Colors.muted,
    fontSize: 12,
  },
  shopperMeta: {
    color: Colors.muted,
    fontSize: 11,
    marginTop: 1,
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.accent,
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  followBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  followingBtnText: {
    color: Colors.muted,
  },
  myDealItem: {
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
  myDealIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  myDealIcon: {
    fontSize: 22,
  },
  myDealInfo: {
    flex: 1,
    gap: 3,
  },
  myDealTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  myDealMeta: {
    color: Colors.muted,
    fontSize: 12,
  },
  myDealStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  myDealLikes: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  settingsItemText: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
  },
  bottomPad: {
    height: 20,
  },
});
