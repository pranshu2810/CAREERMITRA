import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, TrendingUp, Award, Clock, Flame, Trophy, Star } from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import useStore from '../store/useStore';
import { CAREER_NODES } from '../data/careers';

function StatCard({ icon, label, value, sub, color = 'var(--color-primary-glow)' }) {
  return (
    <motion.div
      className="glass-card"
      whileHover={{ scale: 1.03 }}
      style={{ padding: 20, display: 'flex', gap: 14, alignItems: 'center' }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 12, background: `rgba(${hexToRgb(color)},0.12)`, border: `1.5px solid rgba(${hexToRgb(color)},0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

export default function ProgressView() {
  const { progress, savedRoadmaps, getCareerProgress, setSelectedCareer, setActiveView, setActiveRoadmap } = useStore();

  // Compute data for all tracked careers
  const trackedCareers = CAREER_NODES.filter((c) => {
    const cp = progress[c.id];
    return cp && Object.keys(cp).length > 0;
  });

  const totalTasksDone = trackedCareers.reduce((acc, c) => {
    const cp = progress[c.id] || {};
    let done = 0;
    c.roadmapPhases.forEach((p, pi) => {
      p.tasks.forEach((_, ti) => { if (cp[pi]?.[ti]) done++; });
    });
    return acc + done;
  }, 0);

  const completedCareers = trackedCareers.filter((c) => getCareerProgress(c.id) === 100).length;

  // Radial bar data
  const radialData = trackedCareers.map((c) => ({
    name: c.title,
    progress: getCareerProgress(c.id),
    fill: c.color,
  }));

  // Simulated weekly activity (last 8 weeks)
  const weeklyData = Array.from({ length: 8 }, (_, i) => ({
    week: `Wk ${i + 1}`,
    tasks: Math.floor(Math.random() * 8 + (i * 0.5)),
  }));

  return (
    <div style={{ paddingTop: 88, minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>
            <span className="text-gradient">Progress Dashboard</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Track your skill milestones across all career paths.</p>
        </motion.div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard icon="✅" label="Tasks Completed" value={totalTasksDone} color="#10b981" />
          <StatCard icon="🎯" label="Careers Tracked" value={trackedCareers.length} color="#7c3aed" />
          <StatCard icon="🏆" label="Completed Paths" value={completedCareers} color="#f59e0b" />
          <StatCard icon="💾" label="Saved Roadmaps" value={savedRoadmaps.length} color="#06b6d4" />
        </div>

        {/* No tracked careers */}
        {trackedCareers.length === 0 && (
          <motion.div className="glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🛤️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>No Progress Yet</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Generate a roadmap and check off tasks to start tracking your journey.</p>
            <button className="btn btn-primary" onClick={() => setActiveView('galaxy')}>Explore Careers →</button>
          </motion.div>
        )}

        {trackedCareers.length > 0 && (
          <>
            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <motion.div className="glass-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Career Progress</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <RadialBarChart innerRadius="20%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                    <RadialBar minAngle={15} dataKey="progress" background={{ fill: 'rgba(255,255,255,0.04)' }} cornerRadius={6} label={{ position: 'insideStart', fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--color-bg-modal)', border: '1px solid var(--color-border)', borderRadius: 8 }}
                      formatter={(v) => [`${v}%`, 'Progress']}
                    />
                    <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div className="glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Weekly Activity</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="week" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: 'var(--color-bg-modal)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="tasks" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 4 }} activeDot={{ r: 6, fill: '#c4b5fd' }} name="Tasks Done" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Per-career progress cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {trackedCareers.map((career, idx) => {
                const pct = getCareerProgress(career.id);
                const cp = progress[career.id] || {};

                return (
                  <motion.div
                    key={career.id}
                    className="glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    style={{ padding: 24 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: 28 }}>{career.icon}</span>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>{career.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{career.category}</div>
                        </div>
                        {pct === 100 && <span className="badge badge-emerald"><Trophy size={10} /> Complete!</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{
                          fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900,
                          color: pct === 100 ? '#10b981' : career.color,
                        }}>{pct}%</span>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setSelectedCareer(career);
                            const saved = savedRoadmaps.find((r) => r.careerId === career.id);
                            if (saved) setActiveRoadmap(saved);
                            setActiveView('roadmap');
                          }}
                        >
                          Continue →
                        </button>
                      </div>
                    </div>

                    <div className="progress-bar" style={{ height: 8, marginBottom: 16 }}>
                      <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--grad-emerald)' : `linear-gradient(90deg, ${career.color}, ${career.color}88)` }} />
                    </div>

                    {/* Phase breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                      {career.roadmapPhases.map((phase, pi) => {
                        const phaseTasks = phase.tasks;
                        const done = phaseTasks.filter((_, ti) => cp[pi]?.[ti]).length;
                        const phasePct = Math.round((done / phaseTasks.length) * 100);
                        return (
                          <div key={pi} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{phase.phase}</span>
                              <span style={{ fontSize: '0.75rem', color: phasePct === 100 ? '#10b981' : 'var(--color-text-muted)' }}>{done}/{phaseTasks.length}</span>
                            </div>
                            <div className="progress-bar" style={{ height: 4 }}>
                              <div className="progress-fill" style={{ width: `${phasePct}%`, background: phasePct === 100 ? 'var(--grad-emerald)' : 'var(--grad-primary)' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  if (hex.startsWith('var(')) return '124,58,237';
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '124,58,237';
}
