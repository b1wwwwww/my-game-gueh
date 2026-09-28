export type HeroClassId = 'commando' | 'demolitionist' | 'scout';

export interface HeroClassConfig {
  id: HeroClassId;
  name: string;
  callsign: string;
  code: string;
  division: string;
  role: string;
  tagline: string;
  description: string;
  badge: string;
  portrait?: string;
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
    callsign: 'STRIKER-1',
    code: 'VNG-01',
    division: 'Vanguard Assault Corp',
    role: 'Heavy Assault',
    tagline: 'Rapid Firepower & Bullet Penetration',
    description: 'Battlefield-tested veteran equipped with a high-caliber assault rifle. Shreds hordes with high rate of fire and penetrating ammunition.',
    badge: 'VNG',
    color: '#2563eb', // Cobalt blue / navy
    accentColor: '#60a5fa',
    glowColor: 'rgba(37, 99, 235, 0.4)',
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
    callsign: 'VULCAN-7',
    code: 'ORD-02',
    division: 'Siege & Ordnance Division',
    role: 'Blast Engineer',
    tagline: 'Explosive Payload & Area Denial',
    description: 'Heavy explosive specialist clad in blast-proof armor. Bullets trigger micro-detonations and starts with an Orbiting Plasma Saw.',
    badge: 'ORD',
    color: '#ea580c', // Blaze orange
    accentColor: '#fb923c',
    glowColor: 'rgba(234, 88, 12, 0.4)',
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
    callsign: 'SPECTRE-9',
    code: 'RCN-03',
    division: 'Cyber Reconnaissance Wing',
    role: 'Cyber Infiltrator',
    tagline: 'Hyper Mobility & Autonomous Drone',
    description: 'Agile operative armed with cybernetic thrust boosters and an automated combat drone companion that snipes approaching zombies.',
    badge: 'RCN',
    color: '#0891b2', // Neon cyan
    accentColor: '#22d3ee',
    glowColor: 'rgba(8, 145, 178, 0.4)',
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
