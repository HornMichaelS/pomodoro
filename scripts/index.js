(function () {
  'use strict';

  const modes = Object.freeze({
    session: 'session',
    break: 'break',
    stopped: 'stopped',
  });

  const defaultTimerSetting = 25;
  const defaultBreakSetting = 5;

  // Default time is 25 minutes - value is given in minutes
  let timerSetting = defaultTimerSetting;
  let breakSetting = defaultBreakSetting;
  let remainingSeconds = timerSetting * 60;
  let timer = null;
  let mode = modes.stopped;

  function minutesToMilliseconds(minutes) {
    return 1000 * 60 * minutes;
  }

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
    const timeDisplay = document.querySelector('.timer-display');
    const sessionSettingDisplay = document.querySelector('.session-length .control-value');
    const breakSettingDisplay = document.querySelector('.break-length .control-value');
    const modeDisplay = document.querySelector('.mode-display');
    const modeSpan = modeDisplay.querySelector('span');

    modeDisplay.classList.remove('in-session', 'stopped', 'on-break');

    switch (mode) {
      case modes.session:
        modeSpan.textContent = 'IN SESSION';
        modeDisplay.classList.add('in-session');
        break;
      case modes.break:
        modeSpan.textContent = 'BREAK TIME';
        modeDisplay.classList.add('on-break');
        break;
      case modes.stopped:
        modeSpan.textContent = 'STOPPED';
        modeDisplay.classList.add('stopped');
    }

    timeDisplay.textContent = timeStringFromSeconds(remainingSeconds);
    sessionSettingDisplay.textContent = timerSetting;
    breakSettingDisplay.textContent = breakSetting;
  }

  function startTimer() {
    if (timer) {
      return;
    }

    mode = modes.session;

    timer = setInterval(function () {
      if (remainingSeconds === 0) {
        switch (mode) {
          case modes.session:
            mode = modes.break;
            remainingSeconds = breakSetting * 60;
            break;
          default:
            mode = modes.session;
            remainingSeconds = timerSetting * 60;
        }
      } else {
        remainingSeconds--;
      }

      updateTimerDisplay();
    }, 50);
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
    mode = modes.stopped;
    updateTimerDisplay();
  }

  function resetTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    timerSetting = defaultTimerSetting;
    breakSetting = defaultBreakSetting;
    remainingSeconds = timerSetting * 60;
    mode = modes.stopped;
    updateTimerDisplay();
  }

  function incrementSessionDuration() {
    if (timer) {
      return;
    }

    timerSetting += 1;
    remainingSeconds = timerSetting * 60;
    updateTimerDisplay();
  }

  function decrementSessionDuration() {
    if (timerSetting < 2 || timer) {
      return;
    }

    timerSetting -= 1;
    remainingSeconds = timerSetting * 60;
    updateTimerDisplay();
  }

  function incrementBreakDuration() {
    if (timer) {
      return;
    }

    breakSetting += 1;
    updateTimerDisplay();
  }

  function decrementBreakDuration() {
    if (breakSetting < 2 || timer) {
      return;
    }

    breakSetting -= 1;
    updateTimerDisplay();
  }

  function addClickListener(selector, callback) {
    document.querySelector(selector).addEventListener(
      'click',
      callback,
    )
  }

  // Detect touch events on iOS Safari
  document.addEventListener("touchstart", function () { }, true);

  addClickListener('#start-button', startTimer);
  addClickListener('#pause-button', pauseCountdown);
  addClickListener('#stop-button', clearCountdown);
  addClickListener('#reset-button', resetTimer);

  addClickListener('.session-length .control-left', decrementSessionDuration);
  addClickListener('.session-length .control-right', incrementSessionDuration);
  addClickListener('.break-length .control-left', decrementBreakDuration);
  addClickListener('.break-length .control-right', incrementBreakDuration);
})();
