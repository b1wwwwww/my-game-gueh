export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  x: number;
  y: number;
  radius: number;
  speed: number;
  baseSpeed: number;
  hp: number;
  maxHp: number;
  angle: number;
  fireCooldown: number;
  fireRate: number; // shots per second
  bulletDamage: number;
  bulletSpeed: number;
  bulletPierce: number;
  bulletCount: number;
  bulletSpread: number;
  magnetRange: number;
  explosiveRadius: number;
  shieldActive: boolean;
  shieldCooldown: number;
  invincibleTimer: number;
  // Active temporary buffs from Supply Drops
  damageBoostTimer: number; // seconds remaining
  magnetBoostTimer: number; // seconds remaining
  rapidBoostTimer: number;  // seconds remaining
  speedBoostTimer: number;  // seconds remaining
}

export type SupplyDropType = 'MASSIVE_DAMAGE' | 'SUPER_MAGNET' | 'OVERDRIVE_RAPID' | 'HYPER_SPEED' | 'TACTICAL_NUKE';

export interface SupplyDrop {
  id: number;
  x: number;
  y: number;
  targetY: number;
  type: SupplyDropType;
  title: string;
  duration: number; // seconds duration once picked up
  parachuteY: number; // starts high, falls down to arena
  isLanded: boolean;
  pulseTimer: number;
  radius: number;
  color: string;
  iconSymbol: string;
}

export interface BossShockwave {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  damage: number;
  hitPlayer: boolean;
  color: string;
}

export interface BossMinionSpawn {
  x: number;
  y: number;
}

export interface Zombie {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  hp: number;
  maxHp: number;
  damage: number;
  isBoss: boolean;
  color: string;
  flashTimer: number;
  angle: number;
  walkCycle: number;
  scoreValue: number;
  coinValue: number;
  // Boss Skill Properties
  bossSkillCooldown?: number;
  bossSkillTimer?: number;
  bossState?: 'CHASING' | 'CHARGING' | 'SLAM_WINDUP' | 'SLAMMING' | 'ENRAGED';
  bossChargeTarget?: { x: number; y: number; vx: number; vy: number };
  bossDialogueText?: string;
  bossDialogueTimer?: number;
  bossSlamRadius?: number;
  enraged?: boolean;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  pierceLeft: number;
  distanceTraveled: number;
  maxDistance: number;
  explosiveRadius: number;
  hitZombieIds: Set<number>;
}

export interface Coin {
  id: number;
  x: number;
  y: number;
  radius: number;
  value: number;
  pulseTimer: number;
  beingAttracted: boolean;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  life: number;
  maxLife: number;
  vy: number;
  isCrit?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface BloodSplat {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export interface Barrel {
  id: number;
  x: number;
  y: number;
  radius: number;
  hp: number;
}

export interface UpgradeOption {
  id: string;
  title: string;
  description: string;
  category: 'offense' | 'defense' | 'utility';
  icon: string;
  tier: 'common' | 'rare' | 'epic';
}

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'UPGRADE' | 'GAMEOVER';
