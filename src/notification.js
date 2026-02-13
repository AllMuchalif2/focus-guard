import { CONFIG, SETTINGS } from "./config.js";

class NotificationManager {
  constructor() {
    this.audio = new Audio("sound.mp3");
    this.isCooldown = false;
  }

  requestPermission() {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }

  notifyDetection() {
    if (this.isCooldown) return;

    // Always play sound on detection
    this.audio.currentTime = 0;
    this.audio.play().catch(() => {});

    // Only send notification if enabled
    if (SETTINGS.notificationEnabled && Notification.permission === "granted") {
      new Notification("HP Terdeteksi!", {
        body: "Singkirkan HP-mu dan kembali fokus!",
        icon: "icon.svg",
      });
    }

    this.isCooldown = true;
    setTimeout(() => {
      this.isCooldown = false;
    }, CONFIG.NOTIFICATION_COOLDOWN_MS);
  }

  notifyComplete() {
    // Silent notification for completion
    if (Notification.permission === "granted") {
      new Notification("Sesi Fokus Selesai!", {
        body: "Kerja bagus! Istirahatlah sejenak.",
        icon: "icon.svg",
      });
    }
  }
}

export const notificationManager = new NotificationManager();
