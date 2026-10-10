import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Sparkles, Compass, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import { CAREER_NODES } from '../data/careers';

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register, loginAsGuest, addCustomCareer } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('ai-engineer');
  const [customRole, setCustomRole] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        if (!email || !password) {
          toast.error('Please enter email and password');
          setLoading(false);
          return;
        }
        const res = await login(email, password);
        if (res.success) {
          toast.success(res.message || 'Welcome back, Explorer!');
        } else {
          toast.error(res.message || 'Login failed');
        }
      } else {
        if (!name || !email || !password) {
          toast.error('Please fill in all required fields');
          setLoading(false);
          return;
        }

        let effectiveRole = targetRole;
        if (targetRole === 'other') {
          if (!customRole.trim()) {
            toast.error('Please specify your custom career title');
            setLoading(false);
            return;
          }
          const created = addCustomCareer({ title: customRole.trim() });
          effectiveRole = created.id;
        }

        const res = await register(name, email, password, effectiveRole);
        if (res.success) {
          toast.success('Cosmic account initialized! Welcome aboard.');
        } else {
          toast.error(res.message || 'Registration failed');
        }
      }
    } catch (err) {
      toast.error('Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@careermitra.ai');
    setPassword('demo123');
    toast('Demo credentials populated!', { icon: '🔑' });
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    await loginAsGuest();
    toast.success('Entered as Cosmic Guest Explorer!');
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(2, 1, 10, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="card card-glow"
          style={{
            width: '100%',
            maxWidth: 460,
            background: 'linear-gradient(135deg, rgba(16, 12, 38, 0.96) 0%, rgba(8, 6, 24, 0.98) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.35)',
            boxShadow: '0 25px 60px -15px rgba(124, 58, 237, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
            borderRadius: 20,
            padding: '32px 28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative cosmic orb */}
          <div style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 150,
            height: 150,
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="btn btn-ghost btn-sm"
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              padding: 6,
              borderRadius: '50%',
              color: 'var(--color-text-muted)',
            }}
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 0 25px rgba(124, 58, 237, 0.6)',
            }}>
              <Compass size={28} color="#fff" />
            </div>

            <h2 style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, #fff, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 4,
            }}>
              {isLogin ? 'Sign In to CareerMitra' : 'Begin Your Cosmic Journey'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              {isLogin
                ? 'Resume your personalized AI roadmap and skill galaxy'
                : 'Free AI career mapping, milestone replanning & tracking'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: '0.84rem',
                fontWeight: isLogin ? 700 : 500,
                background: isLogin ? 'rgba(124, 58, 237, 0.35)' : 'transparent',
                color: isLogin ? '#fff' : 'var(--color-text-muted)',
                border: isLogin ? '1px solid rgba(124, 58, 237, 0.5)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: '0.84rem',
                fontWeight: !isLogin ? 700 : 500,
                background: !isLogin ? 'rgba(124, 58, 237, 0.35)' : 'transparent',
                color: !isLogin ? '#fff' : 'var(--color-text-muted)',
                border: !isLogin ? '1px solid rgba(124, 58, 237, 0.5)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(124, 58, 237, 0.25)',
                      borderRadius: 10,
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(124, 58, 237, 0.25)',
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a78bfa',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Zap size={12} /> Auto-fill Demo
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(124, 58, 237, 0.25)',
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                  Target Career Galaxy
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#120d2b',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    marginBottom: targetRole === 'other' ? 10 : 0,
                  }}
                >
                  {CAREER_NODES.map((career) => (
                    <option key={career.id} value={career.id} style={{ background: '#120d2b', color: '#fff' }}>
                      {career.title} ({career.cluster})
                    </option>
                  ))}
                  <option value="other" style={{ background: '#120d2b', color: '#67e8f9', fontWeight: 'bold' }}>
                    ✨ Other (Write your own career path...)
                  </option>
                </select>

                {targetRole === 'other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: 8 }}
                  >
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#a78bfa', marginBottom: 4 }}>
                      Specify Custom Career Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robotics Engineer, Game Architect, BioTech Dev..."
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(124, 58, 237, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.4)',
                        borderRadius: 10,
                        color: '#fff',
                        fontSize: '0.86rem',
                        outline: 'none',
                      }}
                    />
                  </motion.div>
                )}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: 6,
                padding: '12px',
                borderRadius: 10,
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? (
                <span className="spinner" style={{ width: 18, height: 18 }} />
              ) : (
                <>
                  {isLogin ? 'Enter Space Station' : 'Create Cosmic Profile'}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '20px 0',
            color: 'var(--color-text-muted)',
            fontSize: '0.76rem',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
            <span>OR EXPLORE INSTANTLY</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          {/* Guest 1-Click Action */}
          <motion.button
            whileHover={{ scale: 1.02, background: 'rgba(6, 182, 212, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGuestAccess}
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: 10,
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#67e8f9',
              fontSize: '0.86rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Sparkles size={16} />
            Explore as Guest (No Password Required)
          </motion.button>

          {/* Privacy footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 18,
            fontSize: '0.72rem',
            color: 'var(--color-text-muted)',
          }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Encrypted passwords & JWT sessions</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
