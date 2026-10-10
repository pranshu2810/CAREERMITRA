import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, RefreshCw, Download, Share2, Save, Clock, Target,
  CheckCircle2, Circle, ChevronDown, ChevronRight, AlertCircle,
  RotateCcw, ExternalLink, TrendingUp, Zap, BookOpen, Calendar,
  Edit3, Plus, Trash2
} from 'lucide-react';
import useStore from '../store/useStore';
import { generateRoadmap, replanRoadmap } from '../utils/roadmapAPI';
import { CAREER_NODES } from '../data/careers';
import toast from 'react-hot-toast';
import { exportRoadmapPDF } from '../utils/exportUtils';

export default function RoadmapView() {
  const {
    selectedCareer, userProfile, activeRoadmap, setActiveRoadmap,
    savedRoadmaps, saveRoadmap, progress, toggleTask, getCareerProgress,
    isGenerating, setIsGenerating, generationError, setGenerationError,
    notes, setNote, getAllCareers,
    addPhaseToRoadmap, removePhaseFromRoadmap,
    addTaskToRoadmapPhase, removeTaskFromRoadmapPhase,
  } = useStore();

  const [expandedPhase, setExpandedPhase] = useState(0);
  const [showReplan, setShowReplan] = useState(false);
  const [newTimeline, setNewTimeline] = useState(12);
  const [localNote, setLocalNote] = useState('');
  const [builderMode, setBuilderMode] = useState(false);
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [newPhaseTitle, setNewPhaseTitle] = useState('');
  const [newPhaseDesc, setNewPhaseDesc] = useState('');
  const [taskInputs, setTaskInputs] = useState({}); // { [phaseIdx]: { title: '', hours: 15 } }

  const allCareers = getAllCareers();
  const career = selectedCareer || (activeRoadmap ? allCareers.find((c) => c.id === activeRoadmap.careerId) : null) || allCareers[0];

  useEffect(() => {
    if (career && notes[career.id]) setLocalNote(notes[career.id]);
  }, [career?.id]);

  // Auto-generate if career changed and no roadmap
  useEffect(() => {
    if (career && (!activeRoadmap || activeRoadmap.careerId !== career.id)) {
      handleGenerate();
    }
  }, [career?.id]);

  const handleGenerate = async () => {
    if (!career) return;
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const roadmap = await generateRoadmap({
        careerId: career.id,
        career,
        userProfile,
        existingSkills: userProfile?.skills || [],
        timelineMonths: userProfile?.timelineMonths || 12,
      });
      setActiveRoadmap(roadmap);
      toast.success('🚀 Roadmap generated!', { style: { background: '#0e0a2e', color: '#f0ecff', border: '1px solid rgba(124,58,237,0.4)' } });
    } catch (err) {
      setGenerationError(err.message);
      toast.error('Generation failed. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddManualPhase = (e) => {
    e.preventDefault();
    if (!newPhaseTitle.trim()) return;
    addPhaseToRoadmap(newPhaseTitle.trim(), newPhaseDesc.trim() || 'Milestone phase focus');
    setNewPhaseTitle('');
    setNewPhaseDesc('');
    setShowAddPhase(false);
    toast.success('✨ New milestone phase added!');
  };

  const handleAddManualTask = (phaseIdx) => {
    const input = taskInputs[phaseIdx];
    if (!input || !input.title?.trim()) {
      toast.error('Please enter a milestone title');
      return;
    }
    addTaskToRoadmapPhase(phaseIdx, input.title.trim(), Number(input.hours) || 15);
    setTaskInputs({ ...taskInputs, [phaseIdx]: { title: '', hours: 15 } });
    toast.success('Added milestone task!');
  };

  const handleReplan = async () => {
    if (!activeRoadmap) return;
    setIsGenerating(true);
    try {
      const completedPhases = activeRoadmap.phases
        .map((p, i) => ({ i, done: p.tasks.every((t) => progress[activeRoadmap.careerId]?.[i]?.[activeRoadmap.phases[i].tasks.indexOf(t)] || false) }))
        .filter((x) => x.done)
        .map((x) => x.i);
      const updated = await replanRoadmap({
        existingRoadmap: activeRoadmap,
        completedPhases,
        updatedSkills: userProfile?.skills || [],
        newTimeline,
      });
      setActiveRoadmap(updated);
      setShowReplan(false);
      toast.success('📅 Roadmap replanned!');
    } catch (err) {
      toast.error('Replanning failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!activeRoadmap) return;
    saveRoadmap(activeRoadmap);
    toast.success('💾 Roadmap saved!');
  };

  const handleExport = async () => {
    if (!activeRoadmap || !career) return;
    try {
      await exportRoadmapPDF(activeRoadmap, career);
      toast.success('📄 PDF exported!');
    } catch {
      toast.error('Export failed.');
    }
  };

  const handleShare = () => {
    const text = `Check out my AI-generated career roadmap for ${career?.title} on CareerMitra! 🚀`;
    if (navigator.share) {
      navigator.share({ title: 'CareerMitra Roadmap', text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('📋 Link copied to clipboard!');
    }
  };

  const handleNoteBlur = () => {
    if (career) setNote(career.id, localNote);
  };

  // ── No career selected ──
  if (!career) {
    return (
      <div style={{ paddingTop: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🗺️</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>No Career Selected</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Visit the Galaxy view, click a career node, and generate your personalized AI roadmap.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CAREER_NODES.slice(0, 4).map((c) => (
              <button key={c.id} className="btn btn-ghost" onClick={() => useStore.getState().setSelectedCareer(c)} style={{ justifyContent: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span> {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const overallProgress = getCareerProgress(career.id);
  const isSaved = savedRoadmaps.some((r) => r.careerId === career.id);

  return (
    <div style={{ paddingTop: 88, minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 32 }}>{career.icon}</span>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, lineHeight: 1.1 }}>
                    <span className="text-gradient">{career.title}</span>
                  </h1>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    AI-Generated Career Roadmap {activeRoadmap ? `· ${activeRoadmap.skillMatch}% skill match` : ''}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                id="roadmap-mode-toggle"
                className={`btn btn-sm ${builderMode ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setBuilderMode(!builderMode)}
                style={{
                  border: builderMode ? '1px solid #7c3aed' : '1px solid rgba(124,58,237,0.3)',
                  gap: 6,
                }}
              >
                {builderMode ? <Sparkles size={14} /> : <Edit3 size={14} />}
                {builderMode ? 'Switch to AI View' : '✍️ Edit Manually / Builder'}
              </button>
              <button id="roadmap-replan" className="btn btn-ghost btn-sm" onClick={() => setShowReplan(!showReplan)}>
                <RotateCcw size={14} /> Replan
              </button>
              <button id="roadmap-regenerate" className="btn btn-ghost btn-sm" onClick={handleGenerate} disabled={isGenerating}>
                <RefreshCw size={14} style={{ animation: isGenerating ? 'spin 0.8s linear infinite' : 'none' }} /> Regenerate
              </button>
              <button id="roadmap-save" className="btn btn-ghost btn-sm" onClick={handleSave}>
                <Save size={14} /> {isSaved ? 'Saved ✓' : 'Save'}
              </button>
              <button id="roadmap-export" className="btn btn-ghost btn-sm" onClick={handleExport}>
                <Download size={14} /> Export PDF
              </button>
              <button id="roadmap-share" className="btn btn-accent btn-sm" onClick={handleShare}>
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>

          {/* Overall progress */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Overall Progress</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary-glow)' }}>{overallProgress}%</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </motion.div>

        {/* Replan Panel */}
        <AnimatePresence>
          {showReplan && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-card"
              style={{ marginBottom: 24, padding: 24, overflow: 'hidden' }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16 }}>🔄 Dynamic Replan</h3>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: 8 }}>
                    New Timeline (months)
                  </label>
                  <input
                    id="replan-timeline"
                    type="range" min={3} max={24} value={newTimeline}
                    onChange={(e) => setNewTimeline(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-primary-glow)' }}
                  />
                  <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-glow)', marginTop: 4 }}>{newTimeline} months</div>
                </div>
                <button id="replan-submit" className="btn btn-primary" onClick={handleReplan} disabled={isGenerating}>
                  <Zap size={14} /> Apply Replan
                </button>
                <button id="replan-cancel" className="btn btn-ghost" onClick={() => setShowReplan(false)}>Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isGenerating && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ width: 60, height: 60, margin: '0 auto 20px', fontSize: 36 }}
            >
              🧠
            </motion.div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>AI is crafting your roadmap…</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Analyzing skill gaps · Personalizing phases · Optimizing timeline</div>
          </div>
        )}

        {/* Error State */}
        {generationError && !isGenerating && (
          <div className="glass-card" style={{ padding: 24, marginBottom: 24, borderColor: 'rgba(244,63,94,0.3)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <AlertCircle color="#f43f5e" size={20} />
            <div>
              <div style={{ fontWeight: 600 }}>Generation Error</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{generationError}</div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleGenerate} style={{ marginLeft: 'auto' }}>Retry</button>
          </div>
        )}

        {/* Roadmap Content */}
        {!isGenerating && activeRoadmap && activeRoadmap.careerId === career?.id && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {builderMode ? (
              /* ================= MANUAL / CUSTOM ROADMAP BUILDER ================= */
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(124, 58, 237, 0.08)',
                  border: '1.5px dashed rgba(124, 58, 237, 0.4)',
                  borderRadius: 18,
                  padding: 24,
                  marginBottom: 28,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                      ✍️ Manual Roadmap Builder
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                      Create and customize your milestones manually. Check off tasks to track progress in real-time.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setShowAddPhase(true)}
                      style={{ gap: 6 }}
                    >
                      <Plus size={15} /> + Add Phase
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleSave}
                      style={{ gap: 6 }}
                    >
                      <Save size={15} /> Save Roadmap
                    </button>
                  </div>
                </div>

                {/* List of Phases to Edit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {activeRoadmap?.phases?.map((phase, pIdx) => (
                    <div
                      key={pIdx}
                      style={{
                        background: 'rgba(16, 12, 38, 0.85)',
                        border: '1px solid rgba(124, 58, 237, 0.25)',
                        borderRadius: 14,
                        padding: '18px 20px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: 6,
                            background: 'rgba(124, 58, 237, 0.3)', color: '#c4b5fd',
                            fontSize: '0.75rem', fontWeight: 700,
                          }}>
                            Phase {pIdx + 1}
                          </span>
                          <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                            {phase.phase || phase.title}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            ({phase.duration || '2 months'})
                          </span>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => removePhaseFromRoadmap(pIdx)}
                          title="Delete Phase"
                          style={{ color: '#f43f5e', padding: 6 }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Tasks under this phase */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        {(phase.tasks || []).map((task, tIdx) => {
                          const taskTitle = typeof task === 'object' ? task.title : task;
                          const taskHours = typeof task === 'object' ? (task.hours || task.estimatedHours || 15) : 15;
                          const isDone = !!progress[career.id]?.[pIdx]?.[tIdx];

                          return (
                            <div
                              key={tIdx}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '8px 12px', borderRadius: 8,
                                background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                                border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)'}`,
                              }}
                            >
                              <div
                                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}
                                onClick={() => toggleTask(career.id, pIdx, tIdx, taskTitle)}
                              >
                                {isDone
                                  ? <CheckCircle2 size={16} color="#10b981" />
                                  : <Circle size={16} color="var(--color-text-muted)" />
                                }
                                <span style={{
                                  fontSize: '0.86rem',
                                  color: isDone ? 'var(--color-text-muted)' : '#f0ecff',
                                  textDecoration: isDone ? 'line-through' : 'none',
                                }}>
                                  {taskTitle}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: '0.74rem', color: '#c4b5fd' }}>~{taskHours}h</span>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => removeTaskFromRoadmapPhase(pIdx, tIdx)}
                                  style={{ padding: 4, color: 'var(--color-text-muted)' }}
                                  title="Delete Task"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add task quick row */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          placeholder="Add new milestone task..."
                          value={taskInputs[pIdx]?.title || ''}
                          onChange={(e) => setTaskInputs({
                            ...taskInputs,
                            [pIdx]: { ...taskInputs[pIdx], title: e.target.value, hours: taskInputs[pIdx]?.hours || 15 }
                          })}
                          style={{
                            flex: 1, padding: '7px 12px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(124, 58, 237, 0.25)',
                            borderRadius: 8, color: '#fff', fontSize: '0.82rem', outline: 'none',
                          }}
                        />
                        <input
                          type="number"
                          placeholder="Hours"
                          value={taskInputs[pIdx]?.hours || 15}
                          onChange={(e) => setTaskInputs({
                            ...taskInputs,
                            [pIdx]: { ...taskInputs[pIdx], hours: e.target.value }
                          })}
                          style={{
                            width: 70, padding: '7px 8px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(124, 58, 237, 0.25)',
                            borderRadius: 8, color: '#fff', fontSize: '0.82rem', outline: 'none',
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleAddManualTask(pIdx)}
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                          <Plus size={13} /> Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Phase Form */}
                {showAddPhase && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleAddManualPhase}
                    style={{
                      marginTop: 16, padding: 18, borderRadius: 12,
                      background: 'rgba(124, 58, 237, 0.15)',
                      border: '1px solid rgba(124, 58, 237, 0.35)',
                      display: 'flex', flexDirection: 'column', gap: 10,
                    }}
                  >
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>+ New Milestone Phase</h4>
                    <input
                      type="text"
                      required
                      placeholder="Phase Title (e.g. Advanced System Architecture)"
                      value={newPhaseTitle}
                      onChange={(e) => setNewPhaseTitle(e.target.value)}
                      style={{
                        padding: '8px 12px', background: '#120d2b',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        borderRadius: 8, color: '#fff', fontSize: '0.84rem', outline: 'none',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Duration & description (e.g. 2 months · Deep dive into scale)"
                      value={newPhaseDesc}
                      onChange={(e) => setNewPhaseDesc(e.target.value)}
                      style={{
                        padding: '8px 12px', background: '#120d2b',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        borderRadius: 8, color: '#fff', fontSize: '0.84rem', outline: 'none',
                      }}
                    />
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddPhase(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary btn-sm">
                        Confirm Phase
                      </button>
                    </div>
                  </motion.form>
                )}
              </motion.div>
            ) : (
              /* ================= AI GUIDED ROADMAP VIEW ================= */
              <>
                {/* AI Summary Card */}
                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: 24, marginBottom: 24,
                    background: `linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.06) 100%)`,
                    borderColor: 'rgba(124,58,237,0.3)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <Sparkles size={20} color="#c4b5fd" />
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1rem' }}>AI Insights</span>
                    <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>Skill Match: {activeRoadmap.skillMatch}%</span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>{activeRoadmap.aiSummary}</p>

                  {/* Recommendations */}
                  {activeRoadmap.recommendations && (
                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {activeRoadmap.recommendations.map((rec, i) => (
                        <div key={i} style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', padding: '6px 0', borderTop: i === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingTop: i === 0 ? 12 : undefined }}>
                          {rec}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            )}

            {/* Phases */}
            {!builderMode && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                {activeRoadmap.phases.map((phase, phaseIdx) => {
                  const careerProg = progress[career.id] || {};
                  const phaseProg = careerProg[phaseIdx] || {};
                  const completedTasks = phase.tasks.filter((_, tIdx) => phaseProg[tIdx]).length;
                  const phaseProgress = Math.round((completedTasks / phase.tasks.length) * 100);
                  const isExpanded = expandedPhase === phaseIdx;

                  return (
                    <motion.div
                      key={phaseIdx}
                      className="glass-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: phaseIdx * 0.1 }}
                      style={{ overflow: 'hidden' }}
                    >
                      {/* Phase header */}
                      <div
                        onClick={() => setExpandedPhase(isExpanded ? -1 : phaseIdx)}
                        style={{
                          padding: '20px 24px',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 16,
                          userSelect: 'none',
                        }}
                      >
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                          background: phaseProgress === 100 ? 'rgba(16,185,129,0.2)' : 'rgba(124,58,237,0.15)',
                          border: `2px solid ${phaseProgress === 100 ? '#10b981' : career.color}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.85rem', fontWeight: 700,
                          color: phaseProgress === 100 ? '#10b981' : career.color,
                        }}>
                          {phaseProgress === 100 ? <CheckCircle2 size={18} /> : phaseIdx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>Phase {phaseIdx + 1}: {phase.phase || phase.title}</span>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={12} /> {phase.duration || '2 months'}
                              </span>
                              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: phaseProgress === 100 ? '#10b981' : 'var(--color-primary-glow)' }}>{phaseProgress}%</span>
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>
                          </div>
                          <div className="progress-bar" style={{ height: 4 }}>
                            <div className="progress-fill" style={{ width: `${phaseProgress}%`, background: phaseProgress === 100 ? 'var(--grad-emerald)' : 'var(--grad-primary)' }} />
                          </div>
                        </div>
                      </div>

                      {/* Expanded phase body */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ borderTop: '1px solid var(--color-border)', padding: '16px 24px 20px' }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                              {phase.tasks.map((task, taskIdx) => {
                                const taskObj = typeof task === 'object' ? task : { title: task, priority: 'learn', estimatedHours: 15 };
                                const isDone = !!phaseProg[taskIdx];
                                return (
                                  <motion.div
                                    key={taskIdx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: taskIdx * 0.04 }}
                                    onClick={() => toggleTask(career.id, phaseIdx, taskIdx, taskObj.title || taskObj)}
                                    style={{
                                      display: 'flex', gap: 12, alignItems: 'center',
                                      padding: '10px 14px',
                                      background: isDone ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                                      border: `1px solid ${isDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}`,
                                      borderRadius: 10,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => { if (!isDone) e.currentTarget.style.background = 'rgba(124,58,237,0.06)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = isDone ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)'; }}
                                  >
                                    {isDone
                                      ? <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
                                      : <Circle size={18} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
                                    }
                                    <div style={{ flex: 1 }}>
                                      <span style={{
                                        fontSize: '0.88rem',
                                        color: isDone ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        fontWeight: isDone ? 400 : 500,
                                      }}>{taskObj.title || taskObj}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                                      {taskObj.priority && (
                                        <span className={`badge ${taskObj.priority === 'review' ? 'badge-gold' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                                          {taskObj.priority}
                                        </span>
                                      )}
                                      {taskObj.estimatedHours && (
                                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>~{taskObj.estimatedHours}h</span>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Weekly Plan */}
            {activeRoadmap.weeklyPlan && (
              <motion.div className="glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }} style={{ padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Calendar size={16} color="var(--color-accent)" /> Weekly Schedule
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {activeRoadmap.weeklyPlan.map((week, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>Week {week.startWeek}–{week.endWeek}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{week.phase}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{week.focus}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-accent)', marginTop: 6 }}>~{week.hoursPerWeek}h/week</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Notes */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                📝 My Notes
              </h3>
              <textarea
                id="roadmap-notes"
                className="form-input"
                rows={4}
                placeholder="Jot down ideas, track barriers, set mini-goals…"
                value={localNote}
                onChange={(e) => setLocalNote(e.target.value)}
                onBlur={handleNoteBlur}
                style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.7 }}
              />
            </div>

            {/* Alternative Paths */}
            {activeRoadmap.alternativePaths?.length > 0 && (
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <TrendingUp size={16} /> Alternative Paths
                </h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  {activeRoadmap.alternativePaths.map((path) => (
                    <div key={path.id} style={{
                      flex: 1, padding: '14px 18px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12,
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{path.icon}</div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{path.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{path.reason}</div>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ marginTop: 10, width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                        onClick={() => { useStore.getState().setSelectedCareer(CAREER_NODES.find((c) => c.id === path.id)); }}
                      >
                        Explore Path →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
