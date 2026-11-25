/**
 * DU-FLEX 7주차 실습 2: 점심 메뉴 룰렛 (app.js)
 * 순수 자바스크립트(Vanilla JS)로 구현한 캔버스 룰렛 및 로컬스토리지 연동
 * DU-FLEX 7주차 실습 7: 점심 메뉴 룰렛 크롬 확장 프로그램 (app.js)
 * chrome.storage.local 비동기 저장소 지원 (일반 브라우저/HTML 단독 실행 시 localStorage 자동 폴백)
 */

(function () {
  'use strict';

  // 로컬스토리지 키
  const STORAGE_KEY = 'lunch_roulette_menus';
  // 저장소 키
  const STORAGE_KEY = 'lunch_roulette_ext_menus';

  // 기본 프리셋 메뉴 목록
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
  let currentRotation = 0; // 라디안 각도
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

  // 1. 초기화: localStorage에서 메뉴 불러오기
  function loadMenus() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          menus = parsed;
          return;
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
            } catch (e) {
              console.warn('localStorage 접근 실패, 기본값 사용:', e);
              menus = [...DEFAULT_MENUS];
              saveMenus();
              if (callback) callback();
            }
            menus = [...DEFAULT_MENUS];
            saveMenus();
          }

          // 2. localStorage에 메뉴 저장
          function saveMenus() {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
            } catch (e) {
              console.error('localStorage 저장 오류:', e);
              if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.set({ [STORAGE_KEY]: menus }, () => { });
              } else {
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
                } catch (e) {
                  console.error('localStorage 저장 실패:', e);
                }
              }
            }

            // 3. 메뉴 목록 UI 렌더링
            // 2. 메뉴 목록 UI 렌더링
            function renderMenuList() {
              menuList.innerHTML = '';
              menuCountBadge.textContent = `${menus.length}개`;

              if (menus.length === 0) {
                const emptyLi = document.createElement('li');
                emptyLi.className = 'empty-state';
                emptyLi.textContent = '등록된 메뉴가 없습니다. 메뉴를 추가해 주세요!';
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

            // HTML 이스케이프 헬퍼
            function escapeHtml(text) {
              const div = document.createElement('div');
              div.textContent = text;
              return div.innerHTML;
            }

            // 4. 캔버스 룰렛 그리기
            // 3. 캔버스 룰렛 렌더링
            function drawWheel(rotation = 0) {
              const width = canvas.width;
              const height = canvas.height;
              const centerX = width / 2;
              const centerY = height / 2;
              const radius = width / 2 - 12;
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

                // 슬라이스 채우기
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, radius, startAngle, endAngle);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();

                // 슬라이스 테두리
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // 텍스트 그리기
                ctx.save();
                const midAngle = startAngle + sliceAngle / 2;
                ctx.rotate(midAngle);
                ctx.textAlign = 'right';
                ctx.fillStyle = '#1e293b';
                ctx.font = 'bold 15px sans-serif';
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.shadowBlur = 4;
                ctx.font = 'bold 13px sans-serif';

                // 글자가 너무 길면 잘라서 표시
                const displayLabel = item.length > 8 ? item.slice(0, 7) + '…' : item;
                ctx.fillText(displayLabel, radius - 24, 6);
                const displayLabel = item.length > 7 ? item.slice(0, 6) + '…' : item;
                ctx.fillText(displayLabel, radius - 18, 5);
                ctx.restore();
              });

              // 중앙 원형 캡(허브)
              // 중앙 허브
              ctx.beginPath();
              ctx.arc(0, 0, 36, 0, 2 * Math.PI);
              ctx.arc(0, 0, 28, 0, 2 * Math.PI);
              ctx.fillStyle = '#ffffff';
              ctx.fill();
              ctx.lineWidth = 4;
              ctx.lineWidth = 3;
              ctx.strokeStyle = '#f97316';
              ctx.stroke();

              ctx.fillStyle = '#f97316';
              ctx.font = 'bold 18px sans-serif';
              ctx.font = 'bold 15px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('GO', 0, 0);

              ctx.restore();
            }

            // 빈 룰렛 상태 그리기
            function drawEmptyWheel() {
              const width = canvas.width;
              const height = canvas.height;
              const centerX = width / 2;
              const centerY = height / 2;
              const radius = width / 2 - 12;
              const radius = width / 2 - 10;

              ctx.clearRect(0, 0, width, height);

              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
              ctx.fillStyle = '#e2e8f0';
              ctx.fill();
              ctx.strokeStyle = '#cbd5e1';
              ctx.lineWidth = 4;
              ctx.lineWidth = 3;
              ctx.stroke();

              ctx.fillStyle = '#64748b';
              ctx.font = '16px sans-serif';
              ctx.font = '14px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('메뉴를 추가해 주세요', centerX, centerY);
              ctx.fillText('메뉴 없음', centerX, centerY);
            }

            // 5. 메뉴 추가 기능 (기능 ①)
            // 4. 메뉴 추가 & 삭제
            function handleAddMenu(e) {
              if (e) e.preventDefault();
              const val = menuInput.value.trim();
              if (!val) {
                alert('추가할 메뉴명을 입력해 주세요!');
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

            // 6. 메뉴 삭제 기능 (기능 ①)
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

            // 7. 룰렛 돌리기 기능: 2초간 회전 후 하나 선택 (기능 ②)
            // 5. 룰렛 돌리기 (2초 회전)
            function spinRoulette() {
              if (isSpinning || menus.length === 0) return;

              isSpinning = true;
              spinBtn.disabled = true;
              resultCard.classList.add('hidden');

              const totalDuration = 2000; // 정확히 2초 (2000ms)
              const totalDuration = 2000; // 2초
              const startTime = performance.now();

              // 무작위 당첨 인덱스 선정
              const winningIndex = Math.floor(Math.random() * menus.length);
              const sliceAngle = (2 * Math.PI) / menus.length;

              // 포인터 위치: 캔버스 상단 (270도 = 1.5 * Math.PI 또는 -0.5 * Math.PI)
              // 회전 후 winningIndex 슬라이스의 중앙이 상단 포인터에 닿도록 목표 각도 계산
              const pointerAngle = 1.5 * Math.PI;
              const sliceCenterAngle = winningIndex * sliceAngle + sliceAngle / 2;

              // 최소 5~8바퀴 추가 회전으로 극적인 회전감 연출
              const extraFullRotations = 6 * (2 * Math.PI);
              const startRotation = currentRotation % (2 * Math.PI);

              // 목표 최종 회전 각도
              const targetFinalAngle = pointerAngle - sliceCenterAngle;
              // 이전 각도에서 목표 각도까지 정규화된 델타 계산
              let delta = (targetFinalAngle - startRotation) % (2 * Math.PI);
              if (delta < 0) delta += 2 * Math.PI;

              const totalDelta = extraFullRotations + delta;
              const targetRotation = currentRotation + totalDelta;

              function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / totalDuration, 1);

                // 감속 커브 (Cubic Ease-Out): 1 - (1 - t)^3
                // Cubic Ease-Out 감속 곡선
                const easeOut = 1 - Math.pow(1 - progress, 3);
                currentRotation = startRotation + totalDelta * easeOut;

                drawWheel(currentRotation);

                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  // 정확히 2초 종료
                  currentRotation = targetRotation;
                  drawWheel(currentRotation);
                  isSpinning = false;
                  spinBtn.disabled = false;

                  // 결과 표시 (기능 ②)
                  showResult(menus[winningIndex]);
                  resultText.textContent = menus[winningIndex];
                  resultCard.classList.remove('hidden');
                }
              }

              requestAnimationFrame(animate);
            }

            // 당첨 결과 표시
            function showResult(item) {
              resultText.textContent = item;
              resultCard.classList.remove('hidden');
            }

            // 8. 기본 메뉴 복원 및 전체 삭제
            function resetPreset() {
              if (confirm('기본 추천 메뉴 목록으로 복원하시겠습니까?')) {
                if (confirm('기본 인기 점심 6종 메뉴로 복원하시겠습니까?')) {
                  menus = [...DEFAULT_MENUS];
                  saveMenus();
                  renderMenuList();
                  resultCard.classList.add('hidden');
                }
              }

              function clearAll() {
                if (confirm('모든 메뉴를 목록에서 삭제하시겠습니까?')) {
                  if (confirm('모든 메뉴를 삭제하시겠습니까?')) {
                    menus = [];
                    saveMenus();
                    renderMenuList();
                    resultCard.classList.add('hidden');
                  }
                }

                // 이벤트 바인딩
                // 이벤트 등록
                addMenuForm.addEventListener('submit', handleAddMenu);
                menuList.addEventListener('click', handleDeleteMenu);
                spinBtn.addEventListener('click', spinRoulette);
                resetPresetBtn.addEventListener('click', resetPreset);
                clearAllBtn.addEventListener('click', clearAll);

                // 실행
                loadMenus();
                renderMenuList();
                loadMenus(() => {
                  renderMenuList();
                });
              }) ();

