import { TileType } from './types';

export const TILE_TYPES: TileType[] = [
  { id: 'strawberry', symbol: '🍓', name: 'Strawberry', color: 'bg-red-100' },
  { id: 'hibiscus', symbol: '🌺', name: 'Hibiscus', color: 'bg-pink-100' },
  { id: 'daisy', symbol: '🌼', name: 'Daisy', color: 'bg-yellow-100' },
  { id: 'lotus', symbol: '🪷', name: 'Lotus', color: 'bg-indigo-100' },
  { id: 'lavender', symbol: '🪻', name: 'Lavender', color: 'bg-purple-100' },
  { id: 'cherry_blossom', symbol: '🌸', name: 'Cherry Blossom', color: 'bg-rose-100' },
  { id: 'rose', symbol: '🌹', name: 'Rose', color: 'bg-red-50' },
  { id: 'orange', symbol: '🍊', name: 'Orange', color: 'bg-orange-100' },
  { id: 'kiwi', symbol: '🥝', name: 'Kiwi', color: 'bg-green-100' },
  { id: 'leaf', symbol: '🍃', name: 'Leaf', color: 'bg-emerald-50' },
  { id: 'gem', symbol: '💎', name: 'Gem', color: 'bg-cyan-100' },
  { id: 'mushroom', symbol: '🍄', name: 'Mushroom', color: 'bg-orange-50' },
  { id: 'lemon', symbol: '🍋', name: 'Lemon', color: 'bg-yellow-50' },
  { id: 'blueberry', symbol: '🫐', name: 'Blueberry', color: 'bg-blue-100' },
  { id: 'cherry', symbol: '🍒', name: 'Cherry', color: 'bg-red-200' },
  { id: 'snowflake', symbol: '❄️', name: 'Snowflake', color: 'bg-blue-50' },
  { id: 'fire', symbol: '🔥', name: 'Fire', color: 'bg-orange-200' },
  { id: 'lightning', symbol: '⚡', name: 'Lightning', color: 'bg-yellow-200' },
  { id: 'balloon', symbol: '🎈', name: 'Balloon', color: 'bg-pink-200' },
];

export const TRAY_SIZE = 7;
export const MATCH_COUNT = 3;
export const TILE_SIZE = 64; // px
export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 10;

export const THEMES = [
  { id: 'emerald', name: 'Emerald', gradient: 'from-emerald-400 via-teal-500 to-cyan-600', accent: 'bg-emerald-600', price: 0 },
  { id: 'sunset', name: 'Sunset', gradient: 'from-orange-400 via-red-500 to-pink-600', accent: 'bg-orange-600', price: 500 },
  { id: 'ocean', name: 'Ocean', gradient: 'from-blue-400 via-indigo-500 to-purple-600', accent: 'bg-blue-600', price: 500 },
  { id: 'forest', name: 'Forest', gradient: 'from-green-600 via-emerald-700 to-teal-800', accent: 'bg-green-800', price: 1000 },
  { id: 'lavender', name: 'Lavender', gradient: 'from-purple-300 via-violet-400 to-indigo-500', accent: 'bg-purple-500', price: 1000 },
  { id: 'midnight', name: 'Midnight', gradient: 'from-slate-800 via-slate-900 to-black', accent: 'bg-slate-700', price: 2000 },
  { id: 'sakura', name: 'Sakura', gradient: 'from-pink-200 via-rose-300 to-red-400', accent: 'bg-pink-400', price: 2000 },
];

export const BOOSTERS = [
  { id: 'extra_slot', name: 'Extra Slot', description: 'Start with 8 tray slots', icon: 'PlusCircle', price: 100 },
  { id: 'star_shield', name: 'Star Shield', description: 'Lose stars 50% slower', icon: 'Shield', price: 150 },
  { id: 'combo_boost', name: 'Combo Boost', description: 'Combo window +2 seconds', icon: 'Zap', price: 200 },
];

export const ACHIEVEMENTS = [
  { id: 'first_win', title: 'Novice Explorer', description: 'Win your first level', target: 1, reward: 50 },
  { id: 'combo_5', title: 'Combo King', description: 'Reach a x5 multiplier', target: 5, reward: 100 },
  { id: 'levels_10', title: 'Dedicated', description: 'Unlock level 10', target: 10, reward: 200 },
  { id: 'stars_100', title: 'Stellar', description: 'Collect 100 stars', target: 100, reward: 500 },
  { id: 'coins_1000', title: 'Wealthy', description: 'Have 1,000 coins', target: 1000, reward: 300 },
];

export const SOUNDS = {
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  MATCH: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  WIN: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  LOSE: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  SHUFFLE: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3',
};
