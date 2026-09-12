import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Sparkles, Droplets, Wind } from 'lucide-react';
import { WaveCanvas } from './components/WaveCanvas';

type WaveMode = 'gentle' | 'drift' | 'tidal';

const waveModes: { id: WaveMode; label: string; speed: number; icon: typeof Waves; desc: string }[] = [
  { id: 'gentle', label: 'Gentle Swell', speed: 0.7, icon: Wind, desc: 'Calm sinusoidal rhythm' },
  { id: 'drift', label: 'Ocean Drift', speed: 1.1, icon: Waves, desc: 'Natural harmonic currents' },
  { id: 'tidal', label: 'Tidal Flow', speed: 1.7, icon: Droplets, desc: 'Vibrant undulating crests' },
];

export default function App() {
  const [activeMode, setActiveMode] = useState<WaveMode>('drift');
  const currentSpeed = waveModes.find((m) => m.id === activeMode)?.speed ?? 1.1;

  return (
    <main
      id="main-container"
      className="min-h-screen w-full flex flex-col justify-between items-center px-6 py-8 sm:px-12 sm:py-12 bg-[#060c18] text-slate-100 relative overflow-hidden selection:bg-sky-500/30 selection:text-sky-100"
    >
      {/* Dynamic Animated Canvas Wave Engine */}
      <WaveCanvas speedMultiplier={currentSpeed} interactive={true} />

      {/* Ambient subtle glow overlay */}
      <div
        id="bg-ambient-light"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] sm:w-[50rem] sm:h-[50rem] rounded-full bg-sky-600/10 blur-[120px] z-[1]"
      />

      {/* Top Header / Brand mark */}
      <motion.header
        id="site-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl flex items-center justify-between text-xs tracking-widest uppercase font-medium text-sky-200/60 z-10"
      >
        <div id="brand-tag" className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
          </span>
          <span className="text-sky-200 font-semibold tracking-wider">AQUAMARINE</span>
        </div>

        <div id="status-tag" className="flex items-center gap-2 text-sky-300/70">
          <Waves className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>Live Wave Flow</span>
        </div>
      </motion.header>

      {/* Main Center Content */}
      <div
        id="center-content-wrapper"
        className="my-auto w-full max-w-2xl flex flex-col items-center justify-center text-center z-10 px-4 py-8"
      >
        <motion.div
          id="greeting-frame"
          initial={{ opacity: 0, scale: 0.95, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative w-full rounded-2xl border border-sky-400/20 bg-slate-900/50 backdrop-blur-xl px-8 py-12 sm:px-14 sm:py-16 shadow-[0_8px_32px_rgba(2,132,199,0.12)]"
        >
          {/* Subtle corner detail markers */}
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-sky-400/70" aria-hidden="true" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-sky-400/70" aria-hidden="true" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-sky-400/70" aria-hidden="true" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-sky-400/70" aria-hidden="true" />

          {/* Subheading pill */}
          <motion.div
            id="greeting-subheading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-300 text-xs font-medium tracking-wide shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Harmonic Tide</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            id="main-heading"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-display text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-sky-100 to-sky-300 leading-[1.05] mb-5 drop-shadow-[0_2px_18px_rgba(56,189,248,0.2)]"
          >
            Hello, World.
          </motion.h1>

          {/* Description */}
          <motion.p
            id="greeting-description"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="font-sans-ui text-base sm:text-lg text-sky-200/80 max-w-lg mx-auto font-normal leading-relaxed mb-8"
          >
            Immersed in fluid motion, deep oceanic azure tones, and continuous ambient wave rhythms.
          </motion.p>

          {/* Wave Motion Controls */}
          <motion.div
            id="wave-controls"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-sky-500/15"
          >
            {waveModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  id={`wave-btn-${mode.id}`}
                  onClick={() => setActiveMode(mode.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 font-semibold shadow-[0_0_16px_rgba(14,165,233,0.5)] scale-105'
                      : 'bg-slate-800/60 text-sky-300/80 hover:text-sky-100 hover:bg-slate-800 border border-sky-500/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        id="site-footer"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-full max-w-4xl flex items-center justify-between text-xs text-sky-300/50 font-sans-ui z-10 pt-4"
      >
        <span id="footer-copyright">Ocean Wave Synthesizer</span>
        <span id="footer-status">Fluid 60 FPS Canvas</span>
      </motion.footer>
    </main>
  );
}

