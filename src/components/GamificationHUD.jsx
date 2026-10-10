import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, Flame, Shield, X, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import useStore from '../store/useStore';
import { playClickSound, playLevelUpSound } from '../utils/soundFX';
import confetti from 'canvas-confetti';

const BADGE_DEFINITIONS = [
  {
    id: 'first_milestone',
    title: 'First Stardust',
    desc: 'Completed your very first career milestone',
    icon: '✨',
    color: '#8b5cf6',
  },
  {
    id: 'explorer',
    title: 'Galaxy Cartographer',
    desc: 'Explored 3+ celestial career constellations',
    icon: '🌌',
    color: '#06b6d4',
  },
  {
    id: 'speed_of_light',
    title: 'Speed of Light',
    desc: 'Completed 5 milestones across your trajectory',
    icon: '⚡',
    color: '#f59e0b',
  },
  {
    id: 'architect',
    title: 'Milestone Architect',
    desc: 'Created or customized a roadmap in the builder',
    icon: '🛠️',
    color: '#ec4899',
  },
  {
    id: 'ai_oracle',
    title: 'AI Celestial Oracle',
    desc: 'Generated a personalized AI roadmap with insights',
    icon: '🔮',
    color: '#3b82f6',
  },
  {
    id: 'streak_master',
    title: 'Solar Streak Pioneer',
    desc: 'Maintained consecutive days of focused learning',
    icon: '🔥',
    color: '#f97316',
  },
  {
    id: 'constellation_master',
    title: 'Constellation Master',
    desc: 'Completed an entire 4-phase career roadmap',
    icon: '👑',
    color: '#10b981',
  },
  {
    id: 'quantum_leap',
    title: 'Quantum Overlord',
    desc: 'Reached Level 5 in Cosmic Career Mastery',
    icon: '🪐',
    color: '#a855f7',
  },
  {
    id: 'quiz_master',
    title: 'Phase Grandmaster',
    desc: 'Scored 80%+ on a gamified domain phase assessment',
    icon: '🎯',
    color: '#ec4899',
  },
  {
    id: 'career_ready',
    title: 'Galactic Certification',
    desc: 'Successfully passed the Major Career Readiness Assessment',
    icon: '📜',
    color: '#3b82f6',
  },
  {
    id: 'project_builder',
    title: 'Capstone Engineer',
    desc: 'Completed an industry-standard portfolio capstone project',
    icon: '🚀',
    color: '#10b981',
  },
];

export default function GamificationHUD() {
  const {
    user,
    badges = [],
    streakDays = 3,
    showBadgesModal,
    setShowBadgesModal,
    recentXPGain,
    clearRecentXPGain,
    soundEnabled,
  } = useStore();

  const [floatingXP, setFloatingXP] = useState(null);

  const xp = user?.xp || 250;
  const level = user?.level || Math.floor(xp / 200) + 1;
  const xpInCurrentLevel = xp % 200;
  const xpProgressPercent = Math.round((xpInCurrentLevel / 200) * 100);

  // Floating +50 XP notification trigger
  useEffect(() => {
    if (recentXPGain) {
      setFloatingXP(recentXPGain);
      const timer = setTimeout(() => {
        setFloatingXP(null);
        clearRecentXPGain();
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [recentXPGain]);

  const getRankTitle = (lvl) => {
    if (lvl >= 5) return 'Galactic Architect';
    if (lvl >= 4) return 'Solar Voyager';
    if (lvl >= 3) return 'Constellation Scout';
    if (lvl >= 2) return 'Orbit Pioneer';
    return 'Stellar Cadet';
  };

  const handleOpenBadges = () => {
    playClickSound(soundEnabled);
    setShowBadgesModal(true);
  };

  return (
    <>
      {/* Floating XP Gain Popup Notification */}
      <AnimatePresence>
        {floatingXP && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: 80,
              right: 32,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 20px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(124, 58, 237, 0.3) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(16, 185, 129, 0.5)',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3), 0 0 20px rgba(124, 58, 237, 0.3)',
              color: '#fff',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)',
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.02em' }}>
                +{floatingXP.amount || 50} XP EARNED!
              </div>
              <div style={{ fontSize: '0.78rem', color: '#c4b5fd' }}>
                {floatingXP.reason || 'Milestone Completed'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badges & Achievements Modal */}
      <AnimatePresence>
        {showBadgesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBadgesModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              background: 'rgba(3, 2, 14, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 680,
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'linear-gradient(145deg, rgba(16, 12, 44, 0.98) 0%, rgba(7, 5, 24, 0.99) 100%)',
                border: '1.5px solid rgba(124, 58, 237, 0.35)',
                borderRadius: 24,
                padding: '32px 28px',
                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(124, 58, 237, 0.25)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowBadgesModal(false)}
                className="btn btn-ghost btn-sm"
                style={{ position: 'absolute', top: 20, right: 20, borderRadius: '50%', padding: 8 }}
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 12px',
                    borderRadius: 9999,
                    background: 'rgba(124, 58, 237, 0.2)',
                    border: '1px solid rgba(124, 58, 237, 0.4)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#c4b5fd',
                    marginBottom: 10,
                  }}
                >
                  <Award size={14} /> COSMIC HALL OF ACHIEVEMENTS
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff' }}>
                  Your Galactic Badges
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginTop: 4 }}>
                  Level {level} · {getRankTitle(level)} · {badges.length} of {BADGE_DEFINITIONS.length} Unlocked
                </p>

                {/* Level Progress Bar in Modal */}
                <div style={{ maxWidth: 360, margin: '18px auto 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Progress to Level {level + 1}</span>
                    <span style={{ fontWeight: 700, color: '#22d3ee' }}>{xpInCurrentLevel} / 200 XP</span>
                  </div>
                  <div className="progress-bar" style={{ height: 8 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${xpProgressPercent}%`,
                        background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Badges Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 16,
                }}
              >
                {BADGE_DEFINITIONS.map((badge) => {
                  const isUnlocked = badges.includes(badge.id) || badge.id === 'first_milestone' || badge.id === 'explorer';
                  return (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.02, translateY: -2 }}
                      style={{
                        padding: '16px 18px',
                        borderRadius: 16,
                        background: isUnlocked
                          ? 'rgba(124, 58, 237, 0.12)'
                          : 'rgba(255, 255, 255, 0.02)',
                        border: isUnlocked
                          ? `1px solid ${badge.color}60`
                          : '1px solid rgba(255, 255, 255, 0.06)',
                        boxShadow: isUnlocked
                          ? `0 8px 24px rgba(0,0,0,0.4), 0 0 20px ${badge.color}20`
                          : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        opacity: isUnlocked ? 1 : 0.55,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Top neon line on unlocked */}
                      {isUnlocked && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 2,
                            background: `linear-gradient(90deg, transparent, ${badge.color}, transparent)`,
                          }}
                        />
                      )}

                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: isUnlocked
                            ? `rgba(255,255,255,0.06)`
                            : 'rgba(255,255,255,0.02)',
                          border: isUnlocked ? `1.5px solid ${badge.color}` : '1px solid rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24,
                          flexShrink: 0,
                        }}
                      >
                        {badge.icon}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: isUnlocked ? '#fff' : 'var(--color-text-muted)' }}>
                            {badge.title}
                          </span>
                          {isUnlocked ? (
                            <CheckCircle2 size={13} color="#10b981" />
                          ) : (
                            <Lock size={12} color="var(--color-text-muted)" />
                          )}
                        </div>
                        <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', lineHeight: 1.4, marginTop: 2 }}>
                          {badge.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowBadgesModal(false)}
                  style={{ padding: '8px 24px', borderRadius: 9999 }}
                >
                  Close Codex
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
