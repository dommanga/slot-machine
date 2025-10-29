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

// 슬롯 릴 초기화
function initializeSlot(slotElement, items) {
  const reel = slotElement.querySelector(".slot-reel");
  const itemHeight = slotElement.offsetHeight;
  reel.innerHTML = "";

  // 초기 아이템만 표시
  const item = document.createElement("div");
  item.className = "slot-item";
  item.style.height = `${itemHeight}px`; // 동적으로 높이 설정!
  item.textContent = items[0];
  reel.appendChild(item);

  reel.style.transform = "translateY(0)";
  reel.style.transition = "none";
}

// 랜덤 아이템 선택
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 슬롯 애니메이션 (무한 루프 - 단순화 버전)
function animateSlot(slotElement, items) {
  return new Promise((resolve) => {
    const reel = slotElement.querySelector(".slot-reel");
    const itemHeight = slotElement.offsetHeight;

    console.log(`슬롯 높이: ${itemHeight}px, 아이템 개수: ${items.length}`);

    // 최종 결과 선택
    const finalItem = getRandomItem(items);
    const finalIndex = items.indexOf(finalItem);

    console.log(`최종 선택: ${finalItem} (인덱스: ${finalIndex})`);

    // 릴 초기화 - 충분히 많이 반복 (20번)
    reel.innerHTML = "";
    const totalRepeats = 20;
    for (let cycle = 0; cycle < totalRepeats; cycle++) {
      items.forEach((itemText, idx) => {
        const div = document.createElement("div");
        div.className = "slot-item";
        div.style.height = `${itemHeight}px`;
        div.textContent = itemText;
        div.dataset.cycle = cycle;
        div.dataset.index = idx;
        reel.appendChild(div);
      });
    }

    const cycleLength = items.length * itemHeight;
    console.log(
      `한 사이클 길이: ${cycleLength}px (${items.length}개 × ${itemHeight}px)`
    );

    // 초기 위치
    reel.style.transition = "none";
    reel.style.transform = "translateY(0)";
    reel.offsetHeight;

    let currentCycle = 0;
    const fastCycles = 6; // 빠르게 6바퀴

    // 빠른 스핀 함수
    const spinCycle = () => {
      if (currentCycle < fastCycles) {
        const speed = currentCycle < 2 ? 0.3 : 0.15;
        reel.style.transition = `transform ${speed}s linear`;
        reel.style.transform = `translateY(-${cycleLength}px)`;

        setTimeout(() => {
          reel.style.transition = "none";
          reel.style.transform = "translateY(0)";
          reel.offsetHeight;

          currentCycle++;
          spinCycle();
        }, speed * 1000);
      } else {
        // 감속하면서 최종 위치로
        // 한 바퀴 더 + 최종 아이템 위치
        const offset = 75;
        const finalPosition = cycleLength + finalIndex * itemHeight + offset;

        console.log(
          `감속 시작 → 최종 위치: ${cycleLength} + ${
            finalIndex * itemHeight
          } = ${finalPosition}px`
        );

        reel.style.transition =
          "transform 2.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
        reel.style.transform = `translateY(-${finalPosition}px)`;

        setTimeout(() => {
          // 정확히 어떤 아이템이 화면 중앙에 있는지 계산
          // translateY(-finalPosition) 이므로 화면에는 finalPosition만큼 이동한 위치
          const visibleIndex = Math.round(finalPosition / itemHeight);
          const visibleItem = reel.children[visibleIndex];

          console.log(`멈춘 위치 인덱스: ${visibleIndex}`);
          console.log(
            `화면 중앙 아이템: ${
              visibleItem ? visibleItem.textContent : "없음"
            }`
          );
          console.log(`선택된 아이템: ${finalItem}`);
          console.log(
            `일치 여부: ${
              visibleItem && visibleItem.textContent === finalItem ? "✅" : "❌"
            }`
          );

          slotElement.classList.add("shaking");
          setTimeout(() => {
            slotElement.classList.remove("shaking");
            resolve(finalItem);
          }, 500);
        }, 2500);
      }
    };

    setTimeout(() => {
      spinCycle();
    }, 50);
  });
}

// 결과 표시 함수
async function displayResults(results) {
  console.log("결과 표시:", results);

  // 결과 표시
  document.getElementById("resultSlot1").textContent = results[0];
  document.getElementById("resultSlot2").textContent = results[1];
  document.getElementById("resultSlot3").textContent = results[2];

  // 운세 생성 중 표시
  fortuneText.textContent = "🔮 AI가 운세를 분석하고 있어요...";
  resultDiv.classList.remove("hidden");

  // Gemini API로 운세 생성
  // const fortune = "dummy";
  const fortune = await generateFortune(results[0], results[1], results[2]);
  fortuneText.textContent = fortune;

  isSpinning = false;
  spinButton.disabled = false;
  spinButton.textContent = "운세 뽑기 🎲";
}

// 페이지 로드 시 슬롯 초기화
document.addEventListener("DOMContentLoaded", () => {
  initializeSlot(slots[0], categories.category1);
  initializeSlot(slots[1], categories.category2);
  initializeSlot(slots[2], categories.category3);
});

// 스핀 버튼 클릭
spinButton.addEventListener("click", async () => {
  if (isSpinning) return;

  isSpinning = true;
  spinButton.disabled = true;
  spinButton.textContent = "돌리는 중...";
  resultDiv.classList.add("hidden");

  console.log("스핀 시작!");

  // 결과 저장용 배열
  const results = [null, null, null];
  let completedCount = 0;

  // 완료 체크 함수
  const checkComplete = () => {
    completedCount++;
    console.log(`완료된 슬롯: ${completedCount}/3`);
    if (completedCount === 3) {
      console.log("모든 슬롯 완료!");
      setTimeout(() => {
        displayResults(results);
      }, 600);
    }
  };

  // 첫 번째 슬롯 (즉시 시작)
  setTimeout(async () => {
    results[0] = await animateSlot(slots[0], categories.category1);
    checkComplete();
  }, 0);

  // 두 번째 슬롯 (0.3초 후 시작)
  setTimeout(async () => {
    results[1] = await animateSlot(slots[1], categories.category2);
    checkComplete();
  }, 300);

  // 세 번째 슬롯 (0.6초 후 시작)
  setTimeout(async () => {
    results[2] = await animateSlot(slots[2], categories.category3);
    checkComplete();
  }, 600);
});

// 리셋 버튼
resetButton.addEventListener("click", () => {
  resultDiv.classList.add("hidden");

  // 슬롯 초기화
  initializeSlot(slots[0], categories.category1);
  initializeSlot(slots[1], categories.category2);
  initializeSlot(slots[2], categories.category3);
});
