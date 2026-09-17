export type HeroClassId = 'commando' | 'demolitionist' | 'scout';

export interface HeroClassConfig {
  id: HeroClassId;
  name: string;
  role: string;
  tagline: string;
  description: string;
  badge: string;
  color: string;
  accentColor: string;
  glowColor: string;
  bulletColor: string;
  baseHp: number;
  baseSpeed: number;
  baseFireRate: number; // shots per second
  baseBulletDamage: number;
  basePierce: number;
  magnetRange: number;
  dashCooldown: number; // seconds
  startingPerk: string;
  stats: {
    firepower: number; // 1-5 stars
    survivability: number;
    mobility: number;
    tech: number;
  };
}

export const HERO_CLASSES: Record<HeroClassId, HeroClassConfig> = {
  commando: {
    id: 'commando',
    name: 'Commando',
    role: 'Heavy Assault',
    tagline: 'Rapid Firepower & Bullet Penetration',
    description: 'Battlefield-tested veteran equipped with a high-caliber assault rifle. Shreds hordes with high rate of fire and penetrating ammunition.',
    badge: '🎖️',
    color: '#3b82f6', // Cobalt blue / navy
    accentColor: '#60a5fa',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    bulletColor: '#60a5fa',
    baseHp: 100,
    baseSpeed: 3.8,
    baseFireRate: 3.6, // +28% fire rate
    baseBulletDamage: 24,
    basePierce: 2, // starts with pierce 2
    magnetRange: 120,
    dashCooldown: 2.5,
    startingPerk: '+28% Fire Rate & +1 Natural Bullet Pierce',
    stats: {
      firepower: 5,
      survivability: 3,
      mobility: 3,
      tech: 2
    }
  },
  demolitionist: {
    id: 'demolitionist',
    name: 'Demolitionist',
    role: 'Blast Engineer',
    tagline: 'Explosive Payload & Area Denial',
    description: 'Heavy explosive specialist clad in blast-proof armor. Bullets trigger micro-detonations and starts with an Orbiting Plasma Saw.',
    badge: '💥',
    color: '#f97316', // Blaze orange
    accentColor: '#fb923c',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    bulletColor: '#fb923c',
    baseHp: 130, // Tougher
    baseSpeed: 3.5,
    baseFireRate: 2.8,
    baseBulletDamage: 30, // Heavy damage
    basePierce: 1,
    magnetRange: 120,
    dashCooldown: 2.8,
    startingPerk: 'Explosive Rounds + Starts with 1 Orbiting Plasma Saw',
    stats: {
      firepower: 4,
      survivability: 5,
      mobility: 2,
      tech: 3
    }
  },
  scout: {
    id: 'scout',
    name: 'Recon Scout',
    role: 'Cyber Infiltrator',
    tagline: 'Hyper Mobility & Autonomous Drone',
    description: 'Agile operative armed with cybernetic thrust boosters and an automated combat drone companion that snipes approaching zombies.',
    badge: '⚡',
    color: '#06b6d4', // Neon cyan
    accentColor: '#22d3ee',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    bulletColor: '#22d3ee',
    baseHp: 85,
    baseSpeed: 4.6, // Fast cyber mobility
    baseFireRate: 3.2,
    baseBulletDamage: 22,
    basePierce: 1,
    magnetRange: 190, // Huge magnet range
    dashCooldown: 1.5, // Ultra-fast dash
    startingPerk: 'Rapid 1.5s Dash, +60% Magnet & Starts with Combat Drone',
    stats: {
      firepower: 3,
      survivability: 2,
      mobility: 5,
      tech: 5
    }
  }
};
