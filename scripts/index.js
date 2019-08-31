// Default time is 25 minutes - value is given in minutes
let timerSetting = 25;
let remainingSeconds = 25 * 60;
let timer = null;

function minutesToMilliseconds(minutes) {
  return 1000 * 60 * minutes;
}

document.addEventListener("touchstart", function () { }, true);

function zeroPadded(str, len) {
  if (str.length < len) {
    const diff = len - str.length;
    return `${'0'.repeat(diff)}${str}`;
  }

  return str;
}

function timeStringFromSeconds(seconds) {
  const minuteStr = zeroPadded(String(Math.floor(seconds / 60)), 2);
  const secondStr = zeroPadded(String(seconds % 60), 2);
  return `${minuteStr}:${secondStr}`
}

function updateTimerDisplay() {
  const display = document.querySelector('.timer-display');
  display.textContent = timeStringFromSeconds(remainingSeconds);
}

function startCountdown() {
  if (timer) {
    return;
  }

  timer = setInterval(function () {
    remainingSeconds--;
    updateTimerDisplay();
  }, 1000);
}

function pauseCountdown() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function clearCountdown() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  remainingSeconds = timerSetting * 60;
  updateTimerDisplay();
}

function resetTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  timerSetting = 25;
}

document.querySelector('#start-button').addEventListener(
  'click',
  startCountdown,
)

document.querySelector('#pause-button').addEventListener(
  'click',
  pauseCountdown,
)

document.querySelector('#stop-button').addEventListener(
  'click',
  clearCountdown,
)
