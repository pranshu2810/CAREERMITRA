import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Info, Plus, GitCompare, Sparkles, TrendingUp, X } from 'lucide-react';
import useStore from '../store/useStore';
import { CAREER_NODES, CAREER_EDGES, CATEGORIES, DEMAND_COLORS } from '../data/careers';
import CareerDetailModal from './CareerDetailModal';

const CANVAS_W = 1100;
const CANVAS_H = 720;

// Galaxy node positions (laid out in space)
const NODE_POS = {
  'swe':            { x: 300, y: 200 },
  'data-scientist': { x: 620, y: 140 },
  'ux-designer':    { x: 900, y: 210 },
  'product-manager':{ x: 800, y: 460 },
  'ai-researcher':  { x: 480, y: 460 },
  'devops':         { x: 160, y: 420 },
  'cybersecurity':  { x: 210, y: 620 },
  'mlops':          { x: 560, y: 620 },
  'frontend':       { x: 730, y: 330 },
  'fullstack':      { x: 420, y: 310 },
};

export default function CareerGalaxy() {
  const { galaxyFilter, setGalaxyFilter, searchQuery, setSearchQuery, comparedCareers, toggleCompare, setActiveView, setSelectedCareer } = useStore();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [detailCareer, setDetailCareer] = useState(null);
  const [animated, setAnimated] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const filteredIds = CAREER_NODES.filter((c) => {
    const matchCat = galaxyFilter === 'all' || c.category === galaxyFilter;
    const matchSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  }).map((c) => c.id);

  const handleNodeClick = useCallback((career) => {
    setDetailCareer(career);
    setSelectedCareer(career);
  }, [setSelectedCareer]);

  const handleGenerateRoadmap = (career) => {
    setSelectedCareer(career);
    setDetailCareer(null);
    setActiveView('roadmap');
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', paddingTop: 88 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '32px 24px 16px' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="badge badge-primary" style={{ marginBottom: 16 }}>
            <Sparkles size={10} /> Career Intelligence Platform
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 12 }}
        >
          <span className="text-gradient">Navigate Your</span>
          <br />
          <span style={{ color: 'var(--color-text-primary)' }}>Career Galaxy</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto 28px' }}
        >
          Explore 10+ tech career paths. Click any star to get an AI-generated roadmap personalized to your skills.
        </motion.p>

        {/* Search + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}
        >
          <div style={{ position: 'relative', maxWidth: 320, width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              id="galaxy-search"
              className="form-input"
              style={{ paddingLeft: 40 }}
              placeholder="Search careers or skills…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                id={`filter-${cat.id}`}
                className={`btn btn-sm ${galaxyFilter === cat.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setGalaxyFilter(cat.id)}
              >
                {cat.icon} {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 8 }}
        >
          {[
            { label: 'Career Paths', value: CAREER_NODES.length },
            { label: 'Skills Mapped', value: CAREER_NODES.reduce((a, c) => a + c.skills.length, 0) },
            { label: 'AI Roadmap Ready', value: '10' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stat.value}+
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Galaxy SVG Canvas */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 24px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '100%',
          maxWidth: CANVAS_W,
          background: 'rgba(8, 6, 28, 0.5)',
          borderRadius: 28,
          border: '1px solid rgba(124,58,237,0.2)',
          overflow: 'hidden',
          boxShadow: '0 20px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            style={{ width: '100%', display: 'block' }}
          >
            <defs>
              {CAREER_NODES.map((c) => (
                <radialGradient key={`grd-${c.id}`} id={`grd-${c.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={c.color} stopOpacity="0.9" />
                  <stop offset="60%" stopColor={c.color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={c.color} stopOpacity="0" />
                </radialGradient>
              ))}
              <filter id="glow-blur">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="node-glow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Nebula background blobs */}
            {[
              { cx: 300, cy: 300, r: 200, color: 'rgba(124,58,237,0.06)' },
              { cx: 700, cy: 250, r: 180, color: 'rgba(6,182,212,0.05)' },
              { cx: 500, cy: 550, r: 160, color: 'rgba(168,85,247,0.04)' },
            ].map((blob, i) => (
              <circle key={i} cx={blob.cx} cy={blob.cy} r={blob.r} fill={blob.color} />
            ))}

            {/* Edges */}
            {CAREER_EDGES.map((edge, idx) => {
              const src = NODE_POS[edge.source];
              const tgt = NODE_POS[edge.target];
              if (!src || !tgt) return null;
              const srcCareer = CAREER_NODES.find((c) => c.id === edge.source);
              const isVisible = filteredIds.includes(edge.source) && filteredIds.includes(edge.target);
              const isHovered = hoveredNode === edge.source || hoveredNode === edge.target;
              return (
                <motion.line
                  key={edge.id}
                  x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  stroke={srcCareer?.color || '#7c3aed'}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeOpacity={isVisible ? (isHovered ? 0.6 : 0.18 * edge.strength) : 0.03}
                  strokeDasharray="4 6"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isVisible ? 1 : 0.2 }}
                  transition={{ duration: 1.2, delay: idx * 0.05 }}
                />
              );
            })}

            {/* Career Nodes */}
            {CAREER_NODES.map((career, idx) => {
              const pos = NODE_POS[career.id];
              if (!pos) return null;
              const isFiltered = filteredIds.includes(career.id);
              const isHovered = hoveredNode === career.id;
              const isCompared = comparedCareers.includes(career.id);
              const nodeR = 44;
              const glowR = isHovered ? 65 : 52;

              return (
                <motion.g
                  key={career.id}
                  id={`node-${career.id}`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredNode(career.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => isFiltered && handleNodeClick(career)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isFiltered ? 1 : 0.15, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {/* Outer glow halo */}
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={glowR}
                    fill={`url(#grd-${career.id})`}
                    animate={{ r: isHovered ? 68 : 52, opacity: isHovered ? 0.9 : 0.5 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Pulse ring */}
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={nodeR + 10}
                    fill="none"
                    stroke={career.color}
                    strokeWidth={1}
                    strokeOpacity={0.35}
                    animate={{ r: [nodeR + 10, nodeR + 22, nodeR + 10], strokeOpacity: [0.35, 0.05, 0.35] }}
                    transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}
                  />
                  {/* Main node circle */}
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={nodeR}
                    fill={`rgba(${hexToRgb(career.color)}, 0.15)`}
                    stroke={career.color}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    filter="url(#node-glow)"
                    animate={{ r: isHovered ? 50 : nodeR }}
                    transition={{ duration: 0.25 }}
                  />
                  {/* Icon */}
                  <text
                    x={pos.x} y={pos.y - 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isHovered ? 26 : 22}
                    style={{ userSelect: 'none', transition: 'font-size 0.2s' }}
                  >
                    {career.icon}
                  </text>
                  {/* Title label */}
                  <text
                    x={pos.x} y={pos.y + nodeR + 16}
                    textAnchor="middle"
                    fill={isFiltered ? career.color : '#555'}
                    fontSize={11}
                    fontWeight={isHovered ? '700' : '500'}
                    fontFamily="var(--font-display)"
                    style={{ userSelect: 'none' }}
                  >
                    {career.title.length > 18 ? career.title.slice(0, 16) + '…' : career.title}
                  </text>
                  {/* Demand badge */}
                  {isHovered && (
                    <g>
                      <rect x={pos.x - 34} y={pos.y + nodeR + 28} width={68} height={16} rx={8} fill={DEMAND_COLORS[career.demand] || '#10b981'} fillOpacity={0.2} />
                      <text x={pos.x} y={pos.y + nodeR + 40} textAnchor="middle" fill={DEMAND_COLORS[career.demand] || '#10b981'} fontSize={9} fontWeight="600">
                        ↑ {career.demand}
                      </text>
                    </g>
                  )}
                  {/* Comparison badge */}
                  {isCompared && (
                    <circle cx={pos.x + 35} cy={pos.y - 32} r={8} fill="#7c3aed" stroke="#c4b5fd" strokeWidth={1.5} />
                  )}
                </motion.g>
              );
            })}

            {/* Hover tooltip */}
            {hoveredNode && (() => {
              const career = CAREER_NODES.find((c) => c.id === hoveredNode);
              const pos = NODE_POS[hoveredNode];
              if (!career || !pos) return null;
              const tipX = pos.x > CANVAS_W - 200 ? pos.x - 190 : pos.x + 58;
              const tipY = Math.max(20, Math.min(pos.y - 40, CANVAS_H - 140));
              return (
                <g>
                  <rect x={tipX - 8} y={tipY - 8} width={188} height={120} rx={10} fill="rgba(8,6,28,0.92)" stroke={career.color} strokeWidth={1} strokeOpacity={0.5} />
                  <text x={tipX} y={tipY + 10} fill={career.color} fontSize={12} fontWeight="700" fontFamily="var(--font-display)">{career.title}</text>
                  <text x={tipX} y={tipY + 28} fill="#a8a0cc" fontSize={10}>{career.category}</text>
                  <text x={tipX} y={tipY + 48} fill="#f0ecff" fontSize={10}>💰 {career.avgSalary}</text>
                  <text x={tipX} y={tipY + 64} fill="#f0ecff" fontSize={10}>📈 Growth: {career.growthRate}</text>
                  <text x={tipX} y={tipY + 82} fill="#a8a0cc" fontSize={9}>{career.skills.slice(0, 3).join(' · ')}</text>
                  <rect x={tipX} y={tipY + 96} width={172} height={16} rx={8} fill={career.color} fillOpacity={0.2} />
                  <text x={tipX + 86} y={tipY + 108} textAnchor="middle" fill={career.color} fontSize={9} fontWeight="600">Click to explore →</text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Career Cards Grid below galaxy */}
      <div className="container" style={{ paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
          {CAREER_NODES.filter((c) => filteredIds.includes(c.id)).map((career, idx) => (
            <CareerCard
              key={career.id}
              career={career}
              idx={idx}
              isCompared={comparedCareers.includes(career.id)}
              onToggleCompare={() => toggleCompare(career.id)}
              onClick={() => handleNodeClick(career)}
              onRoadmap={() => handleGenerateRoadmap(career)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailCareer && (
          <CareerDetailModal
            career={detailCareer}
            onClose={() => setDetailCareer(null)}
            onGenerateRoadmap={() => handleGenerateRoadmap(detailCareer)}
            isCompared={comparedCareers.includes(detailCareer.id)}
            onToggleCompare={() => toggleCompare(detailCareer.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Career Card ──
function CareerCard({ career, idx, isCompared, onToggleCompare, onClick, onRoadmap }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 + 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      className="glass-card"
      style={{ padding: 24, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
    >
      {/* Color accent top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${career.color}, transparent)` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 48, height: 48,
            background: `rgba(${hexToRgb(career.color)}, 0.15)`,
            border: `1.5px solid rgba(${hexToRgb(career.color)}, 0.35)`,
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>{career.icon}</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>{career.title}</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{career.category}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            id={`compare-${career.id}`}
            className="btn btn-ghost btn-sm"
            onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
            style={{ border: isCompared ? `1px solid ${career.color}` : undefined, color: isCompared ? career.color : undefined, padding: '5px 8px' }}
          >
            <GitCompare size={13} />
          </button>
          <button id={`info-${career.id}`} className="btn btn-ghost btn-sm" onClick={onClick} style={{ padding: '5px 8px' }}>
            <Info size={13} />
          </button>
        </div>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: 16 }}>{career.description}</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginBottom: 3 }}>💰 AVG SALARY</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{career.avgSalary}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginBottom: 3 }}>📈 GROWTH</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: DEMAND_COLORS[career.demand] || '#10b981' }}>{career.growthRate}</div>
        </div>
      </div>

      {/* Skills chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {career.skills.slice(0, 5).map((skill) => (
          <span key={skill} style={{
            fontSize: '0.7rem', padding: '3px 10px',
            background: `rgba(${hexToRgb(career.color)}, 0.1)`,
            color: career.color, borderRadius: 'var(--radius-full)',
            border: `1px solid rgba(${hexToRgb(career.color)}, 0.25)`,
          }}>{skill}</span>
        ))}
        {career.skills.length > 5 && (
          <span style={{ fontSize: '0.7rem', padding: '3px 10px', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)', borderRadius: 'var(--radius-full)' }}>
            +{career.skills.length - 5}
          </span>
        )}
      </div>

      <button
        id={`roadmap-${career.id}`}
        className="btn btn-primary"
        onClick={(e) => { e.stopPropagation(); onRoadmap(); }}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <Sparkles size={15} /> Generate AI Roadmap
      </button>
    </motion.div>
  );
}

// hex color to "r,g,b" string helper
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '124,58,237';
}
