import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass, Telescope, Sparkles, BookOpen, GitCompare, LayoutDashboard,
  ShieldCheck, ArrowRight, Zap, Target, Star, Award, CheckCircle2,
  TrendingUp, Globe, ChevronRight, Play, Rocket
} from 'lucide-react';
import useStore from '../store/useStore';
import { CAREER_NODES } from '../data/careers';

export default function LandingView() {
  const { openAuthModal, loginAsGuest, setActiveView, isAuthenticated, user, getAllCareers } = useStore();

  const handleLaunchApp = async () => {
    if (isAuthenticated) {
      setActiveView('galaxy');
    } else {
      await loginAsGuest();
      setActiveView('galaxy');
    }
  };

  const featuredCareers = (getAllCareers ? getAllCareers() : CAREER_NODES).slice(0, 4);

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', paddingTop: 90, paddingBottom: 80 }}>
      {/* Background radial cosmic glows */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1000px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ================= HERO SECTION ================= */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto' }}>
          {/* Cosmic Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 9999,
              background: 'rgba(124, 58, 237, 0.12)',
              border: '1px solid rgba(124, 58, 237, 0.35)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.25)',
              fontSize: '0.82rem',
              color: '#c4b5fd',
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: 24,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 8px #06b6d4', display: 'inline-block' }} />
            <span>AI-POWERED COSMIC CAREER NAVIGATOR</span>
            <Sparkles size={14} color="#67e8f9" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: 20,
              background: 'linear-gradient(135deg, #ffffff 20%, #ddd6fe 60%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Chart Your Trajectory in the Tech Cosmos
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: 720,
              margin: '0 auto 36px',
            }}
          >
            Leave flat, generic learning roadmaps behind. Explore 10+ interconnected career constellations with AI-driven milestones, adaptive prerequisite trees, and real-time skill replanning.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 48,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(124, 58, 237, 0.6)' }}
              whileTap={{ scale: 0.96 }}
              onClick={handleLaunchApp}
              className="btn btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 14,
                gap: 10,
                boxShadow: '0 0 25px rgba(124, 58, 237, 0.45)',
              }}
            >
              <Rocket size={18} />
              {isAuthenticated ? 'Enter Career Galaxy' : 'Launch Galaxy (Guest Demo)'}
              <ArrowRight size={18} />
            </motion.button>

            {!isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openAuthModal('register')}
                className="btn btn-secondary"
                style={{
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 14,
                  gap: 8,
                }}
              >
                <Sparkles size={18} color="#c4b5fd" />
                Create Free Account
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveView('roadmap')}
                className="btn btn-secondary"
                style={{
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 14,
                  gap: 8,
                }}
              >
                <BookOpen size={18} color="#67e8f9" />
                View My Roadmap
              </motion.button>
            )}
          </motion.div>

          {/* Highlights line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            flexWrap: 'wrap',
            color: 'var(--color-text-muted)',
            fontSize: '0.84rem',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={15} color="#10b981" /> 100% Free & Open Source
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={15} color="#10b981" /> No Credit Card Required
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={15} color="#10b981" /> Gemini 1.5 AI Synthesis
            </span>
          </div>
        </div>

        {/* Hero Interactive Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            marginTop: 48,
            position: 'relative',
            borderRadius: 24,
            padding: 2,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.6) 0%, rgba(6, 182, 212, 0.4) 50%, rgba(124, 58, 237, 0.1) 100%)',
            boxShadow: '0 30px 80px -20px rgba(124, 58, 237, 0.45)',
          }}
        >
          <div style={{
            background: 'linear-gradient(180deg, rgba(15, 11, 36, 0.95) 0%, rgba(8, 6, 24, 0.98) 100%)',
            borderRadius: 22,
            padding: '36px 32px',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: 20,
              marginBottom: 28,
              flexWrap: 'wrap',
              gap: 16,
            }}>
              <div>
                <span style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  color: '#67e8f9',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}>
                  Cosmic Trajectory Preview
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
                  AI Engineer Constellation · Orbit Alpha
                </h3>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                }}>
                  $125k - $210k / yr
                </span>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  background: 'rgba(124, 58, 237, 0.15)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  color: '#c4b5fd',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                }}>
                  Level 3 · 450 XP
                </span>
              </div>
            </div>

            {/* Visual Constellation Milestone Ribbon */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}>
              {[
                { phase: 'Phase 1', title: 'Python & Math Foundations', status: 'Completed', xp: '+120 XP', color: '#10b981' },
                { phase: 'Phase 2', title: 'Deep Learning & PyTorch', status: 'In Orbit', xp: '+180 XP', color: '#67e8f9' },
                { phase: 'Phase 3', title: 'LLMs, Transformers & RAG', status: 'Unlocked', xp: '+240 XP', color: '#a78bfa' },
                { phase: 'Phase 4', title: 'Production ML Systems & MLOps', status: 'Prereq Locked', xp: '+300 XP', color: '#94a3b8' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '18px',
                    borderRadius: 14,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${step.color}33`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 4,
                    height: '100%',
                    background: step.color,
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.72rem', color: step.color, fontWeight: 700 }}>{step.phase}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{step.xp}</span>
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>{step.title}</h4>
                  <div style={{
                    fontSize: '0.74rem',
                    color: step.color,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: step.color }} />
                    {step.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= CORE PILLARS / FEATURES ================= */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            fontSize: '0.78rem',
            color: '#a78bfa',
            letterSpacing: '0.1em',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}>
            Engineered For Modern Tech Careers
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            marginTop: 8,
            color: '#fff',
          }}>
            Four Breakthrough Capabilities
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          {[
            {
              icon: Telescope,
              title: '3D Cosmic Galaxy Map',
              desc: 'Explore 10+ tech domains rendered as glowing interactive constellations. Zoom into node blueprints, inspect salary trends, and check market demand.',
              color: '#7c3aed',
            },
            {
              icon: Sparkles,
              title: 'Gemini AI Roadmaps',
              desc: 'Custom-tailored learning paths generated in real time. We factor in your exact background skills, weekly study bandwidth, and target deadline.',
              color: '#06b6d4',
            },
            {
              icon: Zap,
              title: 'Dynamic Replanner',
              desc: 'Mark learned skills complete or exempt. The engine dynamically unlocks downstream prerequisites, recalculates finish dates, and awards XP.',
              color: '#10b981',
            },
            {
              icon: GitCompare,
              title: 'Multi-Role Comparison',
              desc: 'Compare any two engineering paths side-by-side with 6-axis radar metrics, percentage skill overlap, and transition feasibility benchmarks.',
              color: '#f59e0b',
            },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6, boxShadow: `0 20px 40px -10px ${pillar.color}33` }}
                className="card card-glow"
                style={{
                  padding: '30px 24px',
                  borderRadius: 18,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  background: 'rgba(16, 12, 38, 0.65)',
                }}
              >
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: `${pillar.color}22`,
                  border: `1px solid ${pillar.color}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={24} color={pillar.color} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{pillar.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{pillar.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= FEATURED CAREER CONSTELLATIONS ================= */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 36,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#67e8f9', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>
              Orbit Catalog
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#fff', marginTop: 4 }}>
              Featured Constellations
            </h2>
          </div>
          <button
            onClick={handleLaunchApp}
            className="btn btn-ghost"
            style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
          >
            Explore all 10 careers in Galaxy <ChevronRight size={18} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {featuredCareers.map((career) => (
            <motion.div
              key={career.id}
              whileHover={{ scale: 1.02 }}
              onClick={handleLaunchApp}
              style={{
                background: 'rgba(16, 12, 38, 0.75)',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                borderRadius: 16,
                padding: '24px 20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 9999,
                  background: 'rgba(6, 182, 212, 0.1)',
                  color: '#67e8f9',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}>
                  {career.cluster}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                  {career.growthRate}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{career.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
                {career.tagline}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 12,
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.8rem',
              }}>
                <span style={{ color: '#c4b5fd', fontWeight: 700 }}>{career.salaryRange}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{career.avgMonths} mo</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA BANNER ================= */}
      <section style={{ maxWidth: 1000, margin: '80px auto 40px', padding: '0 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)',
          borderRadius: 24,
          border: '1px solid rgba(124, 58, 237, 0.4)',
          padding: '60px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(124, 58, 237, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: '#fff',
            marginBottom: 16,
          }}>
            Ready to Reach Escape Velocity?
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-secondary)',
            maxWidth: 580,
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}>
            Join students and engineers accelerating their careers with tailored milestones, dynamic XP progression, and actionable AI guidance.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLaunchApp}
              className="btn btn-primary"
              style={{
                padding: '14px 36px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 14,
                gap: 8,
              }}
            >
              <Rocket size={18} />
              Launch Galaxy (Free Demo)
            </motion.button>
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('register')}
                className="btn btn-secondary"
                style={{
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 14,
                }}
              >
                Sign Up / Sign In
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={{
        maxWidth: 1200,
        margin: '60px auto 0',
        padding: '30px 24px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        color: 'var(--color-text-muted)',
        fontSize: '0.82rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Compass size={18} color="#7c3aed" />
          <span style={{ fontWeight: 700, color: '#fff' }}>CareerMitra</span>
          <span>— Cosmic AI Career Navigator</span>
        </div>
        <div>MIT License © 2026 CareerMitra. Ready for Web & React Native.</div>
      </footer>
    </div>
  );
}
