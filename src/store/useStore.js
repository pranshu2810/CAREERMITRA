import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CAREER_NODES } from '../data/careers.js';
import { synthesizeCareerBlueprint } from '../utils/blueprintSynthesizer.js';

const API_BASE = import.meta.env?.VITE_API_BASE_URL || '';
const ACCOUNT_STORAGE_PREFIX = 'careermitra_user_data_';
const ACTIVE_ACCOUNT_KEY = 'careermitra_active_account_key';

export function getAccountKey(user) {
  if (!user) return 'guest_anonymous';
  if (user.isGuest) return `guest_${user.id || 'session'}`;
  return (user.id || user.email || 'user_unknown').toLowerCase().trim();
}

export function getCleanAccountState(user = null) {
  return {
    progress: {},
    activityHistory: [],
    phaseAssessments: {},
    readinessAssessments: {},
    projectProgress: {},
    projectSubmissions: {},
    savedRoadmaps: [],
    notes: {},
    badges: ['first_milestone', 'explorer', 'ai_oracle'],
    streakDays: 1,
    customCareers: [],
    deletedCareerIds: [],
    userProfile: user ? {
      name: user.name || '',
      email: user.email || '',
      goalCareer: user.targetRole || '',
      skills: user.skills || [],
      timelineMonths: user.targetMonths || 6,
      hoursPerWeek: user.weeklyHours || 15,
    } : null,
  };
}

export function loadAccountDataFromStorage(accountKey) {
  try {
    const raw = localStorage.getItem(ACCOUNT_STORAGE_PREFIX + accountKey);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load user state from localStorage:', e);
  }
  return null;
}

export function saveAccountDataToStorage(accountKey, data) {
  try {
    localStorage.setItem(ACCOUNT_STORAGE_PREFIX + accountKey, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save user state to localStorage:', e);
  }
}

// ── Zustand Store with strict per-account isolation ──
const useStore = create(
  persist(
    (set, get) => ({
      // ── User Profile & Preferences ──
      userProfile: null,
      setUserProfile: (profile) => {
        set({ userProfile: profile });
        get().persistCurrentAccount();
      },

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
        get().persistCurrentAccount();
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
        get().persistCurrentAccount();
      },
      restoreDefaultCareers: () => {
        set({ deletedCareerIds: [] });
        get().persistCurrentAccount();
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
      activityHistory: [], // [{ id, careerId, phaseIndex, taskIndex, taskTitle, timestamp }]

      // ── Gamification, Badges & Audio ──
      soundEnabled: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      warpActive: false,
      triggerWarp: (duration = 600) => {
        set({ warpActive: true });
        setTimeout(() => set({ warpActive: false }), duration);
      },
      streakDays: 1,
      badges: ['first_milestone', 'explorer', 'ai_oracle'],
      unlockBadge: (badgeId) => {
        const { badges } = get();
        if (!badges.includes(badgeId)) {
          set({ badges: [...badges, badgeId] });
          get().persistCurrentAccount();
        }
      },
      showBadgesModal: false,
      setShowBadgesModal: (v) => set({ showBadgesModal: v }),
      recentXPGain: null,
      clearRecentXPGain: () => set({ recentXPGain: null }),

      toggleTask: (careerId, phaseIndex, taskIndex, taskTitle = 'Milestone') => {
        const { progress, activityHistory, user, badges } = get();
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

        const newProgress = {
          ...progress,
          [careerId]: {
            ...careerProgress,
            [phaseIndex]: {
              ...phaseProgress,
              [taskIndex]: nextState,
            },
          },
        };

        // Live calculate XP
        const totalCompletedAcrossAll = Object.values(newProgress).reduce((acc, cp) => {
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
          progress: newProgress,
          activityHistory: updatedHistory,
          user: user ? { ...user, xp: newXP, level: newLevel } : { id: 'local', xp: newXP, level: newLevel },
          badges: newBadges,
          recentXPGain: nextState ? { amount: 50, reason: taskTitle || 'Milestone Completed', id: Date.now() } : null,
        });

        get().persistCurrentAccount();
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
        get().persistCurrentAccount();
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
        get().persistCurrentAccount();
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
        get().persistCurrentAccount();
      },

      // ── Dedicated Quiz & Assessment View Navigation ──
      activeAssessment: null,
      setActiveAssessment: (assessment) => set({ activeAssessment: assessment }),
      openQuizAssessment: (assessment) => {
        get().triggerWarp(500);
        set({ activeAssessment: assessment, activeView: 'quiz' });
      },
      closeQuizAssessment: () => {
        get().triggerWarp(500);
        set({ activeAssessment: null, activeView: 'roadmap' });
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
        get().persistCurrentAccount();
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
        get().persistCurrentAccount();
      },

      // ── Dedicated Project Portal View Navigation ──
      selectedProject: null,
      setSelectedProject: (project) => set({ selectedProject: project }),
      openProjectPortal: (project, career = null) => {
        get().triggerWarp(500);
        set({
          selectedProject: project,
          ...(career ? { selectedCareer: career } : {}),
          activeView: 'projects',
        });
      },
      closeProjectPortal: () => {
        get().triggerWarp(500);
        set({ selectedProject: null, activeView: 'roadmap' });
      },
      projectSubmissions: {}, // { [careerId]: { [projectId]: { repoUrl, demoUrl, savedAt } } }
      saveProjectSubmission: (careerId, projectId, repoUrl, demoUrl) => {
        const { projectSubmissions } = get();
        const cp = projectSubmissions[careerId] || {};
        const updated = {
          ...projectSubmissions,
          [careerId]: {
            ...cp,
            [projectId]: { repoUrl, demoUrl, savedAt: new Date().toISOString() },
          },
        };
        set({ projectSubmissions: updated });
        get().persistCurrentAccount();
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
        let updated;
        if (exists) {
          updated = savedRoadmaps.map((r) => r.careerId === roadmap.careerId ? roadmap : r);
        } else {
          updated = [...savedRoadmaps, roadmap];
        }
        set({ savedRoadmaps: updated });
        get().persistCurrentAccount();
      },
      deleteSavedRoadmap: (careerId) => {
        const updated = get().savedRoadmaps.filter((r) => r.careerId !== careerId);
        set({ savedRoadmaps: updated });
        get().persistCurrentAccount();
      },

      // ── Notes ──
      notes: {},
      setNote: (careerId, text) => {
        const updated = { ...get().notes, [careerId]: text };
        set({ notes: updated });
        get().persistCurrentAccount();
      },

      // ── Per-Account Persistence & Sync Helper ──
      persistCurrentAccount: () => {
        const state = get();
        const accountKey = getAccountKey(state.user);
        const data = {
          progress: state.progress,
          activityHistory: state.activityHistory,
          phaseAssessments: state.phaseAssessments,
          readinessAssessments: state.readinessAssessments,
          projectProgress: state.projectProgress,
          projectSubmissions: state.projectSubmissions,
          savedRoadmaps: state.savedRoadmaps,
          notes: state.notes,
          badges: state.badges,
          streakDays: state.streakDays,
          customCareers: state.customCareers,
          deletedCareerIds: state.deletedCareerIds,
          userProfile: state.userProfile,
          xp: state.user?.xp || 100,
          level: state.user?.level || 1,
        };
        saveAccountDataToStorage(accountKey, data);
        get().syncAccountToServer();
      },

      syncAccountToServer: async () => {
        const { user, token, isGuest, progress, activityHistory, phaseAssessments, readinessAssessments, projectProgress, savedRoadmaps, notes, badges, customCareers, streakDays, userProfile } = get();
        if (!user || isGuest || !token) return;
        try {
          await fetch(`${API_BASE}/api/user/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              progress,
              activityHistory,
              phaseAssessments,
              readinessAssessments,
              projectProgress,
              savedRoadmaps,
              notes,
              badges,
              customCareers,
              streakDays,
              xp: user.xp,
              level: user.level,
              userProfile,
            })
          });
        } catch (_) {
          // Background sync failure handled gracefully
        }
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
        const prevUser = get().user;
        if (prevUser) {
          // Save previous user account's state before switching
          const prevKey = getAccountKey(prevUser);
          const prevSnapshot = {
            progress: get().progress,
            activityHistory: get().activityHistory,
            phaseAssessments: get().phaseAssessments,
            readinessAssessments: get().readinessAssessments,
            projectProgress: get().projectProgress,
            projectSubmissions: get().projectSubmissions,
            savedRoadmaps: get().savedRoadmaps,
            notes: get().notes,
            badges: get().badges,
            streakDays: get().streakDays,
            customCareers: get().customCareers,
            deletedCareerIds: get().deletedCareerIds,
            userProfile: get().userProfile,
            xp: prevUser.xp || 100,
            level: prevUser.level || 1,
          };
          saveAccountDataToStorage(prevKey, prevSnapshot);
        }

        const accountKey = getAccountKey(user);
        localStorage.setItem(ACTIVE_ACCOUNT_KEY, accountKey);
        if (token) localStorage.setItem('careermitra_token', token);

        // Load targeted user account's isolated data
        const localSaved = loadAccountDataFromStorage(accountKey);
        const clean = getCleanAccountState(user);

        // Merge server user object progress & local saved progress for THIS account only
        const merged = {
          ...clean,
          ...(localSaved || {}),
          ...(user?.progress && Object.keys(user.progress).length > 0 ? { progress: user.progress } : {}),
          ...(user?.activityHistory && user.activityHistory.length > 0 ? { activityHistory: user.activityHistory } : {}),
          ...(user?.phaseAssessments && Object.keys(user.phaseAssessments).length > 0 ? { phaseAssessments: user.phaseAssessments } : {}),
          ...(user?.readinessAssessments && Object.keys(user.readinessAssessments).length > 0 ? { readinessAssessments: user.readinessAssessments } : {}),
          ...(user?.projectProgress && Object.keys(user.projectProgress).length > 0 ? { projectProgress: user.projectProgress } : {}),
          ...(user?.savedRoadmaps && user.savedRoadmaps.length > 0 ? { savedRoadmaps: user.savedRoadmaps } : {}),
          ...(user?.notes && Object.keys(user.notes).length > 0 ? { notes: user.notes } : {}),
          ...(user?.badges && user.badges.length > 0 ? { badges: user.badges } : {}),
          ...(user?.customCareers && user.customCareers.length > 0 ? { customCareers: user.customCareers } : {}),
          ...(user?.userProfile ? { userProfile: user.userProfile } : {}),
        };

        const accountXP = user?.xp !== undefined ? user.xp : (merged.xp || 100);
        const accountLevel = user?.level !== undefined ? user.level : (merged.level || 1);
        const updatedUser = { ...user, xp: accountXP, level: accountLevel };

        set({
          user: updatedUser,
          token,
          isAuthenticated: true,
          isGuest: Boolean(user?.isGuest),
          authModalOpen: false,
          activeView: get().activeView === 'landing' ? 'galaxy' : get().activeView,
          progress: merged.progress || {},
          activityHistory: merged.activityHistory || [],
          phaseAssessments: merged.phaseAssessments || {},
          readinessAssessments: merged.readinessAssessments || {},
          projectProgress: merged.projectProgress || {},
          projectSubmissions: merged.projectSubmissions || {},
          savedRoadmaps: merged.savedRoadmaps || [],
          notes: merged.notes || {},
          badges: merged.badges || ['first_milestone', 'explorer', 'ai_oracle'],
          streakDays: merged.streakDays || 1,
          customCareers: merged.customCareers || [],
          deletedCareerIds: merged.deletedCareerIds || [],
          userProfile: merged.userProfile || null,
        });

        // Persist fresh snapshot for this isolated account
        saveAccountDataToStorage(accountKey, merged);
      },

      login: async (email, password) => {
        try {
          const res = await fetch(`${API_BASE}/api/auth/login`, {
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
              id: 'user-demo-101',
              name: 'Demo Cosmic Explorer',
              email,
              targetRole: 'ai-engineer',
              skills: ['Python', 'SQL'],
              xp: 250,
              level: 2,
            };
            get().setAuth(demoUser, 'demo-token');
            return { success: true, message: 'Welcome to demo mode!' };
          }
          return { success: false, message: 'Server unreachable. Try guest mode or start server.' };
        }
      },

      register: async (name, email, password, targetRole = 'ai-engineer', skills = []) => {
        try {
          const res = await fetch(`${API_BASE}/api/auth/register`, {
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
          const res = await fetch(`${API_BASE}/api/auth/guest`, {
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
        const currentUser = get().user;
        if (currentUser) {
          const key = getAccountKey(currentUser);
          const snapshot = {
            progress: get().progress,
            activityHistory: get().activityHistory,
            phaseAssessments: get().phaseAssessments,
            readinessAssessments: get().readinessAssessments,
            projectProgress: get().projectProgress,
            projectSubmissions: get().projectSubmissions,
            savedRoadmaps: get().savedRoadmaps,
            notes: get().notes,
            badges: get().badges,
            streakDays: get().streakDays,
            customCareers: get().customCareers,
            deletedCareerIds: get().deletedCareerIds,
            userProfile: get().userProfile,
            xp: currentUser.xp || 100,
            level: currentUser.level || 1,
          };
          saveAccountDataToStorage(key, snapshot);
        }

        localStorage.removeItem('careermitra_token');
        localStorage.removeItem(ACTIVE_ACCOUNT_KEY);

        const clean = getCleanAccountState(null);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isGuest: false,
          activeView: 'landing',
          activeRoadmap: null,
          activeAssessment: null,
          selectedProject: null,
          ...clean,
        });
      },

      initAuthSession: async () => {
        const token = localStorage.getItem('careermitra_token');
        if (!token) return;

        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              get().setAuth(data.user, token);
            }
          } else if (res.status === 401 || res.status === 403) {
            get().logout();
          }
        } catch (err) {
          // Offline mode verification
          const activeKey = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
          if (activeKey) {
            const saved = loadAccountDataFromStorage(activeKey);
            if (saved) {
              set({
                progress: saved.progress || {},
                activityHistory: saved.activityHistory || [],
                phaseAssessments: saved.phaseAssessments || {},
                readinessAssessments: saved.readinessAssessments || {},
                projectProgress: saved.projectProgress || {},
                projectSubmissions: saved.projectSubmissions || {},
                savedRoadmaps: saved.savedRoadmaps || [],
                notes: saved.notes || {},
                badges: saved.badges || ['first_milestone', 'explorer', 'ai_oracle'],
                streakDays: saved.streakDays || 1,
                customCareers: saved.customCareers || [],
                deletedCareerIds: saved.deletedCareerIds || [],
                userProfile: saved.userProfile || null,
              });
            }
          }
        }
      },

      // ── UI State ──
      activeView: 'landing',      // 'landing' | 'galaxy' | 'roadmap' | 'compare' | 'profile' | 'progress' | 'quiz' | 'projects'
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
        activeView: state.activeView,
        soundEnabled: state.soundEnabled,
        selectedCareer: state.selectedCareer,
        comparedCareers: state.comparedCareers,
      }),
    }
  )
);

export default useStore;
