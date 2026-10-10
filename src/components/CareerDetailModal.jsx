import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Sparkles, GitCompare, TrendingUp, Clock, Star, Award } from 'lucide-react';
import { DEMAND_COLORS } from '../data/careers';

export default function CareerDetailModal({ career, onClose, onGenerateRoadmap, isCompared, onToggleCompare }) {
  if (!career) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ maxWidth: 680 }}
      >
        {/* Header */}
        <div style={{
          padding: '28px 32px 20px',
          borderBottom: '1px solid var(--color-border)',
          background: `linear-gradient(135deg, rgba(${hexToRgb(career.color)},0.12) 0%, transparent 100%)`,
          borderRadius: '32px 32px 0 0',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${career.color}, transparent 70%)`, borderRadius: '32px 32px 0 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 60, height: 60,
                background: `rgba(${hexToRgb(career.color)}, 0.15)`,
                border: `2px solid rgba(${hexToRgb(career.color)}, 0.4)`,
                borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
                boxShadow: `0 0 20px rgba(${hexToRgb(career.color)}, 0.3)`,
              }}>{career.icon}</div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>{career.title}</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">{career.category}</span>
                  <span className="badge" style={{ background: `rgba(${hexToRgb(DEMAND_COLORS[career.demand] || '#10b981')},0.15)`, color: DEMAND_COLORS[career.demand] || '#10b981', border: `1px solid rgba(${hexToRgb(DEMAND_COLORS[career.demand] || '#10b981')},0.3)` }}>
                    <TrendingUp size={9} /> {career.demand} Demand
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                id={`modal-compare-${career.id}`}
                className={`btn btn-sm ${isCompared ? 'btn-primary' : 'btn-ghost'}`}
                onClick={onToggleCompare}
              >
                <GitCompare size={14} /> {isCompared ? 'Comparing' : 'Compare'}
              </button>
              <button id="modal-close" className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '6px 8px' }}>
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 32px', overflowY: 'auto', maxHeight: 'calc(85vh - 160px)' }}>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 24 }}>{career.description}</p>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '💰', label: 'Avg Salary', value: career.avgSalary },
              { icon: '📈', label: 'Growth Rate', value: career.growthRate },
              { icon: '🕒', label: 'Timeline', value: `${career.roadmapPhases.reduce((a, p) => a + parseInt(p.duration), 0)} months` },
            ].map((stat) => (
              <div key={stat.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{stat.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: 2 }}>{stat.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
              <Star size={12} style={{ marginRight: 6 }} />Core Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {career.skills.map((skill) => (
                <span key={skill} style={{
                  fontSize: '0.8rem', padding: '5px 12px',
                  background: `rgba(${hexToRgb(career.color)}, 0.1)`,
                  color: career.color, borderRadius: 'var(--radius-full)',
                  border: `1px solid rgba(${hexToRgb(career.color)}, 0.25)`,
                }}>{skill}</span>
              ))}
            </div>
          </div>

          {/* Roadmap phases preview */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
              <Clock size={12} style={{ marginRight: 6 }} />Learning Phases
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {career.roadmapPhases.map((phase, idx) => (
                <div key={idx} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: `rgba(${hexToRgb(career.color)},0.2)`,
                    border: `1.5px solid ${career.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: career.color,
                  }}>{idx + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{phase.phase}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{phase.duration}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{phase.tasks.slice(0, 3).join(' · ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
              <Award size={12} style={{ marginRight: 6 }} />Top Resources
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {career.resources.map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8,
                    textDecoration: 'none',
                    color: 'var(--color-text-primary)',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{res.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{res.type}</div>
                  </div>
                  <ExternalLink size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            id={`modal-roadmap-${career.id}`}
            className="btn btn-primary btn-lg"
            onClick={onGenerateRoadmap}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Sparkles size={18} /> Generate My AI Roadmap for {career.title}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '124,58,237';
}
