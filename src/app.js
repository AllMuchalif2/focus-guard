import { CONFIG, SETTINGS } from "./config.js";
import { Detector } from "./detector.js";
import { Timer } from "./timer.js";
import { notificationManager } from "./notification.js";
import { UI } from "./ui.js";

// App State
let video = null;
let detector = new Detector();
let timer = null;
let selectedDeviceId = null;

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

  // Populate camera list (onchange auto-switches camera)
  await populateCameraList();

  // Initially set hint state
  setCameraCardState(false);
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
async function populateCameraList() {
  const select = document.getElementById("camera-select");
  if (!select) return;

  try {
    // Brief permission request so labels are readable
    const tempStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    tempStream.getTracks().forEach((t) => t.stop());
  } catch (_) {
    /* permission denied – labels may be empty */
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((d) => d.kind === "videoinput");

  select.innerHTML = "";
  videoDevices.forEach((device, i) => {
    const opt = document.createElement("option");
    opt.value = device.deviceId;
    opt.textContent = device.label || `Kamera ${i + 1}`;
    select.appendChild(opt);
  });

  // Set default selected device
  if (videoDevices.length > 0) {
    selectedDeviceId = videoDevices[0].deviceId;
  }

  select.onchange = () => {
    selectedDeviceId = select.value;
    handleSwitchCamera();
  };
}

async function handleSwitchCamera() {
  if (!timer || !timer.isRunning) return;
  const select = document.getElementById("camera-select");
  const newDeviceId = select ? select.value : null;
  if (!newDeviceId) return;

  detector.stop();

  try {
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach((t) => t.stop());
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: newDeviceId } },
    });
    video.srcObject = stream;
    await video.play();
    selectedDeviceId = newDeviceId;
    detector.start(video, handleDetections);
  } catch (e) {
    console.warn("Switch camera failed:", e);
    alert("Gagal mengganti kamera.");
    detector.start(video, handleDetections);
  }
}

function setCameraCardState(sessionActive) {
  const hint = document.getElementById("camera-switch-hint");
  if (hint) {
    hint.textContent = sessionActive
      ? "Kamera akan berganti otomatis saat memilih dari dropdown."
      : "Mulai sesi terlebih dahulu untuk mengganti kamera.";
  }
}

async function startSession() {
  notificationManager.requestPermission();

  const select = document.getElementById("camera-select");
  const deviceId = select && select.value ? select.value : null;

  if (!video) {
    video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.style.position = "absolute";
    video.style.inset = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    document.getElementById("video-container").appendChild(video);
  }

  try {
    const constraints = deviceId
      ? { video: { deviceId: { exact: deviceId } } }
      : { video: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    await video.play();
  } catch (e) {
    alert("Izin kamera ditolak atau kamera tidak tersedia.");
    video.remove();
    video = null;
    return;
  }

  const duration = Math.max(
    1,
    parseInt(UI.elements.timerInput.value) || SETTINGS.timerDuration,
  );
  timer = new Timer(
    duration,
    (remaining) => updateTimerDisplay(remaining),
    () => {
      stopSession();
      notificationManager.notifyComplete();
    },
  );

  UI.setFocusState(true);
  setCameraCardState(true);
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
  setCameraCardState(false);

  const duration = Math.max(
    1,
    parseInt(UI.elements.timerInput.value) || SETTINGS.timerDuration,
  );
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
