import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CAREER_NODES } from '../data/careers';

// ── Zustand Store with localStorage persistence ──
const useStore = create(
  persist(
    (set, get) => ({
      // ── User Profile ──
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),

      // ── Selected Career ──
      selectedCareer: null,
      setSelectedCareer: (career) => set({ selectedCareer: career }),

      // ── Comparison ──
      comparedCareers: [],
      toggleCompare: (careerId) => {
        const { comparedCareers } = get();
        if (comparedCareers.includes(careerId)) {
          set({ comparedCareers: comparedCareers.filter((id) => id !== careerId) });
        } else if (comparedCareers.length < 3) {
          set({ comparedCareers: [...comparedCareers, careerId] });
        }
      },
      clearCompare: () => set({ comparedCareers: [] }),

      // ── Active Roadmap ──
      activeRoadmap: null,       // { careerId, generatedAt, phases, aiSummary }
      setActiveRoadmap: (roadmap) => set({ activeRoadmap: roadmap }),

      // ── Progress Tracking ──
      // { [careerId]: { [phaseIndex]: { [taskIndex]: boolean } } }
      progress: {},
      toggleTask: (careerId, phaseIndex, taskIndex) => {
        const { progress } = get();
        const careerProgress = progress[careerId] || {};
        const phaseProgress = careerProgress[phaseIndex] || {};
        const current = phaseProgress[taskIndex] || false;

        set({
          progress: {
            ...progress,
            [careerId]: {
              ...careerProgress,
              [phaseIndex]: {
                ...phaseProgress,
                [taskIndex]: !current,
              },
            },
          },
        });
      },

      getCareerProgress: (careerId) => {
        const { progress } = get();
        const career = CAREER_NODES.find((c) => c.id === careerId);
        if (!career) return 0;
        const careerProgress = progress[careerId] || {};
        let total = 0;
        let done = 0;
        career.roadmapPhases.forEach((phase, pIdx) => {
          phase.tasks.forEach((_, tIdx) => {
            total++;
            if (careerProgress[pIdx]?.[tIdx]) done++;
          });
        });
        return total === 0 ? 0 : Math.round((done / total) * 100);
      },

      // ── Saved Roadmaps ──
      savedRoadmaps: [],
      saveRoadmap: (roadmap) => {
        const { savedRoadmaps } = get();
        const exists = savedRoadmaps.find((r) => r.careerId === roadmap.careerId);
        if (exists) {
          set({ savedRoadmaps: savedRoadmaps.map((r) => r.careerId === roadmap.careerId ? roadmap : r) });
        } else {
          set({ savedRoadmaps: [...savedRoadmaps, roadmap] });
        }
      },
      deleteSavedRoadmap: (careerId) => {
        set({ savedRoadmaps: get().savedRoadmaps.filter((r) => r.careerId !== careerId) });
      },

      // ── Notes ──
      // { [careerId]: string }
      notes: {},
      setNote: (careerId, text) => {
        set({ notes: { ...get().notes, [careerId]: text } });
      },

      // ── Authentication & User State ──
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: false,
      authModalOpen: false,
      authModalMode: 'login', // 'login' | 'register'

      openAuthModal: (mode = 'login') => set({ authModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ authModalOpen: false }),

      setAuth: (user, token) => {
        if (token) localStorage.setItem('careermitra_token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isGuest: Boolean(user?.isGuest),
          authModalOpen: false,
          activeView: get().activeView === 'landing' ? 'galaxy' : get().activeView,
        });
      },

      login: async (email, password) => {
        try {
          const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (data.success && data.token) {
            get().setAuth(data.user, data.token);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message || 'Login failed' };
        } catch (err) {
          // Offline fallback
          if (email.toLowerCase().includes('demo')) {
            const demoUser = {
              id: 'demo-local',
              name: 'Demo Cosmic Explorer',
              email,
              targetRole: 'ai-engineer',
              skills: ['Python', 'SQL'],
              xp: 250,
              level: 2,
            };
            get().setAuth(demoUser, 'demo-token');
            return { success: true, message: 'Welcome to offline demo mode!' };
          }
          return { success: false, message: 'Server unreachable. Try guest mode or start server.' };
        }
      },

      register: async (name, email, password, targetRole = 'ai-engineer', skills = []) => {
        try {
          const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, targetRole, skills }),
          });
          const data = await res.json();
          if (data.success && data.token) {
            get().setAuth(data.user, data.token);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message || 'Registration failed' };
        } catch (err) {
          return { success: false, message: 'Server error during registration' };
        }
      },

      loginAsGuest: async () => {
        try {
          const res = await fetch('http://localhost:3000/api/auth/guest', {
            method: 'POST',
          });
          const data = await res.json();
          if (data.success && data.token) {
            get().setAuth(data.user, data.token);
            return { success: true };
          }
        } catch (err) {
          // Fallback guest session
        }
        const fallbackGuest = {
          id: `guest-${Date.now()}`,
          name: 'Cosmic Explorer (Guest)',
          email: 'guest@careermitra.ai',
          isGuest: true,
          targetRole: 'ai-engineer',
          skills: ['Python', 'JavaScript'],
          xp: 150,
          level: 1,
        };
        get().setAuth(fallbackGuest, 'guest-token');
        return { success: true };
      },

      logout: () => {
        localStorage.removeItem('careermitra_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isGuest: false,
          activeView: 'landing',
        });
      },

      // ── UI State ──
      activeView: 'landing',      // 'landing' | 'galaxy' | 'roadmap' | 'compare' | 'profile' | 'progress'
      setActiveView: (view) => set({ activeView: view }),

      galaxyFilter: 'all',
      setGalaxyFilter: (filter) => set({ galaxyFilter: filter }),

      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      // ── AI Generation State ──
      isGenerating: false,
      setIsGenerating: (v) => set({ isGenerating: v }),

      generationError: null,
      setGenerationError: (err) => set({ generationError: err }),

      // ── Theme ──
      sidebarOpen: false,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
    }),
    {
      name: 'careermitra-storage',
      partialState: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
        userProfile: state.userProfile,
        progress: state.progress,
        savedRoadmaps: state.savedRoadmaps,
        notes: state.notes,
        comparedCareers: state.comparedCareers,
        activeView: state.activeView,
      }),
    }
  )
);

export default useStore;
