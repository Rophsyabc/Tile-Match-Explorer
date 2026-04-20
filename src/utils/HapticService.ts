import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

class HapticService {
  private isAvailable = true;

  async impact(style: ImpactStyle = ImpactStyle.Light) {
    if (!this.isAvailable) return;
    try {
      await Haptics.impact({ style });
    } catch (e) {
      this.isAvailable = false;
    }
  }

  async notification(type: NotificationType = NotificationType.Success) {
    if (!this.isAvailable) return;
    try {
      await Haptics.notification({ type });
    } catch (e) {
      this.isAvailable = false;
    }
  }

  async vibrate() {
    if (!this.isAvailable) return;
    try {
      await Haptics.vibrate();
    } catch (e) {
      this.isAvailable = false;
    }
  }
}

export const hapticService = new HapticService();
