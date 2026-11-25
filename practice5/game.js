/**
 * DU-FLEX 7주차 실습 5: "결재 서류 잡기" 게임 (game.js)
 * 3x3 두더지잡기 방식: 📄 서류 +10점, ☕ 커피 -5점, 30초 제한시간, localStorage 최고기록
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'doc_mole_high_score';
  const GAME_DURATION = 30; // 30초

  // 상태 변수
  let score = 0;
  let timeLeft = GAME_DURATION;
  let highScore = 0;
  let isPlaying = false;
  let gameTimer = null;
  let moleTimer = null;
  let activeHole = null;

  // 통계
  let docsCaught = 0;
  let coffeeClicked = 0;

  // DOM 요소
  const currentScoreEl = document.getElementById('currentScore');
  const timeLeftEl = document.getElementById('timeLeft');
  const highScoreEl = document.getElementById('highScore');
  const timerProgressBar = document.getElementById('timerProgressBar');
  const startBtn = document.getElementById('startBtn');
  const holes = document.querySelectorAll('.hole');
  const gridBoard = document.getElementById('gridBoard');

  // 모달 요소
  const gameOverModal = document.getElementById('gameOverModal');
  const finalScoreEl = document.getElementById('finalScore');
  const modalHighScoreEl = document.getElementById('modalHighScore');
  const newRecordNotice = document.getElementById('newRecordNotice');
  const statDocsEl = document.getElementById('statDocs');
  const statCoffeeEl = document.getElementById('statCoffee');
  const modalRestartBtn = document.getElementById('modalRestartBtn');

  // 1. 최고 기록 불러오기 (기능 ③: localStorage)
  function loadHighScore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      highScore = saved ? parseInt(saved, 10) || 0 : 0;
    } catch (e) {
      highScore = 0;
    }
    highScoreEl.textContent = `${highScore}점`;
  }

  function saveHighScore(newScore) {
    if (newScore > highScore) {
      highScore = newScore;
      try {
        localStorage.setItem(STORAGE_KEY, highScore.toString());
      } catch (e) {
        console.warn('최고 기록 저장 실패:', e);
      }
      highScoreEl.textContent = `${highScore}점`;
      return true;
    }
    return false;
  }

  // 2. 사운드 효과 (Web Audio API - 외부 파일 없이 자체 합성)
  let audioCtx = null;
  function playTone(freq, duration, type = 'sine') {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // 오디오 미지원 환경 예외 방지
    }
  }

  function playSuccessSound() {
    playTone(587.33, 0.1); // D5
    setTimeout(() => playTone(880, 0.15), 80); // A5
  }

  function playPenaltySound() {
    playTone(220, 0.25, 'sawtooth'); // A3 낮고 탁한 음
  }

  // 3. 무작위 구멍 및 아이템 생성 (기능 ① & ②)
  function randomHole(lastHole) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
      return randomHole(lastHole);
    }
    return hole;
  }

  function popMole() {
    if (!isPlaying) return;

    // 활성 구멍 선택
    const hole = randomHole(activeHole);
    activeHole = hole;
    const mole = hole.querySelector('.mole');

    // 확률 설정: 80% 서류(📄), 20% 커피(☕)
    const isCoffee = Math.random() < 0.20;
    const itemType = isCoffee ? 'coffee' : 'doc';
    const emoji = isCoffee ? '☕' : '📄';

    mole.textContent = emoji;
    hole.dataset.type = itemType;
    hole.dataset.clicked = 'false';
    hole.classList.add('up');

    // 노출 시간: 600ms ~ 1000ms 사이 랜덤
    const popDuration = Math.floor(Math.random() * 400) + 600;

    moleTimer = setTimeout(() => {
      hole.classList.remove('up');
      if (isPlaying) {
        // 다음 이모지 등장 간격 (150ms ~ 350ms)
        const nextDelay = Math.floor(Math.random() * 200) + 150;
        setTimeout(popMole, nextDelay);
      }
    }, popDuration);
  }

  // 4. 클릭 판정 (기능 ②: +10점 / -5점)
  function handleHoleClick(e) {
    if (!isPlaying) return;

    const hole = e.currentTarget;
    if (!hole.classList.contains('up') || hole.dataset.clicked === 'true') {
      return;
    }

    hole.dataset.clicked = 'true';
    const type = hole.dataset.type;

    let points = 0;
    let floatClass = '';
    let floatText = '';

    if (type === 'doc') {
      points = 10;
      score += 10;
      docsCaught += 1;
      floatClass = 'plus';
      floatText = '+10';
      playSuccessSound();
    } else if (type === 'coffee') {
      points = -5;
      score = Math.max(0, score - 5); // 0점 이하로 떨어지지 않도록 방어
      coffeeClicked += 1;
      floatClass = 'minus';
      floatText = '-5';
      playPenaltySound();
    }

    // 점수판 반영
    currentScoreEl.textContent = score;

    // 플로팅 점수 피드백 생성
    showFloatingScore(hole, floatText, floatClass);

    // 즉시 숨기기
    hole.classList.remove('up');
  }

  function showFloatingScore(targetHole, text, className) {
    const floatEl = document.createElement('div');
    floatEl.className = `float-score ${className}`;
    floatEl.textContent = text;
    targetHole.appendChild(floatEl);

    setTimeout(() => {
      if (floatEl.parentNode) {
        floatEl.parentNode.removeChild(floatEl);
      }
    }, 650);
  }

  // 5. 게임 시작 및 타이머 관리 (기능 ③: 30초 제한)
  function startGame() {
    if (isPlaying) return;

    // 초기화
    isPlaying = true;
    score = 0;
    timeLeft = GAME_DURATION;
    docsCaught = 0;
    coffeeClicked = 0;

    currentScoreEl.textContent = '0';
    timeLeftEl.textContent = `${timeLeft}초`;
    timerProgressBar.style.width = '100%';
    startBtn.disabled = true;
    gameOverModal.classList.add('hidden');
    newRecordNotice.classList.add('hidden');

    // 1초마다 타이머 갱신
    gameTimer = setInterval(() => {
      timeLeft -= 1;
      timeLeftEl.textContent = `${timeLeft}초`;
      
      const percent = (timeLeft / GAME_DURATION) * 100;
      timerProgressBar.style.width = `${percent}%`;

      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    // 첫 이모지 등장
    popMole();
  }

  // 6. 게임 종료 (기능 ③)
  function endGame() {
    isPlaying = false;
    clearInterval(gameTimer);
    clearTimeout(moleTimer);

    // 모든 구멍 내리기
    holes.forEach(h => h.classList.remove('up'));

    startBtn.disabled = false;
    timeLeftEl.textContent = '0초';
    timerProgressBar.style.width = '0%';

    // 최고 기록 갱신 여부 확인
    const isNewRecord = saveHighScore(score);

    // 모달 결과창 표시
    finalScoreEl.textContent = `${score}점`;
    modalHighScoreEl.textContent = `${highScore}점`;
    statDocsEl.textContent = docsCaught;
    statCoffeeEl.textContent = coffeeClicked;

    if (isNewRecord && score > 0) {
      newRecordNotice.classList.remove('hidden');
    } else {
      newRecordNotice.classList.add('hidden');
    }

    gameOverModal.classList.remove('hidden');
  }

  // 이벤트 리스너 등록
  holes.forEach(hole => {
    hole.addEventListener('click', handleHoleClick);
  });

  startBtn.addEventListener('click', startGame);
  modalRestartBtn.addEventListener('click', () => {
    gameOverModal.classList.add('hidden');
    startGame();
  });

  // 초기화 실행
  loadHighScore();
})();

