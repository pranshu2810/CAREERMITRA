import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, TrendingUp, Award, Clock, Flame, Trophy, Star, Sparkles, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell
} from 'recharts';
import useStore from '../store/useStore';

function hexToRgb(hex) {
  if (!hex) return '124, 58, 237';
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  const num = parseInt(clean, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

function StatCard({ icon, label, value, sub, color = '#7c3aed' }) {
  return (
    <motion.div
      className="glass-card"
      whileHover={{ y: -4, boxShadow: `0 12px 28px -8px rgba(${hexToRgb(color)}, 0.35)` }}
      style={{ padding: 20, display: 'flex', gap: 14, alignItems: 'center' }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `rgba(${hexToRgb(color)}, 0.14)`,
        border: `1.5px solid rgba(${hexToRgb(color)}, 0.35)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: 2, fontWeight: 600 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

export default function ProgressView() {
  const {
    progress, savedRoadmaps, getCareerProgress, getAllCareers,
    setSelectedCareer, setActiveView, setActiveRoadmap, activityHistory, user
  } = useStore();

  const allCareers = getAllCareers();

  // Find all careers that have any progress recorded or are saved
  const trackedCareers = allCareers.filter((c) => {
    const cp = progress[c.id];
    const hasProgress = cp && Object.values(cp).some((phase) => Object.values(phase).some(Boolean));
    const isSaved = savedRoadmaps.some((r) => r.careerId === c.id);
    return hasProgress || isSaved;
  });

  // Calculate real total tasks done and total hours across all tracked paths
  let totalTasksDone = 0;
  let totalTasksAvailable = 0;
  let totalHoursCompleted = 0;

  const careerBreakdowns = (trackedCareers.length > 0 ? trackedCareers : allCareers.slice(0, 3)).map((c) => {
    const cp = progress[c.id] || {};
    let careerDone = 0;
    let careerTotal = 0;
    let careerHoursDone = 0;

    const phases = c.roadmapPhases || [];
    phases.forEach((p, pIdx) => {
      (p.tasks || []).forEach((t, tIdx) => {
        careerTotal++;
        const hours = t.hours || 15;
        if (cp[pIdx]?.[tIdx]) {
          careerDone++;
          careerHoursDone += hours;
        }
      });
    });

    totalTasksDone += careerDone;
    totalTasksAvailable += careerTotal;
    totalHoursCompleted += careerHoursDone;

    const percent = careerTotal > 0 ? Math.round((careerDone / careerTotal) * 100) : 0;

    return {
      id: c.id,
      title: c.title,
      icon: c.icon || '🚀',
      color: c.color || '#7c3aed',
      cluster: c.cluster || c.category,
      done: careerDone,
      total: careerTotal,
      hoursDone: careerHoursDone,
      percent,
      phases,
    };
  });

  const completedCareers = careerBreakdowns.filter((c) => c.percent === 100 && c.total > 0).length;

  // Real phase-level completion data across all active paths
  const phaseStats = [
    { name: 'Phase 1: Foundations', done: 0, total: 0 },
    { name: 'Phase 2: Core Systems', done: 0, total: 0 },
    { name: 'Phase 3: Advanced Topics', done: 0, total: 0 },
    { name: 'Phase 4: Capstones', done: 0, total: 0 },
  ];

  (trackedCareers.length > 0 ? trackedCareers : allCareers.slice(0, 4)).forEach((c) => {
    const cp = progress[c.id] || {};
    (c.roadmapPhases || []).forEach((p, pIdx) => {
      if (pIdx < 4) {
        (p.tasks || []).forEach((_, tIdx) => {
          phaseStats[pIdx].total++;
          if (cp[pIdx]?.[tIdx]) {
            phaseStats[pIdx].done++;
          }
        });
      }
    });
  });

  const phaseChartData = phaseStats.map((p) => ({
    name: p.name.split(':')[0],
    Completed: p.done,
    Remaining: Math.max(0, p.total - p.done),
  }));

  // Real Radial bar data for actively tracked careers
  const radialData = careerBreakdowns.map((c) => ({
    name: c.title,
    progress: c.percent,
    fill: c.color,
  }));

  const userXP = totalTasksDone * 50;
  const userLevel = Math.floor(userXP / 200) + 1;

  return (
    <div style={{ paddingTop: 88, minHeight: '100vh', paddingBottom: 60 }}>
      <div className="container" style={{ paddingTop: 32 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: 8 }}>
                <Sparkles size={12} /> Live Real-Time Analytics
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, marginBottom: 6 }}>
                <span className="text-gradient">Progress & Mastery Dashboard</span>
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
                Accurate, live metrics derived from your actual completed milestones and roadmap tasks.
              </p>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(124, 58, 237, 0.35)',
              borderRadius: 16,
              padding: '10px 18px',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, color: '#fff', fontSize: 16,
              }}>
                {userLevel}
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#c4b5fd', fontWeight: 700, letterSpacing: '0.06em' }}>COSMIC RANK</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Level {userLevel} · {userXP} XP</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard
            icon="✅"
            label="Tasks Completed"
            value={totalTasksDone}
            sub={`${totalTasksAvailable > 0 ? Math.round((totalTasksDone / totalTasksAvailable) * 100) : 0}% of all paths`}
            color="#10b981"
          />
          <StatCard
            icon="⏱️"
            label="Study Hours Logged"
            value={`${totalHoursCompleted} hrs`}
            sub="Hands-on mastery"
            color="#06b6d4"
          />
          <StatCard
            icon="🌌"
            label="Careers In Orbit"
            value={careerBreakdowns.filter(c => c.done > 0).length}
            sub="Actively tracked"
            color="#7c3aed"
          />
          <StatCard
            icon="🏆"
            label="Finished Constellations"
            value={completedCareers}
            sub="100% complete"
            color="#f59e0b"
          />
        </div>

        {/* Real-time Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 28 }}>
          {/* Phase Completion Real Bar Chart */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                  Phase-by-Phase Completion
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Real tasks completed vs pending per phase</p>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                {totalTasksDone} Tasks Done
              </span>
            </div>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(8, 6, 28, 0.95)',
                      borderColor: 'rgba(124, 58, 237, 0.4)',
                      borderRadius: 12,
                      color: '#fff',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Remaining" stackId="a" fill="rgba(124, 58, 237, 0.25)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Career Progress Breakdown */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ padding: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                  Live Career Mastery
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Progress per enrolled career path</p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setActiveView('galaxy')}
                style={{ fontSize: '0.76rem', color: '#a78bfa' }}
              >
                + Enrol More
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {careerBreakdowns.slice(0, 5).map((career) => (
                <div key={career.id} style={{ padding: '8px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{career.icon}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{career.title}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: career.color }}>
                      {career.percent}% ({career.done}/{career.total})
                    </span>
                  </div>

                  <div style={{
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${career.percent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${career.color}, #06b6d4)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Live Milestone Activity Feed */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                Real-Time Milestone Log
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Live record of every milestone you complete in your roadmaps
              </p>
            </div>
            <span style={{
              fontSize: '0.74rem',
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '4px 10px',
              borderRadius: 999,
              fontWeight: 700,
            }}>
              ● Real-Time Active
            </span>
          </div>

          {(!activityHistory || activityHistory.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🧭</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: 14 }}>
                No milestones marked yet. Go to your <strong>Roadmap</strong>, check off a task, and it will immediately register here in real-time!
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setActiveView('roadmap')}
              >
                Go to Roadmap <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activityHistory.slice(0, 8).map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(124, 58, 237, 0.18)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#10b981',
                    }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                        {act.taskTitle || 'Milestone Task'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        Phase {act.phaseIndex + 1} · {act.careerId}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.75rem', color: '#c4b5fd', fontWeight: 700 }}>
                      +50 XP
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
