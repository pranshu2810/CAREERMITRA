import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { api } from '../api/config';

export default function AuthScreen({ onAuthSuccess, onCancel }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Required Fields', 'Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await api.login(email, password);
      } else {
        res = await api.register(name, email, password, 'ai-engineer');
      }

      if (res.success) {
        onAuthSuccess(res.user, res.token);
      } else {
        Alert.alert('Authentication Failed', res.message || 'Please check your credentials.');
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to reach authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@careermitra.ai');
    setPassword('demo123');
  };

  const handleGuest = async () => {
    setLoading(true);
    const res = await api.guestLogin();
    setLoading(false);
    if (res.success) {
      onAuthSuccess(res.user, res.token);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Top Cancel */}
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>✕ Close</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🧭</Text>
          <Text style={styles.title}>
            {isLogin ? 'Sign In to CareerMitra' : 'Create Cosmic Profile'}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Resume your AI roadmap and XP progression' : 'Start your personalized AI career journey'}
          </Text>
        </View>

        {/* Tab switch */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, isLogin && styles.activeTab]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !isLogin && styles.activeTab]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Alex Vance"
                placeholderTextColor="#71717a"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@domain.com"
              placeholderTextColor="#71717a"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              {isLogin && (
                <TouchableOpacity onPress={fillDemo}>
                  <Text style={styles.demoLink}>⚡ Auto-fill Demo</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#71717a"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isLogin ? 'Enter Space Station 🚀' : 'Create Account ✦'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Guest */}
          <TouchableOpacity
            style={styles.guestBtn}
            onPress={handleGuest}
            disabled={loading}
          >
            <Text style={styles.guestBtnText}>Explore as Guest (No Password)</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#060417',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  cancelBtn: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  cancelText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.5)',
  },
  tabText: {
    color: '#a1a1aa',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#a1a1aa',
    fontSize: 12,
    marginBottom: 6,
  },
  demoLink: {
    color: '#a78bfa',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#100c28',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  guestBtn: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  guestBtnText: {
    color: '#67e8f9',
    fontSize: 13,
    fontWeight: '600',
  },
});
