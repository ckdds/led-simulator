"use strict";

// ID를 그대로 빨간색 점멸 횟수로 사용한다. (장치 1)
function defaultBlinkColors(id) {
  return Array.from({ length: id }, () => "red");
}

// 5단위 타산(tally) 표시: 5가 될 때마다 초록 1번, 나머지는 빨강으로 표시한다. (장치 2)
// 예) 5 -> 초록1  6 -> 초록1 빨강1  7 -> 초록1 빨강2  10 -> 초록2
function tallyBlinkColors(id) {
  const greenCount = Math.floor(id / 5);
  const redCount = id % 5;
  return [
    ...Array.from({ length: greenCount }, () => "green"),
    ...Array.from({ length: redCount }, () => "red"),
  ];
}

// 장치(LED + 버튼 + 타이밍 설정) 1개를 초기화한다.
// suffix로 각 장치의 DOM 요소를 구분하고, 상태(currentId, 타이머)는 장치별로 독립적으로 관리한다.
// getBlinkColors(id): 현재 ID에 대해 순서대로 점멸할 색상("red"|"green") 배열을 반환한다.
function initDevice(suffix, getBlinkColors) {
  const led = document.getElementById(`led${suffix}`);
  if (!led) return; // 현재 페이지에 이 장치가 없으면 아무것도 하지 않는다.

  const idButton = document.getElementById(`idButton${suffix}`);
  const idLabel = document.getElementById(`idLabel${suffix}`);
  const intervalInput = document.getElementById(`intervalInput${suffix}`);

  // 공통 ON/OFF 입력 (장치 1처럼 색상이 하나뿐인 경우 사용)
  const genericOnTimeInput = document.getElementById(`onTimeInput${suffix}`);
  const genericOffTimeInput = document.getElementById(`offTimeInput${suffix}`);

  let blinkTimerId = null;
  let currentId = 1;

  // 색상별 전용 ON/OFF 입력이 있으면 그것을 쓰고, 없으면 공통 입력으로 대체한다.
  function getColorTiming(color) {
    const onInput = document.getElementById(`${color}OnTimeInput${suffix}`) || genericOnTimeInput;
    const offInput = document.getElementById(`${color}OffTimeInput${suffix}`) || genericOffTimeInput;
    return {
      onTime: Math.max(0, parseInt(onInput.value, 10) || 0),
      offTime: Math.max(0, parseInt(offInput.value, 10) || 0),
    };
  }

  function getInterval() {
    return Math.max(0, parseInt(intervalInput.value, 10) || 0);
  }

  function clearBlinkTimer() {
    if (blinkTimerId !== null) {
      clearTimeout(blinkTimerId);
      blinkTimerId = null;
    }
  }

  function setLedColor(color) {
    led.classList.remove("on-red", "on-green");
    if (color) led.classList.add(`on-${color}`);
  }

  // 현재 ID에 해당하는 색상 순서대로 점멸한 뒤, INTERVAL만큼 대기하고 처음부터 다시 반복한다.
  function startBlinking() {
    clearBlinkTimer();
    runBlinkStep(0);
  }

  function runBlinkStep(blinkCount) {
    const colors = getBlinkColors(currentId);

    if (blinkCount >= colors.length) {
      // 정해진 순서를 다 표시했으면 INTERVAL만큼 대기 후 처음부터 재시작
      blinkTimerId = setTimeout(startBlinking, getInterval());
      return;
    }

    const color = colors[blinkCount];
    const { onTime, offTime } = getColorTiming(color);

    setLedColor(color);
    blinkTimerId = setTimeout(() => {
      setLedColor(null);
      blinkTimerId = setTimeout(() => {
        runBlinkStep(blinkCount + 1);
      }, offTime);
    }, onTime);
  }

  // 버튼을 누를 때마다 ID를 1 증가시키고, 10을 넘어가면 1로 되돌린다.
  function incrementId() {
    currentId = currentId >= 10 ? 1 : currentId + 1;
    idLabel.textContent = `ID : ${currentId}`;

    // 깜박임을 즉시 멈추고 LED를 끈 뒤, INTERVAL만큼 기다렸다가 새 ID로 처음부터 다시 시작한다.
    clearBlinkTimer();
    setLedColor(null);
    blinkTimerId = setTimeout(() => {
      runBlinkStep(0);
    }, getInterval());
  }

  idButton.addEventListener("click", incrementId);

  // 설정값이 바뀌면 새 값으로 점멸을 처음부터 다시 시작한다. (공통 입력 + 색상별 입력 모두 포함)
  const timingInputs = [
    genericOnTimeInput,
    genericOffTimeInput,
    intervalInput,
    document.getElementById(`redOnTimeInput${suffix}`),
    document.getElementById(`redOffTimeInput${suffix}`),
    document.getElementById(`greenOnTimeInput${suffix}`),
    document.getElementById(`greenOffTimeInput${suffix}`),
  ].filter(Boolean);

  timingInputs.forEach((input) => {
    input.addEventListener("change", startBlinking);
  });

  startBlinking();
}

initDevice(1, defaultBlinkColors);
initDevice(2, tallyBlinkColors);
