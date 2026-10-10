import React, { useEffect, useRef } from 'react';

// Animated star field background component
export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate stars
    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
      color: randomStarColor(),
    }));

    // Shooting stars
    const shootingStars = [];
    let shootTimer = 0;

    function randomStarColor() {
      const colors = ['#ffffff', '#c4b5fd', '#67e8f9', '#fcd34d', '#fda4af'];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function spawnShootingStar() {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.5),
        len: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 4,
        alpha: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        const twinkle = Math.sin(frame * star.speed + star.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.05, star.alpha + twinkle);
        ctx.fill();
      });

      // Shooting stars
      shootTimer++;
      if (shootTimer > 120 + Math.random() * 200) {
        spawnShootingStar();
        shootTimer = 0;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.beginPath();
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len * Math.cos(s.angle), s.y - s.len * Math.sin(s.angle));
        grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = s.alpha;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.len * Math.cos(s.angle), s.y + s.len * Math.sin(s.angle));
        ctx.stroke();
        s.x += s.speed * Math.cos(s.angle);
        s.y += s.speed * Math.sin(s.angle);
        s.alpha -= 0.02;
        if (s.alpha <= 0) shootingStars.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      frame++;
      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.9,
      }}
    />
  );
}
