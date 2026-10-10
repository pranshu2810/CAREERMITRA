import React, { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

/**
 * 3D Interactive Cosmic Starfield & Nebula Particle Engine
 * Features:
 * - True 3D perspective projection (X, Y, Z coordinates)
 * - Mouse-driven camera parallax & inertia panning
 * - Continuous interstellar warp motion
 * - Hyperspace Warp Drive streak effect when switching routes
 * - Interactive cursor stardust trail
 * - Cosmic nebula clouds with breathing colors
 */
export default function StarField() {
  const canvasRef = useRef(null);
  const warpActive = useStore((s) => s.warpActive);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Mouse Tracking with smooth inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let cameraX = 0;
    let cameraY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetCameraX = (e.clientX - width / 2) * 0.22;
      targetCameraY = (e.clientY - height / 2) * 0.22;
      
      // Spawn cursor cosmic stardust
      if (Math.random() > 0.4) {
        cursorParticles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 2 + 1,
          alpha: 0.8,
          color: Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4',
        });
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── 3D Star Engine ──
    const STAR_COUNT = 360;
    const FOV = 320;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * 2200,
      y: (Math.random() - 0.5) * 2200,
      z: Math.random() * 1000 + 1,
      size: Math.random() * 1.5 + 0.5,
      color: getStarColor(),
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    function getStarColor() {
      const palette = ['#ffffff', '#c4b5fd', '#67e8f9', '#fbcfe8', '#fde047', '#a78bfa'];
      return palette[Math.floor(Math.random() * palette.length)];
    }

    // ── Cursor Stardust Particles ──
    const cursorParticles = [];

    // ── Shooting Stars ──
    const shootingStars = [];
    let shootTimer = 0;

    function spawnShootingStar() {
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.45),
        len: Math.random() * 90 + 50,
        speed: Math.random() * 10 + 6,
        alpha: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.35,
        color: Math.random() > 0.5 ? '#67e8f9' : '#c4b5fd',
      });
    }

    // ── Nebula Cloud Centers ──
    const nebulae = [
      { x: width * 0.2, y: height * 0.3, r: 350, color: 'rgba(124, 58, 237, 0.08)', drift: 0.001 },
      { x: width * 0.8, y: height * 0.7, r: 420, color: 'rgba(6, 182, 212, 0.07)', drift: -0.0015 },
      { x: width * 0.5, y: height * 0.85, r: 300, color: 'rgba(236, 72, 153, 0.05)', drift: 0.0008 },
    ];

    let frame = 0;

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Camera inertia smoothing
      cameraX += (targetCameraX - cameraX) * 0.05;
      cameraY += (targetCameraY - cameraY) * 0.05;

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Nebula Glows
      nebulae.forEach((nebula, idx) => {
        const pulse = Math.sin(frame * 0.01 + idx) * 30;
        const grad = ctx.createRadialGradient(
          nebula.x - cameraX * 0.2,
          nebula.y - cameraY * 0.2,
          10,
          nebula.x - cameraX * 0.2,
          nebula.y - cameraY * 0.2,
          nebula.r + pulse
        );
        grad.addColorStop(0, nebula.color);
        grad.addColorStop(1, 'rgba(4, 3, 13, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nebula.x - cameraX * 0.2, nebula.y - cameraY * 0.2, nebula.r + pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw 3D Stars
      const baseSpeed = warpActive ? 22 : 0.85;

      stars.forEach((star) => {
        const prevZ = star.z;
        star.z -= baseSpeed;

        if (star.z <= 1) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * 2200;
          star.y = (Math.random() - 0.5) * 2200;
        }

        // 3D Perspective Projection
        const k = FOV / star.z;
        const px = (star.x - cameraX) * k + centerX;
        const py = (star.y - cameraY) * k + centerY;

        // Check screen bounds
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const depthAlpha = Math.min(1, Math.max(0.1, (1000 - star.z) / 900));
          const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinklePhase) * 0.25;
          const finalAlpha = Math.max(0.08, Math.min(1, depthAlpha + twinkle));
          const starRadius = Math.max(0.6, (star.size * (1000 - star.z)) / 600);

          if (warpActive) {
            // Draw Hyperspace Light Streak
            const prevK = FOV / prevZ;
            const prevPx = (star.x - cameraX) * prevK + centerX;
            const prevPy = (star.y - cameraY) * prevK + centerY;

            ctx.beginPath();
            ctx.strokeStyle = star.color;
            ctx.lineWidth = starRadius * 1.5;
            ctx.globalAlpha = finalAlpha;
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            // Normal 3D glowing star
            ctx.beginPath();
            ctx.arc(px, py, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = finalAlpha;
            ctx.fill();

            // Soft aura on closer stars
            if (star.z < 350) {
              ctx.beginPath();
              ctx.arc(px, py, starRadius * 2.8, 0, Math.PI * 2);
              ctx.fillStyle = star.color;
              ctx.globalAlpha = finalAlpha * 0.25;
              ctx.fill();
            }
          }
        }
      });

      // 3. Draw Shooting Stars
      shootTimer++;
      if (shootTimer > 180 + Math.random() * 260) {
        spawnShootingStar();
        shootTimer = 0;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.beginPath();
        const tailX = s.x - s.len * Math.cos(s.angle);
        const tailY = s.y - s.len * Math.sin(s.angle);

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, s.color);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = s.alpha;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        s.x += s.speed * Math.cos(s.angle);
        s.y += s.speed * Math.sin(s.angle);
        s.alpha -= 0.016;

        if (s.alpha <= 0) shootingStars.splice(i, 1);
      }

      // 4. Draw Cursor Cosmic Stardust
      for (let i = cursorParticles.length - 1; i >= 0; i--) {
        const p = cursorParticles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;
        p.radius *= 0.96;

        if (p.alpha <= 0 || p.radius < 0.2) {
          cursorParticles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      frame++;
      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [warpActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 20%, #0c0828 0%, #050314 60%, #02000a 100%)',
      }}
    />
  );
}
