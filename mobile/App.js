import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import LandingScreen from './src/screens/LandingScreen';
import AuthScreen from './src/screens/AuthScreen';
import GalaxyScreen from './src/screens/GalaxyScreen';
import RoadmapScreen from './src/screens/RoadmapScreen';

export default function App() {
  // Screens: 'landing' | 'auth' | 'galaxy' | 'roadmap'
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);

  const isAuthenticated = Boolean(user && token);

  const handleAuthSuccess = (authenticatedUser, authToken) => {
    setUser(authenticatedUser);
    setToken(authToken);
    setCurrentScreen('galaxy');
  };

  const handleEnterGalaxy = () => {
    if (!isAuthenticated) {
      // Auto guest login
      setUser({ name: 'Cosmic Guest', email: 'guest@careermitra.ai', isGuest: true, level: 1, xp: 150 });
      setToken('guest-token');
    }
    setCurrentScreen('galaxy');
  };

  const handleSelectCareer = (career) => {
    setSelectedCareer(career);
    setCurrentScreen('roadmap');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setCurrentScreen('landing');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Screen Router */}
      {currentScreen === 'landing' && (
        <LandingScreen
          isAuthenticated={isAuthenticated}
          user={user}
          onEnterGalaxy={handleEnterGalaxy}
          onOpenAuth={() => setCurrentScreen('auth')}
        />
      )}

      {currentScreen === 'auth' && (
        <AuthScreen
          onAuthSuccess={handleAuthSuccess}
          onCancel={() => setCurrentScreen('landing')}
        />
      )}

      {currentScreen === 'galaxy' && (
        <GalaxyScreen
          user={user}
          onSelectCareer={handleSelectCareer}
        />
      )}

      {currentScreen === 'roadmap' && (
        <RoadmapScreen
          career={selectedCareer}
          onBack={() => setCurrentScreen('galaxy')}
        />
      )}

      {/* Global Bottom Navigation (Visible in Galaxy & Roadmap) */}
      {(currentScreen === 'galaxy' || currentScreen === 'roadmap') && (
        <SafeAreaView style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setCurrentScreen('landing')}
            >
              <Text style={styles.navIcon}>🏠</Text>
              <Text style={styles.navLabel}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setCurrentScreen('galaxy')}
            >
              <Text style={styles.navIcon}>🌌</Text>
              <Text style={[styles.navLabel, currentScreen === 'galaxy' && styles.navLabelActive]}>
                Galaxy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => {
                if (!selectedCareer) {
                  setSelectedCareer({ id: 'ai-engineer', title: 'AI Engineer' });
                }
                setCurrentScreen('roadmap');
              }}
            >
              <Text style={styles.navIcon}>🗺️</Text>
              <Text style={[styles.navLabel, currentScreen === 'roadmap' && styles.navLabelActive]}>
                Roadmap
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={handleLogout}
            >
              <Text style={styles.navIcon}>🚪</Text>
              <Text style={styles.navLabel}>Exit</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#060417',
  },
  bottomNavContainer: {
    backgroundColor: '#08051e',
    borderTopWidth: 1,
    borderTopColor: 'rgba(124, 58, 237, 0.25)',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#08051e',
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navLabel: {
    color: '#71717a',
    fontSize: 11,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#c4b5fd',
    fontWeight: '700',
  },
});
