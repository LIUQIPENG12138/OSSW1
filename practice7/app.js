/**
 * DU-FLEX 7주차 실습 7: 점심 메뉴 룰렛 크롬 확장 프로그램 (app.js)
 * chrome.storage.local 비동기 저장소 지원 (일반 브라우저/HTML 단독 실행 시 localStorage 자동 폴백)
 */

(function () {
  'use strict';

  // 저장소 키
  const STORAGE_KEY = 'lunch_roulette_ext_menus';

  // 한·중 인기 점심 6종 프리셋 (사용자 선택 옵션 3)
  const DEFAULT_MENUS = [
    '김치찌개 🍲',
    '비빔밥 🥗',
    '돈까스 🍛',
    '마라탕 🥘',
    '제육볶음 🥩',
    '초밥 🍣'
  ];

  // 슬라이스 색상 팔레트
  const PALETTE = [
    '#f87171', '#fb923c', '#fbbf24', '#a3e635',
    '#34d399', '#22d3ee', '#818cf8', '#e879f9'
  ];

  // 상태 관리
  let menus = [];
  let currentRotation = 0;
  let isSpinning = false;

  // DOM 요소
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const spinBtn = document.getElementById('spinBtn');
  const addMenuForm = document.getElementById('addMenuForm');
  const menuInput = document.getElementById('menuInput');
  const menuList = document.getElementById('menuList');
  const menuCountBadge = document.getElementById('menuCountBadge');
  const resultCard = document.getElementById('resultCard');
  const resultText = document.getElementById('resultText');
  const resetPresetBtn = document.getElementById('resetPresetBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');

  // 1. 저장소 추상화 (chrome.storage.local 우선, localStorage 폴백)
  function loadMenus(callback) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([STORAGE_KEY], (res) => {
        const saved = res[STORAGE_KEY];
        if (Array.isArray(saved) && saved.length > 0) {
          menus = saved;
        } else {
          menus = [...DEFAULT_MENUS];
          saveMenus();
        }
        if (callback) callback();
      });
    } else {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            menus = parsed;
            if (callback) callback();
            return;
          }
        }
      } catch (e) {
        console.warn('저장소 접근 오류:', e);
      }
      menus = [...DEFAULT_MENUS];
      saveMenus();
      if (callback) callback();
    }
  }

  function saveMenus() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ [STORAGE_KEY]: menus }, () => {});
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
      } catch (e) {
        console.error('localStorage 저장 실패:', e);
      }
    }
  }

  // 2. 메뉴 목록 UI 렌더링
  function renderMenuList() {
    menuList.innerHTML = '';
    menuCountBadge.textContent = `${menus.length}개`;

    if (menus.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'empty-state';
      emptyLi.textContent = '메뉴를 추가해 주세요!';
      menuList.appendChild(emptyLi);
      spinBtn.disabled = true;
      drawEmptyWheel();
      return;
    }

    spinBtn.disabled = isSpinning;

    menus.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'menu-item';

      const color = PALETTE[index % PALETTE.length];

      li.innerHTML = `
        <span class="menu-name">
          <span class="menu-dot" style="background-color: ${color}"></span>
          ${escapeHtml(item)}
        </span>
        <button type="button" class="delete-btn" data-index="${index}" title="삭제">✕</button>
      `;
      menuList.appendChild(li);
    });

    drawWheel(currentRotation);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 3. 캔버스 룰렛 렌더링
  function drawWheel(rotation = 0) {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 10;

    ctx.clearRect(0, 0, width, height);

    if (menus.length === 0) {
      drawEmptyWheel();
      return;
    }

    const sliceAngle = (2 * Math.PI) / menus.length;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    menus.forEach((item, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const color = PALETTE[i % PALETTE.length];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.save();
      const midAngle = startAngle + sliceAngle / 2;
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 13px sans-serif';

      const displayLabel = item.length > 7 ? item.slice(0, 6) + '…' : item;
      ctx.fillText(displayLabel, radius - 18, 5);
      ctx.restore();
    });

    // 중앙 허브
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f97316';
    ctx.stroke();

    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GO', 0, 0);

    ctx.restore();
  }

  function drawEmptyWheel() {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 10;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('메뉴 없음', centerX, centerY);
  }

  // 4. 메뉴 추가 & 삭제
  function handleAddMenu(e) {
    if (e) e.preventDefault();
    const val = menuInput.value.trim();
    if (!val) {
      alert('메뉴명을 입력해 주세요!');
      menuInput.focus();
      return;
    }
    if (menus.includes(val)) {
      alert('이미 등록된 메뉴입니다!');
      menuInput.focus();
      return;
    }

    menus.push(val);
    saveMenus();
    renderMenuList();
    menuInput.value = '';
    menuInput.focus();
  }

  function handleDeleteMenu(e) {
    const target = e.target.closest('.delete-btn');
    if (!target) return;
    const idx = parseInt(target.getAttribute('data-index'), 10);
    if (!isNaN(idx) && idx >= 0 && idx < menus.length) {
      menus.splice(idx, 1);
      saveMenus();
      renderMenuList();
    }
  }

  // 5. 룰렛 돌리기 (2초 회전)
  function spinRoulette() {
    if (isSpinning || menus.length === 0) return;

    isSpinning = true;
    spinBtn.disabled = true;
    resultCard.classList.add('hidden');

    const totalDuration = 2000; // 2초
    const startTime = performance.now();

    const winningIndex = Math.floor(Math.random() * menus.length);
    const sliceAngle = (2 * Math.PI) / menus.length;
    const pointerAngle = 1.5 * Math.PI;
    const sliceCenterAngle = winningIndex * sliceAngle + sliceAngle / 2;

    const extraFullRotations = 6 * (2 * Math.PI);
    const startRotation = currentRotation % (2 * Math.PI);

    const targetFinalAngle = pointerAngle - sliceCenterAngle;
    let delta = (targetFinalAngle - startRotation) % (2 * Math.PI);
    if (delta < 0) delta += 2 * Math.PI;

    const totalDelta = extraFullRotations + delta;
    const targetRotation = currentRotation + totalDelta;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Cubic Ease-Out 감속 곡선
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentRotation = startRotation + totalDelta * easeOut;

      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        currentRotation = targetRotation;
        drawWheel(currentRotation);
        isSpinning = false;
        spinBtn.disabled = false;

        resultText.textContent = menus[winningIndex];
        resultCard.classList.remove('hidden');
      }
    }

    requestAnimationFrame(animate);
  }

  function resetPreset() {
    if (confirm('기본 인기 점심 6종 메뉴로 복원하시겠습니까?')) {
      menus = [...DEFAULT_MENUS];
      saveMenus();
      renderMenuList();
      resultCard.classList.add('hidden');
    }
  }

  function clearAll() {
    if (confirm('모든 메뉴를 삭제하시겠습니까?')) {
      menus = [];
      saveMenus();
      renderMenuList();
      resultCard.classList.add('hidden');
    }
  }

  // 이벤트 등록
  addMenuForm.addEventListener('submit', handleAddMenu);
  menuList.addEventListener('click', handleDeleteMenu);
  spinBtn.addEventListener('click', spinRoulette);
  resetPresetBtn.addEventListener('click', resetPreset);
  clearAllBtn.addEventListener('click', clearAll);

  // 실행
  loadMenus(() => {
    renderMenuList();
  });
})();
