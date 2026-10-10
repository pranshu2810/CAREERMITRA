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

      // ── Custom Careers (User Defined) ──
      customCareers: [],
      addCustomCareer: (careerData) => {
        const id = `custom-${Date.now()}`;
        const newCareer = {
          id,
          title: careerData.title || 'Custom Role',
          cluster: careerData.cluster || 'Emerging Tech',
          icon: careerData.icon || '🚀',
          color: careerData.color || '#ec4899',
          tagline: careerData.tagline || 'Customized career trajectory',
          salaryRange: careerData.salaryRange || '$90k - $160k',
          demand: careerData.demand || 'High',
          growthRate: careerData.growthRate || '+25%',
          avgMonths: careerData.avgMonths || 6,
          skills: careerData.skills || ['Core Fundamentals', 'Domain Principles', 'Applied Practice'],
          radarStats: careerData.radarStats || { math: 65, coding: 75, systems: 70, mlCore: 60, cloud: 65, product: 70 },
          roadmapPhases: careerData.roadmapPhases || [
            {
              title: 'Phase 1: Core Fundamentals',
              desc: 'Initial foundations and toolset',
              tasks: [
                { title: 'Core Principles & Theory', hours: 20, status: 'available' },
                { title: 'Practical Setup & Environment', hours: 15, status: 'available' },
              ],
            },
            {
              title: 'Phase 2: Applied Projects',
              desc: 'Hands-on portfolio work',
              tasks: [
                { title: 'Intermediate Project Implementation', hours: 30, status: 'available' },
                { title: 'Portfolio Capstone Deliverable', hours: 25, status: 'available' },
              ],
            },
          ],
        };
        const updated = [...get().customCareers, newCareer];
        set({ customCareers: updated, selectedCareer: newCareer });
        return newCareer;
      },
      getAllCareers: () => [...CAREER_NODES, ...(get().customCareers || [])],

      // ── Active Roadmap ──
      activeRoadmap: null,       // { careerId, generatedAt, phases, aiSummary, isManual }
      setActiveRoadmap: (roadmap) => set({ activeRoadmap: roadmap }),

      // Manual Roadmap Editing Actions
      updateActiveRoadmap: (updater) => {
        const { activeRoadmap } = get();
        if (!activeRoadmap) return;
        const updated = typeof updater === 'function' ? updater(activeRoadmap) : { ...activeRoadmap, ...updater };
        set({ activeRoadmap: updated });
      },
      addPhaseToRoadmap: (phaseTitle = 'New Phase', phaseDesc = 'Milestone focus') => {
        const { activeRoadmap } = get();
        if (!activeRoadmap) return;
        const newPhase = {
          title: phaseTitle,
          desc: phaseDesc,
          tasks: [{ title: 'First Milestone Task', hours: 15, status: 'available' }],
        };
        const updatedPhases = [...(activeRoadmap.phases || []), newPhase];
        set({ activeRoadmap: { ...activeRoadmap, phases: updatedPhases } });
      },
      removePhaseFromRoadmap: (phaseIndex) => {
        const { activeRoadmap } = get();
        if (!activeRoadmap || !activeRoadmap.phases) return;
        const updatedPhases = activeRoadmap.phases.filter((_, i) => i !== phaseIndex);
        set({ activeRoadmap: { ...activeRoadmap, phases: updatedPhases } });
      },
      addTaskToRoadmapPhase: (phaseIndex, taskTitle = 'New Task', hours = 15) => {
        const { activeRoadmap } = get();
        if (!activeRoadmap || !activeRoadmap.phases?.[phaseIndex]) return;
        const phases = JSON.parse(JSON.stringify(activeRoadmap.phases));
        phases[phaseIndex].tasks.push({ title: taskTitle, hours, status: 'available' });
        set({ activeRoadmap: { ...activeRoadmap, phases } });
      },
      removeTaskFromRoadmapPhase: (phaseIndex, taskIndex) => {
        const { activeRoadmap } = get();
        if (!activeRoadmap || !activeRoadmap.phases?.[phaseIndex]) return;
        const phases = JSON.parse(JSON.stringify(activeRoadmap.phases));
        phases[phaseIndex].tasks.splice(taskIndex, 1);
        set({ activeRoadmap: { ...activeRoadmap, phases } });
      },

      // ── Progress Tracking & Real-Time Activity Log ──
      // { [careerId]: { [phaseIndex]: { [taskIndex]: boolean } } }
      progress: {},
      activityHistory: [], // Real timestamps of completed milestones [{ careerId, phaseIndex, taskIndex, taskTitle, timestamp }]

      toggleTask: (careerId, phaseIndex, taskIndex, taskTitle = 'Milestone') => {
        const { progress, activityHistory, user } = get();
        const careerProgress = progress[careerId] || {};
        const phaseProgress = careerProgress[phaseIndex] || {};
        const current = phaseProgress[taskIndex] || false;
        const nextState = !current;

        // Record real activity log
        let updatedHistory = [...(activityHistory || [])];
        if (nextState) {
          updatedHistory.unshift({
            id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            careerId,
            phaseIndex,
            taskIndex,
            taskTitle,
            timestamp: new Date().toISOString(),
          });
        } else {
          updatedHistory = updatedHistory.filter(
            (a) => !(a.careerId === careerId && a.phaseIndex === phaseIndex && a.taskIndex === taskIndex)
          );
        }

        // Live calculate XP
        const totalCompletedAcrossAll = Object.values({
          ...progress,
          [careerId]: {
            ...careerProgress,
            [phaseIndex]: {
              ...phaseProgress,
              [taskIndex]: nextState,
            },
          },
        }).reduce((acc, cp) => {
          return acc + Object.values(cp).reduce((pAcc, pp) => {
            return pAcc + Object.values(pp).filter(Boolean).length;
          }, 0);
        }, 0);

        const newXP = totalCompletedAcrossAll * 50;
        const newLevel = Math.floor(newXP / 200) + 1;

        set({
          progress: {
            ...progress,
            [careerId]: {
              ...careerProgress,
              [phaseIndex]: {
                ...phaseProgress,
                [taskIndex]: nextState,
              },
            },
          },
          activityHistory: updatedHistory,
          user: user ? { ...user, xp: newXP, level: newLevel } : user,
        });
      },

      getCareerProgress: (careerId) => {
        const { progress, activeRoadmap, savedRoadmaps } = get();
        const allCareers = get().getAllCareers();
        const career = allCareers.find((c) => c.id === careerId);

        // Find phases from career node or active/saved roadmap
        let phases = career?.roadmapPhases;
        if (!phases) {
          const r = (activeRoadmap?.careerId === careerId ? activeRoadmap : null) ||
                    savedRoadmaps.find((s) => s.careerId === careerId);
          phases = r?.phases;
        }

        if (!phases || phases.length === 0) return 0;
        const careerProgress = progress[careerId] || {};
        let total = 0;
        let done = 0;
        phases.forEach((phase, pIdx) => {
          (phase.tasks || []).forEach((_, tIdx) => {
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
        customCareers: state.customCareers,
        activityHistory: state.activityHistory,
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
