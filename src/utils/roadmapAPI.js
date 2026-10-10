// AI Roadmap Generation API
// Uses Gemini (or simulates with rich local data) to generate personalized roadmaps

import { CAREER_NODES } from '../data/careers';

/**
 * Simulates an AI-generated personalized roadmap.
 * In production, replace `simulateAI` with a real Gemini API call.
 */
export async function generateRoadmap({ careerId, userProfile, existingSkills = [], timelineMonths = 12 }) {
  // Simulate network latency
  await delay(2200);

  const career = CAREER_NODES.find((c) => c.id === careerId);
  if (!career) throw new Error(`Career "${careerId}" not found`);

  // Calculate personalized adjustments
  const skillMatch = computeSkillMatch(existingSkills, career.skills);
  const phaseDurations = adjustPhaseDurations(career.roadmapPhases, timelineMonths, skillMatch);
  const prioritizedTasks = prioritizeTasks(career.roadmapPhases, existingSkills);

  const roadmap = {
    careerId,
    careerTitle: career.title,
    generatedAt: new Date().toISOString(),
    userProfile: userProfile || {},
    timelineMonths,
    skillMatch: Math.round(skillMatch * 100),
    aiSummary: generateSummary(career, skillMatch, userProfile, timelineMonths),
    phases: career.roadmapPhases.map((phase, idx) => ({
      ...phase,
      id: `phase-${idx}`,
      duration: phaseDurations[idx],
      tasks: prioritizedTasks[idx],
      status: 'pending',   // 'pending' | 'in-progress' | 'completed'
      resources: getPhaseResources(career, idx),
    })),
    recommendations: generateRecommendations(career, skillMatch, existingSkills),
    alternativePaths: getAlternativePaths(career),
    weeklyPlan: generateWeeklyPlan(career, timelineMonths),
  };

  return roadmap;
}

/**
 * Replans a roadmap based on updated skills or pace changes.
 */
export async function replanRoadmap({ existingRoadmap, completedPhases, updatedSkills, newTimeline }) {
  await delay(1500);

  const remainingPhases = existingRoadmap.phases.filter((_, idx) => !completedPhases.includes(idx));
  const revisedTimeline = newTimeline || existingRoadmap.timelineMonths - completedPhases.length * 2;
  const career = CAREER_NODES.find((c) => c.id === existingRoadmap.careerId);

  const updatedSkillMatch = computeSkillMatch(updatedSkills || [], career.skills);
  const newDurations = adjustPhaseDurations(remainingPhases, revisedTimeline, updatedSkillMatch);

  return {
    ...existingRoadmap,
    generatedAt: new Date().toISOString(),
    timelineMonths: revisedTimeline,
    skillMatch: Math.round(updatedSkillMatch * 100),
    aiSummary: `Based on your progress, your revised plan focuses on the remaining ${remainingPhases.length} phases. ${generatePaceAdvice(updatedSkillMatch)}`,
    phases: remainingPhases.map((phase, idx) => ({
      ...phase,
      duration: newDurations[idx],
    })),
    recommendations: [
      '✅ Great momentum! You\'ve completed the foundational phases.',
      `🎯 Focus area: ${remainingPhases[0]?.phase || 'Advanced Topics'}`,
      '📅 Maintain 15–20 hours/week to hit your target.',
      '🤝 Start networking in the community now.',
    ],
  };
}

// ── Helpers ──

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function computeSkillMatch(existingSkills, careerSkills) {
  if (!existingSkills.length) return 0.2;
  const normalized = existingSkills.map((s) => s.toLowerCase());
  const matches = careerSkills.filter((s) => normalized.some((e) => s.toLowerCase().includes(e) || e.includes(s.toLowerCase())));
  return Math.min(0.9, 0.2 + (matches.length / careerSkills.length) * 0.7);
}

function adjustPhaseDurations(phases, totalMonths, skillMatch) {
  const baseDurations = phases.map(() => totalMonths / phases.length);
  // Advanced learners can compress early phases
  return baseDurations.map((d, i) => {
    const compression = i < 2 ? skillMatch * 0.4 : 0;
    const months = Math.max(1, Math.round(d * (1 - compression)));
    return `${months} month${months > 1 ? 's' : ''}`;
  });
}

function prioritizeTasks(phases, existingSkills) {
  const normalized = existingSkills.map((s) => s.toLowerCase());
  return phases.map((phase) => {
    return phase.tasks.map((task) => {
      const isKnown = normalized.some((s) => task.toLowerCase().includes(s));
      return {
        title: task,
        priority: isKnown ? 'review' : 'learn',
        estimatedHours: isKnown ? 8 : 20,
        completed: false,
      };
    });
  });
}

function getPhaseResources(career, phaseIdx) {
  // Distribute career resources across phases
  const allResources = career.resources || [];
  return allResources.filter((_, i) => i % career.roadmapPhases.length === phaseIdx % career.roadmapPhases.length);
}

function generateSummary(career, skillMatch, userProfile, timelineMonths) {
  const matchPct = Math.round(skillMatch * 100);
  const name = userProfile?.name ? `, ${userProfile.name}` : '';
  const level = matchPct > 60 ? 'strong foundation' : matchPct > 30 ? 'some relevant background' : 'fresh perspective';

  return `Welcome${name}! Your personalized roadmap to becoming a **${career.title}** is ready. ` +
    `You bring a ${level} with ${matchPct}% skill alignment. ` +
    `In ${timelineMonths} months, you'll progress through ${career.roadmapPhases.length} structured phases — ` +
    `from fundamentals to industry-ready expertise. ` +
    `The ${career.category} field is seeing ${career.growthRate} annual growth, with average salaries of ${career.avgSalary}. ` +
    `Stay consistent with 15–20 hours/week and you'll be job-ready on schedule.`;
}

function generateRecommendations(career, skillMatch, existingSkills) {
  const recs = [];
  if (skillMatch < 0.3) {
    recs.push('🌱 Start with the foundational resources — build a solid base before rushing ahead.');
    recs.push('⏱️ Budget at least 2 hours daily for the first 3 months.');
  } else if (skillMatch < 0.6) {
    recs.push('⚡ You can skim Phase 1 quickly and dive into Phase 2 sooner.');
    recs.push('🔗 Connect with 3 professionals in the field on LinkedIn this week.');
  } else {
    recs.push('🚀 Your background is strong — fast-track to advanced phases within 2 months.');
    recs.push('🏆 Consider contributing to open-source to build credibility fast.');
  }
  recs.push(`📚 Top resource to start: ${career.resources?.[0]?.title || 'industry documentation'}`);
  recs.push('📊 Track weekly hours in a spreadsheet to stay accountable.');
  return recs;
}

function getAlternativePaths(career) {
  return (career.relatedCareers || []).slice(0, 2).map((id) => {
    const related = CAREER_NODES.find((c) => c.id === id);
    return related ? { id: related.id, title: related.title, icon: related.icon, reason: `Shared skills with ${career.title}` } : null;
  }).filter(Boolean);
}

function generateWeeklyPlan(career, months) {
  const totalWeeks = months * 4;
  const weeksPerPhase = Math.ceil(totalWeeks / career.roadmapPhases.length);
  return career.roadmapPhases.map((phase, idx) => ({
    phaseIndex: idx,
    phase: phase.phase,
    startWeek: idx * weeksPerPhase + 1,
    endWeek: (idx + 1) * weeksPerPhase,
    hoursPerWeek: 18,
    focus: phase.tasks.slice(0, 2).join(', '),
  }));
}

function generatePaceAdvice(skillMatch) {
  if (skillMatch > 0.6) return 'Your skill gains are accelerating the timeline.';
  if (skillMatch > 0.3) return 'You\'re on a steady pace — keep the momentum.';
  return 'Consider dedicating extra hours this week to catch up.';
}
