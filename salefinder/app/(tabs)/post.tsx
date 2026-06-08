import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useToast } from '../../context/ToastContext';
import Toast from '../../components/Toast';

const CATEGORIES = [
  { key: 'mystery', label: '🎁 Mystery' },
  { key: 'tech', label: '💻 Tech' },
  { key: 'food', label: '🍔 Food' },
  { key: 'mode', label: '👗 Mode' },
  { key: 'toy', label: '🧸 Spielzeug' },
];

const BADGES = [
  { key: 'deal', label: '🔥 Deal' },
  { key: 'new', label: '✨ Neu' },
  { key: 'mystery', label: '🎁 Mystery Box' },
];

export default function PostScreen() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [shop, setShop] = useState('');
  const [category, setCategory] = useState('deal');
  const [badge, setBadge] = useState('deal');
  const { showToast, toastMessage, toastVisible } = useToast();

  const canPost = title.trim().length > 0 && desc.trim().length > 0;

  const handlePost = () => {
    if (!canPost) return;
    showToast('✅ Deal gepostet!');
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Deal posten</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Titel *</Text>
              <TextInput
                style={styles.input}
                placeholder="z.B. Samsung Galaxy S25 −30%"
                placeholderTextColor={Colors.muted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Beschreibung *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Beschreibe den Deal detailliert..."
                placeholderTextColor={Colors.muted}
                value={desc}
                onChangeText={setDesc}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex]}>
                <Text style={styles.inputLabel}>Neuer Preis</Text>
                <TextInput
                  style={styles.input}
                  placeholder="€0,00"
                  placeholderTextColor={Colors.muted}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.inputGroup, styles.flex]}>
                <Text style={styles.inputLabel}>Alter Preis</Text>
                <TextInput
                  style={styles.input}
                  placeholder="€0,00"
                  placeholderTextColor={Colors.muted}
                  value={oldPrice}
                  onChangeText={setOldPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Shop suchen</Text>
              <View style={styles.shopInputRow}>
                <Ionicons name="search-outline" size={18} color={Colors.muted} style={styles.shopIcon} />
                <TextInput
                  style={styles.shopInput}
                  placeholder="z.B. Saturn, Zara, Billa..."
                  placeholderTextColor={Colors.muted}
                  value={shop}
                  onChangeText={setShop}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kategorie</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[styles.chip, category === cat.key && styles.chipActive]}
                    onPress={() => setCategory(cat.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, category === cat.key && styles.chipTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Badge</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {BADGES.map((b) => (
                  <TouchableOpacity
                    key={b.key}
                    style={[styles.chip, badge === b.key && styles.chipActive]}
                    onPress={() => setBadge(b.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, badge === b.key && styles.chipTextActive]}>
                      {b.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[styles.ctaButton, !canPost && styles.ctaDisabled]}
              onPress={handlePost}
              activeOpacity={0.85}
            >
              <Ionicons name="rocket-outline" size={20} color="#fff" />
              <Text style={styles.ctaText}>Deal posten</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast message={toastMessage} visible={toastVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  headerPlaceholder: {
    width: 36,
  },
  form: {
    paddingHorizontal: 20,
    gap: 18,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: Colors.text,
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 13,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  shopInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  shopIcon: {
    marginRight: 8,
  },
  shopInput: {
    flex: 1,
    paddingVertical: 13,
    color: Colors.text,
    fontSize: 15,
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
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
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
