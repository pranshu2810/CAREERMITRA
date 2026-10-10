import React from 'react';
import { motion } from 'framer-motion';
import { Compass, LayoutDashboard, GitCompare, User, BookOpen, Telescope } from 'lucide-react';
import useStore from '../store/useStore';

const NAV_ITEMS = [
  { id: 'galaxy',   icon: Telescope,      label: 'Galaxy',   desc: 'Explore careers' },
  { id: 'roadmap',  icon: BookOpen,       label: 'Roadmap',  desc: 'AI roadmap' },
  { id: 'progress', icon: LayoutDashboard,label: 'Progress', desc: 'Track skills' },
  { id: 'compare',  icon: GitCompare,     label: 'Compare',  desc: 'Career comparison' },
  { id: 'profile',  icon: User,           label: 'Profile',  desc: 'Your profile' },
];

export default function Navbar() {
  const { activeView, setActiveView, comparedCareers } = useStore();

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
        background: 'rgba(4, 3, 13, 0.7)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.15)',
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => setActiveView('galaxy')}
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
            NAVIGATE YOUR DESTINY
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

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 10px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
          AI Active
        </div>
      </div>
    </motion.nav>
  );
}
