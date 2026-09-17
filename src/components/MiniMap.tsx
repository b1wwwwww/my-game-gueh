import React, { useRef, useEffect, useState } from 'react';
import { GameEngine } from '../game/engine';
import { Radar, Package, Skull, Crosshair, ChevronDown, ChevronUp } from 'lucide-react';

interface MiniMapProps {
  engine: GameEngine | null;
}

export const MiniMap: React.FC<MiniMapProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zombieCount, setZombieCount] = useState(0);
  const [bossPresent, setBossPresent] = useState(false);
  const [activeDropsCount, setActiveDropsCount] = useState(0);

  // Map canvas logical resolution (matches 1800:1400 aspect ratio)
  const mapWidth = 180;
  const mapHeight = 140;

  useEffect(() => {
    let animationFrameId: number;
    let sweepAngle = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas || !engine) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const arenaW = engine.arenaWidth || 1800;
      const arenaH = engine.arenaHeight || 1400;
      const scaleX = mapWidth / arenaW;
      const scaleY = mapHeight / arenaH;

      // Update counters for UI header
      setZombieCount(engine.zombies.length);
      setActiveDropsCount(engine.supplyDrops.length);
      const hasBoss = engine.zombies.some((z) => z.isBoss);
      setBossPresent(hasBoss);

      // Clear canvas
      ctx.clearRect(0, 0, mapWidth, mapHeight);

      // 1. Radar Background with Grid
      ctx.fillStyle = 'rgba(10, 14, 22, 0.9)';
      ctx.fillRect(0, 0, mapWidth, mapHeight);

      // Grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.lineWidth = 1;
      const gridStepX = mapWidth / 4;
      const gridStepY = mapHeight / 4;

      ctx.beginPath();
      for (let x = gridStepX; x < mapWidth; x += gridStepX) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, mapHeight);
      }
      for (let y = gridStepY; y < mapHeight; y += gridStepY) {
        ctx.moveTo(0, y);
        ctx.lineTo(mapWidth, y);
      }
      ctx.stroke();

      // Radar concentric distance circles from center
      const centerX = mapWidth / 2;
      const centerY = mapHeight / 2;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
      ctx.stroke();

      // Sweeping radar beam
      sweepAngle = (sweepAngle + 0.04) % (Math.PI * 2);
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(sweepAngle) * 90,
        centerY + Math.sin(sweepAngle) * 90
      );
      ctx.stroke();
      ctx.restore();

      // 2. Arena Outer Hazard Border
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, mapWidth - 2, mapHeight - 2);

      // 3. Explosive Barrels
      if (engine.barrels) {
        ctx.fillStyle = 'rgba(249, 115, 22, 0.7)';
        for (const b of engine.barrels) {
          const bx = b.x * scaleX;
          const by = b.y * scaleY;
          ctx.beginPath();
          ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Incoming Zombie Clusters
      for (const z of engine.zombies) {
        const zx = z.x * scaleX;
        const zy = z.y * scaleY;

        if (z.isBoss) {
          // Boss Marker: Large pulsing crimson/purple skull beacon
          const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.3;
          const bossRadius = 5.5 * pulse;

          // Threat ring
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(zx, zy, bossRadius + 3, 0, Math.PI * 2);
          ctx.stroke();

          // Boss center
          ctx.fillStyle = z.enraged ? '#e11d48' : '#a855f7';
          ctx.beginPath();
          ctx.arc(zx, zy, bossRadius, 0, Math.PI * 2);
          ctx.fill();

          // Text label
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 7px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('BOSS', zx, zy - bossRadius - 2);
        } else {
          // Standard Zombie: Red glowing blip
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 3;
          ctx.beginPath();
          ctx.arc(zx, zy, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 5. Active Supply Drops (Parachuting & Landed)
      for (const drop of engine.supplyDrops) {
        const dx = drop.x * scaleX;
        const dy = drop.y * scaleY;
        const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.25;

        // Supply drop beacon halo
        ctx.strokeStyle = drop.color || '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(dx, dy, (drop.isLanded ? 6 : 8) * pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Crate square marker
        const crateSize = 5.5;
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(dx - crateSize / 2, dy - crateSize / 2, crateSize, crateSize);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.strokeRect(dx - crateSize / 2, dy - crateSize / 2, crateSize, crateSize);

        // Status pill indicator
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 6.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(drop.isLanded ? 'CRATE' : 'DROP', dx, dy - 7);
      }

      // 6. Camera Viewport Boundary (Shows currently visible area on screen)
      if (engine.canvas) {
        const viewX = engine.cameraX * scaleX;
        const viewY = engine.cameraY * scaleY;
        const viewW = engine.canvas.width * scaleX;
        const viewH = engine.canvas.height * scaleY;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(viewX, viewY, viewW, viewH);
        ctx.setLineDash([]);
      }

      // 7. Player Position & Aiming Cone
      if (engine.player) {
        const px = engine.player.x * scaleX;
        const py = engine.player.y * scaleY;
        const angle = engine.player.angle || 0;

        // Player directional aiming cone
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);

        // Forward arrow
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(0, -3.5);
        ctx.lineTo(2, 0);
        ctx.lineTo(0, 3.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Player dot with glowing beacon
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(px, py, 3.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [engine]);

  return (
    <div
      id="mini-map-container"
      className="absolute bottom-4 left-4 z-30 flex flex-col bg-neutral-950/85 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden pointer-events-auto transition-all"
    >
      {/* Mini-Map Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900/90 border-b border-neutral-800 text-[11px] font-mono select-none">
        <div className="flex items-center gap-1.5 font-bold text-neutral-300">
          <Radar className={`w-3.5 h-3.5 text-cyan-400 ${bossPresent ? 'animate-spin' : ''}`} />
          <span className="tracking-wider">RADAR</span>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 text-[10px]">
          {activeDropsCount > 0 && (
            <div className="flex items-center gap-1 text-cyan-400 font-semibold animate-pulse">
              <Package className="w-3 h-3" />
              <span>{activeDropsCount}</span>
            </div>
          )}

          <div className={`flex items-center gap-0.5 font-semibold ${bossPresent ? 'text-rose-400 font-bold' : 'text-red-400'}`}>
            <Skull className="w-3 h-3" />
            <span>{zombieCount}</span>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
            title={isCollapsed ? 'Expand Mini-Map' : 'Minimize Mini-Map'}
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mini-Map Radar Canvas */}
      {!isCollapsed && (
        <div className="relative p-1.5 bg-neutral-950/90">
          <canvas
            ref={canvasRef}
            width={mapWidth}
            height={mapHeight}
            className="block rounded-lg border border-neutral-800/80 bg-neutral-950 shadow-inner cursor-crosshair"
          />

          {/* Radar Legend Footer */}
          <div className="flex items-center justify-between px-1.5 pt-1 text-[9px] text-neutral-400 font-mono">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_4px_#38bdf8]" />
              <span>YOU</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_4px_#ef4444]" />
              <span>SWARM</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-sky-500 inline-block shadow-[0_0_4px_#0284c7]" />
              <span>DROP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
