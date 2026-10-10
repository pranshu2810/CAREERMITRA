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

      // ── UI State ──
      activeView: 'galaxy',      // 'galaxy' | 'roadmap' | 'compare' | 'profile' | 'progress'
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
