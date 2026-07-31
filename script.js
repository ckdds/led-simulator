"use strict";

const led = document.querySelector(".led");
const onTimeInput = document.getElementById("onTimeInput");
const offTimeInput = document.getElementById("offTimeInput");
const intervalInput = document.getElementById("intervalInput");
const idButton = document.getElementById("idButton");
const idLabel = document.getElementById("idLabel");

let blinkTimerId = null;
let currentId = 1;

// 버튼을 누를 때마다 ID를 1 증가시키고, 10을 넘어가면 1로 되돌린다.
function incrementId() {
  currentId = currentId >= 10 ? 1 : currentId + 1;
  idLabel.textContent = `ID : ${currentId}`;

  // 깜박임을 즉시 멈추고 LED를 끈 뒤, INTERVAL만큼 기다렸다가 새 ID로 처음부터 다시 시작한다.
  clearBlinkTimer();
  led.classList.remove("on");
  const { interval } = getTimingValues();
  blinkTimerId = setTimeout(() => {
    runBlinkStep(0);
  }, interval);
}

idButton.addEventListener("click", incrementId);

// 입력창 값을 읽어 0 이상의 정수로 변환한다. (빈 값/잘못된 값은 0으로 처리)
function getTimingValues() {
  return {
    onTime: Math.max(0, parseInt(onTimeInput.value, 10) || 0),
    offTime: Math.max(0, parseInt(offTimeInput.value, 10) || 0),
    interval: Math.max(0, parseInt(intervalInput.value, 10) || 0),
  };
}

function clearBlinkTimer() {
  if (blinkTimerId !== null) {
    clearTimeout(blinkTimerId);
    blinkTimerId = null;
  }
}

// 현재 ID 횟수만큼 ON/OFF를 반복한 뒤, INTERVAL만큼 대기하고 처음부터 다시 반복한다.
function startBlinking() {
  clearBlinkTimer();
  runBlinkStep(0);
}

function runBlinkStep(blinkCount) {
  const { onTime, offTime, interval } = getTimingValues();

  if (blinkCount >= currentId) {
    // ID 횟수만큼 다 켰다 껐으면 INTERVAL만큼 대기 후 처음부터 재시작
    blinkTimerId = setTimeout(startBlinking, interval);
    return;
  }

  led.classList.add("on");
  blinkTimerId = setTimeout(() => {
    led.classList.remove("on");
    blinkTimerId = setTimeout(() => {
      runBlinkStep(blinkCount + 1);
    }, offTime);
  }, onTime);
}

// 설정값이 바뀌면 새 값으로 점멸을 처음부터 다시 시작한다.
[onTimeInput, offTimeInput, intervalInput].forEach((input) => {
  input.addEventListener("change", startBlinking);
});

startBlinking();
