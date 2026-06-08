import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { register } = useAuth();

  const canSubmit = email.trim() && password.trim() && username.trim();

  const handleRegister = () => {
    if (!canSubmit) return;
    register(email.trim(), password, username.trim());
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              sale<Text style={styles.logoAccent}>finder</Text>
            </Text>
            <Text style={styles.tagline}>
              Entdecke lokale Deals. Teile sie mit deiner Community.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Konto erstellen</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Benutzername</Text>
              <TextInput
                style={styles.input}
                placeholder="z.B. nico_deals"
                placeholderTextColor={Colors.muted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-Mail</Text>
              <TextInput
                style={styles.input}
                placeholder="deine@email.at"
                placeholderTextColor={Colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Passwort</Text>
              <TextInput
                style={styles.input}
                placeholder="Mindestens 8 Zeichen"
                placeholderTextColor={Colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <TouchableOpacity
              style={[styles.ctaButton, !canSubmit && styles.ctaDisabled]}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaText}>Registrieren</Text>
            </TouchableOpacity>

            <View style={styles.linkRow}>
              <Text style={styles.linkText}>Bereits ein Konto? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1,
  },
  logoAccent: {
    color: Colors.accent,
  },
  tagline: {
    color: Colors.muted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    maxWidth: 280,
  },
  form: {
    gap: 16,
  },
  formTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: Colors.muted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: 16,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
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
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: Colors.muted,
    fontSize: 14,
  },
  link: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});
