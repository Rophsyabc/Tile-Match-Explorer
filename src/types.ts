export type TileType = {
  id: string;
  symbol: string;
  name: string;
  color: string;
};

export type SpecialTileType = 'ice' | 'lock' | 'timed' | 'key';

export type GameTile = TileType & {
  instanceId: string;
  x: number;
  y: number;
  z: number; // Layer
  isBlocked: boolean;
  isHinted?: boolean;
  special?: SpecialTileType;
  health?: number; // For Ice: 2 = normal, 1 = cracked
  isLocked?: boolean; // For Lock tiles
  timer?: number; // For Timed tiles
};

export type GameStatus = 'playing' | 'won' | 'lost' | 'idle';

export type PatternType = 'grid' | 'heart' | 'butterfly' | 'circle' | 'diamond' | 'star' | 'spiral' | 'cross' | 'pyramid';

export interface Theme {
  id: string;
  name: string;
  gradient: string;
  accent: string;
  price: number;
  isUnlocked?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  isClaimed?: boolean;
}

export interface GameState {
  board: GameTile[];
  tray: GameTile[];
  status: GameStatus;
  level: number;
  history: { board: GameTile[], tray: GameTile[] }[];
  isMuted: boolean;
  bestStars: Record<number, number>;
  personalBests: Record<number, number>;
  isDailyChallenge: boolean;
  lastDailyDate?: string;
  view: 'game' | 'map' | 'leaderboard' | 'shop' | 'achievements' | 'challenge';
  unlockedLevels: number;
  coins: number;
  inventory: {
    themes: string[]; // List of theme IDs
    activeTheme: string;
    boosters: Record<string, number>;
  };
  achievements: Record<string, Achievement>;
  pet: {
    name: string;
    level: number;
    exp: number;
    mood: 'happy' | 'neutral' | 'sad' | 'excited';
  };
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  score: number;
  level: number;
  isPlayer?: boolean;
}
