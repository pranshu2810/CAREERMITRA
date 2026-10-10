import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import StarField from './components/StarField';
import Navbar from './components/Navbar';
import CareerGalaxy from './components/CareerGalaxy';
import AuthModal from './components/AuthModal';
import GamificationHUD from './components/GamificationHUD';
import useStore from './store/useStore';

// Lazy-load views
const LandingView        = lazy(() => import('./pages/LandingView'));
const RoadmapView        = lazy(() => import('./pages/RoadmapView'));
const CompareView        = lazy(() => import('./pages/CompareView'));
const ProfileView        = lazy(() => import('./pages/ProfileView'));
const ProgressView       = lazy(() => import('./pages/ProgressView'));
const QuizAssessmentView = lazy(() => import('./pages/QuizAssessmentView'));
const ProjectPortalView  = lazy(() => import('./pages/ProjectPortalView'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div className="spinner" />
      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Navigating cosmos…</div>
    </div>
  );
}

const VIEW_COMPONENTS = {
  landing:  <Suspense fallback={<PageLoader />}><LandingView /></Suspense>,
  galaxy:   <CareerGalaxy />,
  roadmap:  <Suspense fallback={<PageLoader />}><RoadmapView /></Suspense>,
  compare:  <Suspense fallback={<PageLoader />}><CompareView /></Suspense>,
  profile:  <Suspense fallback={<PageLoader />}><ProfileView /></Suspense>,
  progress: <Suspense fallback={<PageLoader />}><ProgressView /></Suspense>,
  quiz:     <Suspense fallback={<PageLoader />}><QuizAssessmentView /></Suspense>,
  projects: <Suspense fallback={<PageLoader />}><ProjectPortalView /></Suspense>,
};

export default function App() {
  const { activeView, initAuthSession } = useStore();

  React.useEffect(() => {
    if (initAuthSession) {
      initAuthSession();
    }
  }, []);

  return (
    <>
      {/* Animated starfield canvas */}
      <StarField />

      {/* Navigation bar */}
      <Navbar />

      {/* Page content with animated transitions */}
      <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {VIEW_COMPONENTS[activeView] || VIEW_COMPONENTS['landing']}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Authentication Modal & Gamification HUD */}
      <AuthModal />
      <GamificationHUD />

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        gutter={8}
        toastOptions={{
          duration: 3200,
          style: {
            background: 'rgba(8, 6, 28, 0.95)',
            color: '#f0ecff',
            border: '1px solid rgba(124, 58, 237, 0.35)',
            borderRadius: '12px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            backdropFilter: 'blur(20px)',
          },
        }}
      />
    </>
  );
}
