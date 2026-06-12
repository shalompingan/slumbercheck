// Sleep Quality Assessment — 8 questions based on simplified PSQI
const questions = [
  {
    id: 'q1',
    text: 'In the past month, how long does it typically take you to fall asleep at night?',
    options: [
      { label: '≤ 15 minutes', value: 3 },
      { label: '16–30 minutes', value: 2 },
      { label: '31–60 minutes', value: 1 },
      { label: '> 60 minutes', value: 0 }
    ]
  },
  {
    id: 'q2',
    text: 'How many hours of actual sleep do you get per night?',
    options: [
      { label: '≥ 7 hours', value: 3 },
      { label: '6–7 hours', value: 2 },
      { label: '5–6 hours', value: 1 },
      { label: '< 5 hours', value: 0 }
    ]
  },
  {
    id: 'q3',
    text: 'How often do you wake up in the middle of the night?',
    options: [
      { label: 'Rarely or never', value: 3 },
      { label: 'Once or twice a week', value: 2 },
      { label: '3–5 times a week', value: 1 },
      { label: 'Every night or almost every night', value: 0 }
    ]
  },
  {
    id: 'q4',
    text: 'How often do you feel tired during the day due to poor sleep?',
    options: [
      { label: 'Rarely or never', value: 3 },
      { label: 'Sometimes (1–2 days/week)', value: 2 },
      { label: 'Often (3–4 days/week)', value: 1 },
      { label: 'Almost every day', value: 0 }
    ]
  },
  {
    id: 'q5',
    text: 'How often do you use sleep medication (prescribed or over-the-counter)?',
    options: [
      { label: 'Not in the past month', value: 3 },
      { label: 'Less than once a week', value: 2 },
      { label: '1–2 times a week', value: 1 },
      { label: '3+ times a week', value: 0 }
    ]
  },
  {
    id: 'q6',
    text: 'How satisfied are you with your current sleep quality?',
    options: [
      { label: 'Very satisfied', value: 3 },
      { label: 'Fairly satisfied', value: 2 },
      { label: 'Fairly dissatisfied', value: 1 },
      { label: 'Very dissatisfied', value: 0 }
    ]
  },
  {
    id: 'q7',
    text: 'How often do you have trouble staying asleep due to noise, light, or temperature?',
    options: [
      { label: 'Rarely or never', value: 3 },
      { label: 'Once or twice a week', value: 2 },
      { label: '3–5 times a week', value: 1 },
      { label: 'Every night', value: 0 }
    ]
  },
  {
    id: 'q8',
    text: 'How often do you wake up feeling rested and refreshed?',
    options: [
      { label: 'Almost every morning', value: 3 },
      { label: 'Most mornings (3+ times/week)', value: 2 },
      { label: 'Some mornings (1–2 times/week)', value: 1 },
      { label: 'Rarely or never', value: 0 }
    ]
  }
];

const recommendations = {
  excellent: {
    label: 'Excellent Sleep Quality',
    color: 'emerald',
    desc: 'Your sleep habits are working well for you. Keep up your routine and maintain a consistent sleep schedule.',
    tips: [
      'Maintain your consistent bedtime and wake-up schedule — even on weekends.',
      'Keep your bedroom optimized for sleep (cool, dark, quiet).',
      'Consider upgrading to a high-quality mattress if yours is over 7 years old.'
    ]
  },
  good: {
    label: 'Good Sleep Quality',
    color: 'blue',
    desc: 'You\'re doing fairly well, but there\'s room for improvement. Small changes can make a big difference.',
    tips: [
      'Try to keep a consistent sleep schedule, even on weekends.',
      'Avoid screens 30–60 minutes before bed (blue light suppresses melatonin).',
      'Check if your mattress and pillow are still supporting you properly — they wear out after 7–8 years.',
      'Consider a white noise machine if environmental noise disrupts your sleep.'
    ]
  },
  fair: {
    label: 'Fair Sleep Quality',
    color: 'amber',
    desc: 'Your sleep could be better. Addressing your sleep environment and evening habits can help significantly.',
    tips: [
      'Create a wind-down routine: read, stretch, or meditate 30 min before bed.',
      'Reduce caffeine after 2 PM and limit alcohol before bed (it fragments sleep).',
      'Evaluate your bedroom: temperature (65–68°F ideal), light levels, and noise.',
      'Your mattress and pillow may need upgrading — they should be replaced every 7–8 years.',
      'Try blackout curtains if outside light enters your bedroom at night.'
    ]
  },
  poor: {
    label: 'Poor Sleep Quality',
    color: 'red',
    desc: 'Your sleep quality needs attention. Poor sleep affects your health, mood, and daily performance.',
    tips: [
      'Establish a consistent sleep schedule: same bedtime and wake time every day.',
      'Create an optimal sleep environment: cool room (65–68°F), complete darkness, quiet.',
      'Avoid screens, heavy meals, caffeine, and alcohol within 2 hours of bedtime.',
      'Consider upgrading your mattress — a quality mattress can dramatically improve sleep.',
      'A weighted blanket may help if you have trouble falling or staying asleep.',
      'If problems persist, consider consulting a sleep specialist.'
    ]
  }
};

let currentQuestion = 0;
let answers = [];
let answeredCount = 0;

const container = document.getElementById('questionsContainer');
const progressBar = document.getElementById('progressBar');
const qNum = document.getElementById('qNum');
const quizDone = document.getElementById('quizDone');
const resultsSection = document.getElementById('resultsSection');
const scoreValue = document.getElementById('scoreValue');
const scoreLabel = document.getElementById('scoreLabel');
const scoreBar = document.getElementById('scoreBar');
const scoreInterpretation = document.getElementById('scoreInterpretation');
const recommendationsDiv = document.getElementById('recommendations');

function renderQuestion(index) {
  if (index >= questions.length) {
    // All questions answered
    container.innerHTML = '';
    quizDone.classList.remove('hidden');
    setTimeout(calculateScore, 600);
    return;
  }

  const q = questions[index];
  container.innerHTML = `
    <div class="result-card">
      <p class="text-sm font-medium text-gray-400 mb-1">Question ${index + 1} of ${questions.length}</p>
      <p class="text-lg font-medium text-gray-900 mb-4">${q.text}</p>
      <div class="space-y-2">
        ${q.options.map((opt, i) => `
          <button class="q-option w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm text-gray-700" data-value="${opt.value}">
            ${opt.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Attach event listeners
  container.querySelectorAll('.q-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = parseInt(btn.dataset.value);
      answers[index] = value;
      answeredCount = answers.filter(a => a !== undefined).length;
      progressBar.style.width = `${(answeredCount / questions.length) * 100}%`;
      qNum.textContent = answeredCount;
      currentQuestion++;
      renderQuestion(currentQuestion);
    });
  });
}

function calculateScore() {
  const total = answers.reduce((sum, v) => sum + v, 0);
  const maxScore = questions.length * 3; // 24
  const score = total; // 0–24 range, scale to 0–20
  const scaledScore = Math.round((score / maxScore) * 20);

  // Determine category
  let category;
  if (scaledScore >= 16) category = 'excellent';
  else if (scaledScore >= 11) category = 'good';
  else if (scaledScore >= 6) category = 'fair';
  else category = 'poor';

  const rec = recommendations[category];
  const colorMap = { excellent: 'bg-emerald-500', good: 'bg-blue-500', fair: 'bg-amber-500', poor: 'bg-red-500' };

  // Show results
  quizDone.classList.add('hidden');
  resultsSection.classList.remove('hidden');
  scoreValue.textContent = scaledScore;
  scoreLabel.textContent = rec.label;

  // Save to localStorage
  localStorage.setItem('slumber_assessment', JSON.stringify({ score: scaledScore, label: rec.label }));

  setTimeout(() => {
    scoreBar.style.width = `${(scaledScore / 20) * 100}%`;
    scoreBar.className = `h-full rounded-full transition-all duration-1000 ease-out ${colorMap[category]}`;
  }, 100);

  scoreInterpretation.innerHTML = `
    <p class="font-medium text-gray-700 mb-1">What this means</p>
    <p>${rec.desc}</p>
  `;

  recommendationsDiv.innerHTML = `
    <p class="font-medium text-gray-700 text-sm mb-2">💡 Tips for improvement</p>
    ${rec.tips.map(tip => `
      <div class="flex gap-2 text-sm text-gray-600">
        <span class="text-indigo-400 mt-0.5">•</span>
        <span>${tip}</span>
      </div>
    `).join('')}
  `;

  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Start the quiz
renderQuestion(0);
