class TimerUI {
  constructor() {
    this.timerElement = document.getElementById("timer");
    this.resumeBtn = document.getElementById("resumeBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.isRunning = false;
    this.time = 0;
    this.intervalId = null;

    this.hourlySoundCheckbox = document.getElementById("hourlySound");
    this.lastHour = 0;

    this.resumeBtn.addEventListener("click", () => this.toggleTimer());
    this.resetBtn.addEventListener("click", () => this.resetTimer());
    this.hourlySoundCheckbox.addEventListener("change", () =>
      this.toggleHourlySound()
    );

    this.updateUI();
  }

  toggleTimer() {
    if (this.isRunning) {
      chrome.runtime.sendMessage({ action: "pause" });
      clearInterval(this.intervalId);
    } else {
      chrome.runtime.sendMessage({ action: "start" });
      this.startLocalTimer();
    }
    this.isRunning = !this.isRunning;
    this.updateButtonState();
  }

  resetTimer() {
    chrome.runtime.sendMessage({ action: "reset" });
    clearInterval(this.intervalId);
    this.time = 0;
    this.isRunning = false;
    this.updateTimerDisplay();
    this.updateButtonState();
  }

  startLocalTimer() {
    this.intervalId = setInterval(() => {
      this.time++;
      this.updateTimerDisplay();

      const currentHour = Math.floor(this.time / 3600);
      if (this.hourlySoundCheckbox.checked && currentHour > this.lastHour) {
        this.playHourlySound();
        this.lastHour = currentHour;
      }
    }, 1000);
  }

  toggleHourlySound() {
    const isEnabled = this.hourlySoundCheckbox.checked;
    chrome.runtime.sendMessage({
      action: "toggleHourlySound",
      hourlySoundEnabled: isEnabled,
    });
  }

  playHourlySound() {
    const audio = new Audio("sounds/bell.wav");
    audio.play();
  }

  updateUI() {
    chrome.storage.local.get(["isRunning", "time", "hourlySound"], (result) => {
      this.isRunning = result.isRunning || false;
      this.time = result.time || 0;
      this.hourlySoundCheckbox.checked = result.hourlySound || false;
      this.updateTimerDisplay();
      this.updateButtonState();
      if (this.isRunning) {
        this.startLocalTimer();
      }
    });
  }

  updateTimerDisplay() {
    const hours = Math.floor(this.time / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((this.time % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(this.time % 60)
      .toString()
      .padStart(2, "0");
    this.timerElement.textContent = `${hours}:${minutes}:${seconds}`;
  }

  updateButtonState() {
    this.resumeBtn.textContent = this.isRunning ? "Pause" : "Start";
    this.resetBtn.textContent = "Stop";
  }
}

const timerUI = new TimerUI();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateTime") {
    timerUI.time = request.time;
    timerUI.updateTimerDisplay();
  }
});
