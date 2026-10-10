import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CAREER_NODES } from '../data/careers.js';
import { synthesizeCareerBlueprint } from '../utils/blueprintSynthesizer.js';

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
        const blueprint = synthesizeCareerBlueprint(careerData.title || 'Custom Role');
        const newCareer = {
          ...blueprint,
          id,
          title: careerData.title || blueprint.title,
          cluster: careerData.cluster || blueprint.cluster,
          category: careerData.category || blueprint.category,
          icon: careerData.icon || blueprint.icon,
          color: careerData.color || blueprint.color,
          glowColor: careerData.glowColor || blueprint.glowColor,
          tagline: careerData.tagline || blueprint.tagline,
          salaryRange: careerData.salaryRange || blueprint.salaryRange,
          avgSalary: careerData.avgSalary || careerData.salaryRange || blueprint.avgSalary,
          demand: careerData.demand || blueprint.demand,
          growthRate: careerData.growthRate || blueprint.growthRate,
          avgMonths: careerData.avgMonths || blueprint.avgMonths,
          skills: careerData.skills || blueprint.skills,
          radarStats: careerData.radarStats || blueprint.radarStats,
          roadmapPhases: careerData.roadmapPhases || blueprint.roadmapPhases,
          resources: careerData.resources || blueprint.resources,
        };
        const updated = [...get().customCareers, newCareer];
        set({ customCareers: updated, selectedCareer: newCareer });
        return newCareer;
      },
      deletedCareerIds: [],
      deleteCareer: (careerId) => {
        const { customCareers, deletedCareerIds, selectedCareer, comparedCareers, activeRoadmap } = get();
        const updatedCustom = (customCareers || []).filter((c) => c.id !== careerId);
        const updatedDeleted = Array.from(new Set([...(deletedCareerIds || []), careerId]));
        
        const allRemaining = [...CAREER_NODES, ...updatedCustom].filter((c) => !updatedDeleted.includes(c.id));
        const newSelected = selectedCareer?.id === careerId ? (allRemaining[0] || null) : selectedCareer;
        const newCompared = (comparedCareers || []).filter((id) => id !== careerId);
        const newActiveRoadmap = activeRoadmap?.careerId === careerId ? null : activeRoadmap;

        set({
          customCareers: updatedCustom,
          deletedCareerIds: updatedDeleted,
          selectedCareer: newSelected,
          comparedCareers: newCompared,
          activeRoadmap: newActiveRoadmap,
        });
      },
      restoreDefaultCareers: () => {
        set({ deletedCareerIds: [] });
      },
      getAllCareers: () => {
        const { customCareers, deletedCareerIds } = get();
        const deletedSet = new Set(deletedCareerIds || []);
        return [...CAREER_NODES, ...(customCareers || [])].filter((c) => !deletedSet.has(c.id));
      },

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

      // ── Gamification, Badges & Audio ──
      soundEnabled: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      warpActive: false,
      triggerWarp: (duration = 600) => {
        set({ warpActive: true });
        setTimeout(() => set({ warpActive: false }), duration);
      },
      streakDays: 4,
      badges: ['first_milestone', 'explorer', 'ai_oracle'],
      unlockBadge: (badgeId) => {
        const { badges } = get();
        if (!badges.includes(badgeId)) {
          set({ badges: [...badges, badgeId] });
        }
      },
      showBadgesModal: false,
      setShowBadgesModal: (v) => set({ showBadgesModal: v }),
      recentXPGain: null,
      clearRecentXPGain: () => set({ recentXPGain: null }),

      toggleTask: (careerId, phaseIndex, taskIndex, taskTitle = 'Milestone') => {
        const { progress, activityHistory, user, badges, unlockBadge } = get();
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

        const newXP = Math.max(100, totalCompletedAcrossAll * 50);
        const newLevel = Math.floor(newXP / 200) + 1;

        let newBadges = [...badges];
        if (nextState && !newBadges.includes('first_milestone')) {
          newBadges.push('first_milestone');
        }
        if (totalCompletedAcrossAll >= 5 && !newBadges.includes('speed_of_light')) {
          newBadges.push('speed_of_light');
        }

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
          user: user ? { ...user, xp: newXP, level: newLevel } : { id: 'local', xp: newXP, level: newLevel },
          badges: newBadges,
          recentXPGain: nextState ? { amount: 50, reason: taskTitle || 'Milestone Completed', id: Date.now() } : null,
        });
      },

      awardXP: (amount = 50, reason = 'Achievement Unlocked') => {
        const { user } = get();
        const currentXP = user?.xp || 100;
        const newXP = currentXP + amount;
        const newLevel = Math.floor(newXP / 200) + 1;
        set({
          user: user ? { ...user, xp: newXP, level: newLevel } : { id: 'local', xp: newXP, level: newLevel },
          recentXPGain: { amount, reason, id: Date.now() },
        });
      },

      // ── Gamified Assessments State ──
      // { [careerId]: { [phaseIdx]: { score, total, percentage, passed, date } } }
      phaseAssessments: {},
      savePhaseAssessment: (careerId, phaseIdx, assessmentData) => {
        const { phaseAssessments, unlockBadge, awardXP } = get();
        const careerAssessments = phaseAssessments[careerId] || {};
        const updated = {
          ...phaseAssessments,
          [careerId]: {
            ...careerAssessments,
            [phaseIdx]: {
              ...assessmentData,
              completedAt: new Date().toISOString(),
            },
          },
        };
        const passed = assessmentData.percentage >= 70;
        const xpAward = passed ? 150 : 50;
        awardXP(xpAward, `Phase ${Number(phaseIdx) + 1} Assessment (${assessmentData.percentage}%)`);
        if (assessmentData.percentage >= 80) {
          unlockBadge('quiz_master');
        }
        set({ phaseAssessments: updated });
      },

      // { [careerId]: { score, total, percentage, passed, verdict, report, date } }
      readinessAssessments: {},
      saveReadinessAssessment: (careerId, assessmentData) => {
        const { readinessAssessments, unlockBadge, awardXP } = get();
        const updated = {
          ...readinessAssessments,
          [careerId]: {
            ...assessmentData,
            completedAt: new Date().toISOString(),
          },
        };
        const passed = assessmentData.percentage >= 70;
        const xpAward = passed ? 300 : 100;
        awardXP(xpAward, `Career Readiness Assessment (${assessmentData.percentage}%) 🚀`);
        if (assessmentData.percentage >= 70) {
          unlockBadge('career_ready');
        }
        set({ readinessAssessments: updated });
      },

      // ── Industry Portfolio Projects Tracking ──
      // { [careerId]: { [projectId]: { started: boolean, completed: boolean, completedMilestones: number[] } } }
      projectProgress: {},
      toggleProjectMilestone: (careerId, projectId, milestoneIdx) => {
        const { projectProgress, awardXP } = get();
        const cp = projectProgress[careerId] || {};
        const proj = cp[projectId] || { started: true, completed: false, completedMilestones: [] };
        const milestones = proj.completedMilestones || [];
        const exists = milestones.includes(milestoneIdx);
        const updatedMilestones = exists ? milestones.filter((m) => m !== milestoneIdx) : [...milestones, milestoneIdx];
        if (!exists) {
          awardXP(30, 'Project Milestone Complete 🛠️');
        }
        set({
          projectProgress: {
            ...projectProgress,
            [careerId]: {
              ...cp,
              [projectId]: {
                ...proj,
                started: true,
                completedMilestones: updatedMilestones,
              },
            },
          },
        });
      },
      setProjectStatus: (careerId, projectId, isCompleted) => {
        const { projectProgress, awardXP, unlockBadge } = get();
        const cp = projectProgress[careerId] || {};
        const proj = cp[projectId] || { started: true, completed: false, completedMilestones: [] };
        if (isCompleted && !proj.completed) {
          awardXP(120, 'Industry Portfolio Project Finished! 🏆');
          unlockBadge('project_builder');
        }
        set({
          projectProgress: {
            ...projectProgress,
            [careerId]: {
              ...cp,
              [projectId]: {
                ...proj,
                started: true,
                completed: isCompleted,
              },
            },
          },
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
      setActiveView: (view) => {
        const current = get().activeView;
        if (current !== view) {
          get().triggerWarp(600);
        }
        set({ activeView: view });
      },

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
        deletedCareerIds: state.deletedCareerIds,
        activityHistory: state.activityHistory,
        userProfile: state.userProfile,
        progress: state.progress,
        savedRoadmaps: state.savedRoadmaps,
        notes: state.notes,
        comparedCareers: state.comparedCareers,
        activeView: state.activeView,
        soundEnabled: state.soundEnabled,
        badges: state.badges,
        streakDays: state.streakDays,
        phaseAssessments: state.phaseAssessments,
        readinessAssessments: state.readinessAssessments,
        projectProgress: state.projectProgress,
      }),
    }
  )
);

export default useStore;
