// Sleep cycle durations by age group (minutes per cycle)
const CYCLE_DURATIONS = { child: 60, adult: 90, senior: 80 };

// Age group labels for display
const AGE_LABELS = { child: 'Child (4–12)', adult: 'Adult (13–64)', senior: 'Senior (65+)' };

// DOM refs
let currentMode = 'bedtime'; // 'bedtime' or 'wakeup'
let selectedAge = 'adult';

const timeInput = document.getElementById('timeInput');
const timeLabel = document.getElementById('timeLabel');
const modeBedtime = document.getElementById('modeBedtime');
const modeWakeup = document.getElementById('modeWakeup');
const timeInputGroup = document.getElementById('timeInputGroup');
const latencySlider = document.getElementById('latencySlider');
const latencyDisplay = document.getElementById('latencyDisplay');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsList = document.getElementById('resultsList');
const resultExplanation = document.getElementById('resultExplanation');
const ageBtns = document.querySelectorAll('.age-btn');
const ageInfo = document.getElementById('ageInfo');

// --- Mode toggle ---
modeBedtime.addEventListener('click', () => {
  currentMode = 'bedtime';
  modeBedtime.classList.add('bg-white', 'shadow-sm', 'text-gray-900');
  modeBedtime.classList.remove('text-gray-500');
  modeWakeup.classList.remove('bg-white', 'shadow-sm', 'text-gray-900');
  modeWakeup.classList.add('text-gray-500');
  timeLabel.textContent = 'What time do you need to wake up?';
  resultsSection.classList.add('hidden');
});

modeWakeup.addEventListener('click', () => {
  currentMode = 'wakeup';
  modeWakeup.classList.add('bg-white', 'shadow-sm', 'text-gray-900');
  modeWakeup.classList.remove('text-gray-500');
  modeBedtime.classList.remove('bg-white', 'shadow-sm', 'text-gray-900');
  modeBedtime.classList.add('text-gray-500');
  timeLabel.textContent = 'What time are you going to bed?';
  resultsSection.classList.add('hidden');
});

// --- Age selection ---
ageBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    ageBtns.forEach(b => {
      b.classList.remove('border-indigo-300', 'bg-indigo-50', 'text-indigo-700', 'font-medium');
      b.classList.add('border-gray-200', 'text-gray-700');
    });
    btn.classList.add('border-indigo-300', 'bg-indigo-50', 'text-indigo-700', 'font-medium');
    btn.classList.remove('border-gray-200');
    selectedAge = btn.dataset.age;
    const info = { child: 'Children cycle faster — ~60 min per cycle.', adult: 'Adults have ~90 min sleep cycles.', senior: 'Seniors: cycles are slightly shorter (~80 min).' };
    ageInfo.textContent = info[selectedAge];
    resultsSection.classList.add('hidden');
  });
});

// --- Latency slider ---
latencySlider.addEventListener('input', () => {
  latencyDisplay.textContent = latencySlider.value === '0' ? '0 min (instant)' : `${latencySlider.value} min`;
});

// --- Calculate ---
calculateBtn.addEventListener('click', calculate);

function calculate() {
  const timeStr = timeInput.value;
  if (!timeStr) return;

  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const cycleLen = CYCLE_DURATIONS[selectedAge];
  const latency = parseInt(latencySlider.value);

  let times = [];

  if (currentMode === 'bedtime') {
    // User wants to know when to go to bed (given wake-up time)
    // Subtract latency, then subtract cycles
    const wakeMin = totalMinutes;
    // Recommend 4 to 7 cycles
    for (let cycles = 4; cycles <= 7; cycles++) {
      const bedtime = (wakeMin - latency - cycles * cycleLen + 1440) % 1440;
      const h = Math.floor(bedtime / 60);
      const m = Math.round(bedtime % 60);
      if (h >= 0 && h < 24) {
        const sleepDuration = cycles * cycleLen / 60;
        const totalInBed = (cycles * cycleLen + latency) / 60;
        times.push({ hours: h, minutes: m, cycles, sleepDuration, totalInBed });
      }
    }
    resultExplanation.textContent = `If you need to wake up at ${timeStr}, try going to bed at one of these times:`;
  } else {
    // User wants to know when to wake up (given bedtime)
    const bedMin = totalMinutes;
    for (let cycles = 4; cycles <= 7; cycles++) {
      const wakeMin = (bedMin + latency + cycles * cycleLen) % 1440;
      const h = Math.floor(wakeMin / 60);
      const m = Math.round(wakeMin % 60);
      if (h >= 0 && h < 24) {
        const sleepDuration = cycles * cycleLen / 60;
        const totalInBed = (cycles * cycleLen + latency) / 60;
        times.push({ hours: h, minutes: m, cycles, sleepDuration, totalInBed });
      }
    }
    resultExplanation.textContent = `If you go to bed at ${timeStr}, try setting your alarm for one of these times:`;
  }

  // Sort by cycle count (ascending)
  times.sort((a, b) => a.cycles - b.cycles);

  renderResults(times, cycleLen);
}

function renderResults(times, cycleLen) {
  resultsList.innerHTML = '';

  times.forEach((t, i) => {
    const h = t.hours % 12 || 12;
    const ampm = t.hours < 12 || t.hours === 24 ? 'AM' : 'PM';
    const minStr = t.minutes.toString().padStart(2, '0');
    const timeLabel = currentMode === 'bedtime' ? 'Bedtime' : 'Wake up';
    const icon = currentMode === 'bedtime' ? '🌙' : '☀️';

    const card = document.createElement('div');
    card.className = 'result-card flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3';

    // Highlight the middle option (5-6 cycles = ideal)
    if (t.cycles === 5 || t.cycles === 6) {
      card.classList.add('ring-2', 'ring-indigo-200', 'bg-indigo-50/50');
    }

    card.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-lg">${icon}</span>
        <div>
          <div class="font-semibold text-gray-900">${h}:${minStr} ${ampm}</div>
          <div class="text-xs text-gray-400">${t.cycles} cycles · ${t.sleepDuration.toFixed(1)} hrs sleep · ${t.totalInBed.toFixed(1)} hrs in bed</div>
        </div>
      </div>
      <div class="text-xs ${t.cycles === 5 || t.cycles === 6 ? 'text-indigo-600 font-medium' : 'text-gray-400'}">${t.cycles === 5 || t.cycles === 6 ? 'Recommended' : ''}</div>
    `;

    resultsList.appendChild(card);
  });

  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initial calculation on page load
window.addEventListener('load', calculate);
