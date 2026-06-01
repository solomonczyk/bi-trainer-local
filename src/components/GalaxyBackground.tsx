import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  life: number;
  orbit: number;
  radius: number;
  speed: number;
  color: string;
}

interface Config {
  density: number;
  speed: number;
  spread: number;
  tightness: number;
  turbulence: number;
}

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const configRef = useRef<Config>({
    density: 0.6,
    speed: 0.45,
    spread: 0.9,
    tightness: 1.0,
    turbulence: 0.7,
  });
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const pausedRef = useRef(false);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (ctx) ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    createGalaxy();
  }, []);

  const colorFor = (mix: number, seed: number): string => {
    if (mix < 0.18) return `rgba(255, ${190 + seed * 44}, ${82 + seed * 48},`;
    if (mix < 0.56) return seed > 0.5 ? 'rgba(255, 106, 162,' : 'rgba(255, 136, 104,';
    return seed > 0.48 ? 'rgba(107, 220, 255,' : 'rgba(183, 122, 255,';
  };

  const createGalaxy = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const config = configRef.current;
    const smallerSide = Math.min(width, height);
    const count = Math.floor(smallerSide * smallerSide * 0.009 * config.density);
    const armCount = 5;
    const radius = Math.min(width, height) * 0.47 * config.spread;
    const stars: Star[] = [];

    for (let i = 0; i < count; i++) {
      const arm = i % armCount;
      const branchAngle = (arm / armCount) * Math.PI * 2;
      const distance = Math.pow(Math.random(), 0.64) * radius;
      const spin = distance * 0.018 * config.tightness;
      const scatter = (Math.random() - 0.5) * config.turbulence * (distance / radius) * 1.8;
      const orbit = branchAngle + spin + scatter;
      const heightLift = (Math.random() - 0.5) * 0.36 * distance;
      const size = 0.45 + Math.random() * (distance < radius * 0.24 ? 2.2 : 1.35);
      const life = Math.random() * Math.PI * 2;
      const hueMix = distance / radius;

      stars.push({
        x: Math.cos(orbit) * distance,
        y: Math.sin(orbit) * distance * 0.58 + heightLift,
        z: Math.random() * 0.58 + 0.58,
        size,
        life,
        orbit,
        radius: distance,
        speed: 0.00032 + Math.random() * 0.00095,
        color: colorFor(hueMix, Math.random()),
      });
    }

    starsRef.current = stars;
  }, []);

  const drawGalaxy = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const config = configRef.current;
    const mouse = mouseRef.current;

    // Smooth mouse follow
    mouse.targetX += (mouse.x - mouse.targetX) * 0.04;
    mouse.targetY += (mouse.y - mouse.targetY) * 0.04;

    frameRef.current += config.speed;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2 + mouse.targetX * 0.06;
    const centerY = height * (width < 720 ? 0.55 : 0.53) + mouse.targetY * 0.04;

    const rotation = frameRef.current * 0.0035;

    // Core glow
    const glowRadius = Math.min(width, height) * 0.42;
    const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
    glow.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
    glow.addColorStop(0.32, 'rgba(168, 85, 247, 0.10)');
    glow.addColorStop(1, 'rgba(107, 220, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'lighter';

    const stars = starsRef.current;
    stars.forEach((star) => {
      const angle = rotation + star.orbit + frameRef.current * star.speed + mouse.targetX * 0.00008;
      const wave = Math.sin(frameRef.current * 0.024 + star.life) * 0.5 + 0.5;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = centerX + cos * star.radius * 0.9 - sin * star.y * 0.18;
      const y = centerY + sin * star.radius * 0.52 + star.y * 0.35;
      const alpha = (0.22 + wave * 0.68) * star.z;
      const radius = star.size * (0.8 + wave * 0.55);

      ctx.beginPath();
      ctx.fillStyle = `${star.color} ${alpha})`;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';

    // Core star
    ctx.beginPath();
    ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
    ctx.shadowColor = 'rgba(99, 102, 241, 0.7)';
    ctx.shadowBlur = 24;
    ctx.arc(centerX, centerY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (!pausedRef.current) {
      rafRef.current = requestAnimationFrame(drawGalaxy);
    }
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };

    const handleResize = () => {
      resize();
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('resize', handleResize);

    resize();
    drawGalaxy();

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [resize, drawGalaxy]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
