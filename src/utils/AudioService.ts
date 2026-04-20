import { SOUNDS } from '../constants';

class AudioService {
  private sounds: Record<string, HTMLAudioElement> = {};
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      Object.entries(SOUNDS).forEach(([key, url]) => {
        const audio = new Audio(url as string);
        audio.preload = 'auto';
        this.sounds[key as string] = audio;
      });
    }
  }

  setMuted(isMuted: boolean) {
    this.muted = isMuted;
  }

  play(soundKey: keyof typeof SOUNDS) {
    if (this.muted) return;
    const sound = this.sounds[soundKey as string];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.warn('Audio play failed:', e));
    }
  }
}

export const audioService = new AudioService();
