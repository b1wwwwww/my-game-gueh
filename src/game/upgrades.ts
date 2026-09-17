import { UpgradeOption, Player } from './types';

export const ALL_UPGRADES: UpgradeOption[] = [
  {
    id: 'fire_rate',
    title: 'Rapid Trigger',
    description: '+25% Fire Rate. Shoot faster to overwhelm the horde.',
    category: 'offense',
    icon: 'Zap',
    tier: 'common'
  },
  {
    id: 'bullet_damage',
    title: 'Heavy Caliber',
    description: '+35% Bullet Damage. Tear through tough zombie flesh.',
    category: 'offense',
    icon: 'Sword',
    tier: 'common'
  },
  {
    id: 'pierce',
    title: 'Piercing Rounds',
    description: '+1 Bullet Pierce. Bullets rip through multiple enemies.',
    category: 'offense',
    icon: 'Crosshair',
    tier: 'rare'
  },
  {
    id: 'multishot',
    title: 'Twin Barrel',
    description: '+1 Projectile per shot. Fires in a controlled spread.',
    category: 'offense',
    icon: 'Flame',
    tier: 'rare'
  },
  {
    id: 'move_speed',
    title: 'Sprint Boost',
    description: '+20% Movement Speed. Outrun fast rushers.',
    category: 'utility',
    icon: 'Footprints',
    tier: 'common'
  },
  {
    id: 'max_hp',
    title: 'Vitality Core',
    description: '+30 Max HP and instantly heal +50 HP.',
    category: 'defense',
    icon: 'Heart',
    tier: 'common'
  },
  {
    id: 'magnet',
    title: 'Coin Magnet',
    description: '+60% Coin Pickup Radius with intense gravitational pull.',
    category: 'utility',
    icon: 'Compass',
    tier: 'common'
  },
  {
    id: 'explosive',
    title: 'High Explosive',
    description: 'Bullets detonate on impact dealing 50% splash damage.',
    category: 'offense',
    icon: 'Bomb',
    tier: 'epic'
  },
  {
    id: 'shield',
    title: 'Aegis Barrier',
    description: 'Generates a rechargeable energy shield blocking incoming damage.',
    category: 'defense',
    icon: 'Shield',
    tier: 'epic'
  },
  {
    id: 'bullet_speed',
    title: 'Velocity Barrel',
    description: '+40% Bullet Speed and heavy knockback on impact.',
    category: 'offense',
    icon: 'Wind',
    tier: 'common'
  }
];

export function getRandomUpgrades(count = 3): UpgradeOption[] {
  const shuffled = [...ALL_UPGRADES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function applyUpgradeToPlayer(player: Player, upgradeId: string) {
  switch (upgradeId) {
    case 'fire_rate':
      player.fireRate *= 1.25;
      break;
    case 'bullet_damage':
      player.bulletDamage = Math.round(player.bulletDamage * 1.35);
      break;
    case 'pierce':
      player.bulletPierce += 1;
      break;
    case 'multishot':
      player.bulletCount += 1;
      player.bulletSpread = Math.min(0.5, 0.15 + player.bulletCount * 0.05);
      break;
    case 'move_speed':
      player.speed *= 1.2;
      break;
    case 'max_hp':
      player.maxHp += 30;
      player.hp = Math.min(player.maxHp, player.hp + 50);
      break;
    case 'magnet':
      player.magnetRange *= 1.6;
      break;
    case 'explosive':
      player.explosiveRadius = Math.max(45, player.explosiveRadius + 30);
      break;
    case 'shield':
      player.shieldActive = true;
      player.shieldCooldown = 0;
      break;
    case 'bullet_speed':
      player.bulletSpeed *= 1.35;
      break;
  }
}
