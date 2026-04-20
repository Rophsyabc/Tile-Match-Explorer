import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { GameTile, GameStatus, Theme } from './types';
import { generateLevel, updateBlockedStatus } from './utils/gameLogic';
import { TRAY_SIZE, MATCH_COUNT, TILE_SIZE, BOARD_WIDTH, BOARD_HEIGHT, THEMES } from './constants';
import { Tile } from './components/Tile';
import { Tray } from './components/Tray';
import { GameOverlay } from './components/GameOverlay';
import { PowerUps } from './components/PowerUps';
import { Settings } from './components/Settings';
import { LevelMap } from './components/LevelMap';
import { Leaderboard } from './components/Leaderboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdRewardModal } from './components/AdRewardModal';
import { BannerAd } from './components/BannerAd';
import { InterstitialAd } from './components/InterstitialAd';
import { audioService } from './utils/AudioService';
import { findBestMoveAI } from './utils/aiService';
import { findBestMove, calculateComboBonus } from './utils/gameLogic';
import { ComboIndicator } from './components/ComboIndicator';
import { Shop } from './components/Shop';
import { Achievements } from './components/Achievements';
import { PetCompanion } from './components/PetCompanion';
import { DailyBonus } from './components/DailyBonus';
import { GlobalChallenge } from './components/GlobalChallenge';
import { hapticService } from './utils/HapticService';
import { ACHIEVEMENTS, BOOSTERS } from './constants';
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType, 
  testConnection 
} from './firebase';
import { 
  signInWithPopup, 
  signInAnonymously,
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { Sparkles, Leaf, Wind, Settings as SettingsIcon, Star, Map as MapIcon, Trophy, Calendar, LogIn, Coins } from 'lucide-react';

const STORAGE_KEY = 'tile_explorer_save';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [level, setLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [board, setBoard] = useState<GameTile[]>([]);
  const [tray, setTray] = useState<GameTile[]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [history, setHistory] = useState<{ board: GameTile[], tray: GameTile[] }[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bestStars, setBestStars] = useState<Record<number, number>>({});
  const [currentStars, setCurrentStars] = useState(3);
  const [startTime, setStartTime] = useState(0);
  const [view, setView] = useState<'game' | 'map' | 'leaderboard'>('game');
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [lastDailyDate, setLastDailyDate] = useState<string | null>(null);
  const [coins, setCoins] = useState(100); // Initial coins
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adRewardType, setAdRewardType] = useState<'revive' | 'coins'>('coins');
  const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [lastMatchTime, setLastMatchTime] = useState(0);
  const [activeTheme, setActiveTheme] = useState('emerald');
  const [inventory, setInventory] = useState({ themes: ['emerald'], boosters: {} });
  const [achievements, setAchievements] = useState<Record<string, any>>({});
  const [pet, setPet] = useState({ name: 'Sparky', level: 1, exp: 0, mood: 'neutral' as const });
  const [gameScale, setGameScale] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load all initial state from LocalStorage for immediate start
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.level) setLevel(data.level);
        if (data.unlockedLevels) setUnlockedLevels(data.unlockedLevels);
        if (data.bestStars) setBestStars(data.bestStars);
        if (data.lastDailyDate) setLastDailyDate(data.lastDailyDate);
        if (data.coins !== undefined) setCoins(data.coins);
        if (data.inventory) {
          setInventory(data.inventory);
          if (data.inventory.activeTheme) setActiveTheme(data.inventory.activeTheme);
        }
        if (data.achievements) setAchievements(data.achievements);
        if (data.pet) setPet(data.pet);
        if (data.isMuted !== undefined) {
          setIsMuted(data.isMuted);
          audioService.setMuted(data.isMuted);
        }
      } catch (e) {
        console.error('Failed to load local save', e);
      }
    }
  }, []);

  // Responsive Scaling Logic
  useEffect(() => {
    const handleResize = () => {
      const headerHeight = 120;
      const footerHeight = 240;
      const padding = 40;
      
      const availableWidth = window.innerWidth - padding;
      const availableHeight = window.innerHeight - headerHeight - footerHeight - padding;
      
      const boardW = BOARD_WIDTH * TILE_SIZE;
      const boardH = BOARD_HEIGHT * TILE_SIZE;
      
      const scaleW = availableWidth / boardW;
      const scaleH = availableHeight / boardH;
      
      setGameScale(Math.min(1, scaleW, scaleH));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auth Listener (Resilient Initialization)
  useEffect(() => {
    testConnection();
    
    // Safety timeout: If auth takes too long (e.g. poor network), 
    // allow the app to proceed in guest mode using local data.
    const timeoutId = setTimeout(() => {
      if (!isAuthReady) {
        console.warn('Auth initialization timed out, proceeding in offline mode');
        setIsAuthReady(true);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        signInAnonymously(auth)
          .then(() => {
            clearTimeout(timeoutId);
            setIsAuthReady(true);
          })
          .catch(e => {
            console.error('Guest login failed', e);
            // Don't clear timeout, let it fall back or resolve manually
            setIsAuthReady(true);
          });
      } else {
        setUser(u);
        clearTimeout(timeoutId);
        setIsAuthReady(true);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [isAuthReady]);

  // Firestore Sync with Data Merging
  useEffect(() => {
    if (!user || user.isAnonymous === false) return; // Only sync for actual users or once auth is stable

    const path = `users/${user.uid}`;
    const unsubscribe = onSnapshot(doc(db, path), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        
        // Merge strategy: Keep the "best" progress (highest level/stars/coins)
        setUnlockedLevels(prev => Math.max(prev, data.unlockedLevels || 1));
        setBestStars(prev => {
          const merged = { ...prev };
          const remoteStars = data.bestStars || {};
          Object.keys(remoteStars).forEach(lvl => {
            const levelNum = parseInt(lvl);
            merged[levelNum] = Math.max(merged[levelNum] || 0, remoteStars[lvl]);
          });
          return merged;
        });
        
        // Use remote data for global states if they are newer or non-existent locally
        if (data.coins !== undefined) setCoins(prev => Math.max(prev, data.coins));
        if (data.lastDailyDate) setLastDailyDate(prev => (!prev || data.lastDailyDate > prev) ? data.lastDailyDate : prev);
        
        if (data.level && data.level > 1) setLevel(prev => Math.max(prev, data.level));
        
        if (data.inventory) {
          setInventory(prev => ({
            ...prev,
            ...data.inventory,
            themes: Array.from(new Set([...prev.themes, ...(data.inventory.themes || [])]))
          }));
          if (data.inventory.activeTheme) setActiveTheme(data.inventory.activeTheme);
        }
        
        if (data.achievements) setAchievements(prev => ({ ...prev, ...data.achievements }));
        if (data.pet) setPet(prev => (data.pet.exp > prev.exp) ? data.pet : prev);
      }
    }, (error) => {
      console.warn('Firestore sync paused (possibly offline):', error.message);
    });

    return () => unsubscribe();
  }, [user]);

  const saveProgress = async (
    newLevel: number, 
    newUnlocked: number, 
    newStars: Record<number, number>, 
    newDaily: string | null, 
    newCoins: number,
    newInventory = inventory,
    newAchievements = achievements,
    newPet = pet
  ) => {
    // 1. Always save to LocalStorage first (Synchronous fallback)
    const saveData = {
      level: newLevel,
      unlockedLevels: newUnlocked,
      bestStars: newStars,
      lastDailyDate: newDaily,
      coins: newCoins,
      inventory: newInventory,
      achievements: newAchievements,
      pet: newPet,
      isMuted,
      updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));

    // 2. Attempt Firestore sync if user is authenticated
    if (!user) return;

    const userPath = `users/${user.uid}`;
    const leaderboardPath = `leaderboard/${user.uid}`;
    const totalStars = Object.values(newStars).reduce((a, b) => (a as number) + (b as number), 0) as number;

    try {
      await setDoc(doc(db, userPath), {
        ...saveData,
        uid: user.uid,
        displayName: user.displayName || 'Explorer',
        photoURL: user.photoURL,
        updatedAt: serverTimestamp()
      }, { merge: true });

      await setDoc(doc(db, leaderboardPath), {
        uid: user.uid,
        displayName: user.displayName || 'Explorer',
        score: totalStars * 100,
        level: newUnlocked,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.warn('Silent sync failure (expected if offline):', error);
      // We don't throw here to prevent UI disruption
    }
  };

  const showInterstitial = (callback: () => void) => {
    // 30% chance to show interstitial to maximize profit without being too annoying
    if (Math.random() < 0.3) {
      setPendingAction(() => callback);
      setIsInterstitialOpen(true);
    } else {
      callback();
    }
  };

  const handleAdReward = () => {
    if (adRewardType === 'revive') {
      const newTray = tray.slice(0, -3);
      setTray(newTray);
      setStatus('playing');
      audioService.play('MATCH');
    } else if (adRewardType === 'coins') {
      const newCoins = coins + 50;
      setCoins(newCoins);
      saveProgress(level, unlockedLevels, bestStars, lastDailyDate, newCoins);
      audioService.play('WIN');
    }
  };

  const currentTheme = useMemo(() => {
    if (isDailyChallenge) return THEMES[6];
    return THEMES.find(t => t.id === activeTheme) || THEMES[0];
  }, [activeTheme, isDailyChallenge]);

  const startLevel = useCallback((l: number, daily = false) => {
    setIsDailyChallenge(daily);
    if (daily) {
      const today = new Date().toISOString().split('T')[0];
      const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
      setBoard(generateLevel(seed % 500 + 1));
    } else {
      setBoard(generateLevel(l));
    }
    setTray([]);
    setHistory([]);
    setStatus('playing');
    setStartTime(Date.now());
    setCurrentStars(3);
    setView('game');
  }, []);

  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 120) setCurrentStars(1);
      else if (elapsed > 60) setCurrentStars(2);
      else setCurrentStars(3);
    }, 1000);
    return () => clearInterval(interval);
  }, [status, startTime]);

  const handleTileClick = (clickedTile: GameTile) => {
    if (status !== 'playing' || tray.length >= TRAY_SIZE || isProcessing) return;
    if (clickedTile.isLocked) {
      audioService.play('LOSE');
      return;
    }

    audioService.play('CLICK');
    setHistory(prev => [...prev, { board: [...board], tray: [...tray] }]);

    // Special Tile Handling - Ice
    if (clickedTile.special === 'ice' && clickedTile.health && clickedTile.health > 1) {
      setBoard(prev => prev.map(t => 
        t.instanceId === clickedTile.instanceId ? { ...t, health: (t.health || 0) - 1 } : t
      ));
      return;
    }

    // Key handling
    if (clickedTile.special === 'key') {
      setBoard(prev => prev.map(t => t.special === 'lock' ? { ...t, isLocked: false, special: undefined } : t));
    }

    const newBoard = board.filter(t => t.instanceId !== clickedTile.instanceId);
    setBoard(updateBlockedStatus(newBoard));

    // Smart Tray Insertion Logic (Grouping)
    const trayTile = { ...clickedTile, isHinted: false, special: undefined }; // Clean version
    const existingGroupIndices = tray.reduce((acc: number[], t, idx) => {
      if (t.id === trayTile.id) acc.push(idx);
      return acc;
    }, []);

    let newTray: GameTile[];
    if (existingGroupIndices.length > 0) {
      const lastIndex = existingGroupIndices[existingGroupIndices.length - 1];
      newTray = [...tray];
      newTray.splice(lastIndex + 1, 0, trayTile);
    } else {
      newTray = [...tray, trayTile];
    }

    setIsProcessing(true);
    setTray(newTray);
    
    // Check matches after a short delay for animation
    setTimeout(() => {
      checkMatches(newTray, newBoard);
    }, 300);
    
    // Pet reaction
    setPet(prev => ({ ...prev, mood: 'happy', exp: prev.exp + 1 }));
  };

  // Timed Tile Timer Loop
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      setBoard(prev => {
        let hasExpired = false;
        const newBoard = prev.map(tile => {
          if (tile.special === 'timed' && tile.timer !== undefined) {
            if (tile.timer <= 0) {
              hasExpired = true;
              return tile;
            }
            return { ...tile, timer: tile.timer - 1 };
          }
          return tile;
        });

        if (hasExpired) {
          setStatus('lost');
          audioService.play('LOSE');
          setPet(p => ({ ...p, mood: 'sad' }));
        }
        return newBoard;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const updateCombo = () => {
    const now = Date.now();
    const diff = (now - lastMatchTime) / 1000;
    
    if (diff < 5) { // 5 second window for combo
      setComboMultiplier(prev => Math.min(prev + 1, 10));
    } else {
      setComboMultiplier(1);
    }
    setLastMatchTime(now);
  };

  const checkMatches = (currentTray: GameTile[], currentBoard: GameTile[]) => {
    const counts: Record<string, number> = {};
    currentTray.forEach(t => counts[t.id] = (counts[t.id] || 0) + 1);
    const matchId = Object.keys(counts).find(id => counts[id] >= MATCH_COUNT);

    if (matchId) {
      audioService.play('MATCH');
      updateCombo();
      
      setTimeout(() => {
        const afterMatchTray = currentTray.filter(t => t.id !== matchId);
        setTray(afterMatchTray);
        setIsProcessing(false); // Reset after clearing

        if (currentBoard.length === 0) {
          setStatus('won');
          audioService.play('WIN');
          
          let nextLevel = level;
          let nextUnlocked = unlockedLevels;
          let nextStars = { ...bestStars, [level]: Math.max(bestStars[level] || 0, currentStars) };
          let nextDaily = lastDailyDate;

          if (isDailyChallenge) {
            nextDaily = new Date().toISOString().split('T')[0];
          } else {
            if (level === unlockedLevels) {
              nextUnlocked = Math.min(unlockedLevels + 1, 500);
            }
          }

          const bonus = calculateComboBonus(comboMultiplier);
          const finalCoins = coins + 20 + bonus;
          setCoins(finalCoins);
          saveProgress(nextLevel, nextUnlocked, nextStars, nextDaily, finalCoins);
          
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else {
          // Normal match, show small effect
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#fbbf24', '#f59e0b', '#fb7185']
          });
        }
      }, 500);
    } else {
      setIsProcessing(false); // Reset immediately if no match
      
      // If tray is full and no match was found, game is lost
      if (currentTray.length >= TRAY_SIZE) {
        setStatus('lost');
        audioService.play('LOSE');
        setPet(p => ({ ...p, mood: 'sad' }));
      }
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    hapticService.impact();
    const lastState = history[history.length - 1];
    setBoard(lastState.board);
    setTray(lastState.tray);
    setHistory(prev => prev.slice(0, -1));
    audioService.play('CLICK');
  };

  const handleShopPurchaseTheme = (themeId: string, price: number) => {
    if (coins < price) return;
    const newCoins = coins - price;
    const newThemes = [...inventory.themes, themeId];
    const newInventory = { ...inventory, themes: newThemes };
    setCoins(newCoins);
    setInventory(newInventory);
    saveProgress(level, unlockedLevels, bestStars, lastDailyDate, newCoins, newInventory);
    audioService.play('WIN');
    hapticService.notification();
  };

  const handleAchievementClaim = (id: string) => {
    const achievement = achievements[id];
    if (!achievement || achievement.isClaimed) return;
    const newCoins = coins + achievement.reward;
    const newAchievements = { ...achievements, [id]: { ...achievement, isClaimed: true } };
    setCoins(newCoins);
    setAchievements(newAchievements);
    saveProgress(level, unlockedLevels, bestStars, lastDailyDate, newCoins, inventory, newAchievements);
    audioService.play('WIN');
  };

  const handleDailyClaim = (reward: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newCoins = coins + reward;
    setCoins(newCoins);
    setLastDailyDate(today);
    saveProgress(level, unlockedLevels, bestStars, today, newCoins);
    audioService.play('WIN');
    hapticService.notification();
  };

  const handleHint = () => {
    const counts: Record<string, GameTile[]> = {};
    board.forEach(t => {
      if (!t.isBlocked) {
        if (!counts[t.id]) counts[t.id] = [];
        counts[t.id].push(t);
      }
    });
    const hintId = Object.keys(counts).find(id => counts[id].length >= 1);
    if (hintId) {
      const tileToHint = counts[hintId][0];
      setBoard(prev => prev.map(t => t.instanceId === tileToHint.instanceId ? { ...t, isHinted: true } : t));
      setTimeout(() => setBoard(prev => prev.map(t => ({ ...t, isHinted: false }))), 2000);
    }
    audioService.play('CLICK');
  };

  const handleAIHint = async () => {
    if (coins < 20) return;
    
    setCoins(prev => prev - 20);
    audioService.play('CLICK');
    
    const hintInstanceId = await findBestMoveAI(board);
    if (hintInstanceId) {
      setBoard(prev => prev.map(t => t.instanceId === hintInstanceId ? { ...t, isHinted: true } : t));
      setTimeout(() => setBoard(prev => prev.map(t => ({ ...t, isHinted: false }))), 3000);
    } else {
      // Fallback to basic hint if AI fails
      handleHint();
    }
  };

  const handleShuffle = () => {
    const symbols = board.map(t => ({ id: t.id, symbol: t.symbol, name: t.name, color: t.color }));
    for (let i = symbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
    }
    setBoard(prev => prev.map((t, i) => ({ ...t, ...symbols[i] })));
    audioService.play('SHUFFLE');
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioService.setMuted(newMuted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isMuted: newMuted }));
  };

  const resetProgress = () => {
    setLevel(1);
    setUnlockedLevels(1);
    setBestStars({});
    setLastDailyDate(null);
    setCoins(100);
    saveProgress(1, 1, {}, null, 100);
    startLevel(1);
  };

  const totalScore = useMemo(() => {
    return Object.values(bestStars).reduce((a, b) => (a as number) + (b as number) * 100, 0) as number;
  }, [bestStars]);

  const isDailyDone = lastDailyDate === new Date().toISOString().split('T')[0];

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;
      
      switch (e.key.toLowerCase()) {
        case 'u': handleUndo(); break;
        case 'h': handleHint(); break;
        case 's': handleShuffle(); break;
        case 'a': handleAIHint(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, board, coins, history]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`relative h-screen w-full overflow-hidden font-sans text-slate-900 transition-colors duration-1000 bg-gradient-to-br ${currentTheme.gradient} flex flex-col`}>
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <motion.div animate={{ x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-20 left-10"><Leaf size={120} /></motion.div>
          <motion.div animate={{ x: [0, -100, 0], y: [0, -50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-40 right-20"><Wind size={150} /></motion.div>
        </div>

        {/* Header - Top Bar */}
        <header className="relative z-10 p-4 pt-6 flex shrink-0 items-center justify-center">
          <div className="w-full max-w-2xl flex items-center justify-between px-4">
            <div className="flex gap-2">
              <button onClick={() => setIsSettingsOpen(true)} className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white hover:bg-white/30 transition-all active:scale-90"><SettingsIcon size={22} /></button>
              <button onClick={() => showInterstitial(() => setView('map'))} className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white hover:bg-white/30 transition-all active:scale-90"><MapIcon size={22} /></button>
              <button onClick={() => showInterstitial(() => setView('leaderboard'))} className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white hover:bg-white/30 transition-all active:scale-90"><Trophy size={22} /></button>
            </div>
            
            <div className="flex flex-col items-center">
              <PetCompanion pet={pet} />
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex gap-1">
                {[1, 2, 3].map(s => <Star key={s} size={18} className={s <= currentStars ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'} />)}
              </div>
              <button 
                onClick={() => setView('shop')}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white font-black text-xs hover:bg-white/30 transition-all active:scale-95"
              >
                <Coins size={12} className="text-amber-300" />
                {coins}
              </button>
            </div>
          </div>
        </header>

        {/* Main Game Area - Optimized Board */}
        <main className="relative z-10 flex-grow flex items-center justify-center p-2 min-h-0">
          <div 
            className="relative rounded-[40px] origin-center transition-transform duration-500" 
            style={{ 
              width: `${BOARD_WIDTH * TILE_SIZE}px`, 
              height: `${BOARD_HEIGHT * TILE_SIZE}px`,
              transform: `scale(${gameScale})`
            }}
          >
            <AnimatePresence>
              {board.map((tile) => <Tile key={tile.instanceId} tile={tile} onClick={handleTileClick} />)}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer Area - Tray & Controls */}
        <footer className="relative z-20 shrink-0 flex flex-col items-center gap-4 pb-12 pt-2 bg-gradient-to-t from-black/20 to-transparent">
          <Tray tiles={tray} size={inventory.boosters.extra_slot ? 8 : 7} />
          
          <PowerUps 
            onUndo={handleUndo} 
            onHint={handleHint} 
            onAIHint={handleAIHint}
            onShuffle={handleShuffle} 
            undoDisabled={history.length === 0} 
            coins={coins}
          />
        </footer>

        <ComboIndicator multiplier={comboMultiplier} />

        <GameOverlay 
          status={status} 
          level={level} 
          stars={currentStars}
          onStart={status === 'idle' ? () => startLevel(level) : () => {
            showInterstitial(() => {
              if (isDailyChallenge) { setView('map'); setStatus('idle'); } 
              else { const nextL = level + 1; setLevel(nextL); startLevel(nextL); }
            });
          }} 
          onRestart={() => startLevel(level, isDailyChallenge)} 
          onRevive={() => {
            setAdRewardType('revive');
            setIsAdModalOpen(true);
          }}
        />

        <AnimatePresence>
          {view === 'map' && (
            <LevelMap 
              currentLevel={level} unlockedLevels={unlockedLevels} bestStars={bestStars}
              onSelectLevel={(lvl) => { setLevel(lvl); startLevel(lvl); }}
              onBack={() => showInterstitial(() => setView('game'))} 
              onDailyChallenge={() => !isDailyDone && startLevel(0, true)} 
              isDailyDone={isDailyDone}
              onOpenShop={() => setView('shop')}
              onOpenAchievements={() => setView('achievements')}
              coins={coins}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {view === 'leaderboard' && <Leaderboard playerScore={totalScore} playerLevel={unlockedLevels} onBack={() => showInterstitial(() => setView('game'))} />}
        </AnimatePresence>

        <AnimatePresence>
          {view === 'shop' && (
            <Shop 
              coins={coins} ownedThemes={inventory.themes} activeThemeId={activeTheme} boosters={inventory.boosters}
              onBack={() => setView('map')} onActivateTheme={setActiveTheme} onPurchaseTheme={handleShopPurchaseTheme}
              onPurchaseBooster={(id, price) => {
                if (coins < price) return;
                const newCoins = coins - price;
                const newB = { ...inventory.boosters, [id]: (inventory.boosters[id] || 0) + 1 };
                const newInv = { ...inventory, boosters: newB };
                setCoins(newCoins); setInventory(newInv);
                saveProgress(level, unlockedLevels, bestStars, lastDailyDate, newCoins, newInv);
                audioService.play('WIN');
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {view === 'achievements' && (
            <Achievements achievements={achievements} onBack={() => setView('map')} onClaim={handleAchievementClaim} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {view === 'challenge' && (
            <GlobalChallenge onBack={() => setView('game')} onPlay={() => {}} coins={coins} />
          )}
        </AnimatePresence>

        <DailyBonus 
          isOpen={!lastDailyDate || (lastDailyDate !== new Date().toISOString().split('T')[0])} 
          onClose={() => setLastDailyDate(new Date().toISOString().split('T')[0])}
          lastClaimDate={lastDailyDate} onClaim={handleDailyClaim}
        />

        <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} isMuted={isMuted} onToggleMute={toggleMute} onResetProgress={resetProgress} />

        <AdRewardModal 
          isOpen={isAdModalOpen}
          onClose={() => setIsAdModalOpen(false)}
          onReward={handleAdReward}
          rewardText={adRewardType === 'revive' ? 'a Revive (Clear 3 Tiles)' : '50 Free Coins'}
        />

        <InterstitialAd 
          isOpen={isInterstitialOpen}
          onClose={() => {
            setIsInterstitialOpen(false);
            if (pendingAction) {
              pendingAction();
              setPendingAction(null);
            }
          }}
        />

        <BannerAd />
      </div>
    </ErrorBoundary>
  );
}
