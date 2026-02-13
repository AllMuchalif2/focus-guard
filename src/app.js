import { CONFIG, SETTINGS } from "./config.js";
import { Detector } from "./detector.js";
import { Timer } from "./timer.js";
import { notificationManager } from "./notification.js";
import { UI } from "./ui.js";

// App State
let video = null;
let detector = new Detector();
let timer = null;

async function init() {
  UI.init();

  const loadingStatus = document.getElementById("loading-status");
  const loadingOverlay = document.getElementById("loading-overlay");

  if (loadingStatus) loadingStatus.innerText = "MENYIAPKAN OFFLINE MODE...";

  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker Registered");
    } catch (e) {
      console.warn("SW Registration Failed", e);
    }
  }

  if (loadingStatus) loadingStatus.innerText = "MEMUAT AI MODEL...";
  try {
    await detector.load();
  } catch (e) {
    console.error("Model Load Failed", e);
    if (loadingStatus) loadingStatus.innerText = "GAGAL MEMUAT MODEL";
    return;
  }

  if (loadingStatus) loadingStatus.innerText = "SIAP!";

  if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.style.opacity = "0";
      setTimeout(() => {
        loadingOverlay.style.display = "none";
      }, 500);
    }, 800);
  }

  UI.updateStatus("SIAP", "gray");
  updateTimerDisplay(SETTINGS.timerDuration * 60);

  const toggleBtn = document.getElementById("btn-toggle");
  if (toggleBtn) toggleBtn.onclick = handleToggle;
}

function handleToggle() {
  if (timer && timer.isRunning) {
    stopSession();
  } else {
    startSession();
  }
}

function updateTimerDisplay(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  UI.updateTimer(
    `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
  );
}

async function startSession() {
  notificationManager.requestPermission();

  if (!video) {
    video = document.createElement("video");
    video.width = 640;
    video.height = 480;
    video.autoplay = true;
    video.playsInline = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();
      document.getElementById("video-container").appendChild(video);
    } catch (e) {
      alert("Camera permission denied");
      return;
    }
  }

  const duration =
    parseInt(UI.elements.timerInput.value) || SETTINGS.timerDuration;
  timer = new Timer(
    duration,
    (remaining) => updateTimerDisplay(remaining),
    () => {
      stopSession();
      notificationManager.notifyComplete();
    },
  );

  UI.setFocusState(true);
  timer.start();

  detector.start(video, handleDetections);
}

function stopSession() {
  if (timer) timer.stop();
  detector.stop();

  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach((t) => t.stop());
    video.remove();
    video = null;
  }

  UI.setFocusState(false);

  const duration =
    parseInt(UI.elements.timerInput.value) || SETTINGS.timerDuration;
  updateTimerDisplay(duration * 60);
}

function handleDetections(results) {
  const phone = results.find(
    (d) =>
      d.label === CONFIG.LABEL_TARGET &&
      d.confidence > CONFIG.CONFIDENCE_THRESHOLD,
  );

  if (phone) {
    UI.showDetection(true);
    notificationManager.notifyDetection();
  } else {
    UI.showDetection(false);
  }
}

// Start App
window.addEventListener("DOMContentLoaded", init);
