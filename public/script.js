// 슬롯 데이터
const categories = {
  category1: [
    "전공",
    "교양",
    "시험",
    "팀플",
    "보고서",
    "발표",
    "실험",
    "퀴즈",
    "과제",
    "조교시간",
    "수강신청",
    "출석",
    "EN과목",
  ],
  category2: [
    "🍯꿀",
    "🔥지옥",
    "😌여유",
    "😐평범",
    "🌪️카오스",
    "✨완벽",
    "😰떨리는",
    "⚡벼락",
    "🐆웃는치타",
    "🐨행복한쿼카",
    "🤔생각많은",
    "💤졸린",
  ],
  category3: [
    "🍕피자",
    "🎯과녁",
    "🎪서커스",
    "🌈무지개",
    "🚀로켓",
    "🐢거북이",
    "🎲주사위",
    "🏃달리는사람",
    "🛌침대",
    "💊알약",
    "🎁선물상자",
    "🎭가면",
    "💸날아가는돈",
  ],
};

// Gemini API를 통한 운세 해석 생성
async function generateFortune(slot1, slot2, slot3) {
  try {
    const response = await fetch("http://localhost:3000/api/fortune", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slot1, slot2, slot3 }),
    });

    const data = await response.json();
    return data.fortune;
  } catch (error) {
    console.error("운세 생성 오류:", error);
    // Fallback 메시지
    return `${slot1}의 ${slot2} 기운이 느껴져! ${slot3}의 결과가 기다리고 있어. 최선을 다하면 좋은 일이 생길 거야! 💪`;
  }
}

// DOM 요소
const spinButton = document.getElementById("spinButton");
const resetButton = document.getElementById("resetButton");
const resultDiv = document.getElementById("result");
const fortuneText = document.getElementById("fortuneText");
const slots = [
  document.getElementById("slot1"),
  document.getElementById("slot2"),
  document.getElementById("slot3"),
];

let isSpinning = false;

// 결과 표시 함수
async function displayResults(results) {
  // 결과 표시
  document.getElementById("resultSlot1").textContent = results[0];
  document.getElementById("resultSlot2").textContent = results[1];
  document.getElementById("resultSlot3").textContent = results[2];

  // 운세 생성 중 표시
  fortuneText.textContent = "🔮 AI가 운세를 분석하고 있어요...";
  resultDiv.classList.remove("hidden");

  // Gemini API로 운세 생성
  const fortune = await generateFortune(results[0], results[1], results[2]);
  fortuneText.textContent = fortune;

  isSpinning = false;
  spinButton.disabled = false;
  spinButton.textContent = "운세 뽑기 🎲";
}

// 랜덤 아이템 선택
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Easing 함수 (느리게 시작 → 빠르게 → 느리게 끝)
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// 슬롯 애니메이션 (가속/감속 + 흔들림 효과)
function animateSlot(slotElement, items, duration) {
  return new Promise((resolve) => {
    const slotInner = slotElement.querySelector(".slot-inner");
    const slotItem = slotElement.querySelector(".slot-item");

    slotElement.classList.add("spinning");

    const startTime = Date.now();
    let lastUpdateTime = startTime;
    const minInterval = 30; // 최소 간격 (빠를 때)
    const maxInterval = 200; // 최대 간격 (느릴 때)

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing 적용: 0에서 1로 부드럽게 변화
      const easedProgress = easeInOutQuad(progress);

      // 진행도에 따라 간격 조절 (처음/끝은 느리게, 중간은 빠르게)
      const currentInterval =
        maxInterval -
        (maxInterval - minInterval) * Math.sin(easedProgress * Math.PI);

      if (now - lastUpdateTime >= currentInterval) {
        slotItem.textContent = getRandomItem(items);
        lastUpdateTime = now;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 애니메이션 종료
        slotElement.classList.remove("spinning");
        const finalItem = getRandomItem(items);
        slotItem.textContent = finalItem;

        // 흔들림 효과
        slotElement.classList.add("shaking");
        setTimeout(() => {
          slotElement.classList.remove("shaking");
          resolve(finalItem);
        }, 500); // 0.5초 흔들림
      }
    };

    requestAnimationFrame(animate);
  });
}

// 스핀 버튼 클릭
spinButton.addEventListener("click", async () => {
  if (isSpinning) return;

  isSpinning = true;
  spinButton.disabled = true;
  spinButton.textContent = "돌리는 중...";
  resultDiv.classList.add("hidden");

  // 각 슬롯을 순차적으로 시작 (0.3초 간격)
  const results = [];

  // 첫 번째 슬롯
  setTimeout(async () => {
    results[0] = await animateSlot(slots[0], categories.category1, 2000);
  }, 0);

  // 두 번째 슬롯 (0.3초 후 시작)
  setTimeout(async () => {
    results[1] = await animateSlot(slots[1], categories.category2, 2000);
  }, 300);

  // 세 번째 슬롯 (0.6초 후 시작)
  setTimeout(async () => {
    results[2] = await animateSlot(slots[2], categories.category3, 2000);

    // 모든 슬롯이 멈춘 후 결과 표시
    setTimeout(() => {
      displayResults(results);
    }, 600); // 흔들림 효과 끝난 후
  }, 600);
});

// 리셋 버튼
resetButton.addEventListener("click", () => {
  resultDiv.classList.add("hidden");

  // 슬롯 초기화
  slots[0].querySelector(".slot-item").textContent = "전공";
  slots[1].querySelector(".slot-item").textContent = "🍯꿀";
  slots[2].querySelector(".slot-item").textContent = "🍕피자";
});
