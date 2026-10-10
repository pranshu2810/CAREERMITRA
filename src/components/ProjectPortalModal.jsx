import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, Circle, Sparkles, ExternalLink, Copy, Check,
  Clock, Layers, ShieldCheck, Target, Award, Rocket, FileText, ChevronRight
} from 'lucide-react';
import useStore from '../store/useStore';
import { playClickSound, playTaskCompleteSound, playLevelUpSound } from '../utils/soundFX';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function ProjectPortalModal({ project, career, onClose }) {
  const {
    projectProgress, toggleProjectMilestone, setProjectStatus,
    soundEnabled, user
  } = useStore();

  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'overview' | 'resume'
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (!project) return null;

  const careerId = career?.id || 'swe';
  const progressData = projectProgress?.[careerId]?.[project.id] || { started: false, completed: false, completedMilestones: [] };
  const completedMilestones = progressData.completedMilestones || [];
  const isCompleted = progressData.completed;

  const totalMilestones = project.milestones?.length || 5;
  const milestonePercent = Math.round((completedMilestones.length / totalMilestones) * 100);

  const handleToggleMilestone = (idx) => {
    toggleProjectMilestone(careerId, project.id, idx);
    const wasCompleted = completedMilestones.includes(idx);
    if (!wasCompleted) {
      playTaskCompleteSound(soundEnabled);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#7c3aed', '#06b6d4', '#10b981'],
      });
      toast.success(`Milestone ${idx + 1} completed! +30 XP ⚡`);
    } else {
      playClickSound(soundEnabled);
    }
  };

  const handleMarkProjectComplete = () => {
    const nextState = !isCompleted;
    setProjectStatus(careerId, project.id, nextState);
    if (nextState) {
      playLevelUpSound(soundEnabled);
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#7c3aed', '#06b6d4', '#f59e0b', '#10b981'],
      });
      toast.success('🏆 Capstone Project Completed! +120 XP awarded!');
    } else {
      playClickSound(soundEnabled);
      toast('Project reset to in-progress');
    }
  };

  const handleCopyBullet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    playClickSound(soundEnabled);
    toast.success('📋 Copied resume bullet to clipboard!');
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Production Capstone': return '#ec4899';
      case 'Advanced': return '#f59e0b';
      case 'Intermediate': return '#06b6d4';
      default: return '#10b981';
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1000,
        backdropFilter: 'blur(16px)',
        background: 'rgba(3, 2, 14, 0.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <motion.div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          width: '100%',
          maxWidth: 820,
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, rgba(14, 10, 36, 0.98) 0%, rgba(8, 6, 24, 0.99) 100%)',
          border: '1px solid rgba(124, 58, 237, 0.4)',
          borderRadius: 24,
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(124, 58, 237, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Top Accent Strip */}
        <div style={{
          height: 4,
          width: '100%',
          background: 'linear-gradient(90deg, #ec4899, #7c3aed, #06b6d4, #10b981)',
        }} />

        {/* Modal Header */}
        <div style={{
          padding: '24px 28px 18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                <span
                  className="badge"
                  style={{
                    background: `rgba(${getDifficultyColor(project.difficulty) === '#ec4899' ? '236,72,153' : '124,58,237'}, 0.15)`,
                    color: getDifficultyColor(project.difficulty),
                    border: `1px solid ${getDifficultyColor(project.difficulty)}40`,
                    fontWeight: 700,
                  }}
                >
                  <Sparkles size={11} style={{ marginRight: 4 }} /> {project.difficulty}
                </span>
                <span className="badge badge-primary">
                  <Layers size={11} style={{ marginRight: 4 }} /> {project.domain}
                </span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)' }}>
                  <Clock size={11} style={{ marginRight: 4 }} /> {project.estHours}
                </span>
                {isCompleted && (
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                    ✓ Completed Capstone
                  </span>
                )}
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.25,
                marginBottom: 6,
              }}>
                {project.title}
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {project.tagline || project.summary}
              </p>
            </div>

            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{
                borderRadius: '50%',
                padding: 8,
                color: 'var(--color-text-muted)',
                background: 'rgba(255, 255, 255, 0.04)',
              }}
              title="Close portal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>
                Milestone Progress ({completedMilestones.length} of {totalMilestones} done)
              </span>
              <span style={{ fontWeight: 700, color: '#a78bfa' }}>{milestonePercent}% Complete</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 999, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${milestonePercent}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #ec4899, #7c3aed, #06b6d4)',
                }}
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            {[
              { id: 'milestones', label: 'Implementation Milestones', icon: Target },
              { id: 'overview', label: 'Architecture & Tech Stack', icon: Layers },
              { id: 'resume', label: 'Resume Bullet Points', icon: FileText },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setActiveTab(id);
                }}
                className={`btn btn-sm ${activeTab === id ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  fontSize: '0.8rem',
                  padding: '6px 14px',
                  borderRadius: 10,
                  gap: 6,
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '24px 28px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          {/* TAB 1: Milestones */}
          {activeTab === 'milestones' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f3e8ff' }}>
                    Step-by-Step Milestones Checklist
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Check off milestones as you build. Each milestone awards +30 XP.
                  </p>
                </div>
                <button
                  onClick={handleMarkProjectComplete}
                  className={`btn btn-sm ${isCompleted ? 'btn-ghost' : 'btn-primary'}`}
                  style={{
                    gap: 6,
                    fontWeight: 700,
                    border: isCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : undefined,
                    color: isCompleted ? '#34d399' : undefined,
                  }}
                >
                  <Award size={14} />
                  {isCompleted ? 'Completed ✓ (Click to reset)' : 'Mark Capstone Complete (+120 XP)'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {project.milestones?.map((m, idx) => {
                  const done = completedMilestones.includes(idx);
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleToggleMilestone(idx)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 14,
                        background: done ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: done ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 14,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ marginTop: 2 }}>
                        {done ? (
                          <CheckCircle2 size={18} color="#10b981" />
                        ) : (
                          <Circle size={18} color="rgba(255, 255, 255, 0.3)" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            color: done ? '#6ee7b7' : '#fff',
                            textDecoration: done ? 'line-through' : 'none',
                          }}>
                            Step {m.step || idx + 1}: {m.title}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: done ? '#34d399' : '#8b5cf6', fontWeight: 600 }}>
                            {done ? '+30 XP Claimed' : '+30 XP'}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '0.8rem',
                          color: done ? 'rgba(255, 255, 255, 0.5)' : 'var(--color-text-secondary)',
                          marginTop: 4,
                          lineHeight: 1.45,
                        }}>
                          {m.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 2: Overview & Architecture */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c4b5fd', marginBottom: 8 }}>
                  Project Executive Summary
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {project.summary}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c4b5fd', marginBottom: 10 }}>
                  Recommended Tech Stack & Tools
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {project.techStack?.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        padding: '6px 14px',
                        background: 'rgba(124, 58, 237, 0.15)',
                        border: '1px solid rgba(124, 58, 237, 0.35)',
                        color: '#ddd6fe',
                        borderRadius: 10,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      ⚡ {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c4b5fd', marginBottom: 8 }}>
                  System Architecture & Data Flow
                </h3>
                <div style={{
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: 14,
                  fontSize: '0.84rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.65,
                }}>
                  {project.architecture}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c4b5fd', marginBottom: 8 }}>
                  Core Requirements & Deliverables
                </h3>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {project.requirements?.map((req, i) => (
                    <li key={i} style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Resume Bullet Points */}
          {activeTab === 'resume' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f3e8ff' }}>
                  Recruiter-Ready Resume Bullets
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  These bullet points follow the Google X-Y-Z formula (Accomplished [X] as measured by [Y] by doing [Z]). Copy them directly into your resume!
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {project.resumeBulletPoints?.map((bullet, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 14,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(124, 58, 237, 0.25)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <p style={{ fontSize: '0.86rem', color: '#e9d5ff', lineHeight: 1.55, flex: 1, margin: 0 }}>
                      • {bullet}
                    </p>
                    <button
                      onClick={() => handleCopyBullet(bullet, idx)}
                      className="btn btn-sm btn-ghost"
                      style={{
                        flexShrink: 0,
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        gap: 6,
                        color: copiedIdx === idx ? '#34d399' : '#c4b5fd',
                      }}
                    >
                      {copiedIdx === idx ? <Check size={13} /> : <Copy size={13} />}
                      {copiedIdx === idx ? 'Copied!' : 'Copy Bullet'}
                    </button>
                  </div>
                ))}
              </div>

              {project.githubTemplateUrl && (
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <a
                    href={project.githubTemplateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-accent"
                    style={{ gap: 8, display: 'inline-flex', textDecoration: 'none' }}
                  >
                    <Rocket size={15} /> Explore Project Open Source Templates & References <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 7, 26, 0.95)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            Domain: <strong style={{ color: '#fff' }}>{career?.title || 'Engineering'}</strong>
          </div>
          <button onClick={onClose} className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>
            Done / Close Portal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
