/**
 * DU-FLEX 7주차 실습 6: "집중 응원 배지" 크롬 확장 프로그램 (popup.js)
 * 25분 집중 타이머, 10개 응원 문구 랜덤 표시, 오늘 완료 횟수 저장 (chrome.storage.local)
 */

(function () {
  'use strict';

  const DEFAULT_SECONDS = 25 * 60; // 25분 (1500초)
  let totalSeconds = DEFAULT_SECONDS;
  let timerInterval = null;
  let isRunning = false;

  // 오늘의 응원 문구 10개 (기능 ②)
  const CHEER_QUOTES = [
    {
      kr: "작은 한 걸음이 모여 위대한 결과를 만듭니다.",
      zh: "不积跬步，无以至千里。每一步都算数。"
    },
    {
      kr: "지금 흘린 땀방울은 내일의 가장 큰 자산이 됩니다.",
      zh: "今天付出的每一滴汗水，都将成为明天的宝贵财富。"
    },
    {
      kr: "집중하는 당신의 모습이 세상에서 가장 빛납니다!",
      zh: "全身心专注的你，正散发着最动人的光芒！"
    },
    {
      kr: "완벽함보다 꾸준한 지속이 훨씬 더 중요합니다.",
      zh: "持之以恒的坚持，远胜于偶尔盲目的完美。"
    },
    {
      kr: "단 25분의 몰입이 오늘 하루의 성패를 가릅니다.",
      zh: "只需25分钟的高效沉浸，就能点亮充实的一整天。"
    },
    {
      kr: "천천히 가도 괜찮습니다. 멈추지만 마세요.",
      zh: "不怕走得慢，只要步履不停，终将抵达彼岸。"
    },
    {
      kr: "마음이 흐트러질 땐 심호흡을 크게 한 번 해보세요.",
      zh: "心绪杂乱时，不妨深深地做一次深呼吸重新开始。"
    },
    {
      kr: "오늘의 노력이 내일의 나를 활짝 웃게 할 거예요.",
      zh: "今日所做的点滴努力，必将让明天的自己欣慰微笑。"
    },
    {
      kr: "한 번에 하나씩, 차분하게 완성해 나가요.",
      zh: "一次专注于一件事，从容不迫地逐步完成它。"
    },
    {
      kr: "포기하지 않는 당신을 늘 온 마음으로 응원합니다!",
      zh: "由衷为你加油喝彩，无论何时都不要轻言放弃！"
    }
  ];

  // DOM 요소
  const timerDisplay = document.getElementById('timerDisplay');
  const startPauseBtn = document.getElementById('startPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const quoteText = document.getElementById('quoteText');
  const quoteZh = document.getElementById('quoteZh');
  const refreshQuoteBtn = document.getElementById('refreshQuoteBtn');
  const focusCountEl = document.getElementById('focusCount');

  // 날짜 기반 키 (오늘 날짜)
  function getTodayKey() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `focus_count_${y}-${m}-${d}`;
  }

  // 1. 저장소 추상화 (chrome.storage.local 우선, 일반 브라우저 미리보기 시 localStorage 폴백)
  function getTodayFocusCount(callback) {
    const key = getTodayKey();
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([key], (result) => {
        callback(result[key] || 0);
      });
    } else {
      const val = parseInt(localStorage.getItem(key), 10) || 0;
      callback(val);
    }
  }

  function incrementTodayFocusCount() {
    const key = getTodayKey();
    getTodayFocusCount((current) => {
      const updated = current + 1;
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [key]: updated }, () => {
          focusCountEl.textContent = updated;
        });
      } else {
        localStorage.setItem(key, updated.toString());
        focusCountEl.textContent = updated;
      }
    });
  }

  // 2. 오늘의 응원 문구 무작위 표시 (기능 ②)
  function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * CHEER_QUOTES.length);
    const quote = CHEER_QUOTES[randomIndex];
    quoteText.textContent = `"${quote.kr}"`;
    quoteZh.textContent = quote.zh;
  }

  // 3. 타이머 포맷 및 UI 갱신 (기능 ①)
  function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startPauseBtn.textContent = '일시 정지 · 暂停';
    startPauseBtn.className = 'btn btn-pause';

    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds -= 1;
        updateTimerDisplay();
      } else {
        // 25분 완료!
        clearInterval(timerInterval);
        isRunning = false;
        startPauseBtn.textContent = '시작 · 开始';
        startPauseBtn.className = 'btn btn-start';
        totalSeconds = DEFAULT_SECONDS;
        updateTimerDisplay();

        // 기능 ③: 오늘 완료한 집중 횟수 증가
        incrementTodayFocusCount();
        alert('🎉 축하합니다! 25분 집중 세션을 훌륭하게 완수하셨습니다!\n오늘의 집중 배지가 1회 추가되었습니다.');
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timerInterval);
    isRunning = false;
    startPauseBtn.textContent = '이어 하기 · 继续';
    startPauseBtn.className = 'btn btn-start';
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    totalSeconds = DEFAULT_SECONDS;
    updateTimerDisplay();
    startPauseBtn.textContent = '시작 · 开始';
    startPauseBtn.className = 'btn btn-start';
  }

  // 이벤트 리스너 바인딩
  startPauseBtn.addEventListener('click', () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  resetBtn.addEventListener('click', resetTimer);
  refreshQuoteBtn.addEventListener('click', displayRandomQuote);

  // 초기화 실행
  displayRandomQuote();
  updateTimerDisplay();
  getTodayFocusCount((count) => {
    focusCountEl.textContent = count;
  });
})();

