// 统一睡眠报告 — 从 localStorage 读取三个工具的数据并可视化
const reportSections = [
  {
    title: 'Your Sleep Report',
    desc: 'A combined view of your sleep data across all SlumberCheck tools.'
  }
];

// Get data from localStorage
function loadData() {
  return {
    calculator: JSON.parse(localStorage.getItem('slumber_calculator') || 'null'),
    assessment: JSON.parse(localStorage.getItem('slumber_assessment') || 'null'),
    environment: JSON.parse(localStorage.getItem('slumber_environment') || 'null')
  };
}

const data = loadData();
const hasAny = data.calculator || data.assessment || data.environment;

// Summary stats
const summaryEl = document.getElementById('summaryCards');

function renderSummary() {
  if (!data.assessment) {
    summaryEl.innerHTML = `<div class="text-center py-12 text-gray-400">
      <p class="text-lg mb-2">No sleep data yet</p>
      <p class="text-sm">Use the tools above to generate your sleep report.</p>
    </div>`;
    return;
  }

  let cards = '';

  // Calculator card
  if (data.calculator) {
    const c = data.calculator;
    cards += `
      <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div class="text-xs text-gray-400 mb-1">Sleep Cycle</div>
        <div class="text-lg font-bold text-indigo-600">${c.cycles || '—'} cycles</div>
        <div class="text-xs text-gray-500">${c.sleepDuration?.toFixed(1) || '?'} hrs sleep · ${c.mode === 'bedtime' ? 'Bedtime calc' : 'Wake-up calc'}</div>
      </div>`;
  }

  // Assessment card
  if (data.assessment) {
    const a = data.assessment;
    const label = a.score >= 16 ? 'Excellent' : a.score >= 11 ? 'Good' : a.score >= 6 ? 'Fair' : 'Poor';
    const color = a.score >= 16 ? 'text-emerald-600' : a.score >= 11 ? 'text-blue-600' : a.score >= 6 ? 'text-amber-600' : 'text-red-600';
    cards += `
      <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div class="text-xs text-gray-400 mb-1">Sleep Quality</div>
        <div class="text-lg font-bold ${color}">${a.score}/20</div>
        <div class="text-xs text-gray-500">${label}</div>
      </div>`;
  }

  // Environment card
  if (data.environment) {
    const e = data.environment;
    cards += `
      <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div class="text-xs text-gray-400 mb-1">Environment</div>
        <div class="text-lg font-bold text-green-600">${e.passed}/${e.total}</div>
        <div class="text-xs text-gray-500">factors optimized</div>
      </div>`;
  }

  summaryEl.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-3 gap-3">${cards}</div>`;
}

// Assessment breakdown chart
function renderAssessmentChart() {
  const canvas = document.getElementById('assessmentChartCanvas');
  const wrapper = document.getElementById('assessmentChartWrapper');
  if (!data.assessment) { wrapper.classList.add('hidden'); return; }
  wrapper.classList.remove('hidden');

  const a = data.assessment;
  const maxScore = 24;
  const raw = Math.round((a.score / 20) * maxScore);
  const remaining = maxScore - raw;

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Your Score', 'Room for Improvement'],
      datasets: [{
        data: [raw, remaining],
        backgroundColor: ['#4f46e5', '#e5e7eb'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      cutout: '72%',
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Environment radar chart
function renderEnvironmentChart() {
  const canvas = document.getElementById('envChartCanvas');
  const wrapper = document.getElementById('envChartWrapper');
  if (!data.environment) { wrapper.classList.add('hidden'); return; }
  wrapper.classList.remove('hidden');

  const e = data.environment;
  const factorNames = ['Temperature', 'Noise', 'Light', 'Mattress', 'Pillow', 'Air Quality'];
  const factorScores = e.factors || [0, 0, 0, 0, 0, 0];

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: factorNames,
      datasets: [{
        label: 'Pass (1) / Fail (0)',
        data: factorScores,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderColor: '#4f46e5',
        pointBackgroundColor: '#4f46e5',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0,
          max: 1,
          ticks: { stepSize: 1, display: false },
          grid: { color: '#e5e7eb' },
          angleLines: { color: '#e5e7eb' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Tool CTA links
function renderCtas() {
  const el = document.getElementById('ctaLinks');
  el.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <a href="calculator.html" class="block bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all text-center">
        <div class="text-2xl mb-1">⏰</div>
        <div class="text-sm font-medium text-gray-900">Sleep Cycle Calculator</div>
        <div class="text-xs text-gray-400">Optimize your bedtime</div>
      </a>
      <a href="assessment.html" class="block bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all text-center">
        <div class="text-2xl mb-1">📋</div>
        <div class="text-sm font-medium text-gray-900">Sleep Quality Assessment</div>
        <div class="text-xs text-gray-400">Score your sleep health</div>
      </a>
      <a href="environment.html" class="block bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all text-center">
        <div class="text-2xl mb-1">🏠</div>
        <div class="text-sm font-medium text-gray-900">Environment Checker</div>
        <div class="text-xs text-gray-400">Audit your bedroom</div>
      </a>
    </div>`;
}

// Init
renderSummary();
renderAssessmentChart();
renderEnvironmentChart();
renderCtas();
