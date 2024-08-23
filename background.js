class Timer {
  constructor() {
    this.time = 0;
    this.isRunning = false;
    this.intervalId = null;
    this.hourlySoundEnabled = false;
    this.lastHour = 0;

    chrome.action.setBadgeBackgroundColor({ color: "#E57CD8" });

    this.loadState();
  }

  loadState() {
    chrome.storage.local.get(
      ["time", "isRunning", "hourlySoundEnabled"],
      (result) => {
        this.time = result.time || 0;
        this.isRunning = result.isRunning || false;
        this.hourlySoundEnabled = result.hourlySoundEnabled || false;
        if (this.isRunning) {
          this.start();
        } else {
          this.updateBadge();
        }
      }
    );
  }

  saveState() {
    chrome.storage.local.set({
      time: this.time,
      isRunning: this.isRunning,
      hourlySoundEnabled: this.hourlySoundEnabled,
    });
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => {
        this.time++;
        this.updateBadge();
        this.checkHourlyAlert();
        this.saveState();
        this.sendUpdateToPopup();
      }, 1000);
    }
  }

  pause() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.intervalId);
      this.saveState();
      this.updateBadge();
    }
  }

  reset() {
    this.pause();
    this.time = 0;
    this.lastHour = 0;
    this.updateBadge();
    this.saveState();
    this.sendUpdateToPopup();
  }

  updateBadge() {
    const minutes = Math.floor(this.time / 60);
    const hours = Math.floor(minutes / 60);
    const displayMinutes = (minutes % 60).toString().padStart(2, "0");
    const badgeText = `${hours}:${displayMinutes}`;
    chrome.action.setBadgeText({ text: badgeText });
  }

  checkHourlyAlert() {
    const currentHour = Math.floor(this.time / 3600);
    if (this.hourlySoundEnabled && currentHour > this.lastHour) {
      this.playHourlySound();
      this.lastHour = currentHour;
    }
  }

  playHourlySound() {
    const audio = new Audio("sounds/bell.wav");
    audio.play();
  }

  sendUpdateToPopup() {
    chrome.runtime.sendMessage({ action: "updateTime", time: this.time });
  }
}

const timer = new Timer();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "start":
      timer.start();
      break;
    case "pause":
      timer.pause();
      break;
    case "reset":
      timer.reset();
      break;
    case "toggleHourlySound":
      timer.hourlySoundEnabled = request.hourlySoundEnabled;
      timer.saveState();
      break;
  }
});
