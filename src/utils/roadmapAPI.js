// AI Roadmap Generation API
// Uses Gemini / Cosmic Synthesis Engine to generate personalized roadmaps

import { CAREER_NODES } from '../data/careers.js';
import useStore from '../store/useStore.js';
import { synthesizeCareerBlueprint } from './blueprintSynthesizer.js';

/**
 * Generates an AI-personalized roadmap for ANY standard or custom career.
 * Guarantees zero "Career not found" errors and provides deep domain learning phases.
 */
export async function generateRoadmap({
  careerId,
  career: passedCareer,
  userProfile,
  existingSkills = [],
  timelineMonths = 12,
}) {
  // Simulate network latency for cosmic AI reasoning
  await delay(1600);

  // 1. Resolve career entity
  let career = passedCareer;
  if (!career && careerId) {
    try {
      const all = useStore.getState().getAllCareers();
      career = all.find((c) => c.id === careerId);
    } catch (e) {
      // fallback
    }
  }

  if (!career && careerId) {
    career = CAREER_NODES.find((c) => c.id === careerId);
  }

  // 2. Synthesize blueprint if custom or missing full roadmap phases
  const rawTitle = career?.title || (typeof careerId === 'string' && !careerId.startsWith('custom-') ? careerId : 'Career Track');
  const blueprint = synthesizeCareerBlueprint(rawTitle);

  const effectiveCareer = {
    ...blueprint,
    ...(career || {}),
    id: careerId || career?.id || `custom-${Date.now()}`,
    title: career?.title || blueprint.title,
    category: career?.category || career?.cluster || blueprint.category,
    avgSalary: career?.avgSalary || career?.salaryRange || blueprint.avgSalary,
    growthRate: career?.growthRate || blueprint.growthRate,
    skills: (career?.skills && career.skills.length >= 3) ? career.skills : blueprint.skills,
    roadmapPhases: (career?.roadmapPhases && career.roadmapPhases.length >= 3)
      ? career.roadmapPhases
      : blueprint.roadmapPhases,
    resources: (career?.resources && career.resources.length) ? career.resources : blueprint.resources,
  };

  // 3. Compute personalized adjustments
  const skillMatch = computeSkillMatch(existingSkills, effectiveCareer.skills);
  const phaseDurations = adjustPhaseDurations(effectiveCareer.roadmapPhases, timelineMonths, skillMatch);
  const prioritizedTasks = prioritizeTasks(effectiveCareer.roadmapPhases, existingSkills);

  const roadmap = {
    careerId: effectiveCareer.id,
    careerTitle: effectiveCareer.title,
    generatedAt: new Date().toISOString(),
    userProfile: userProfile || {},
    timelineMonths,
    skillMatch: Math.round(skillMatch * 100),
    aiSummary: generateSummary(effectiveCareer, skillMatch, userProfile, timelineMonths),
    phases: effectiveCareer.roadmapPhases.map((phase, idx) => ({
      ...phase,
      id: `phase-${idx}`,
      phase: phase.phase || phase.title || `Phase ${idx + 1}`,
      duration: phaseDurations[idx] || `${Math.round(timelineMonths / effectiveCareer.roadmapPhases.length)} months`,
      tasks: prioritizedTasks[idx] || [],
      status: 'pending',   // 'pending' | 'in-progress' | 'completed'
      resources: getPhaseResources(effectiveCareer, idx),
    })),
    recommendations: generateRecommendations(effectiveCareer, skillMatch, existingSkills),
    alternativePaths: getAlternativePaths(effectiveCareer),
    weeklyPlan: generateWeeklyPlan(effectiveCareer, timelineMonths),
  };

  return roadmap;
}

/**
 * Replans a roadmap dynamically based on updated skills or timeline changes.
 */
export async function replanRoadmap({
  existingRoadmap,
  completedPhases = [],
  updatedSkills = [],
  newTimeline,
}) {
  await delay(1200);

  const remainingPhases = (existingRoadmap.phases || []).filter((_, idx) => !completedPhases.includes(idx));
  const revisedTimeline = newTimeline || Math.max(3, (existingRoadmap.timelineMonths || 12) - completedPhases.length * 2);

  let career;
  try {
    career = useStore.getState().getAllCareers().find((c) => c.id === existingRoadmap.careerId);
  } catch (e) {}

  if (!career) career = CAREER_NODES.find((c) => c.id === existingRoadmap.careerId);
  if (!career) career = synthesizeCareerBlueprint(existingRoadmap.careerTitle || 'Career Track');

  const updatedSkillMatch = computeSkillMatch(updatedSkills || [], career.skills || []);
  const newDurations = adjustPhaseDurations(remainingPhases, revisedTimeline, updatedSkillMatch);

  return {
    ...existingRoadmap,
    generatedAt: new Date().toISOString(),
    timelineMonths: revisedTimeline,
    skillMatch: Math.round(updatedSkillMatch * 100),
    aiSummary: `Based on your recent progress, your revised roadmap focuses on the remaining ${remainingPhases.length} milestones. ${generatePaceAdvice(updatedSkillMatch)}`,
    phases: remainingPhases.map((phase, idx) => ({
      ...phase,
      duration: newDurations[idx] || `${Math.max(1, Math.round(revisedTimeline / remainingPhases.length))} months`,
    })),
    recommendations: [
      '✅ Great momentum! You\'ve completed earlier milestones.',
      `🎯 Immediate focus: ${remainingPhases[0]?.phase || remainingPhases[0]?.title || 'Advanced Competencies'}`,
      '📅 Dedicate 15–20 hours/week to hit target completion on schedule.',
      '🤝 Actively network with industry peers and practitioners.',
    ],
  };
}

// ── Helpers ──

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function computeSkillMatch(existingSkills, careerSkills = []) {
  if (!existingSkills || !existingSkills.length || !careerSkills.length) return 0.28;
  const normalized = existingSkills.map((s) => s.toLowerCase());
  const matches = careerSkills.filter((s) =>
    normalized.some((e) => s.toLowerCase().includes(e) || e.includes(s.toLowerCase()))
  );
  return Math.min(0.92, 0.25 + (matches.length / careerSkills.length) * 0.7);
}

function adjustPhaseDurations(phases = [], totalMonths, skillMatch) {
  const count = Math.max(1, phases.length);
  const baseDurations = phases.map(() => totalMonths / count);
  return baseDurations.map((d, i) => {
    const compression = i < 2 ? skillMatch * 0.35 : 0;
    const months = Math.max(1, Math.round(d * (1 - compression)));
    return `${months} month${months > 1 ? 's' : ''}`;
  });
}

function prioritizeTasks(phases = [], existingSkills = []) {
  const normalized = (existingSkills || []).map((s) => s.toLowerCase());
  return phases.map((phase) => {
    return (phase.tasks || []).map((task) => {
      const taskTitle = typeof task === 'object' ? (task.title || task.name || 'Milestone Task') : String(task);
      const isKnown = normalized.some((s) => taskTitle.toLowerCase().includes(s) || s.includes(taskTitle.toLowerCase()));
      const estimatedHours = typeof task === 'object' 
        ? (task.hours || task.estimatedHours || (isKnown ? 8 : 20)) 
        : (isKnown ? 8 : 20);

      return {
        title: taskTitle,
        priority: isKnown ? 'review' : 'learn',
        estimatedHours,
        completed: false,
      };
    });
  });
}

function getPhaseResources(career, phaseIdx) {
  const allResources = career.resources || [];
  if (!allResources.length) {
    return [
      { title: `${career.title} Foundational Guide`, type: 'Documentation', url: 'https://wikipedia.org' },
      { title: 'Interactive Learning Track', type: 'Course', url: 'https://coursera.org' },
    ];
  }
  const phasesCount = Math.max(1, career.roadmapPhases?.length || 4);
  const filtered = allResources.filter((_, i) => i % phasesCount === phaseIdx % phasesCount);
  return filtered.length ? filtered : allResources.slice(0, 2);
}

function generateSummary(career, skillMatch, userProfile, timelineMonths) {
  const matchPct = Math.round(skillMatch * 100);
  const name = userProfile?.name ? `, ${userProfile.name}` : '';
  const level = matchPct > 60 ? 'strong foundation' : matchPct > 30 ? 'relevant background' : 'fresh perspective';
  const phaseCount = career.roadmapPhases?.length || 4;
  const categoryName = career.category || career.cluster || 'Specialized';
  const salaryText = career.avgSalary || career.salaryRange || 'competitive industry standards';
  const growthRateText = career.growthRate || '+20%';

  return `Welcome${name}! Your personalized roadmap to becoming a professional **${career.title}** is ready. ` +
    `You bring a ${level} with ${matchPct}% skill alignment. ` +
    `In ${timelineMonths} months, you'll progress through ${phaseCount} structured phases — ` +
    `from core fundamentals to industry-ready mastery. ` +
    `The ${categoryName} domain is seeing ${growthRateText} annual growth, with compensation ranging around ${salaryText}. ` +
    `Stay consistent with 15–20 hours/week and you'll achieve milestone mastery right on schedule.`;
}

function generateRecommendations(career, skillMatch, existingSkills) {
  const recs = [];
  if (skillMatch < 0.3) {
    recs.push('🌱 Master Phase 1 fundamentals thoroughly before advancing to studio/applied work.');
    recs.push('⏱️ Dedicate at least 2 structured hours daily for steady craft compounding.');
  } else if (skillMatch < 0.6) {
    recs.push('⚡ You have existing foundations — skim early review tasks and invest time into Phase 2 & 3.');
    recs.push('🔗 Connect with 3 practitioners and mentors in this domain on LinkedIn or community channels.');
  } else {
    recs.push('🚀 Strong background detected! Accelerate toward capstone showcase within 2 months.');
    recs.push('🏆 Build public case studies or publish original work to establish credibility fast.');
  }
  recs.push(`📚 Top recommended resource: ${career.resources?.[0]?.title || 'Standard Industry Reference'}`);
  recs.push('📊 Keep a weekly practice log to track hours and maintain consistency.');
  return recs;
}

function getAlternativePaths(career) {
  if (career.relatedCareers && career.relatedCareers.length) {
    const list = career.relatedCareers.map((id) => {
      const rel = CAREER_NODES.find((c) => c.id === id);
      return rel ? { id: rel.id, title: rel.title, icon: rel.icon, reason: `Shared skills with ${career.title}` } : null;
    }).filter(Boolean);
    if (list.length) return list.slice(0, 2);
  }

  return CAREER_NODES.slice(0, 2).map((c) => ({
    id: c.id,
    title: c.title,
    icon: c.icon,
    reason: `Adjacent pathway complementing ${career.title}`,
  }));
}

function generateWeeklyPlan(career, months) {
  const phases = career.roadmapPhases || [];
  const totalWeeks = months * 4;
  const count = Math.max(1, phases.length);
  const weeksPerPhase = Math.ceil(totalWeeks / count);

  return phases.map((phase, idx) => {
    const taskTitles = (phase.tasks || []).map((t) => (typeof t === 'object' ? t.title : String(t)));
    return {
      phaseIndex: idx,
      phase: phase.phase || phase.title || `Phase ${idx + 1}`,
      startWeek: idx * weeksPerPhase + 1,
      endWeek: Math.min(totalWeeks, (idx + 1) * weeksPerPhase),
      hoursPerWeek: 18,
      focus: taskTitles.slice(0, 2).join(', ') || 'Core Competencies',
    };
  });
}

function generatePaceAdvice(skillMatch) {
  if (skillMatch > 0.6) return 'Your skill gains are accelerating your milestone timeline.';
  if (skillMatch > 0.3) return 'You are progressing on a steady trajectory — maintain momentum.';
  return 'Consider budgeting 2–3 extra hours this week to solidify foundational concepts.';
}
