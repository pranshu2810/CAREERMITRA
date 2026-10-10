import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, GitCompare, X, ChevronDown, Award } from 'lucide-react';
import useStore from '../store/useStore';
import { CAREER_NODES, DEMAND_COLORS } from '../data/careers';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// All skills normalized across careers for radar
const ALL_TOP_SKILLS = ['Coding', 'Data', 'Design', 'Cloud', 'Security', 'Communication', 'Analytics', 'Leadership'];

function mapCareerToRadar(career) {
  const skillMap = {
    'Coding': ['Python', 'JavaScript', 'React', 'Node', 'Algorithms', 'Data Structures', 'TypeScript'],
    'Data': ['SQL', 'Pandas', 'Machine Learning', 'Statistics', 'Big Data', 'Data Viz', 'NumPy'],
    'Design': ['Figma', 'UX', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems'],
    'Cloud': ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    'Security': ['Penetration Testing', 'Cryptography', 'OWASP', 'SIEM', 'Network Security'],
    'Communication': ['Stakeholder Management', 'Roadmapping', 'Agile', 'Scrum', 'User Interviews'],
    'Analytics': ['A/B Testing', 'Metrics', 'Data Analysis', 'OKRs', 'Mixpanel'],
    'Leadership': ['Product Strategy', 'PRD Writing', 'User Stories', 'Research Methods'],
  };
  return ALL_TOP_SKILLS.map((skill) => {
    const related = skillMap[skill] || [];
    const score = career.skills.filter((s) => related.some((r) => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))).length;
    return { skill, value: Math.min(100, score * 18 + 20) };
  });
}

function parseSalaryMidpoint(salaryStr) {
  const nums = salaryStr.match(/\d+/g);
  if (!nums || nums.length < 2) return parseInt(nums?.[0] || '0');
  return (parseInt(nums[0]) + parseInt(nums[1])) / 2;
}

export default function CompareView() {
  const { comparedCareers, toggleCompare, clearCompare, setSelectedCareer, setActiveView } = useStore();

  const careers = comparedCareers.map((id) => CAREER_NODES.find((c) => c.id === id)).filter(Boolean);

  if (careers.length === 0) {
    return (
      <div style={{ paddingTop: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 500 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>⚖️</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Compare Career Paths</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28 }}>
            Go to the Galaxy view and click the <strong style={{ color: 'var(--color-primary-glow)' }}>⊕ Compare</strong> button on up to 3 career cards to start comparing.
          </p>
          <button className="btn btn-primary" onClick={() => useStore.getState().setActiveView('galaxy')}>
            ← Back to Galaxy
          </button>
        </div>
      </div>
    );
  }

  // Radar data
  const radarData = ALL_TOP_SKILLS.map((skill, si) => {
    const entry = { skill };
    careers.forEach((c) => {
      entry[c.id] = mapCareerToRadar(c)[si].value;
    });
    return entry;
  });

  // Salary comparison data
  const salaryData = careers.map((c) => ({
    name: c.title.length > 12 ? c.title.slice(0, 12) + '…' : c.title,
    salary: parseSalaryMidpoint(c.avgSalary),
    fill: c.color,
  }));

  // Growth data
  const growthData = careers.map((c) => ({
    name: c.title.length > 12 ? c.title.slice(0, 12) + '…' : c.title,
    growth: parseInt(c.growthRate.replace(/[^0-9]/g, '')) || 0,
  }));

  const COLORS = careers.map((c) => c.color);

  return (
    <div style={{ paddingTop: 88, minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, marginBottom: 6 }}>
              <span className="text-gradient">Career Comparison</span>
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Side-by-side analysis of {careers.length} career paths</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {careers.map((c) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px',
                background: `rgba(${hexToRgb(c.color)},0.1)`,
                border: `1px solid rgba(${hexToRgb(c.color)},0.3)`,
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem', color: c.color, fontWeight: 600,
              }}>
                {c.icon} {c.title}
                <button onClick={() => toggleCompare(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.color, padding: 0, display: 'flex' }}>
                  <X size={12} />
                </button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={clearCompare}>Clear All</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveView('galaxy')}>+ Add More</button>
          </div>
        </motion.div>

        {/* Stat comparison grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 28 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 16px 12px', width: '24%' }}>Category</th>
                  {careers.map((c) => (
                    <th key={c.id} style={{ textAlign: 'center', padding: '0 16px 12px', width: `${76 / careers.length}%` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: c.color }}>
                        <span>{c.icon}</span> {c.title}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'avgSalary', label: '💰 Avg Salary', render: (c) => c.avgSalary },
                  { key: 'growthRate', label: '📈 Growth Rate', render: (c) => c.growthRate },
                  { key: 'demand', label: '🔥 Demand', render: (c) => <span style={{ color: DEMAND_COLORS[c.demand] || '#10b981', fontWeight: 600 }}>{c.demand}</span> },
                  { key: 'duration', label: '⏱️ Timeline', render: (c) => `${c.roadmapPhases.reduce((a, p) => a + parseInt(p.duration), 0)} months` },
                  { key: 'skills', label: '🛠️ Skills Count', render: (c) => `${c.skills.length} core skills` },
                  { key: 'phases', label: '📚 Phases', render: (c) => `${c.roadmapPhases.length} phases` },
                  { key: 'category', label: '🏷️ Category', render: (c) => c.category },
                ].map((row, rowIdx) => (
                  <tr key={row.key} style={{ background: rowIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--color-text-muted)', borderRadius: '10px 0 0 10px' }}>{row.label}</td>
                    {careers.map((c) => (
                      <td key={c.id} style={{ textAlign: 'center', padding: '14px 16px', fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                        {row.render(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          {/* Radar Chart */}
          <motion.div className="glass-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Skill Profile Radar</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                {careers.map((c, i) => (
                  <Radar key={c.id} name={c.title} dataKey={c.id} stroke={c.color} fill={c.color} fillOpacity={0.15} strokeWidth={2} />
                ))}
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Salary Bar Chart */}
          <motion.div className="glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Salary Midpoint (LPA)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salaryData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-bg-modal)', border: '1px solid var(--color-border)', borderRadius: 8 }}
                  labelStyle={{ color: 'var(--color-text-primary)' }}
                  itemStyle={{ color: 'var(--color-text-secondary)' }}
                  formatter={(val) => [`₹${val} LPA`, 'Salary']}
                />
                <Bar dataKey="salary" radius={[6, 6, 0, 0]}>
                  {salaryData.map((entry, index) => (
                    <rect key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Skills Venn-like: unique + shared skills */}
        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Skill Overlap Analysis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${careers.length}, 1fr) auto`, gap: 16 }}>
            {careers.map((c) => {
              const unique = c.skills.filter((s) => !careers.filter((x) => x.id !== c.id).some((x) => x.skills.some((xs) => xs.toLowerCase() === s.toLowerCase())));
              return (
                <div key={c.id}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: c.color, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {c.icon} Unique to {c.title}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {unique.map((s) => (
                      <span key={s} style={{ fontSize: '0.72rem', padding: '3px 9px', background: `rgba(${hexToRgb(c.color)},0.1)`, color: c.color, borderRadius: 'var(--radius-full)', border: `1px solid rgba(${hexToRgb(c.color)},0.2)` }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: 16 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 10 }}>🤝 Shared Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(() => {
                  if (careers.length < 2) return <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Add more careers</span>;
                  const shared = careers[0].skills.filter((s) => careers.slice(1).every((c) => c.skills.some((cs) => cs.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(cs.toLowerCase()) || cs.toLowerCase().includes(s.toLowerCase()))));
                  return shared.length ? shared.map((s) => (
                    <span key={s} style={{ fontSize: '0.72rem', padding: '3px 9px', background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {s}
                    </span>
                  )) : <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>No direct overlaps</span>;
                })()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA: Generate roadmap for each */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {careers.map((c) => (
            <button
              key={c.id}
              id={`compare-roadmap-${c.id}`}
              className="btn btn-primary"
              onClick={() => { setSelectedCareer(c); setActiveView('roadmap'); }}
              style={{ justifyContent: 'center', background: `linear-gradient(135deg, ${c.color}aa, ${c.color})` }}
            >
              {c.icon} Roadmap for {c.title}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '124,58,237';
}
