export class Timer {
  constructor(durationMinutes, onTick, onComplete) {
    this.duration = durationMinutes * 60; // seconds
    this.remaining = this.duration;
    this.intervalId = null;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      this.remaining--;
      if (this.onTick) this.onTick(this.remaining);

      if (this.remaining <= 0) {
        this.stop();
        if (this.onComplete) this.onComplete();
      }
    }, 1000);
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.intervalId);
  }

  reset(newDurationMinutes) {
    this.stop();
    this.duration = (newDurationMinutes || this.duration) * 60; // update duration if provided, else keep old
    this.remaining = this.duration;
    // convert to minutes for reset? No, duration is seconds.
    // wait, logic in constructor: durationMinutes * 60.
    // here: newDurationMinutes * 60. Correct.
    if (this.onTick) this.onTick(this.remaining);
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
}
