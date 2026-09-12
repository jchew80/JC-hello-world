import { useEffect, useRef } from 'react';

interface WaveCanvasProps {
  speedMultiplier?: number;
  interactive?: boolean;
}

export function WaveCanvas({ speedMultiplier = 1, interactive = true }: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number; isHovering: boolean }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    isHovering: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let time = 0;

    // Particle bubbles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      pulseSpeed: number;
    }

    const particles: Particle[] = [];
    const numParticles = 45;

    const initParticles = (w: number, h: number) => {
      particles.length = 0;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2.5 + 0.8,
          speedY: Math.random() * 0.4 + 0.15,
          opacity: Math.random() * 0.5 + 0.2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.scale(dpr, dpr);

      if (particles.length === 0) {
        initParticles(width, height);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    resizeObserver.observe(canvas);
    resize();

    // Wave layer configurations
    const waveLayers = [
      {
        baseHeight: 0.72,
        amplitude: 38,
        wavelength: 0.0035,
        speed: 0.008,
        colorStart: 'rgba(3, 105, 161, 0.25)', // Sky 700
        colorEnd: 'rgba(2, 44, 94, 0.85)',
        crestColor: 'rgba(56, 189, 248, 0.4)',
        crestWidth: 1.5,
        phase: 0,
      },
      {
        baseHeight: 0.78,
        amplitude: 48,
        wavelength: 0.0028,
        speed: -0.006,
        colorStart: 'rgba(14, 165, 233, 0.28)', // Sky 500
        colorEnd: 'rgba(3, 37, 76, 0.9)',
        crestColor: 'rgba(125, 211, 252, 0.65)',
        crestWidth: 1.8,
        phase: 2.2,
      },
      {
        baseHeight: 0.84,
        amplitude: 42,
        wavelength: 0.0042,
        speed: 0.011,
        colorStart: 'rgba(2, 132, 199, 0.35)', // Sky 600
        colorEnd: 'rgba(2, 28, 59, 0.95)',
        crestColor: 'rgba(186, 230, 253, 0.75)',
        crestWidth: 2,
        phase: 4.1,
      },
      {
        baseHeight: 0.89,
        amplitude: 32,
        wavelength: 0.005,
        speed: 0.014,
        colorStart: 'rgba(56, 189, 248, 0.4)', // Sky 400
        colorEnd: 'rgba(1, 19, 41, 0.98)',
        crestColor: 'rgba(224, 242, 254, 0.9)',
        crestWidth: 2.2,
        phase: 1.3,
      },
    ];

    const render = () => {
      if (!ctx || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.02 * speedMultiplier;

      // Mouse smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle deep background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#060c18');
      bgGrad.addColorStop(0.5, '#08162f');
      bgGrad.addColorStop(1, '#050f24');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw ambient deep lighting glow
      const mx = mouseRef.current.x * width;
      const my = mouseRef.current.y * height;
      const glowGrad = ctx.createRadialGradient(mx, my, 20, mx, my, Math.max(width * 0.6, 400));
      glowGrad.addColorStop(0, 'rgba(14, 165, 233, 0.14)');
      glowGrad.addColorStop(0.5, 'rgba(3, 105, 161, 0.06)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw ambient floating particles/bubbles
      for (const p of particles) {
        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(time * p.pulseSpeed * 20));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${currentOpacity})`;
        ctx.fill();
      }

      // 4. Render layered flowing waves
      const mouseInfluence = mouseRef.current.isHovering ? (mouseRef.current.y - 0.5) * 40 : 0;
      const mouseXOffset = (mouseRef.current.x - 0.5) * 1.5;

      waveLayers.forEach((layer) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        const layerBaseY = height * layer.baseHeight + mouseInfluence;
        const currentSpeed = layer.speed * speedMultiplier;
        const currentPhase = layer.phase + time * currentSpeed * 60 + mouseXOffset;

        // Trace wave crest points
        for (let x = 0; x <= width; x += 4) {
          const harmonic1 = Math.sin(x * layer.wavelength + currentPhase) * layer.amplitude;
          const harmonic2 = Math.cos(x * layer.wavelength * 1.6 - currentPhase * 0.7) * (layer.amplitude * 0.35);
          const harmonic3 = Math.sin(x * layer.wavelength * 0.5 + currentPhase * 1.2) * (layer.amplitude * 0.2);

          const y = layerBaseY + harmonic1 + harmonic2 + harmonic3;

          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Wave body gradient
        const waveGrad = ctx.createLinearGradient(0, layerBaseY - layer.amplitude, 0, height);
        waveGrad.addColorStop(0, layer.colorStart);
        waveGrad.addColorStop(1, layer.colorEnd);
        ctx.fillStyle = waveGrad;
        ctx.fill();

        // Draw crisp luminous crest line
        ctx.beginPath();
        for (let x = 0; x <= width; x += 4) {
          const harmonic1 = Math.sin(x * layer.wavelength + currentPhase) * layer.amplitude;
          const harmonic2 = Math.cos(x * layer.wavelength * 1.6 - currentPhase * 0.7) * (layer.amplitude * 0.35);
          const harmonic3 = Math.sin(x * layer.wavelength * 0.5 + currentPhase * 1.2) * (layer.amplitude * 0.2);

          const y = layerBaseY + harmonic1 + harmonic2 + harmonic3;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = layer.crestColor;
        ctx.lineWidth = layer.crestWidth;
        ctx.shadowColor = layer.crestColor;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      mouseRef.current.targetX = Math.max(0, Math.min(1, x));
      mouseRef.current.targetY = Math.max(0, Math.min(1, y));
      mouseRef.current.isHovering = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.targetX = 0.5;
      mouseRef.current.targetY = 0.5;
      mouseRef.current.isHovering = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [speedMultiplier, interactive]);

  return (
    <canvas
      ref={canvasRef}
      id="wave-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none block z-0"
    />
  );
}
