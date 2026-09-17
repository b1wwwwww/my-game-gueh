import { Player, Zombie, Bullet, Coin, FloatingText, Particle, BloodSplat, Barrel, GameState, SupplyDrop, SupplyDropType, BossShockwave } from './types';
import { sounds } from './audio';

export interface GameCallbacks {
  onXpChange: (current: number, max: number, level: number) => void;
  onHpChange: (current: number, max: number) => void;
  onWaveChange: (wave: number, remaining: number, total: number, isBoss: boolean) => void;
  onScoreChange: (score: number, kills: number) => void;
  onLevelUp: () => void;
  onGameOver: (stats: GameOverStats) => void;
  onBossAlert: (active: boolean, message?: string) => void;
  onActiveBuffsChange?: (buffs: { type: SupplyDropType; title: string; remaining: number; color: string }[]) => void;
}

export interface GameOverStats {
  score: number;
  kills: number;
  wave: number;
  level: number;
  timeSurvivedSeconds: number;
}

export class GameEngine {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameCallbacks;

  public state: GameState = 'START';
  public arenaWidth = 1800;
  public arenaHeight = 1400;

  // Viewport / Camera
  public cameraX = 0;
  public cameraY = 0;
  private screenShake = 0;

  public triggerScreenShake(intensity: number) {
    this.screenShake = Math.max(this.screenShake, intensity);
  }

  // Game Entities
  public player: Player;
  public zombies: Zombie[] = [];
  public bullets: Bullet[] = [];
  public coins: Coin[] = [];
  public floatingTexts: FloatingText[] = [];
  public particles: Particle[] = [];
  public bloodSplats: BloodSplat[] = [];
  public barrels: Barrel[] = [];
  public supplyDrops: SupplyDrop[] = [];
  public shockwaves: BossShockwave[] = [];

  // Supply Drop Spawning
  public supplyDropTimer = 0;
  public supplyDropInterval = 28; // Spawns every 28 seconds

  // Wave Management
  public wave = 1;
  public zombiesSpawnedInWave = 0;
  public zombiesTotalInWave = 14;
  public zombiesKilledInWave = 0;
  public spawnTimer = 0;
  public spawnInterval = 0.9; // seconds
  public waveBreakTimer = 0;
  public isWaveBreak = false;
  public bossAlive = false;

  // Progression & Stats
  public currentXp = 0;
  public maxXp = 10; // Slightly higher initial max for balanced early game
  public level = 1;
  public score = 0;
  public kills = 0;
  public startTime = 0;
  public elapsedTime = 0;

  // Controls & Inputs
  public keys: { [key: string]: boolean } = {};
  public mouseX = 0;
  public mouseY = 0;
  public mouseMoved = false;
  public virtualStick: { active: boolean; dx: number; dy: number } = { active: false, dx: 0, dy: 0 };

  // Internal Loop
  private animationFrameId: number | null = null;
  private lastTimestamp = 0;
  private nextEntityId = 1;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;
    this.callbacks = callbacks;

    this.player = this.createDefaultPlayer();
    this.initBarrels();
    this.setupEventListeners();
  }

  private createDefaultPlayer(): Player {
    return {
      x: this.arenaWidth / 2,
      y: this.arenaHeight / 2,
      radius: 18,
      speed: 3.8, // Slightly more deliberate initial pace (tighter maneuvering required)
      baseSpeed: 3.8,
      hp: 100,
      maxHp: 100,
      angle: 0,
      fireCooldown: 0,
      fireRate: 2.8, // Tighter early fire rate (challenging yet fair start)
      bulletDamage: 20, // 20 dmg vs 26 hp zombies means 2 shots to down early zombies
      bulletSpeed: 10.5,
      bulletPierce: 1,
      bulletCount: 1,
      bulletSpread: 0.15,
      magnetRange: 120,
      explosiveRadius: 0,
      shieldActive: false,
      shieldCooldown: 0,
      invincibleTimer: 0,
      damageBoostTimer: 0,
      magnetBoostTimer: 0,
      rapidBoostTimer: 0,
      speedBoostTimer: 0
    };
  }

  private initBarrels() {
    this.barrels = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const bx = 150 + Math.random() * (this.arenaWidth - 300);
      const by = 150 + Math.random() * (this.arenaHeight - 300);
      // Keep away from initial center
      const distCenter = Math.hypot(bx - this.arenaWidth / 2, by - this.arenaHeight / 2);
      if (distCenter > 160) {
        this.barrels.push({
          id: this.nextEntityId++,
          x: bx,
          y: by,
          radius: 18,
          hp: 30
        });
      }
    }
  }

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private setupEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = true;
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      if (this.state === 'PLAYING') {
        this.pause();
      } else if (this.state === 'PAUSED') {
        this.resume();
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = false;
  };

  private handleMouseMove = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left + this.cameraX;
    this.mouseY = e.clientY - rect.top + this.cameraY;
    this.mouseMoved = true;
  };

  public startGame() {
    this.player = this.createDefaultPlayer();
    this.zombies = [];
    this.bullets = [];
    this.coins = [];
    this.floatingTexts = [];
    this.particles = [];
    this.bloodSplats = [];
    this.supplyDrops = [];
    this.shockwaves = [];
    this.supplyDropTimer = 14; // First crate arrives 14s in to assist early challenge!
    this.initBarrels();

    this.wave = 1;
    this.initWave(1);

    this.currentXp = 0;
    this.maxXp = 10;
    this.level = 1;
    this.score = 0;
    this.kills = 0;
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.bossAlive = false;

    this.state = 'PLAYING';
    this.updateHUD();

    this.lastTimestamp = performance.now();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  public pause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
    }
  }

  public resume() {
    if (this.state === 'PAUSED' || this.state === 'UPGRADE') {
      this.state = 'PLAYING';
      this.lastTimestamp = performance.now();
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }
  }

  private initWave(waveNum: number) {
    this.wave = waveNum;
    const isBossWave = waveNum % 5 === 0;
    this.zombiesTotalInWave = 14 + (waveNum - 1) * 7 + (isBossWave ? 1 : 0);
    this.zombiesSpawnedInWave = 0;
    this.zombiesKilledInWave = 0;
    this.spawnTimer = 0;
    this.spawnInterval = Math.max(0.35, 1.05 - waveNum * 0.06);
    this.isWaveBreak = false;
    this.bossAlive = false;

    if (isBossWave) {
      this.triggerBossWarning(`WARNING: LEVEL ${waveNum} COLOSSAL BOSS APPROACHING!`);
    }

    this.callbacks.onWaveChange(this.wave, this.zombiesTotalInWave - this.zombiesKilledInWave, this.zombiesTotalInWave, isBossWave);
  }

  private triggerBossWarning(message: string) {
    this.screenShake = 14;
    sounds.playBossAlarm();
    sounds.playBossRoar();
    this.callbacks.onBossAlert(true, message);
    setTimeout(() => {
      this.callbacks.onBossAlert(false);
    }, 4500);
  }

  private gameLoop = (timestamp: number) => {
    if (this.state !== 'PLAYING') return;

    const delta = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;
    this.elapsedTime += delta;

    this.update(delta);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update(delta: number) {
    this.updatePlayer(delta);
    this.updateSupplyDrops(delta);
    this.updateBossShockwaves(delta);
    this.updateZombies(delta);
    this.updateShooting(delta);
    this.updateBullets(delta);
    this.updateCoins(delta);
    this.updateFloatingTexts(delta);
    this.updateParticles(delta);
    this.updateWaveLogic(delta);
    this.updateCamera(delta);
  }

  private updatePlayer(delta: number) {
    // 1. Update temporary supply drop power-up timers
    let speedMultiplier = 1.0;
    if (this.player.speedBoostTimer > 0) {
      this.player.speedBoostTimer -= delta;
      speedMultiplier = 1.45; // +45% speed while hyper-speed active
    }

    if (this.player.damageBoostTimer > 0) {
      this.player.damageBoostTimer -= delta;
    }
    if (this.player.magnetBoostTimer > 0) {
      this.player.magnetBoostTimer -= delta;
    }
    if (this.player.rapidBoostTimer > 0) {
      this.player.rapidBoostTimer -= delta;
    }

    // Notify HUD of active buffs
    this.broadcastActiveBuffs();

    // 2. Player movement
    let moveX = 0;
    let moveY = 0;

    if (this.keys['w'] || this.keys['arrowup']) moveY -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) moveY += 1;
    if (this.keys['a'] || this.keys['arrowleft']) moveX -= 1;
    if (this.keys['d'] || this.keys['arrowright']) moveX += 1;

    if (this.virtualStick.active) {
      moveX += this.virtualStick.dx;
      moveY += this.virtualStick.dy;
    }

    const currentSpeed = this.player.speed * speedMultiplier;
    const len = Math.hypot(moveX, moveY);
    if (len > 0) {
      moveX /= len;
      moveY /= len;
      this.player.x += moveX * currentSpeed;
      this.player.y += moveY * currentSpeed;

      // Hyper speed trail particles
      if (this.player.speedBoostTimer > 0 && Math.random() < 0.4) {
        this.particles.push({
          x: this.player.x - moveX * 12,
          y: this.player.y - moveY * 12,
          vx: -moveX * 0.5,
          vy: -moveY * 0.5,
          radius: 3,
          color: '#06b6d4',
          alpha: 0.8,
          life: 0,
          maxLife: 0.25
        });
      }
    }

    // Keep within arena bounds
    const pRad = this.player.radius;
    this.player.x = Math.max(pRad + 20, Math.min(this.arenaWidth - pRad - 20, this.player.x));
    this.player.y = Math.max(pRad + 20, Math.min(this.arenaHeight - pRad - 20, this.player.y));

    // Barrel collision avoidance (slide around)
    for (const b of this.barrels) {
      const dist = Math.hypot(this.player.x - b.x, this.player.y - b.y);
      const minDist = this.player.radius + b.radius;
      if (dist < minDist && dist > 0) {
        const overlap = minDist - dist;
        this.player.x += ((this.player.x - b.x) / dist) * overlap;
        this.player.y += ((this.player.y - b.y) / dist) * overlap;
      }
    }

    // Invincibility cooldown
    if (this.player.invincibleTimer > 0) {
      this.player.invincibleTimer -= delta;
    }

    // Shield cooldown
    if (this.player.shieldActive && this.player.shieldCooldown > 0) {
      this.player.shieldCooldown -= delta;
    }

    // Auto-aim orientation: target closest zombie, or fallback to mouse / velocity
    const nearest = this.findNearestZombie();
    if (nearest) {
      this.player.angle = Math.atan2(nearest.y - this.player.y, nearest.x - this.player.x);
    } else if (this.mouseMoved) {
      this.player.angle = Math.atan2(this.mouseY - this.player.y, this.mouseX - this.player.x);
    } else if (len > 0) {
      this.player.angle = Math.atan2(moveY, moveX);
    }
  }

  private broadcastActiveBuffs() {
    if (!this.callbacks.onActiveBuffsChange) return;
    const buffs: { type: SupplyDropType; title: string; remaining: number; color: string }[] = [];

    if (this.player.damageBoostTimer > 0) {
      buffs.push({
        type: 'MASSIVE_DAMAGE',
        title: 'TITAN DAMAGE (x2.5)',
        remaining: Math.ceil(this.player.damageBoostTimer),
        color: '#ef4444'
      });
    }
    if (this.player.magnetBoostTimer > 0) {
      buffs.push({
        type: 'SUPER_MAGNET',
        title: 'SUPER VORTEX MAGNET',
        remaining: Math.ceil(this.player.magnetBoostTimer),
        color: '#a855f7'
      });
    }
    if (this.player.rapidBoostTimer > 0) {
      buffs.push({
        type: 'OVERDRIVE_RAPID',
        title: 'OVERDRIVE MINIGUN',
        remaining: Math.ceil(this.player.rapidBoostTimer),
        color: '#f59e0b'
      });
    }
    if (this.player.speedBoostTimer > 0) {
      buffs.push({
        type: 'HYPER_SPEED',
        title: 'HYPER TURBO SPRINT',
        remaining: Math.ceil(this.player.speedBoostTimer),
        color: '#06b6d4'
      });
    }

    this.callbacks.onActiveBuffsChange(buffs);
  }

  private updateSupplyDrops(delta: number) {
    this.supplyDropTimer += delta;

    // Periodically spawn rare supply drops
    if (this.supplyDropTimer >= this.supplyDropInterval) {
      this.supplyDropTimer = 0;
      this.spawnSupplyDrop();
    }

    for (let i = this.supplyDrops.length - 1; i >= 0; i--) {
      const drop = this.supplyDrops[i];
      drop.pulseTimer += delta * 4;

      // Parachute falling animation
      if (!drop.isLanded) {
        drop.parachuteY += 120 * delta;
        drop.y = drop.parachuteY;
        if (drop.parachuteY >= drop.targetY) {
          drop.isLanded = true;
          drop.y = drop.targetY;
          this.screenShake = 4;
          this.spawnHitParticles(drop.x, drop.y, drop.color, 10);
          this.addFloatingText(drop.x, drop.y - 20, 'SUPPLY DROP LANDED!', '#38bdf8', 13);
        }
      }

      // Check player collection
      if (drop.isLanded) {
        const dist = Math.hypot(this.player.x - drop.x, this.player.y - drop.y);
        if (dist <= this.player.radius + drop.radius + 6) {
          this.collectSupplyDrop(drop);
          this.supplyDrops.splice(i, 1);
        }
      }
    }
  }

  private spawnSupplyDrop() {
    const types: { type: SupplyDropType; title: string; color: string; iconSymbol: string; duration: number }[] = [
      { type: 'MASSIVE_DAMAGE', title: 'TITAN DAMAGE', color: '#ef4444', iconSymbol: '⚔️', duration: 12 },
      { type: 'SUPER_MAGNET', title: 'VORTEX MAGNET', color: '#a855f7', iconSymbol: '🧲', duration: 12 },
      { type: 'OVERDRIVE_RAPID', title: 'OVERDRIVE RAPID', color: '#f59e0b', iconSymbol: '⚡', duration: 10 },
      { type: 'HYPER_SPEED', title: 'HYPER SPRINT', color: '#06b6d4', iconSymbol: '👟', duration: 12 },
      { type: 'TACTICAL_NUKE', title: 'TACTICAL NUKE', color: '#eab308', iconSymbol: '☢️', duration: 0 }
    ];

    const pick = types[Math.floor(Math.random() * types.length)];
    // Spawn within active camera view so player actually notices it!
    const padding = 100;
    const minX = Math.max(80, this.cameraX + padding);
    const maxX = Math.min(this.arenaWidth - 80, this.cameraX + this.canvas.width - padding);
    const minY = Math.max(80, this.cameraY + padding);
    const maxY = Math.min(this.arenaHeight - 80, this.cameraY + this.canvas.height - padding);

    const targetX = minX + Math.random() * (maxX - minX);
    const targetY = minY + Math.random() * (maxY - minY);

    this.supplyDrops.push({
      id: this.nextEntityId++,
      x: targetX,
      y: targetY - 260,
      targetY: targetY,
      parachuteY: targetY - 260,
      isLanded: false,
      type: pick.type,
      title: pick.title,
      duration: pick.duration,
      pulseTimer: 0,
      radius: 20,
      color: pick.color,
      iconSymbol: pick.iconSymbol
    });

    sounds.playCoin();
    this.addFloatingText(targetX, targetY - 40, 'INCOMING SUPPLY DROP!', '#38bdf8', 16);
  }

  private collectSupplyDrop(drop: SupplyDrop) {
    sounds.playSupplyDropPickup();
    this.screenShake = 8;
    this.spawnHitParticles(drop.x, drop.y, drop.color, 18);

    switch (drop.type) {
      case 'MASSIVE_DAMAGE':
        this.player.damageBoostTimer = drop.duration;
        this.addFloatingText(this.player.x, this.player.y - 30, '+250% MASSIVE DAMAGE!', '#ef4444', 18);
        break;

      case 'SUPER_MAGNET':
        this.player.magnetBoostTimer = drop.duration;
        this.addFloatingText(this.player.x, this.player.y - 30, 'VORTEX MAGNET ACTIVATED!', '#a855f7', 18);
        // Instantly pull all coins on screen
        for (const coin of this.coins) {
          coin.beingAttracted = true;
        }
        break;

      case 'OVERDRIVE_RAPID':
        this.player.rapidBoostTimer = drop.duration;
        this.addFloatingText(this.player.x, this.player.y - 30, 'MINIGUN OVERDRIVE (3X FIRE RATE)!', '#f59e0b', 18);
        break;

      case 'HYPER_SPEED':
        this.player.speedBoostTimer = drop.duration;
        this.addFloatingText(this.player.x, this.player.y - 30, '+45% HYPER SPEED!', '#06b6d4', 18);
        break;

      case 'TACTICAL_NUKE':
        this.triggerNuke();
        this.addFloatingText(this.player.x, this.player.y - 30, 'TACTICAL NUKE DETONATED!', '#eab308', 22);
        break;
    }
  }

  private triggerNuke() {
    sounds.playExplosion();
    this.screenShake = 22;

    // Destroy all regular zombies or damage boss by 50%
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const z = this.zombies[i];
      if (z.isBoss) {
        this.damageZombie(z, Math.round(z.maxHp * 0.45));
      } else {
        this.damageZombie(z, 9999);
      }
    }
  }

  private findNearestZombie(): Zombie | null {
    let bestDist = Infinity;
    let target: Zombie | null = null;
    const maxAimRange = 550;

    for (const z of this.zombies) {
      const dist = Math.hypot(z.x - this.player.x, z.y - this.player.y);
      if (dist < bestDist && dist <= maxAimRange) {
        bestDist = dist;
        target = z;
      }
    }
    return target;
  }

  private updateShooting(delta: number) {
    this.player.fireCooldown -= delta;
    const effectiveFireRate = this.player.rapidBoostTimer > 0
      ? this.player.fireRate * 2.5
      : this.player.fireRate;
    const shootInterval = 1 / effectiveFireRate;

    if (this.player.fireCooldown <= 0) {
      const target = this.findNearestZombie();
      if (target || this.zombies.length > 0) {
        this.fireBullets(target);
        this.player.fireCooldown = shootInterval;
      }
    }
  }

  private fireBullets(target: Zombie | null) {
    const aimAngle = target
      ? Math.atan2(target.y - this.player.y, target.x - this.player.x)
      : this.player.angle;

    const count = this.player.bulletCount;
    const spread = this.player.bulletSpread;
    const effectiveDamage = this.player.damageBoostTimer > 0
      ? Math.round(this.player.bulletDamage * 2.5)
      : this.player.bulletDamage;
    const bulletRadius = this.player.damageBoostTimer > 0 ? 6.5 : 4.5;

    for (let i = 0; i < count; i++) {
      let angle = aimAngle;
      if (count > 1) {
        const offsetRatio = (i / (count - 1)) - 0.5;
        angle += offsetRatio * spread;
      }

      const spawnDist = this.player.radius + 6;
      const bx = this.player.x + Math.cos(aimAngle) * spawnDist;
      const by = this.player.y + Math.sin(aimAngle) * spawnDist;

      this.bullets.push({
        id: this.nextEntityId++,
        x: bx,
        y: by,
        vx: Math.cos(angle) * this.player.bulletSpeed,
        vy: Math.sin(angle) * this.player.bulletSpeed,
        radius: bulletRadius,
        damage: effectiveDamage,
        pierceLeft: this.player.bulletPierce,
        distanceTraveled: 0,
        maxDistance: 700,
        explosiveRadius: this.player.explosiveRadius,
        hitZombieIds: new Set<number>()
      });
    }

    sounds.playShoot();
  }

  private updateBullets(delta: number) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      b.distanceTraveled += Math.hypot(b.vx, b.vy);

      // Range check
      if (
        b.distanceTraveled >= b.maxDistance ||
        b.x < 0 ||
        b.x > this.arenaWidth ||
        b.y < 0 ||
        b.y > this.arenaHeight
      ) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Barrel collision
      for (const barrel of this.barrels) {
        const dist = Math.hypot(b.x - barrel.x, b.y - barrel.y);
        if (dist <= b.radius + barrel.radius) {
          barrel.hp -= b.damage;
          this.spawnHitParticles(b.x, b.y, '#f59e0b', 4);
          if (barrel.hp <= 0) {
            this.explodeBarrel(barrel);
          }
          b.pierceLeft--;
          if (b.pierceLeft <= 0) {
            this.bullets.splice(i, 1);
            break;
          }
        }
      }

      // Zombie collision
      let bulletRemoved = false;
      for (const z of this.zombies) {
        if (b.hitZombieIds.has(z.id)) continue;

        const dist = Math.hypot(b.x - z.x, b.y - z.y);
        if (dist <= b.radius + z.radius) {
          b.hitZombieIds.add(z.id);
          this.damageZombie(z, b.damage, b.vx, b.vy);

          // Explosive splash damage
          if (b.explosiveRadius > 0) {
            this.triggerExplosion(b.x, b.y, b.explosiveRadius, b.damage * 0.5);
          }

          b.pierceLeft--;
          if (b.pierceLeft <= 0) {
            this.bullets.splice(i, 1);
            bulletRemoved = true;
            break;
          }
        }
      }

      if (bulletRemoved) continue;
    }
  }

  private explodeBarrel(barrel: Barrel) {
    const idx = this.barrels.indexOf(barrel);
    if (idx !== -1) {
      this.barrels.splice(idx, 1);
    }
    this.triggerExplosion(barrel.x, barrel.y, 110, 80);
  }

  private triggerExplosion(x: number, y: number, radius: number, damage: number) {
    sounds.playExplosion();
    this.screenShake = 12;

    // Visual particles
    for (let p = 0; p < 24; p++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 5,
        color: ['#ef4444', '#f97316', '#fbbf24', '#ffffff'][Math.floor(Math.random() * 4)],
        alpha: 1,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3
      });
    }

    // Damage all zombies in radius
    for (const z of this.zombies) {
      const dist = Math.hypot(z.x - x, z.y - y);
      if (dist <= radius + z.radius) {
        const falloff = 1 - (dist / (radius + z.radius)) * 0.4;
        const blastDmg = Math.round(damage * falloff);
        const knockX = (z.x - x) / (dist || 1);
        const knockY = (z.y - y) / (dist || 1);
        this.damageZombie(z, blastDmg, knockX * 8, knockY * 8);
      }
    }
  }

  private damageZombie(z: Zombie, damage: number, knockVx = 0, knockVy = 0) {
    z.hp -= damage;
    z.flashTimer = 0.12;

    // Check boss enrage at 40% hp
    if (z.isBoss && !z.enraged && z.hp <= z.maxHp * 0.4) {
      z.enraged = true;
      z.color = '#e11d48'; // crimson fury
      z.speed *= 1.35;
      this.screenShake = 14;
      sounds.playBossRoar();
      this.triggerBossDialogue(z, 'ENOUGH! I WILL CRUSH YOU ALL! (ENRAGED)', 3.2);
    }

    // Knockback
    const knockStrength = z.isBoss ? 0.15 : 0.8;
    z.x += knockVx * knockStrength;
    z.y += knockVy * knockStrength;

    sounds.playHit();
    this.spawnHitParticles(z.x, z.y, z.isBoss ? '#c084fc' : '#ef4444', 5);

    // Floating damage number
    this.addFloatingText(z.x + (Math.random() * 20 - 10), z.y - 12, `${damage}`, z.isBoss ? '#f43f5e' : '#ffffff', 14);

    if (z.hp <= 0) {
      this.killZombie(z);
    }
  }

  private killZombie(z: Zombie) {
    const idx = this.zombies.indexOf(z);
    if (idx === -1) return;

    this.zombies.splice(idx, 1);
    this.kills++;
    this.score += z.scoreValue;
    this.zombiesKilledInWave++;

    // Blood splatter on floor
    this.bloodSplats.push({
      x: z.x,
      y: z.y,
      radius: z.isBoss ? 55 : 18 + Math.random() * 10,
      alpha: 0.6
    });
    if (this.bloodSplats.length > 80) {
      this.bloodSplats.shift();
    }

    // Drops coins: value scales smoothly with wave
    const coinCount = z.isBoss ? 12 : (Math.random() < 0.8 ? 1 : 2);
    for (let c = 0; c < coinCount; c++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (z.isBoss ? 45 : 16);
      this.coins.push({
        id: this.nextEntityId++,
        x: z.x + Math.cos(angle) * dist,
        y: z.y + Math.sin(angle) * dist,
        radius: 7,
        value: z.coinValue,
        pulseTimer: Math.random() * Math.PI,
        beingAttracted: false
      });
    }

    if (z.isBoss) {
      this.bossAlive = false;
      this.screenShake = 20;
      sounds.playExplosion();
      this.addFloatingText(z.x, z.y - 30, 'COLOSSAL BOSS ANNIHILATED!', '#fbbf24', 22);

      // Boss always drops a guaranteed Supply Drop on defeat!
      setTimeout(() => {
        this.spawnSupplyDrop();
      }, 500);
    }

    this.callbacks.onScoreChange(this.score, this.kills);
    this.callbacks.onWaveChange(this.wave, Math.max(0, this.zombiesTotalInWave - this.zombiesKilledInWave), this.zombiesTotalInWave, this.bossAlive);
  }

  private triggerBossDialogue(z: Zombie, text: string, duration = 2.5) {
    z.bossDialogueText = text;
    z.bossDialogueTimer = duration;
    sounds.playBossRoar();
    this.addFloatingText(z.x, z.y - z.radius - 36, text, '#f43f5e', 15);
  }

  private updateZombies(delta: number) {
    for (let i = 0; i < this.zombies.length; i++) {
      const z = this.zombies[i];

      // Flash timer for hit effects
      if (z.flashTimer > 0) {
        z.flashTimer -= delta;
      }

      // Boss Dialogue timer
      if (z.bossDialogueTimer && z.bossDialogueTimer > 0) {
        z.bossDialogueTimer -= delta;
        if (z.bossDialogueTimer <= 0) {
          z.bossDialogueText = undefined;
        }
      }

      // Check Boss specific Skills
      if (z.isBoss) {
        this.updateBossBehavior(z, delta);
      } else {
        // Normal Zombie movement
        const dx = this.player.x - z.x;
        const dy = this.player.y - z.y;
        const distToPlayer = Math.hypot(dx, dy);

        z.angle = Math.atan2(dy, dx);
        z.walkCycle += delta * (z.speed * 4);

        if (distToPlayer > 0) {
          let vx = (dx / distToPlayer) * z.speed;
          let vy = (dy / distToPlayer) * z.speed;

          // Separation from other zombies
          for (let j = 0; j < this.zombies.length; j++) {
            if (i === j) continue;
            const other = this.zombies[j];
            const distBetween = Math.hypot(z.x - other.x, z.y - other.y);
            const minDist = z.radius + other.radius;
            if (distBetween < minDist && distBetween > 0) {
              const push = (minDist - distBetween) / minDist;
              vx += ((z.x - other.x) / distBetween) * push * 0.8;
              vy += ((z.y - other.y) / distBetween) * push * 0.8;
            }
          }

          z.x += vx;
          z.y += vy;
        }

        // Check collision with player
        const touchDist = z.radius + this.player.radius;
        if (distToPlayer < touchDist) {
          this.hitPlayer(z.damage);
        }
      }
    }
  }

  private updateBossBehavior(z: Zombie, delta: number) {
    if (!z.bossState) z.bossState = 'CHASING';
    if (!z.bossSkillCooldown) z.bossSkillCooldown = 4.0;

    const dx = this.player.x - z.x;
    const dy = this.player.y - z.y;
    const distToPlayer = Math.hypot(dx, dy);

    z.angle = Math.atan2(dy, dx);
    z.walkCycle += delta * (z.speed * 4);

    z.bossSkillCooldown -= delta;

    // Decide skills when off cooldown
    if (z.bossSkillCooldown <= 0 && z.bossState === 'CHASING') {
      const skills = distToPlayer < 240 ? ['SLAM', 'ROAR_MINIONS'] : ['CHARGE', 'SLAM', 'ROAR_MINIONS'];
      const chosen = skills[Math.floor(Math.random() * skills.length)];

      if (chosen === 'CHARGE') {
        // Skill 1: Bull Charge Rush
        z.bossState = 'CHARGING';
        z.bossSkillTimer = 1.0; // 1s telegraph
        const chargeDirX = dx / (distToPlayer || 1);
        const chargeDirY = dy / (distToPlayer || 1);
        z.bossChargeTarget = {
          x: this.player.x,
          y: this.player.y,
          vx: chargeDirX * (z.speed * 3.4),
          vy: chargeDirY * (z.speed * 3.4)
        };
        const dialogueLines = [
          'DIE UNDER MY FEET!',
          'NOWHERE TO RUN, SURVIVOR!',
          'FEEL MY WRATH!'
        ];
        this.triggerBossDialogue(z, dialogueLines[Math.floor(Math.random() * dialogueLines.length)], 2.0);
      } else if (chosen === 'SLAM') {
        // Skill 2: Earthshaker Slam (Area of effect shockwave)
        z.bossState = 'SLAM_WINDUP';
        z.bossSkillTimer = 1.2; // 1.2s windup animation
        const dialogueLines = [
          'GROUND SHATTER!',
          'CRUSH TO DUST!',
          'SUFFER!'
        ];
        this.triggerBossDialogue(z, dialogueLines[Math.floor(Math.random() * dialogueLines.length)], 2.0);
      } else {
        // Skill 3: Roar and summon zombie minions
        z.bossSkillCooldown = z.enraged ? 4.5 : 6.0;
        this.triggerBossDialogue(z, 'ARISE, MY MINIONS! SWARM THEM!', 2.2);
        this.spawnBossMinions(z.x, z.y, z.enraged ? 5 : 3);
        this.screenShake = 8;
      }
    }

    // Handle Active Boss States
    if (z.bossState === 'CHARGING') {
      if (z.bossSkillTimer && z.bossSkillTimer > 0) {
        z.bossSkillTimer -= delta;
        // Telegraph visual: shudder & lock aim
        z.x += (Math.random() - 0.5) * 4;
      } else if (z.bossChargeTarget) {
        // Execute fast charge
        z.x += z.bossChargeTarget.vx;
        z.y += z.bossChargeTarget.vy;

        // Dust & smoke
        if (Math.random() < 0.6) {
          this.spawnHitParticles(z.x, z.y, '#9333ea', 2);
        }

        // Check if charge finished or hit player
        if (distToPlayer < z.radius + this.player.radius) {
          this.hitPlayer(z.damage * 1.3); // Heavy charge damage
          this.screenShake = 14;
          z.bossState = 'CHASING';
          z.bossSkillCooldown = z.enraged ? 3.0 : 4.5;
        }

        // Out of bounds or charge expired
        if (z.x < 40 || z.x > this.arenaWidth - 40 || z.y < 40 || z.y > this.arenaHeight - 40) {
          this.screenShake = 12;
          sounds.playExplosion();
          z.bossState = 'CHASING';
          z.bossSkillCooldown = z.enraged ? 2.5 : 4.0;
        }
      }
    } else if (z.bossState === 'SLAM_WINDUP') {
      if (z.bossSkillTimer && z.bossSkillTimer > 0) {
        z.bossSkillTimer -= delta;
        // Pulse ring telegraphing slam
        z.bossSlamRadius = ((1.2 - z.bossSkillTimer) / 1.2) * 160;
        // Building seismic tremor rumble before the shockwave erupts
        this.triggerScreenShake(3.5);
      } else {
        // Release Ground Shockwave
        z.bossState = 'CHASING';
        z.bossSkillCooldown = z.enraged ? 3.5 : 5.0;
        z.bossSlamRadius = 0;
        // Heavy, explosive screen shake when the boss slams the ground
        this.triggerScreenShake(z.enraged ? 25 : 20);
        sounds.playShockwave();

        // Spawn Expanding Shockwave entity
        this.shockwaves.push({
          id: this.nextEntityId++,
          x: z.x,
          y: z.y,
          radius: z.radius + 10,
          maxRadius: 180,
          speed: 160,
          damage: 28,
          hitPlayer: false,
          color: z.enraged ? '#f43f5e' : '#a855f7'
        });
      }
    } else {
      // Normal Boss Chasing
      if (distToPlayer > 0) {
        z.x += (dx / distToPlayer) * z.speed;
        z.y += (dy / distToPlayer) * z.speed;
      }

      if (distToPlayer < z.radius + this.player.radius) {
        this.hitPlayer(z.damage);
      }
    }

    // Keep Boss in Arena
    z.x = Math.max(z.radius + 20, Math.min(this.arenaWidth - z.radius - 20, z.x));
    z.y = Math.max(z.radius + 20, Math.min(this.arenaHeight - z.radius - 20, z.y));
  }

  private spawnBossMinions(bx: number, by: number, count: number) {
    sounds.playBossRoar();
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 70;
      this.zombies.push({
        id: this.nextEntityId++,
        x: bx + Math.cos(angle) * dist,
        y: by + Math.sin(angle) * dist,
        radius: 13,
        speed: 2.2, // Fast swarmers
        hp: 20 + this.wave * 3,
        maxHp: 20 + this.wave * 3,
        damage: 12,
        isBoss: false,
        color: '#f97316', // Orange fast runner
        flashTimer: 0,
        angle: 0,
        walkCycle: 0,
        scoreValue: 40,
        coinValue: 1 + Math.floor(this.wave / 3)
      });
      this.spawnHitParticles(bx + Math.cos(angle) * dist, by + Math.sin(angle) * dist, '#f97316', 8);
    }
  }

  private updateBossShockwaves(delta: number) {
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed * delta;

      // Check collision with player
      if (!sw.hitPlayer) {
        const dist = Math.hypot(this.player.x - sw.x, this.player.y - sw.y);
        if (Math.abs(dist - sw.radius) < this.player.radius + 15) {
          sw.hitPlayer = true;
          this.hitPlayer(sw.damage);
          this.triggerScreenShake(18);
          this.addFloatingText(this.player.x, this.player.y - 24, 'SHOCKWAVE HIT!', '#f43f5e', 14);
        }
      }

      if (sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  private hitPlayer(damage: number) {
    if (this.player.invincibleTimer > 0) return;

    // Check energy shield
    if (this.player.shieldActive && this.player.shieldCooldown <= 0) {
      this.player.shieldCooldown = 9.0; // 9 second cooldown
      this.triggerScreenShake(8);
      sounds.playHit();
      this.addFloatingText(this.player.x, this.player.y - 25, 'SHIELD BLOCKED!', '#38bdf8', 14);
      this.spawnHitParticles(this.player.x, this.player.y, '#38bdf8', 12);
      this.player.invincibleTimer = 0.4;
      return;
    }

    this.player.hp -= damage;
    this.player.invincibleTimer = 0.5; // grace invincibility frames

    // Dynamic screen shake scaling with damage taken
    const damageShake = Math.min(24, 12 + (damage / 6) * 3);
    this.triggerScreenShake(damageShake);
    sounds.playHurt();

    this.addFloatingText(this.player.x, this.player.y - 20, `-${damage}`, '#ef4444', 16);
    this.spawnHitParticles(this.player.x, this.player.y, '#ef4444', 8);

    this.callbacks.onHpChange(Math.max(0, this.player.hp), this.player.maxHp);

    if (this.player.hp <= 0) {
      this.gameOver();
    }
  }

  private updateCoins(delta: number) {
    const effectiveMagnetRange = this.player.magnetBoostTimer > 0
      ? this.player.magnetRange * 3.5
      : this.player.magnetRange;

    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.pulseTimer += delta * 4;

      const dist = Math.hypot(this.player.x - c.x, this.player.y - c.y);

      // Magnet pull
      if (dist < effectiveMagnetRange) {
        c.beingAttracted = true;
        const maxPull = this.player.magnetBoostTimer > 0 ? 22 : 14;
        const pullSpeed = Math.min(maxPull, 8 + (1 - dist / effectiveMagnetRange) * 16);
        c.x += ((this.player.x - c.x) / dist) * pullSpeed;
        c.y += ((this.player.y - c.y) / dist) * pullSpeed;
      }

      // Collect coin
      if (dist <= this.player.radius + c.radius + 6) {
        this.collectCoin(c);
        this.coins.splice(i, 1);
      }
    }
  }

  private collectCoin(c: Coin) {
    sounds.playCoin();
    this.currentXp += c.value;
    this.score += 15;

    // Small particle ring on pickup
    this.spawnHitParticles(c.x, c.y, '#facc15', 3);

    if (this.currentXp >= this.maxXp) {
      this.levelUp();
    } else {
      this.callbacks.onXpChange(this.currentXp, this.maxXp, this.level);
    }
  }

  private levelUp() {
    this.level++;
    this.currentXp = this.currentXp - this.maxXp;
    this.maxXp = Math.round(this.maxXp * 1.35 + 4);
    sounds.playLevelUp();

    this.callbacks.onXpChange(this.currentXp, this.maxXp, this.level);
    this.callbacks.onLevelUp();

    // Pause game and trigger Upgrade Modal overlay
    this.state = 'UPGRADE';
  }

  private updateWaveLogic(delta: number) {
    if (this.isWaveBreak) {
      this.waveBreakTimer -= delta;
      if (this.waveBreakTimer <= 0) {
        this.isWaveBreak = false;
        this.initWave(this.wave + 1);
      }
      return;
    }

    // Spawn zombies
    if (this.zombiesSpawnedInWave < this.zombiesTotalInWave) {
      this.spawnTimer += delta;
      if (this.spawnTimer >= this.spawnInterval) {
        this.spawnTimer = 0;
        this.spawnZombie();
      }
    }

    // Wave completion check
    if (this.zombiesKilledInWave >= this.zombiesTotalInWave && this.zombies.length === 0) {
      this.isWaveBreak = true;
      this.waveBreakTimer = 2.0; // 2 seconds breathing room
      sounds.playCoin();
      this.addFloatingText(this.player.x, this.player.y - 40, `WAVE ${this.wave} COMPLETED!`, '#22c55e', 22);
    }
  }

  private spawnZombie() {
    const isBoss = (this.wave % 5 === 0) && !this.bossAlive && (this.zombiesSpawnedInWave === this.zombiesTotalInWave - 1);

    // Spawn randomly outside visible camera or at arena borders
    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    const padding = 30;

    switch (side) {
      case 0: // top
        x = Math.random() * this.arenaWidth;
        y = padding;
        break;
      case 1: // bottom
        x = Math.random() * this.arenaWidth;
        y = this.arenaHeight - padding;
        break;
      case 2: // left
        x = padding;
        y = Math.random() * this.arenaHeight;
        break;
      case 3: // right
        x = this.arenaWidth - padding;
        y = Math.random() * this.arenaHeight;
        break;
    }

    // Tougher early game: Base HP 26 so early zombies take 2 shots, with steady scaling
    const baseHp = 26 + (this.wave - 1) * 8;
    const baseSpeed = 1.45 + Math.min(1.8, (this.wave - 1) * 0.09);

    // Scaling XP/coin value as wave increases
    const dynamicCoinValue = 1 + Math.floor((this.wave - 1) * 0.4);

    if (isBoss) {
      this.bossAlive = true;
      const bossHp = 350 + this.wave * 150;
      this.zombies.push({
        id: this.nextEntityId++,
        x,
        y,
        radius: 38, // Boss is large
        speed: baseSpeed * 0.8,
        hp: bossHp,
        maxHp: bossHp,
        damage: 32, // Boss hits hard
        isBoss: true,
        color: '#9333ea', // Distinct purple
        flashTimer: 0,
        angle: 0,
        walkCycle: 0,
        scoreValue: 600,
        coinValue: 6 + this.wave * 2, // High EXP reward for boss
        bossSkillCooldown: 2.5,
        bossState: 'CHASING'
      });
      this.triggerBossWarning(`WARNING: LEVEL ${this.wave} COLOSSAL BOSS SUMMONED!`);
    } else {
      this.zombies.push({
        id: this.nextEntityId++,
        x,
        y,
        radius: 14 + (Math.random() * 3),
        speed: baseSpeed * (0.85 + Math.random() * 0.3),
        hp: baseHp,
        maxHp: baseHp,
        damage: 11 + Math.floor(this.wave * 1.5),
        isBoss: false,
        color: '#dc2626', // Red
        flashTimer: 0,
        angle: 0,
        walkCycle: 0,
        scoreValue: 50,
        coinValue: dynamicCoinValue
      });
    }

    this.zombiesSpawnedInWave++;
    this.callbacks.onWaveChange(this.wave, this.zombiesTotalInWave - this.zombiesKilledInWave, this.zombiesTotalInWave, this.bossAlive);
  }

  private updateFloatingTexts(delta: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life += delta;
      ft.y += ft.vy * delta;
      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string, fontSize = 14) {
    this.floatingTexts.push({
      id: this.nextEntityId++,
      x,
      y,
      text,
      color,
      fontSize,
      life: 0,
      maxLife: 0.8,
      vy: -32
    });
  }

  private updateParticles(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.alpha = 1 - (p.life / p.maxLife);
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private spawnHitParticles(x: number, y: number, color: string, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.25 + Math.random() * 0.25
      });
    }
  }

  private updateCamera(delta: number) {
    const targetX = this.player.x - this.canvas.width / 2;
    const targetY = this.player.y - this.canvas.height / 2;

    this.cameraX += (targetX - this.cameraX) * 0.1;
    this.cameraY += (targetY - this.cameraY) * 0.1;

    // Clamp camera within arena
    this.cameraX = Math.max(0, Math.min(this.arenaWidth - this.canvas.width, this.cameraX));
    this.cameraY = Math.max(0, Math.min(this.arenaHeight - this.canvas.height, this.cameraY));

    // Screen shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - delta * 25);
    }
  }

  private gameOver() {
    this.state = 'GAMEOVER';
    sounds.playGameOver();
    const stats: GameOverStats = {
      score: this.score,
      kills: this.kills,
      wave: this.wave,
      level: this.level,
      timeSurvivedSeconds: Math.floor(this.elapsedTime)
    };
    this.callbacks.onGameOver(stats);
  }

  private updateHUD() {
    this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
    this.callbacks.onXpChange(this.currentXp, this.maxXp, this.level);
    this.callbacks.onWaveChange(this.wave, this.zombiesTotalInWave - this.zombiesKilledInWave, this.zombiesTotalInWave, this.bossAlive);
    this.callbacks.onScoreChange(this.score, this.kills);
  }

  // Canvas Rendering Loop
  private render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply Screen Shake with multi-axis jitter and micro-rotational trauma
    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake * 1.4;
      const shakeY = (Math.random() - 0.5) * this.screenShake * 1.4;
      const rotShake = (Math.random() - 0.5) * (this.screenShake / 500);
      ctx.translate(shakeX, shakeY);
      ctx.rotate(rotShake);
    }

    // Camera offset
    ctx.translate(-this.cameraX, -this.cameraY);

    // 1. Draw Arena Ground & Grid
    this.renderGround(ctx);

    // 2. Draw Blood Decals
    this.renderBloodSplats(ctx);

    // 3. Draw Barrels
    this.renderBarrels(ctx);

    // 4. Draw Coins
    this.renderCoins(ctx);

    // 5. Draw Supply Drops (Parachuting & Landed)
    this.renderSupplyDrops(ctx);

    // 6. Draw Boss Shockwaves & Telegraphed Skill Zones
    this.renderShockwaves(ctx);

    // 7. Draw Zombies (Normal & Boss with Dialogue Bubbles)
    this.renderZombies(ctx);

    // 8. Draw Bullets
    this.renderBullets(ctx);

    // 9. Draw Player
    this.renderPlayer(ctx);

    // 10. Draw Particles
    this.renderParticles(ctx);

    // 11. Draw Floating Numbers
    this.renderFloatingTexts(ctx);

    // 12. Draw Arena Boundary Walls
    this.renderArenaBorders(ctx);

    ctx.restore();
  }

  private renderGround(ctx: CanvasRenderingContext2D) {
    // Ground color - tactical dark dirt floor like Survivor Rush
    ctx.fillStyle = '#1c1613';
    ctx.fillRect(0, 0, this.arenaWidth, this.arenaHeight);

    // Subtle tile grid
    ctx.strokeStyle = '#29211c';
    ctx.lineWidth = 1;
    const gridSize = 60;
    const startX = Math.floor(this.cameraX / gridSize) * gridSize;
    const endX = Math.min(this.arenaWidth, this.cameraX + this.canvas.width + gridSize);
    const startY = Math.floor(this.cameraY / gridSize) * gridSize;
    const endY = Math.min(this.arenaHeight, this.cameraY + this.canvas.height + gridSize);

    ctx.beginPath();
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    // Center circular spawn emblem
    ctx.strokeStyle = '#3b2f27';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.arenaWidth / 2, this.arenaHeight / 2, 70, 0, Math.PI * 2);
    ctx.stroke();
  }

  private renderBloodSplats(ctx: CanvasRenderingContext2D) {
    for (const splat of this.bloodSplats) {
      ctx.fillStyle = `rgba(136, 19, 19, ${splat.alpha})`;
      ctx.beginPath();
      ctx.arc(splat.x, splat.y, splat.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderBarrels(ctx: CanvasRenderingContext2D) {
    for (const b of this.barrels) {
      // Red explosive barrel with yellow hazard stripes
      ctx.fillStyle = '#b91c1c';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Barrel ring
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Small hazard flame icon / exclamation
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', b.x, b.y);
    }
  }

  private renderCoins(ctx: CanvasRenderingContext2D) {
    for (const c of this.coins) {
      const pulse = 1 + Math.sin(c.pulseTimer) * 0.15;
      const rad = c.radius * pulse;

      // Glow
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 8;

      // Shiny Gold / Diamond gem
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(c.x, c.y, rad, 0, Math.PI * 2);
      ctx.fill();

      // Inner highlight
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(c.x - rad * 0.3, c.y - rad * 0.3, rad * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
    }
  }

  private renderZombies(ctx: CanvasRenderingContext2D) {
    for (const z of this.zombies) {
      ctx.save();
      ctx.translate(z.x, z.y);

      // Walk wobble
      const wobble = Math.sin(z.walkCycle) * 0.1;
      ctx.rotate(z.angle + wobble);

      if (z.isBoss) {
        // Boss Glowing Red/Purple Aura
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 24;

        // Outer pulsing ring
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, z.radius + 6, 0, Math.PI * 2);
        ctx.stroke();

        // Main Boss Circle - Purple
        ctx.fillStyle = z.flashTimer > 0 ? '#ffffff' : z.color;
        ctx.beginPath();
        ctx.arc(0, 0, z.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Boss Face / Horns / Menacing features
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(z.radius * 0.4, -z.radius * 0.3, 5, 0, Math.PI * 2);
        ctx.arc(z.radius * 0.4, z.radius * 0.3, 5, 0, Math.PI * 2);
        ctx.fill();

        // Boss Teeth/Mouth
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(z.radius * 0.2, -z.radius * 0.25, 6, z.radius * 0.5);

      } else {
        // Normal Zombie - Red Circle with dark outline
        ctx.fillStyle = z.flashTimer > 0 ? '#ffffff' : z.color;
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(0, 0, z.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Zombie Eyes
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(z.radius * 0.35, -4, 2.5, 0, Math.PI * 2);
        ctx.arc(z.radius * 0.35, 4, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Boss Health Bar above Boss
      if (z.isBoss) {
        const barWidth = 80;
        const barHeight = 8;
        const barX = z.x - barWidth / 2;
        const barY = z.y - z.radius - 20;

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);

        // HP fill
        const hpPercent = Math.max(0, z.hp / z.maxHp);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

        // Boss Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`BOSS: ${Math.ceil(z.hp)} / ${z.maxHp}`, z.x, barY - 5);

        // Boss Dialogue Speech Bubble
        if (z.bossDialogueText) {
          ctx.save();
          ctx.font = 'bold 13px sans-serif';
          const textWidth = ctx.measureText(z.bossDialogueText).width;
          const bubbleW = textWidth + 24;
          const bubbleH = 26;
          const bubbleX = z.x - bubbleW / 2;
          const bubbleY = barY - 38;

          // Bubble background with red glowing border
          ctx.fillStyle = 'rgba(20, 10, 25, 0.92)';
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 12;

          ctx.beginPath();
          ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 6);
          ctx.fill();
          ctx.stroke();

          // Text inside bubble
          ctx.fillStyle = '#fecdd3';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`"${z.bossDialogueText}"`, z.x, bubbleY + bubbleH / 2);
          ctx.restore();
        }
      } else if (z.hp < z.maxHp) {
        // Normal damaged zombie small health bar
        const barWidth = 24;
        const barHeight = 3.5;
        const barX = z.x - barWidth / 2;
        const barY = z.y - z.radius - 8;

        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        const hpPct = Math.max(0, z.hp / z.maxHp);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(barX, barY, barWidth * hpPct, barHeight);
      }
    }
  }

  private renderBullets(ctx: CanvasRenderingContext2D) {
    for (const b of this.bullets) {
      // Bullet Glow
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 6;

      // Small glowing yellow/orange dot
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      // Fading tail
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - b.vx * 1.5, b.y - b.vy * 1.5);
      ctx.stroke();

      ctx.shadowBlur = 0;
    }
  }

  private renderPlayer(ctx: CanvasRenderingContext2D) {
    const p = this.player;
    ctx.save();
    ctx.translate(p.x, p.y);

    // If invincibility active, pulse alpha
    if (p.invincibleTimer > 0) {
      ctx.globalAlpha = Math.sin(Date.now() * 0.03) > 0 ? 0.35 : 0.9;
    }

    // Energy Shield Bubble if active and ready
    if (p.shieldActive && p.shieldCooldown <= 0) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius + 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Directional orientation
    ctx.rotate(p.angle);

    // Gun Barrel line indicating direction
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, -4, p.radius + 12, 8);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, -4, p.radius + 12, 8);

    // Player Body: Blue circle
    ctx.fillStyle = '#2563eb';
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cute survivor visor / headband
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.arc(p.radius * 0.25, 0, p.radius * 0.45, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    ctx.restore();
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D) {
    for (const ft of this.floatingTexts) {
      ctx.save();
      const alpha = 1 - (ft.life / ft.maxLife);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${ft.fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  private renderArenaBorders(ctx: CanvasRenderingContext2D) {
    // Red / Yellow Danger Hazard Border
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, this.arenaWidth - 8, this.arenaHeight - 8);

    // Caution corner stripes
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, this.arenaWidth - 20, this.arenaHeight - 20);
  }

  private renderSupplyDrops(ctx: CanvasRenderingContext2D) {
    for (const drop of this.supplyDrops) {
      ctx.save();

      // Parachute ropes and canopy if still falling
      if (!drop.isLanded) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(drop.x - 14, drop.y);
        ctx.lineTo(drop.x - 22, drop.y - 32);
        ctx.moveTo(drop.x + 14, drop.y);
        ctx.lineTo(drop.x + 22, drop.y - 32);
        ctx.stroke();

        // Parachute dome
        ctx.fillStyle = drop.color;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y - 32, 24, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Ground beacon ring
      const pulse = 1 + Math.sin(drop.pulseTimer) * 0.12;
      ctx.strokeStyle = drop.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = drop.color;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.arc(drop.x, drop.targetY, (drop.radius + 8) * pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Supply crate box
      const boxSize = drop.radius * 1.6;
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = drop.color;
      ctx.lineWidth = 2.5;
      ctx.fillRect(drop.x - boxSize / 2, drop.y - boxSize / 2, boxSize, boxSize);
      ctx.strokeRect(drop.x - boxSize / 2, drop.y - boxSize / 2, boxSize, boxSize);

      // Icon symbol in crate
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(drop.iconSymbol, drop.x, drop.y);

      // Label above crate
      if (drop.isLanded) {
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(drop.title, drop.x, drop.y - drop.radius - 10);
      }

      ctx.restore();
    }
  }

  private renderShockwaves(ctx: CanvasRenderingContext2D) {
    // 1. Render active expanding shockwaves
    for (const sw of this.shockwaves) {
      ctx.save();
      const progress = sw.radius / sw.maxRadius;
      ctx.globalAlpha = Math.max(0, 1 - progress);
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = Math.max(2, 6 * (1 - progress));
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // 2. Render boss slam windup radius telegraph
    for (const z of this.zombies) {
      if (z.isBoss && z.bossState === 'SLAM_WINDUP' && z.bossSlamRadius && z.bossSlamRadius > 0) {
        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.bossSlamRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}
