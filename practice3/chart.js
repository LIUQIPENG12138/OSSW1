/**
 * DU-FLEX 7주차 실습 3: 카페매출 대시보드 (chart.js)
 * Chart.js 라이브러리를 활용한 꺾은선 차트, 막대 차트 및 요일별 테이블 렌더링
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. KPI 카드 업데이트
  const totalRevenue = TOTAL_STATS.totalRevenue;
  const totalVolume = TOTAL_STATS.totalVolume;
  const avgDailyRevenue = Math.round(totalRevenue / DAILY_SALES_DATA.length);

  document.getElementById('kpiTotalRevenue').textContent = `${totalRevenue.toLocaleString()}원`;
  document.getElementById('kpiTotalVolume').textContent = `${totalVolume.toLocaleString()}잔`;
  document.getElementById('kpiAvgDailyRevenue').textContent = `${avgDailyRevenue.toLocaleString()}원`;

  // 최고 매출 요일 찾기
  let topWeekday = WEEKDAY_SUMMARY[0];
  WEEKDAY_SUMMARY.forEach(w => {
    if (w.avg_revenue > topWeekday.avg_revenue) topWeekday = w;
  });
  document.getElementById('kpiTopWeekday').textContent = `${topWeekday.weekday_kr}요일 (${topWeekday.avg_revenue.toLocaleString()}원)`;

  // 2. 기능 ①: 일별 매출 꺾은선 차트 (Line Chart)
  const lineCtx = document.getElementById('dailyRevenueChart').getContext('2d');
  const lineLabels = DAILY_SALES_DATA.map(d => `${d.day}일(${d.weekday_kr})`);
  const lineData = DAILY_SALES_DATA.map(d => d.day_revenue);

  new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: lineLabels,
      datasets: [{
        label: '일별 매출액 (원 / KRW)',
        data: lineData,
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.12)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        pointBackgroundColor: '#0284c7',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { weight: '600' } }
        },
        tooltip: {
          callbacks: {
            label: context => `매출: ${context.parsed.y.toLocaleString()}원`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: value => `${(value / 10000).toLocaleString()}만원`
          },
          grid: { color: '#f1f5f9' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  // 3. 기능 ②: 메뉴별 판매량 막대 차트 (Bar Chart)
  const barCtx = document.getElementById('menuVolumeChart').getContext('2d');
  const barLabels = CAFE_MENUS.map(m => m.name);
  const barData = CAFE_MENUS.map(m => TOTAL_STATS.menuTotals[m.id].volume);
  const barColors = CAFE_MENUS.map(m => m.color);

  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: barLabels,
      datasets: [{
        label: '총 판매량 (잔/개)',
        data: barData,
        backgroundColor: barColors,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => `판매량: ${context.parsed.y.toLocaleString()}잔`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => `${value.toLocaleString()}잔`
          },
          grid: { color: '#f1f5f9' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  // 4. 기능 ③: 요일별 평균 매출 표 (Table)
  const tbody = document.getElementById('weekdayTableBody');
  tbody.innerHTML = '';

  WEEKDAY_SUMMARY.forEach(row => {
    const isWeekend = (row.weekday_idx === 5 || row.weekday_idx === 6);
    const tr = document.createElement('tr');
    if (isWeekend) tr.className = 'weekend-row';

    const sharePercent = ((row.total_revenue / totalRevenue) * 100).toFixed(1);

    tr.innerHTML = `
      <td><strong>${row.weekday_kr}요일</strong> (${row.weekday_zh})</td>
      <td>
        <span class="pill ${isWeekend ? 'pill-weekend' : 'pill-weekday'}">
          ${isWeekend ? '주말 (周末)' : '평일 (工作日)'}
        </span>
      </td>
      <td class="text-right">${row.count}일</td>
      <td class="text-right">${row.total_revenue.toLocaleString()}원</td>
      <td class="text-right"><strong>${row.avg_revenue.toLocaleString()}원</strong></td>
      <td class="text-right">${sharePercent}%</td>
    `;
    tbody.appendChild(tr);
  });
});

