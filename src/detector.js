import { CONFIG } from "./config.js";

export class Detector {
  constructor() {
    this.detector = null;
    this.video = null;
    this.isReady = false;
    this.detectLoopId = null;
    this.onDetection = null;
  }

  async load() {
    return new Promise((resolve, reject) => {
      // ml5 is loaded via script tag in index.html, so it's globally available
      if (typeof ml5 === "undefined") {
        reject("ML5 not loaded");
        return;
      }

      this.detector = ml5.objectDetector("cocossd", {}, () => {
        this.isReady = true;
        console.log("Detector Loaded");
        resolve();
      });
    });
  }

  start(videoElement, onDetectionCallback) {
    if (!this.isReady) {
      console.warn("Detector not ready");
      return;
    }

    this.video = videoElement;
    this.onDetection = onDetectionCallback;
    this.detectLoop();
  }

  stop() {
    cancelAnimationFrame(this.detectLoopId);
    this.detectLoopId = null;
    this.video = null;
  }

  detectLoop() {
    if (!this.video) return;

    // Fix: Ensure video has loaded data before detecting
    if (this.video.readyState < 2) {
      this.detectLoopId = requestAnimationFrame(() => this.detectLoop());
      return;
    }

    this.detector.detect(this.video, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }

      if (this.onDetection) {
        this.onDetection(results);
      }

      this.detectLoopId = requestAnimationFrame(() => this.detectLoop());
    });
  }
}
