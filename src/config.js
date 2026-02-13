export const CONFIG = {
  MODEL_NAME: "cocossd",
  CONFIDENCE_THRESHOLD: 0.6,
  LABEL_TARGET: "cell phone",
  NOTIFICATION_COOLDOWN_MS: 10000,
  DEFAULT_TIMER_MINUTES: 25,
};

export const SETTINGS = {
  get notificationEnabled() {
    return localStorage.getItem("notificationEnabled") !== "false"; // Default true
  },
  set notificationEnabled(value) {
    localStorage.setItem("notificationEnabled", value);
  },
  get timerDuration() {
    return parseInt(
      localStorage.getItem("timerDuration") || CONFIG.DEFAULT_TIMER_MINUTES,
    );
  },
  set timerDuration(value) {
    localStorage.setItem("timerDuration", value);
  },
};
