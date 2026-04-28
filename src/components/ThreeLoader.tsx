import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// ── Satellite (Glowing Orb that orbits the Earth) ──
function Satellite() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      // Smaller Orbit path
      groupRef.current.position.x = Math.cos(t * 1.5) * 1.2;
      groupRef.current.position.z = Math.sin(t * 1.5) * 1.2;
      groupRef.current.position.y = Math.sin(t * 3) * 0.3; // slight wobble
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[0.04, 16, 16]}>
        <meshToonMaterial color="#00ffcc" />
      </Sphere>
      {/* Radar scanning cone / line */}
      <Line
        points={[[0, 0, 0], [0, -0.6, 0]]}
        color="#00ffcc"
        lineWidth={2}
        transparent
        opacity={0.7}
      />
    </group>
  );
}

// ── Cartoon/Anime Earth ──
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.005;
      earthRef.current.rotation.x += 0.002;
    }
  });

  return (
    <Sphere ref={earthRef} args={[0.6, 32, 32]}>
      <meshToonMaterial 
        color="#3b82f6" 
      />
    </Sphere>
  );
}

// ── Main Loader Component ──
interface ThreeLoaderProps {
  onLoadComplete?: () => void;
  minDisplayTime?: number;
}

export default function ThreeLoader({ onLoadComplete, minDisplayTime = 3000 }: ThreeLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Use rAF for a perfectly smooth, constant-speed linear fill at ~60fps
    const startTime = performance.now();
    let rafId: number;
    let completed = false;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min((elapsed / minDisplayTime) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else if (!completed) {
        completed = true;
        setIsFading(true);
        setTimeout(() => {
          if (onLoadComplete) onLoadComplete();
        }, 800);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [minDisplayTime, onLoadComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <Earth />
          <Satellite />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-64">
        <div className="text-blue-500 font-mono tracking-[0.3em] text-sm md:text-base mb-4 animate-pulse">
          INITIALIZING SURVEILLANCE
        </div>
        
        {/* Loading Bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-[#00ffcc] shadow-[0_0_10px_#00ffcc] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-gray-500 font-mono text-xs">
          {Math.round(progress)}% / SYSTEM ONLINE
        </div>
      </div>
      
      {/* Cinematic Grain/Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-20" />
    </div>
  );
}
