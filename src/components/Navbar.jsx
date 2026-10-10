import React from 'react';
import { motion } from 'framer-motion';
import { Compass, LayoutDashboard, GitCompare, User, BookOpen, Telescope, Sparkles, LogOut, LogIn } from 'lucide-react';
import useStore from '../store/useStore';

const NAV_ITEMS = [
  { id: 'landing',  icon: Sparkles,       label: 'Home',     desc: 'Overview & features' },
  { id: 'galaxy',   icon: Telescope,      label: 'Galaxy',   desc: 'Explore careers' },
  { id: 'roadmap',  icon: BookOpen,       label: 'Roadmap',  desc: 'AI roadmap' },
  { id: 'progress', icon: LayoutDashboard,label: 'Progress', desc: 'Track skills' },
  { id: 'compare',  icon: GitCompare,     label: 'Compare',  desc: 'Career comparison' },
  { id: 'profile',  icon: User,           label: 'Profile',  desc: 'Your profile' },
];

export default function Navbar() {
  const {
    activeView, setActiveView, comparedCareers,
    isAuthenticated, user, isGuest, logout, openAuthModal
  } = useStore();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        padding: '0 24px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(4, 3, 13, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.18)',
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => setActiveView('landing')}
      >
        <div style={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
          boxShadow: '0 0 20px rgba(124,58,237,0.5)',
        }}>
          <Compass size={20} color="#fff" />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.15rem',
            background: 'linear-gradient(135deg, #c4b5fd, #67e8f9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
          }}>
            CareerMitra
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', marginTop: 2 }}>
            COSMIC CAREER NAVIGATOR
          </div>
        </div>
      </motion.div>

      {/* Nav Items */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const hasBadge = item.id === 'compare' && comparedCareers.length > 0;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView(item.id)}
              className="btn btn-ghost btn-sm"
              id={`nav-${item.id}`}
              style={{
                position: 'relative',
                background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
                border: isActive ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
                color: isActive ? '#c4b5fd' : 'var(--color-text-secondary)',
                gap: 6,
                padding: '6px 14px',
              }}
            >
              <Icon size={16} />
              <span style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {hasBadge && (
                <span style={{
                  position: 'absolute',
                  top: -4, right: -4,
                  width: 18, height: 18,
                  background: 'var(--grad-primary)',
                  borderRadius: '50%',
                  fontSize: '0.65rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700,
                  color: '#fff',
                  boxShadow: '0 0 8px rgba(124,58,237,0.6)',
                }}>
                  {comparedCareers.length}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: '20%',
                    right: '20%',
                    height: 2,
                    background: 'var(--grad-primary)',
                    borderRadius: '2px 2px 0 0',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Right Section: Auth & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* User chip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px 4px 6px',
              borderRadius: 9999,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
            }}>
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: isGuest
                  ? 'linear-gradient(135deg, #06b6d4, #10b981)'
                  : 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#fff',
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f0ecff' }}>
                {user?.name || (isGuest ? 'Guest' : 'User')}
              </span>
              {user?.level && (
                <span style={{
                  fontSize: '0.68rem',
                  background: 'rgba(124, 58, 237, 0.3)',
                  color: '#c4b5fd',
                  padding: '2px 6px',
                  borderRadius: 6,
                  fontWeight: 700,
                }}>
                  Lvl {user.level}
                </span>
              )}
            </div>

            {/* Logout button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="btn btn-ghost btn-sm"
              style={{
                padding: '6px 10px',
                color: 'var(--color-text-muted)',
                borderRadius: 8,
                fontSize: '0.78rem',
                gap: 5,
              }}
              title="Sign Out"
            >
              <LogOut size={15} />
              <span>Exit</span>
            </motion.button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openAuthModal('login')}
              className="btn btn-ghost btn-sm"
              style={{
                color: '#c4b5fd',
                fontSize: '0.84rem',
                fontWeight: 600,
                gap: 6,
              }}
            >
              <LogIn size={15} />
              Sign In
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 16px rgba(124, 58, 237, 0.5)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openAuthModal('register')}
              className="btn btn-primary btn-sm"
              style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                borderRadius: 9999,
                padding: '7px 16px',
              }}
            >
              Get Started
            </motion.button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
