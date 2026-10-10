import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playHoverSound } from '../utils/soundFX';
import useStore from '../store/useStore';

/**
 * 3D Holographic Perspective Tilt Card
 * Delivers an Apple Vision Pro / Web3 tier interactive experience:
 * - 3D rotation tracking cursor coordinates (rotateX / rotateY)
 * - Dynamic specular light sheen gliding over the surface
 * - Iridescent chromatic glow borders
 * - Synthesized cosmic hover chime
 */
export default function HoloCard({
  children,
  className = '',
  style = {},
  glowColor = '#7c3aed',
  onClick,
  maxTilt = 10,
  scaleOnHover = 1.025,
  ...props
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const soundEnabled = useStore((s) => s.soundEnabled);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -maxTilt;
    const rY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseEnter = () => {
    playHoverSound(soundEnabled);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      whileHover={{ scale: scaleOnHover }}
      className={`holo-card ${className}`}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        borderRadius: 20,
        background: 'rgba(11, 8, 36, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(124, 58, 237, 0.22)',
        boxShadow: `0 12px 40px rgba(0, 0, 0, 0.55), 0 0 30px ${glowColor}15`,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      {...props}
    >
      {/* Specular Holographic Glare Follower */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          background: `radial-gradient(circle 260px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), rgba(124, 58, 237, ${glarePos.opacity * 0.4}) 35%, transparent 70%)`,
          transition: 'opacity 0.25s ease',
          zIndex: 10,
        }}
      />

      {/* Iridescent Top Accent Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${glowColor}, #06b6d4, transparent)`,
          zIndex: 11,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
}
