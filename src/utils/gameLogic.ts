import { GameTile, TileType, PatternType } from '../types';
import { TILE_TYPES, BOARD_WIDTH, BOARD_HEIGHT } from '../constants';

const getPattern = (level: number): PatternType => {
  const patterns: PatternType[] = ['grid', 'circle', 'heart', 'butterfly', 'diamond', 'star', 'spiral', 'cross', 'pyramid'];
  // Introduce patterns gradually
  if (level < 5) return 'grid';
  if (level < 10) return 'circle';
  if (level < 20) return 'heart';
  if (level < 30) return 'butterfly';
  if (level < 40) return 'diamond';
  if (level < 50) return 'star';
  
  // For 500 levels, cycle or randomize based on level
  return patterns[level % patterns.length];
};

export const generateLevel = (level: number): GameTile[] => {
  const tiles: GameTile[] = [];
  
  // Difficulty scaling for 500 levels
  // Max unique types is TILE_TYPES.length (20)
  const numUniqueTypes = Math.min(6 + Math.floor(level / 10), TILE_TYPES.length);
  
  // Total triplets: starts at 8, grows slowly to avoid impossible boards
  // Level 1: 8 triplets (24 tiles)
  // Level 500: 8 + 500/5 = 108 triplets (324 tiles)
  const numTriplets = 8 + Math.floor(level / 5); 
  const totalTiles = numTriplets * 3;
  
  const availableTypes = TILE_TYPES.slice(0, numUniqueTypes);
  const selectedTypes: TileType[] = [];
  
  for (let i = 0; i < numTriplets; i++) {
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    selectedTypes.push(type, type, type);
  }

  // Shuffle selected types
  for (let i = selectedTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedTypes[i], selectedTypes[j]] = [selectedTypes[j], selectedTypes[i]];
  }

  const pattern = getPattern(level);
  // Layers increase with level, max 8
  const layers = Math.min(Math.floor(level / 20) + 3, 8);
  let typeIndex = 0;

  for (let z = 0; z < layers; z++) {
    const points = generatePatternPoints(pattern, z, Math.ceil(totalTiles / layers));
    
    for (const point of points) {
      if (typeIndex < selectedTypes.length) {
        let special: any = undefined;
        let health: number | undefined = undefined;
        let isLocked: boolean | undefined = undefined;
        let timer: number | undefined = undefined;

        // Chance to spawn special tiles
        const roll = Math.random();
        if (level > 10 && roll < 0.1) {
          special = 'ice';
          health = 2;
        } else if (level > 20 && roll < 0.15) {
          special = 'lock';
          isLocked = true;
        } else if (level > 30 && roll < 0.2) {
          special = 'timed';
          timer = 15;
        }

        tiles.push({
          ...selectedTypes[typeIndex],
          instanceId: `tile-${z}-${typeIndex}-${Math.random()}`,
          x: point.x,
          y: point.y,
          z: z,
          isBlocked: false,
          special,
          health,
          isLocked,
          timer
        });
        typeIndex++;
      }
    }
  }

  // Ensure every Lock has a Key somewhere
  const lockedTiles = tiles.filter(t => t.special === 'lock');
  if (lockedTiles.length > 0) {
    const unlockedTiles = tiles.filter(t => !t.special);
    if (unlockedTiles.length > 0) {
      const keyTile = unlockedTiles[Math.floor(Math.random() * unlockedTiles.length)];
      keyTile.special = 'key';
    }
  }

  return updateBlockedStatus(tiles);
};

const generatePatternPoints = (pattern: PatternType, layer: number, count: number): {x: number, y: number}[] => {
  const points: {x: number, y: number}[] = [];
  const centerX = BOARD_WIDTH / 2 - 0.5;
  const centerY = BOARD_HEIGHT / 2 - 0.5;
  const radius = 3.0 - layer * 0.25;

  switch (pattern) {
    case 'star':
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const r = radius * (i % 2 === 0 ? 1 : 0.5);
        points.push({
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r
        });
      }
      break;
    case 'spiral':
      for (let i = 0; i < count; i++) {
        const angle = 0.5 * i;
        const r = (radius / count) * i;
        points.push({
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r
        });
      }
      break;
    case 'cross':
      for (let i = 0; i < count; i++) {
        const progress = (i / count) * 2 - 1;
        if (i % 2 === 0) {
          points.push({ x: centerX + progress * radius, y: centerY });
        } else {
          points.push({ x: centerX, y: centerY + progress * radius });
        }
      }
      break;
    case 'pyramid':
      const rows = Math.ceil(Math.sqrt(count));
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= r; c++) {
          if (idx < count) {
            points.push({
              x: centerX - r * 0.5 + c,
              y: centerY - rows * 0.5 + r
            });
            idx++;
          }
        }
      }
      break;
    case 'circle':
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (layer * Math.PI / 4);
        points.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        });
      }
      break;
    case 'heart':
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        points.push({
          x: centerX + (x / 16) * radius * 1.2,
          y: centerY + (y / 16) * radius * 1.2
        });
      }
      break;
    case 'butterfly':
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5);
        points.push({
          x: centerX + Math.sin(t) * r * radius * 0.5,
          y: centerY - Math.cos(t) * r * radius * 0.5
        });
      }
      break;
    case 'diamond':
      const dSize = radius * 1.5;
      for (let i = 0; i < count; i++) {
        const side = Math.floor((i / count) * 4);
        const progress = (i / count * 4) % 1;
        let x = 0, y = 0;
        if (side === 0) { x = progress; y = 1 - progress; }
        else if (side === 1) { x = 1 - progress; y = -progress; }
        else if (side === 2) { x = -progress; y = -1 + progress; }
        else { x = -1 + progress; y = progress; }
        points.push({
          x: centerX + x * dSize,
          y: centerY + y * dSize
        });
      }
      break;
    case 'grid':
    default:
      const sideLen = Math.ceil(Math.sqrt(count));
      const startX = centerX - (sideLen - 1) / 2;
      const startY = centerY - (sideLen - 1) / 2;
      for (let i = 0; i < count; i++) {
        points.push({
          x: startX + (i % sideLen) + (layer % 2 ? 0.5 : 0),
          y: startY + Math.floor(i / sideLen) + (layer % 2 ? 0.5 : 0)
        });
      }
      break;
  }
  return points;
};

export const findBestMove = (board: GameTile[]): string | null => {
  const available = board.filter(t => !t.isBlocked);
  const counts: Record<string, string[]> = {};
  
  available.forEach(t => {
    if (!counts[t.id]) counts[t.id] = [];
    counts[t.id].push(t.instanceId);
  });

  // Try to find a triplet first
  for (const id in counts) {
    if (counts[id].length >= 3) return counts[id][0];
  }

  // Then a pair
  for (const id in counts) {
    if (counts[id].length >= 2) return counts[id][0];
  }

  // Then any
  for (const id in counts) {
    return counts[id][0];
  }

  return null;
};

export const calculateComboBonus = (multiplier: number): number => {
  return Math.floor(multiplier * 5); // 5 coins per combo level
};

export const updateBlockedStatus = (tiles: GameTile[]): GameTile[] => {
  return tiles.map(tile => {
    const isBlocked = tiles.some(other => {
      if (other.z <= tile.z || other.instanceId === tile.instanceId) return false;
      const dx = Math.abs(other.x - tile.x);
      const dy = Math.abs(other.y - tile.y);
      return dx < 0.7 && dy < 0.7;
    });
    return { ...tile, isBlocked };
  });
};
