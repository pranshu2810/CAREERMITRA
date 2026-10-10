import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, Circle, Sparkles, ExternalLink, Copy, Check,
  Clock, Layers, ShieldCheck, Target, Award, Rocket, FileText,
  ChevronRight, ChevronLeft, GitBranch, Globe, Terminal, Code2,
  FolderTree, Share2
} from 'lucide-react';
import useStore from '../store/useStore';
import { playClickSound, playTaskCompleteSound, playLevelUpSound } from '../utils/soundFX';
import { getCareerProjects } from '../utils/domainProjects';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function ProjectPortalView() {
  const {
    selectedProject, selectedCareer, closeProjectPortal,
    projectProgress, toggleProjectMilestone, setProjectStatus,
    soundEnabled, user, getAllCareers, setSelectedProject,
    projectSubmissions, saveProjectSubmission
  } = useStore();

  const allCareers = getAllCareers();
  const career = selectedCareer || allCareers[0];
  const careerProjects = getCareerProjects(career);

  // If no project selected in store, pick first project
  const currentProject = selectedProject || careerProjects[0];

  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'architecture' | 'resume' | 'submission'
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [repoUrl, setRepoUrl] = useState(projectSubmissions?.[career?.id]?.[currentProject?.id]?.repoUrl || '');
  const [demoUrl, setDemoUrl] = useState(projectSubmissions?.[career?.id]?.[currentProject?.id]?.demoUrl || '');

  if (!currentProject) {
    return (
      <div style={{ paddingTop: 100, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ color: '#fff' }}>No project selected</h2>
        <button className="btn btn-primary" onClick={closeProjectPortal}>Return to Roadmap</button>
      </div>
    );
  }

  const careerId = career?.id || 'swe';
  const progressData = projectProgress?.[careerId]?.[currentProject.id] || { started: false, completed: false, completedMilestones: [] };
  const completedMilestones = progressData.completedMilestones || [];
  const isCompleted = progressData.completed;

  const totalMilestones = currentProject.milestones?.length || 5;
  const milestonePercent = Math.round((completedMilestones.length / totalMilestones) * 100);

  // Count total completed projects for this career
  const totalCompletedProjects = careerProjects.filter(
    (p) => projectProgress?.[careerId]?.[p.id]?.completed
  ).length;

  const handleToggleMilestone = (idx) => {
    toggleProjectMilestone(careerId, currentProject.id, idx);
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
    setProjectStatus(careerId, currentProject.id, nextState);
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

  const handleSaveSubmission = (e) => {
    e.preventDefault();
    if (saveProjectSubmission) {
      saveProjectSubmission(careerId, currentProject.id, repoUrl, demoUrl);
    }
    toast.success('💾 Project links saved to your portfolio!');
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Production Capstone': return '#ec4899';
      case 'Advanced': return '#f59e0b';
      case 'Intermediate': return '#06b6d4';
      default: return '#10b981';
    }
  };

  // Find index of current project to support next / prev
  const currentProjIdx = careerProjects.findIndex((p) => p.id === currentProject.id);

  const handleSelectProject = (proj) => {
    playClickSound(soundEnabled);
    setSelectedProject(proj);
    setRepoUrl(projectSubmissions?.[career?.id]?.[proj.id]?.repoUrl || '');
    setDemoUrl(projectSubmissions?.[career?.id]?.[proj.id]?.demoUrl || '');
  };

  return (
    <div style={{ paddingTop: 78, minHeight: '100vh', paddingBottom: 60, position: 'relative' }}>
      {/* Background ambient lighting */}
      <div style={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80vw',
        height: '420px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(236, 72, 153, 0.08) 60%, transparent 80%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Top Header Navigation Bar ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          padding: '16px 20px',
          background: 'rgba(12, 10, 32, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          borderRadius: 16,
          marginBottom: 20,
        }}>
          {/* Back button & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={closeProjectPortal}
              className="btn btn-ghost btn-sm"
              style={{
                gap: 6,
                fontWeight: 700,
                color: '#c4b5fd',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                padding: '8px 14px',
              }}
            >
              <ArrowLeft size={16} /> Back to Roadmap
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                  INDUSTRY PORTFOLIO ACCELERATOR
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {career?.title}
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 0', color: '#fff' }}>
                Capstone Studio · {currentProject.title}
              </h2>
            </div>
          </div>

          {/* Overall Portfolio Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Career Capstones
              </div>
              <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.94rem' }}>
                {totalCompletedProjects} of {careerProjects.length} Completed
              </div>
            </div>

            <button
              onClick={handleMarkProjectComplete}
              className={`btn btn-sm ${isCompleted ? 'btn-ghost' : 'btn-primary'}`}
              style={{
                fontWeight: 800,
                padding: '8px 18px',
                gap: 6,
                border: isCompleted ? '1.5px solid rgba(16, 185, 129, 0.5)' : undefined,
                color: isCompleted ? '#34d399' : undefined,
              }}
            >
              <CheckCircle2 size={16} />
              {isCompleted ? 'Completed ✓ (+120 XP)' : 'Mark Capstone Complete (+120 XP)'}
            </button>
          </div>
        </div>

        {/* ── 5 Capstones Quick Carousel / Tab Bar ── */}
        <div style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 24,
        }}>
          {careerProjects.map((p, idx) => {
            const isSelected = p.id === currentProject.id;
            const pData = projectProgress?.[careerId]?.[p.id] || {};
            const pDone = pData.completed;
            const doneCount = pData.completedMilestones?.length || 0;

            return (
              <button
                key={p.id}
                onClick={() => handleSelectProject(p)}
                style={{
                  flex: '0 0 auto',
                  padding: '10px 18px',
                  borderRadius: 12,
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected
                    ? '1.5px solid rgba(124, 58, 237, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.07)',
                  color: isSelected ? '#fff' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 700 : 500,
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{pDone ? '✅' : `0${idx + 1}`}</span>
                <span>{p.title}</span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: pDone ? '#34d399' : 'var(--color-text-muted)',
                }}>
                  {pDone ? '100%' : `${doneCount}/5`}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Project Hero Banner ── */}
        <motion.div
          key={currentProject.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '28px 32px',
            background: 'linear-gradient(135deg, rgba(16, 12, 38, 0.95) 0%, rgba(8, 6, 24, 0.98) 100%)',
            border: '1.5px solid rgba(124, 58, 237, 0.35)',
            borderRadius: 20,
            marginBottom: 24,
            boxShadow: '0 15px 45px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  className="badge"
                  style={{
                    background: `${getDifficultyColor(currentProject.difficulty)}22`,
                    color: getDifficultyColor(currentProject.difficulty),
                    border: `1px solid ${getDifficultyColor(currentProject.difficulty)}44`,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  {currentProject.difficulty}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={13} /> {currentProject.estHours || '~35 hours'}
                </span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', fontSize: '0.72rem' }}>
                  {currentProject.domainCluster || career?.clusterName || 'Engineering Capstone'}
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 900,
                color: '#fff',
                margin: '0 0 10px',
              }}>
                {currentProject.title}
              </h1>

              <p style={{
                fontSize: '0.92rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 780,
              }}>
                {currentProject.tagline || currentProject.summary}
              </p>
            </div>

            {/* Milestone Progress Radial / Box */}
            <div style={{
              padding: '16px 20px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center',
              minWidth: 160,
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: isCompleted ? '#34d399' : '#c4b5fd', fontFamily: 'var(--font-display)' }}>
                {milestonePercent}%
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Sprint Completion
              </div>
              <div className="progress-bar" style={{ height: 4, width: 120, margin: '0 auto' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${milestonePercent}%`,
                    background: isCompleted ? 'var(--grad-emerald)' : 'var(--grad-primary)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', alignSelf: 'center', marginRight: 4 }}>
              Core Technologies:
            </span>
            {(currentProject.techStack || ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'Redis']).map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: 'rgba(124, 58, 237, 0.12)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  color: '#c4b5fd',
                  fontWeight: 600,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Studio Navigation Tabs ── */}
        <div style={{
          display: 'flex',
          gap: 12,
          borderBottom: '1px solid rgba(124, 58, 237, 0.25)',
          marginBottom: 24,
          paddingBottom: 2,
        }}>
          {[
            { id: 'milestones', label: 'Milestones & Tasks', icon: Target },
            { id: 'architecture', label: 'System Architecture & Specs', icon: Layers },
            { id: 'resume', label: 'Resume Impact & Bullets', icon: FileText },
            { id: 'submission', label: 'GitHub & Deployment Link', icon: GitBranch },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setActiveTab(tab.id);
                }}
                className="btn btn-ghost"
                style={{
                  gap: 8,
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? '#fff' : 'var(--color-text-muted)',
                  borderBottom: isActive ? '3px solid #7c3aed' : '3px solid transparent',
                  borderRadius: '8px 8px 0 0',
                  padding: '10px 18px',
                }}
              >
                <Icon size={16} color={isActive ? '#c4b5fd' : undefined} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT ── */}

        {/* 1. Milestones Sprint Tracker */}
        {activeTab === 'milestones' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(currentProject.milestones || []).map((m, mIdx) => {
              const isDone = completedMilestones.includes(mIdx);
              const mObj = typeof m === 'object' ? m : { title: m, desc: 'Deliverable task specification', hours: 6 };

              return (
                <motion.div
                  key={mIdx}
                  whileHover={{ x: 3 }}
                  onClick={() => handleToggleMilestone(mIdx)}
                  className="glass-card"
                  style={{
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    cursor: 'pointer',
                    background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1.5px solid ${isDone ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.06)'}`,
                    borderRadius: 14,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                    <div style={{ flexShrink: 0 }}>
                      {isDone ? (
                        <CheckCircle2 size={24} color="#10b981" />
                      ) : (
                        <Circle size={24} color="var(--color-text-muted)" />
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#c4b5fd',
                          background: 'rgba(124, 58, 237, 0.2)',
                          padding: '2px 8px',
                          borderRadius: 6,
                        }}>
                          Sprint Milestone {mIdx + 1}
                        </span>
                        <h4 style={{
                          fontSize: '0.96rem',
                          fontWeight: 700,
                          color: isDone ? 'var(--color-text-muted)' : '#fff',
                          textDecoration: isDone ? 'line-through' : 'none',
                          margin: 0,
                        }}>
                          {mObj.title}
                        </h4>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
                        {mObj.desc}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> ~{mObj.hours || 6}h
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: 6,
                      background: isDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                      color: isDone ? '#34d399' : '#c4b5fd',
                    }}>
                      +30 XP
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* 2. Architecture & Technical Specs */}
        {activeTab === 'architecture' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="glass-card" style={{ padding: 28, borderRadius: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Layers size={18} color="var(--color-accent)" /> System Architecture & Technical Flow
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 18 }}>
                  {currentProject.architectureBrief || 'This production-ready capstone implements an event-driven decoupled service topology. Components communicate over resilient asynchronous message brokers with automatic retry queues, circuit-breakers, and centralized telemetry metrics.'}
                </p>

                <div style={{
                  padding: 20,
                  borderRadius: 12,
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: '#67e8f9',
                  lineHeight: 1.6,
                }}>
                  {currentProject.architectureDiagramText || `[ Client Gateway ]
       ↓ (REST / GraphQL)
[ API Reverse Proxy (Envoy / NGINX) ]
       ↓
[ Core Microservice ] ←→ [ Distributed Cache (Redis) ]
       ↓
[ Asynchronous Broker (Kafka / RabbitMQ) ]
       ↓
[ Worker Task Consumers ] ←→ [ Relational Storage (PostgreSQL) ]`}
                </div>
              </div>

              <div className="glass-card" style={{ padding: 28, borderRadius: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <ShieldCheck size={18} color="#10b981" /> Production Quality Deliverables
                </h3>
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {(currentProject.deliverables || [
                    'Comprehensive test suite with >80% code coverage including integration mocks',
                    'Containerized multi-stage Dockerfile and Docker Compose infrastructure definition',
                    'Automated CI/CD GitHub Actions workflow with linting, security audits, and automated tests',
                    'OpenAPI/Swagger documentation with live interactive payload examples',
                    'Prometheus instrumentation metrics and Grafana health monitoring dashboards',
                  ]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right sidebar: recommended repo layout */}
            <div className="glass-card" style={{ padding: 24, borderRadius: 16, height: 'fit-content' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
                <FolderTree size={16} color="#c4b5fd" /> Suggested Repo Structure
              </h4>
              <div style={{
                padding: 16,
                borderRadius: 10,
                background: 'rgba(0,0,0,0.4)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#cbd5e1',
                lineHeight: 1.8,
              }}>
                <div>├── src/</div>
                <div>│   ├── api/</div>
                <div>│   ├── core/</div>
                <div>│   ├── services/</div>
                <div>│   └── models/</div>
                <div>├── tests/</div>
                <div>├── docker-compose.yml</div>
                <div>├── Dockerfile</div>
                <div>└── README.md</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. Resume Impact & Bullets */}
        {activeTab === 'resume' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="glass-card" style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Sparkles size={18} color="var(--color-accent)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Quantified Resume & LinkedIn Bullet Points
                </h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Copy and tailor these metric-driven bullet points directly into your CV, portfolio site, or GitHub README.
              </p>
            </div>

            {(currentProject.resumeBullets || [
              `Architected production-grade ${currentProject.title} using ${currentProject.techStack?.slice(0, 3).join(', ')}, reducing service latency by 35% through query optimization and caching.`,
              `Implemented robust automated CI/CD pipeline and container orchestration, ensuring zero-downtime rolling updates and 99.95% system uptime.`,
              `Integrated comprehensive end-to-end integration test suites with 85%+ coverage, mitigating production regression errors across 5 critical engineering workflows.`,
            ]).map((bullet, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '20px 24px',
                  borderRadius: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                    Bullet Point {idx + 1}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#f0ecff', lineHeight: 1.6, margin: 0 }}>
                    • {bullet}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyBullet(bullet, idx)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: 6, fontWeight: 700, padding: '8px 16px', flexShrink: 0 }}
                >
                  {copiedIdx === idx ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                  {copiedIdx === idx ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* 4. Submission & Verification */}
        {activeTab === 'submission' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 680, margin: '0 auto' }}>
            <form onSubmit={handleSaveSubmission} className="glass-card" style={{ padding: 32, borderRadius: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                <GitBranch size={20} color="#c4b5fd" /> Portfolio Code & Live Demo Submission
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: 24 }}>
                Keep your real GitHub repository and live deployment URL saved to your account. This builds your verified developer portfolio for recruiters.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://github.com/yourusername/portfolio-capstone"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    Live Production Demo URL
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://capstone-demo.vercel.app"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 800 }}>
                  Save Portfolio Links
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── Bottom Project Navigation ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 40,
          paddingTop: 24,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {currentProjIdx > 0 ? (
            <button
              onClick={() => handleSelectProject(careerProjects[currentProjIdx - 1])}
              className="btn btn-ghost btn-sm"
              style={{ gap: 6, fontWeight: 700 }}
            >
              <ChevronLeft size={16} /> Previous: {careerProjects[currentProjIdx - 1].title}
            </button>
          ) : <div />}

          {currentProjIdx < careerProjects.length - 1 ? (
            <button
              onClick={() => handleSelectProject(careerProjects[currentProjIdx + 1])}
              className="btn btn-ghost btn-sm"
              style={{ gap: 6, fontWeight: 700 }}
            >
              Next: {careerProjects[currentProjIdx + 1].title} <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={closeProjectPortal}
              className="btn btn-primary btn-sm"
              style={{ gap: 6, fontWeight: 700 }}
            >
              Back to Career Roadmap →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
