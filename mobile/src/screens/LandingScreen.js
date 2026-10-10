import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar
} from 'react-native';

export default function LandingScreen({ onEnterGalaxy, onOpenAuth, isAuthenticated, user }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#060417" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Glow Badge */}
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>COSMIC AI CAREER GPS</Text>
        </View>

        {/* Hero Title */}
        <Text style={styles.heroTitle}>Navigate Your Destiny in the Tech Cosmos</Text>
        <Text style={styles.heroSub}>
          Explore 10+ interconnected career constellations with AI-driven learning roadmaps, prerequisite unlocking, and real-time skill replanning.
        </Text>

        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={onEnterGalaxy}
        >
          <Text style={styles.primaryBtnText}>
            {isAuthenticated ? 'Enter Career Galaxy 🌌' : 'Explore as Guest 🚀'}
          </Text>
        </TouchableOpacity>

        {!isAuthenticated && (
          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={onOpenAuth}
          >
            <Text style={styles.secondaryBtnText}>Sign In / Create Account ✦</Text>
          </TouchableOpacity>
        )}

        {/* 4 Feature Pillars */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Breakthrough Capabilities</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>🔭</Text>
          <Text style={styles.cardTitle}>Cosmic Constellations</Text>
          <Text style={styles.cardDesc}>
            Interactive orbital view of AI Engineering, Cloud DevOps, Full-Stack, and Cybersecurity with salary benchmarks and demand gauges.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>⚡</Text>
          <Text style={styles.cardTitle}>Gemini AI Roadmaps</Text>
          <Text style={styles.cardDesc}>
            Dynamic milestones tailored to your existing skills and weekly study bandwidth.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>🎯</Text>
          <Text style={styles.cardTitle}>Dynamic Replanner</Text>
          <Text style={styles.cardDesc}>
            Mark learned skills complete to unlock prerequisites, gain XP, and recalculate finish dates.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>📊</Text>
          <Text style={styles.cardTitle}>Career Comparison</Text>
          <Text style={styles.cardDesc}>
            Compare multi-dimensional radar skill overlap and evaluate transition difficulty.
          </Text>
        </View>

        {/* Footer info */}
        <Text style={styles.footerText}>
          CareerMitra Mobile · Built with React Native & Expo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#060417',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderColor: 'rgba(124, 58, 237, 0.4)',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06b6d4',
    marginRight: 8,
  },
  badgeText: {
    color: '#c4b5fd',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 320,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(124, 58, 237, 0.3)',
    borderWidth: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  secondaryBtnText: {
    color: '#c4b5fd',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    width: '100%',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f4f4f5',
  },
  card: {
    width: '100%',
    backgroundColor: '#100c28',
    borderColor: 'rgba(124, 58, 237, 0.2)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  footerText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 20,
    textAlign: 'center',
  },
});
