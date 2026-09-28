import { sounds } from './audio';

export type AchievementCategory = 'combat' | 'survival' | 'progression' | 'tactics';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  badge: string; // Emoji or short badge
  target: number;
  current: number;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface LifetimeStats {
  lifetimeKills: number;
  highestWave: number;
  highestLevel: number;
  totalDashes: number;
  totalSupplyDrops: number;
  bossesDefeated: number;
  barrelsDetonated: number;
}

export interface CurrentMatchStats {
  kills: number;
  wave: number;
  level: number;
  dashesInMatch?: number;
  supplyDropsCollected?: number;
  bossesDefeatedInMatch?: number;
  barrelsDetonatedInMatch?: number;
  orbitingBladesCount?: number;
  droneActive?: boolean;
  teslaActive?: boolean;
}

const STORAGE_KEY_ACHIEVEMENTS = 'zombie_rush_achievements_v2';
const STORAGE_KEY_STATS = 'zombie_rush_lifetime_stats_v2';

export const INITIAL_ACHIEVEMENTS: Omit<Achievement, 'current' | 'unlocked'>[] = [
  {
    id: 'first_kill',
    title: 'First Blood',
    description: 'Slay your very first zombie in the arena',
    category: 'combat',
    badge: '🩸',
    target: 1
  },
  {
    id: 'kills_100',
    title: 'Zombie Hunter',
    description: 'Eliminate 100 zombies total across your runs',
    category: 'combat',
    badge: '🎯',
    target: 100
  },
  {
    id: 'kills_500',
    title: 'Undead Slayer',
    description: 'Eliminate 500 zombies total across your runs',
    category: 'combat',
    badge: '💀',
    target: 500
  },
  {
    id: 'kills_1000',
    title: '1,000 Total Kills',
    description: 'Slay 1,000 zombies! An unstoppable force of nature.',
    category: 'combat',
    badge: '🔥',
    target: 1000
  },
  {
    id: 'survived_3_waves',
    title: 'Survivor Initiate',
    description: 'Survive and reach Wave 3',
    category: 'survival',
    badge: '🛡️',
    target: 3
  },
  {
    id: 'survived_5_waves',
    title: 'Wave Conqueror',
    description: 'Survive Wave 5 and defeat the first Titan Boss',
    category: 'survival',
    badge: '⚔️',
    target: 5
  },
  {
    id: 'survived_10_waves',
    title: 'Survived 10 Waves',
    description: 'Withstand the relentless onslaught through Wave 10!',
    category: 'survival',
    badge: '👑',
    target: 10
  },
  {
    id: 'survived_15_waves',
    title: 'Immortal Survivor',
    description: 'Reach Wave 15 through the apex nightmare zone',
    category: 'survival',
    badge: '🌟',
    target: 15
  },
  {
    id: 'reach_level_5',
    title: 'Combat Specialist',
    description: 'Reach Level 5 in a single match',
    category: 'progression',
    badge: '⭐',
    target: 5
  },
  {
    id: 'reach_level_10',
    title: 'Apex Operative',
    description: 'Reach Level 10 in a single match',
    category: 'progression',
    badge: '🎖️',
    target: 10
  },
  {
    id: 'total_dashes_25',
    title: 'Slipstream Acrobat',
    description: 'Perform 25 tactical dodge rolls to evade danger',
    category: 'tactics',
    badge: '⚡',
    target: 25
  },
  {
    id: 'supply_drops_5',
    title: 'Supply Line',
    description: 'Retrieve 5 parachute air supply crates',
    category: 'tactics',
    badge: '📦',
    target: 5
  },
  {
    id: 'boss_slayer_1',
    title: 'Titanbane',
    description: 'Slay an Apex Titan boss in mortal combat',
    category: 'combat',
    badge: '💥',
    target: 1
  },
  {
    id: 'full_arsenal',
    title: 'Walking Arsenal',
    description: 'Equip all 3 Auto-Weapons at once (Blades, Drone & Tesla)',
    category: 'progression',
    badge: '🤖',
    target: 1
  },
  {
    id: 'barrels_10',
    title: 'Demolition Expert',
    description: 'Detonate 10 explosive hazard barrels',
    category: 'tactics',
    badge: '🧨',
    target: 10
  }
];

class AchievementManager {
  private achievements: Record<string, Achievement> = {};
  private lifetimeStats: LifetimeStats = {
    lifetimeKills: 0,
    highestWave: 0,
    highestLevel: 0,
    totalDashes: 0,
    totalSupplyDrops: 0,
    bossesDefeated: 0,
    barrelsDetonated: 0
  };

  private listeners: ((unlocked: Achievement) => void)[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    // 1. Initialize achievement definitions
    INITIAL_ACHIEVEMENTS.forEach((def) => {
      this.achievements[def.id] = {
        ...def,
        current: 0,
        unlocked: false
      };
    });

    if (typeof window === 'undefined') return;

    // 2. Load stored lifetime stats
    try {
      const statsJson = localStorage.getItem(STORAGE_KEY_STATS);
      if (statsJson) {
        const parsed = JSON.parse(statsJson);
        this.lifetimeStats = { ...this.lifetimeStats, ...parsed };
      }
    } catch {
      // Ignore parse errors
    }

    // 3. Load stored achievements state
    try {
      const achJson = localStorage.getItem(STORAGE_KEY_ACHIEVEMENTS);
      if (achJson) {
        const parsed: Record<string, Partial<Achievement>> = JSON.parse(achJson);
        Object.entries(parsed).forEach(([id, data]) => {
          if (this.achievements[id]) {
            if (data.unlocked) {
              this.achievements[id].unlocked = true;
              this.achievements[id].unlockedAt = data.unlockedAt || Date.now();
            }
            if (typeof data.current === 'number') {
              this.achievements[id].current = Math.max(this.achievements[id].current, data.current);
            }
          }
        });
      }
    } catch {
      // Ignore parse errors
    }

    this.recalculateCurrentProgress();
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(this.lifetimeStats));
      const achToSave: Record<string, { unlocked: boolean; unlockedAt?: number; current: number }> = {};
      Object.entries(this.achievements).forEach(([id, a]) => {
        achToSave[id] = {
          unlocked: a.unlocked,
          unlockedAt: a.unlockedAt,
          current: a.current
        };
      });
      localStorage.setItem(STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(achToSave));
    } catch {
      // Storage unavailable / quota exceeded
    }
  }

  private recalculateCurrentProgress() {
    // Sync current values based on lifetime stats
    if (this.achievements['first_kill']) this.achievements['first_kill'].current = this.lifetimeStats.lifetimeKills;
    if (this.achievements['kills_100']) this.achievements['kills_100'].current = this.lifetimeStats.lifetimeKills;
    if (this.achievements['kills_500']) this.achievements['kills_500'].current = this.lifetimeStats.lifetimeKills;
    if (this.achievements['kills_1000']) this.achievements['kills_1000'].current = this.lifetimeStats.lifetimeKills;

    if (this.achievements['survived_3_waves']) this.achievements['survived_3_waves'].current = this.lifetimeStats.highestWave;
    if (this.achievements['survived_5_waves']) this.achievements['survived_5_waves'].current = this.lifetimeStats.highestWave;
    if (this.achievements['survived_10_waves']) this.achievements['survived_10_waves'].current = this.lifetimeStats.highestWave;
    if (this.achievements['survived_15_waves']) this.achievements['survived_15_waves'].current = this.lifetimeStats.highestWave;

    if (this.achievements['reach_level_5']) this.achievements['reach_level_5'].current = this.lifetimeStats.highestLevel;
    if (this.achievements['reach_level_10']) this.achievements['reach_level_10'].current = this.lifetimeStats.highestLevel;

    if (this.achievements['total_dashes_25']) this.achievements['total_dashes_25'].current = this.lifetimeStats.totalDashes;
    if (this.achievements['supply_drops_5']) this.achievements['supply_drops_5'].current = this.lifetimeStats.totalSupplyDrops;
    if (this.achievements['boss_slayer_1']) this.achievements['boss_slayer_1'].current = this.lifetimeStats.bossesDefeated;
    if (this.achievements['barrels_10']) this.achievements['barrels_10'].current = this.lifetimeStats.barrelsDetonated;
  }

  public onUnlock(listener: (unlocked: Achievement) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private triggerUnlock(achievement: Achievement) {
    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    achievement.current = achievement.target;
    this.saveState();

    // Sound effect fanfare
    sounds.playAchievement();

    // Broadcast to UI listeners
    this.listeners.forEach((listener) => {
      try {
        listener(achievement);
      } catch (err) {
        console.error('Error in achievement listener:', err);
      }
    });
  }

  /**
   * Monitor milestones during match ticks or events
   */
  public recordKill(): Achievement[] {
    this.lifetimeStats.lifetimeKills += 1;
    return this.checkAll();
  }

  public recordWave(wave: number): Achievement[] {
    if (wave > this.lifetimeStats.highestWave) {
      this.lifetimeStats.highestWave = wave;
    }
    return this.checkAll();
  }

  public recordLevel(level: number): Achievement[] {
    if (level > this.lifetimeStats.highestLevel) {
      this.lifetimeStats.highestLevel = level;
    }
    return this.checkAll();
  }

  public recordDash(): Achievement[] {
    this.lifetimeStats.totalDashes += 1;
    return this.checkAll();
  }

  public recordSupplyDrop(): Achievement[] {
    this.lifetimeStats.totalSupplyDrops += 1;
    return this.checkAll();
  }

  public recordBossKill(): Achievement[] {
    this.lifetimeStats.bossesDefeated += 1;
    return this.checkAll();
  }

  public recordBarrelDetonated(): Achievement[] {
    this.lifetimeStats.barrelsDetonated += 1;
    return this.checkAll();
  }

  public recordWeapons(bladesCount: number, droneActive: boolean, teslaActive: boolean): Achievement[] {
    const hasAll = bladesCount > 0 && droneActive && teslaActive;
    if (hasAll && this.achievements['full_arsenal'] && !this.achievements['full_arsenal'].unlocked) {
      this.achievements['full_arsenal'].current = 1;
      this.triggerUnlock(this.achievements['full_arsenal']);
    }
    return this.checkAll();
  }

  public checkAll(): Achievement[] {
    this.recalculateCurrentProgress();
    const newlyUnlocked: Achievement[] = [];

    Object.values(this.achievements).forEach((a) => {
      if (!a.unlocked && a.current >= a.target) {
        this.triggerUnlock(a);
        newlyUnlocked.push(a);
      }
    });

    this.saveState();
    return newlyUnlocked;
  }

  public getAllAchievements(): Achievement[] {
    return Object.values(this.achievements);
  }

  public getLifetimeStats(): LifetimeStats {
    return { ...this.lifetimeStats };
  }

  public getUnlockedCount(): { unlocked: number; total: number } {
    const all = Object.values(this.achievements);
    const unlocked = all.filter((a) => a.unlocked).length;
    return { unlocked, total: all.length };
  }
}

export const achievementManager = new AchievementManager();
