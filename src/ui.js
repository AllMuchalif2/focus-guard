import { SETTINGS } from "./config.js";

export const UI = {
  elements: {},

  init() {
    this.elements = {
      toggleBtn: document.getElementById("btn-toggle"),
      timerDisplay: document.getElementById("timer-display"),
      timerInput: document.getElementById("timer-input"),
      notificationToggle: document.getElementById("toggle-notification"),
      statusBadge: document.getElementById("status-badge"),
      statusText: document.getElementById("status-text"),
      statusDot: document.getElementById("status-dot"),
      videoContainer: document.getElementById("video-container"),
      videoPlaceholder: document.getElementById("video-placeholder"),
      detectionOverlay: document.getElementById("detection-overlay"),
    };

    // Initialize Settings UI
    this.elements.timerInput.value = SETTINGS.timerDuration;
    this.elements.notificationToggle.checked = SETTINGS.notificationEnabled;

    // Settings Listeners
    this.elements.timerInput.addEventListener("change", (e) => {
      SETTINGS.timerDuration = e.target.value;
    });

    this.elements.notificationToggle.addEventListener("change", (e) => {
      SETTINGS.notificationEnabled = e.target.checked;
    });
  },

  setFocusState(active) {
    if (active) {
      this.elements.toggleBtn.innerText = "STOP SESSION";
      this.elements.toggleBtn.classList.remove("bg-[#50C878]");
      this.elements.toggleBtn.classList.add("bg-[#FF6B6B]");

      this.elements.videoPlaceholder.classList.add("hidden");
      this.elements.videoContainer.classList.remove("hidden");

      this.elements.timerInput.disabled = true;
    } else {
      this.elements.toggleBtn.innerText = "START SESSION";
      this.elements.toggleBtn.classList.remove("bg-[#FF6B6B]");
      this.elements.toggleBtn.classList.add("bg-[#50C878]");

      this.elements.videoPlaceholder.classList.remove("hidden");
      this.elements.videoContainer.classList.add("hidden");

      this.elements.timerInput.disabled = false;
      this.clearDetection();
    }
  },

  updateTimer(formattedTime) {
    this.elements.timerDisplay.innerText = formattedTime;
  },

  showDetection(show) {
    if (show) {
      this.elements.detectionOverlay.classList.remove("hidden");
      this.updateStatus("HP TERDETEKSI!", "red");
    } else {
      this.elements.detectionOverlay.classList.add("hidden");
      this.updateStatus("FOKUS...", "green");
    }
  },

  clearDetection() {
    this.elements.detectionOverlay.classList.add("hidden");
    this.updateStatus("SIAP", "gray");
  },

  updateStatus(text, color) {
    this.elements.statusText.innerText = text;
    this.elements.statusDot.className = `inline-block h-3 w-3 rounded-full border-2 border-black ${
      color === "red"
        ? "bg-red-500 animate-pulse"
        : color === "green"
          ? "bg-green-500"
          : "bg-gray-400"
    }`;
  },
};
