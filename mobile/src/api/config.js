// API Client for CareerMitra Mobile App connecting to Express Backend
import { Platform } from 'react-native';

// On Android Emulator localhost is 10.0.2.2; on iOS / Web it is localhost.
// Replace with your machine's Wi-Fi LAN IP (e.g., http://192.168.1.X:3000) when testing on a physical phone via Expo Go.
export const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

export const api = {
  // Auth
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (err) {
      // Offline fallback
      return {
        success: true,
        token: 'offline-demo-token',
        user: { name: 'Cosmic Explorer', email, isGuest: true, level: 2, xp: 250 },
      };
    }
  },

  register: async (name, email, password, targetRole) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, targetRole }),
      });
      return await res.json();
    } catch (err) {
      return {
        success: true,
        token: 'offline-reg-token',
        user: { name, email, targetRole, level: 1, xp: 100 },
      };
    }
  },

  guestLogin: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/guest`, { method: 'POST' });
      return await res.json();
    } catch (err) {
      return {
        success: true,
        token: 'offline-guest-token',
        user: { name: 'Cosmic Guest', email: 'guest@careermitra.ai', isGuest: true, level: 1, xp: 150 },
      };
    }
  },

  // Careers & Roadmaps
  getCareers: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/careers`);
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  generateRoadmap: async (roleId, backgroundSkills = [], hoursPerWeek = 15) => {
    try {
      const res = await fetch(`${BASE_URL}/api/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, backgroundSkills, hoursPerWeek }),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },
};
