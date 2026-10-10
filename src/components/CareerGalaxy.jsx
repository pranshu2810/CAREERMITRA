import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Info, Plus, GitCompare, Sparkles, TrendingUp, X, Trash2, RotateCcw } from 'lucide-react';
import useStore from '../store/useStore';
import { CAREER_NODES, CAREER_EDGES, CATEGORIES, DEMAND_COLORS } from '../data/careers';
import CareerDetailModal from './CareerDetailModal';
import HoloCard from './HoloCard';
import { playHoverSound, playClickSound } from '../utils/soundFX';
import toast from 'react-hot-toast';

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

function getNodePosition(career, allList = []) {
  if (NODE_POS[career.id]) return NODE_POS[career.id];
  const customList = allList.filter((c) => !NODE_POS[c.id]);
  const customIdx = Math.max(0, customList.indexOf(career));
  const totalCustom = Math.max(1, customList.length);
  const angle = (customIdx / totalCustom) * Math.PI * 1.8 + Math.PI * 0.15;
  const rx = 440;
  const ry = 260;
  return {
    x: Math.round(CANVAS_W / 2 + Math.cos(angle) * rx),
    y: Math.round(CANVAS_H / 2 + Math.sin(angle) * ry),
  };
}

export default function CareerGalaxy() {
  const {
    galaxyFilter, setGalaxyFilter, searchQuery, setSearchQuery,
    comparedCareers, toggleCompare, setActiveView, setSelectedCareer,
    getAllCareers, addCustomCareer, soundEnabled,
    deleteCareer, deletedCareerIds, restoreDefaultCareers
  } = useStore();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [detailCareer, setDetailCareer] = useState(null);
  const [animated, setAnimated] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('engineering');
  const [newSalary, setNewSalary] = useState('$100k - $160k');
  const [newSkills, setNewSkills] = useState('');
  const [newMonths, setNewMonths] = useState(6);
  const svgRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const allCareers = getAllCareers();

  const filteredCareers = allCareers.filter((c) => {
    const matchCat = galaxyFilter === 'all' || c.category === galaxyFilter;
    const matchSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || (c.skills || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const filteredIds = filteredCareers.map((c) => c.id);

  const handleNodeClick = useCallback((career) => {
    setDetailCareer(career);
    setSelectedCareer(career);
  }, [setSelectedCareer]);

  const handleGenerateRoadmap = (career) => {
    setSelectedCareer(career);
    setDetailCareer(null);
    setActiveView('roadmap');
  };

  const handleDeleteCareer = (career, e) => {
    if (e) e.stopPropagation();
    if (!career) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${career.title}" from your Career Galaxy? You can restore it anytime.`
    );
    if (!confirmDelete) return;

    deleteCareer(career.id);
    if (detailCareer?.id === career.id) {
      setDetailCareer(null);
    }
    toast.success(`Deleted "${career.title}" from Career Galaxy`);
  };

  const handleCreateCustomCareer = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const skillList = newSkills.trim()
      ? newSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Core Fundamentals', 'Domain Principles', 'Applied Practice'];

    const created = addCustomCareer({
      title: newTitle.trim(),
      cluster: newCategory.toUpperCase(),
      category: newCategory,
      salaryRange: newSalary,
      avgSalary: newSalary,
      demand: 'High',
      growthRate: '+30%',
      avgMonths: Number(newMonths) || 6,
      skills: skillList,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewSkills('');
    setSelectedCareer(created);
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="btn-add-custom-career"
              className="btn btn-sm"
              onClick={() => setShowAddModal(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(236,72,153,0.3) 0%, rgba(124,58,237,0.3) 100%)',
                border: '1px solid rgba(236,72,153,0.5)',
                color: '#fbcfe8',
                fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Plus size={14} /> + Add Other Career
            </motion.button>
            {deletedCareerIds && deletedCareerIds.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                id="btn-restore-careers"
                className="btn btn-sm"
                onClick={() => {
                  restoreDefaultCareers();
                  toast.success('Restored all deleted career paths!');
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
                title="Restore all deleted careers"
              >
                <RotateCcw size={13} /> Restore Careers ({deletedCareerIds.length})
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 8 }}
        >
          {[
            { label: 'Career Paths', value: allCareers.length },
            { label: 'Skills Mapped', value: allCareers.reduce((a, c) => a + (c.skills?.length || 0), 0) },
            { label: 'AI Roadmap Ready', value: allCareers.length },
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
              {allCareers.map((c) => (
                <radialGradient key={`grd-${c.id}`} id={`grd-${c.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={c.color || '#ec4899'} stopOpacity="0.95" />
                  <stop offset="60%" stopColor={c.color || '#ec4899'} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={c.color || '#ec4899'} stopOpacity="0" />
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

            {/* Custom Career Constellation Edges */}
            {allCareers.filter((c) => !NODE_POS[c.id]).map((c, i) => {
              const pos = getNodePosition(c, allCareers);
              const center = { x: CANVAS_W / 2, y: CANVAS_H / 2 };
              const isHovered = hoveredNode === c.id;
              return (
                <line
                  key={`custom-edge-${c.id}`}
                  x1={pos.x} y1={pos.y}
                  x2={center.x} y2={center.y}
                  stroke={c.color || '#ec4899'}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeOpacity={isHovered ? 0.6 : 0.22}
                  strokeDasharray="4 5"
                />
              );
            })}

            {/* Career Nodes */}
            {allCareers.map((career, idx) => {
              const pos = getNodePosition(career, allCareers);
              if (!pos) return null;
              const isFiltered = filteredIds.includes(career.id);
              const isHovered = hoveredNode === career.id;
              const isCompared = comparedCareers.includes(career.id);
              const nodeR = 44;
              const glowR = isHovered ? 68 : 52;

              return (
                <motion.g
                  key={career.id}
                  id={`node-${career.id}`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => {
                    setHoveredNode(career.id);
                    playHoverSound(soundEnabled);
                  }}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    playClickSound(soundEnabled);
                    if (isFiltered) handleNodeClick(career);
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isFiltered ? 1 : 0.15, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {/* Outer glow halo */}
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={glowR}
                    fill={`url(#grd-${career.id})`}
                    animate={{ r: isHovered ? 70 : 52, opacity: isHovered ? 0.95 : 0.5 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Pulse ring */}
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={nodeR + 10}
                    fill="none"
                    stroke={career.color || '#7c3aed'}
                    strokeWidth={1}
                    strokeOpacity={0.35}
                    animate={{ r: [nodeR + 10, nodeR + 22, nodeR + 10], strokeOpacity: [0.35, 0.05, 0.35] }}
                    transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}
                  />
                  {/* Main node circle */}
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={nodeR}
                    fill={`rgba(${hexToRgb(career.color || '#7c3aed')}, 0.16)`}
                    stroke={career.color || '#7c3aed'}
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
                    {career.icon || '🚀'}
                  </text>
                  {/* Title label */}
                  <text
                    x={pos.x} y={pos.y + nodeR + 16}
                    textAnchor="middle"
                    fill={isFiltered ? (career.color || '#c4b5fd') : '#555'}
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
                        ↑ {career.demand || 'High'}
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
              const career = allCareers.find((c) => c.id === hoveredNode);
              const pos = career ? getNodePosition(career, allCareers) : null;
              if (!career || !pos) return null;
              const tipX = pos.x > CANVAS_W - 200 ? pos.x - 190 : pos.x + 58;
              const tipY = Math.max(20, Math.min(pos.y - 40, CANVAS_H - 140));
              return (
                <g>
                  <rect x={tipX - 8} y={tipY - 8} width={188} height={120} rx={10} fill="rgba(8,6,28,0.92)" stroke={career.color} strokeWidth={1} strokeOpacity={0.5} />
                  <text x={tipX} y={tipY + 10} fill={career.color} fontSize={12} fontWeight="700" fontFamily="var(--font-display)">{career.title}</text>
                  <text x={tipX} y={tipY + 28} fill="#a8a0cc" fontSize={10}>{career.category}</text>
                  <text x={tipX} y={tipY + 48} fill="#f0ecff" fontSize={10}>💰 {career.avgSalary || career.salaryRange || '$100k'}</text>
                  <text x={tipX} y={tipY + 64} fill="#f0ecff" fontSize={10}>📈 Growth: {career.growthRate || '+20%'}</text>
                  <text x={tipX} y={tipY + 82} fill="#a8a0cc" fontSize={9}>{(career.skills || []).slice(0, 3).join(' · ')}</text>
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
          {filteredCareers.map((career, idx) => (
            <CareerCard
              key={career.id}
              career={career}
              idx={idx}
              isCompared={comparedCareers.includes(career.id)}
              onToggleCompare={() => toggleCompare(career.id)}
              onClick={() => handleNodeClick(career)}
              onRoadmap={() => handleGenerateRoadmap(career)}
              onDelete={(c, e) => handleDeleteCareer(c || career, e)}
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
            onDelete={() => handleDeleteCareer(detailCareer)}
          />
        )}
      </AnimatePresence>

      {/* Modal: Add Other / Custom Career */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(3, 2, 12, 0.82)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="card card-glow"
              style={{
                width: '100%',
                maxWidth: 480,
                background: 'linear-gradient(135deg, rgba(16, 12, 38, 0.98) 0%, rgba(8, 6, 24, 0.99) 100%)',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                borderRadius: 20,
                padding: '30px 26px',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-ghost btn-sm"
                style={{ position: 'absolute', top: 16, right: 16, padding: 6, borderRadius: '50%' }}
              >
                <X size={18} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, margin: '0 auto 10px',
                  boxShadow: '0 0 20px rgba(236,72,153,0.5)',
                }}>
                  ✨
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
                  Add Custom Career Constellation
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Define your own custom career path and generate or build its roadmap.
                </p>
              </div>

              <form onSubmit={handleCreateCustomCareer} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                    Career Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Game Developer, Robotics Specialist, Quant Analyst"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                      borderRadius: 10, color: '#fff', fontSize: '0.88rem', outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                      Domain Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px',
                        background: '#120d2b', border: '1px solid rgba(124, 58, 237, 0.3)',
                        borderRadius: 10, color: '#fff', fontSize: '0.85rem', outline: 'none',
                      }}
                    >
                      <option value="engineering">Engineering</option>
                      <option value="data-ai">Data & AI</option>
                      <option value="design">Design</option>
                      <option value="product">Product</option>
                      <option value="security">Security</option>
                      <option value="other">Emerging Tech</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                      Target Timeline (Months)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={newMonths}
                      onChange={(e) => setNewMonths(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        borderRadius: 10, color: '#fff', fontSize: '0.88rem', outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                    Key Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. C++, Unreal Engine, Physics Simulation, Linear Algebra"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                      borderRadius: 10, color: '#fff', fontSize: '0.88rem', outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-ghost"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #ec4899, #7c3aed)',
                      fontWeight: 700,
                    }}
                  >
                    Create & Launch 🚀
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Career Card with 3D Holographic Perspective Tilt ──
function CareerCard({ career, idx, isCompared, onToggleCompare, onClick, onRoadmap, onDelete }) {
  return (
    <HoloCard
      glowColor={career.color || '#7c3aed'}
      onClick={onClick}
      style={{ padding: 24 }}
    >
      {/* Color accent top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${career.color || '#7c3aed'}, transparent)` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 48, height: 48,
            background: `rgba(${hexToRgb(career.color || '#7c3aed')}, 0.15)`,
            border: `1.5px solid rgba(${hexToRgb(career.color || '#7c3aed')}, 0.35)`,
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            boxShadow: `0 0 20px rgba(${hexToRgb(career.color || '#7c3aed')}, 0.25)`,
          }}>{career.icon || '🚀'}</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>{career.title}</div>
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
          <button id={`info-${career.id}`} className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onClick(); }} style={{ padding: '5px 8px' }}>
            <Info size={13} />
          </button>
          {onDelete && (
            <button
              id={`delete-${career.id}`}
              className="btn btn-ghost btn-sm"
              onClick={(e) => { e.stopPropagation(); onDelete(career, e); }}
              title={`Delete ${career.title} from galaxy`}
              style={{
                padding: '5px 8px',
                color: 'rgba(244, 63, 94, 0.75)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f43f5e';
                e.currentTarget.style.background = 'rgba(244, 63, 94, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(244, 63, 94, 0.75)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: 16 }}>{career.description || career.tagline}</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginBottom: 3, letterSpacing: '0.04em' }}>💰 AVG SALARY</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{career.avgSalary || career.salaryRange || '$110k'}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginBottom: 3, letterSpacing: '0.04em' }}>📈 GROWTH</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: DEMAND_COLORS[career.demand] || '#10b981' }}>{career.growthRate || '+24%'}</div>
        </div>
      </div>

      {/* Skills chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {(career.skills || []).slice(0, 5).map((skill) => (
          <span key={skill} style={{
            fontSize: '0.7rem', padding: '3px 10px',
            background: `rgba(${hexToRgb(career.color || '#7c3aed')}, 0.1)`,
            color: career.color || '#c4b5fd', borderRadius: 'var(--radius-full)',
            border: `1px solid rgba(${hexToRgb(career.color || '#7c3aed')}, 0.25)`,
            fontWeight: 500,
          }}>{skill}</span>
        ))}
        {(career.skills || []).length > 5 && (
          <span style={{ fontSize: '0.7rem', padding: '3px 10px', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)', borderRadius: 'var(--radius-full)' }}>
            +{(career.skills || []).length - 5}
          </span>
        )}
      </div>

      <button
        id={`roadmap-${career.id}`}
        className="btn btn-primary"
        onClick={(e) => { e.stopPropagation(); onRoadmap(); }}
        style={{
          width: '100%',
          justifyContent: 'center',
          boxShadow: `0 4px 20px ${career.color || '#7c3aed'}35`,
        }}
      >
        <Sparkles size={15} /> Generate AI Roadmap
      </button>
    </HoloCard>
  );
}

// hex color to "r,g,b" string helper
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '124,58,237';
}
