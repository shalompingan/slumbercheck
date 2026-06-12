// Sleep Environment Checker — 6 factors with affiliate product recommendations
const checklistItems = [
  {
    id: 'temperature',
    label: 'Room Temperature',
    desc: 'The ideal sleep temperature is 65–68°F (18–20°C).',
    yesText: 'Yes, my room is cool enough',
    noText: 'It\'s too warm or I\'m not sure',
    pass: true, // user selects yes → pass
    product: {
      name: 'Cooling Bedding & Temperature Control',
      items: [
        { name: 'Chilipad Cube Sleep System', price: '$199+', url: '#', type: 'temperature' },
        { name: 'Cooling Weighted Blanket', price: '$89', url: '#', type: 'blanket' }
      ]
    }
  },
  {
    id: 'noise',
    label: 'Noise Level',
    desc: 'Your bedroom should be quiet. If you hear street noise, neighbors, or a loud HVAC system, that\'s disruptive.',
    yesText: 'My room is quiet enough',
    noText: 'There\'s disruptive noise',
    pass: true,
    product: {
      name: 'White Noise Machines & Earplugs',
      items: [
        { name: 'LectroFan High Fidelity Sound Machine', price: '$49', url: '#', type: 'whitenoise' },
        { name: 'Loop Quiet Earplugs', price: '$24', url: '#', type: 'earplugs' }
      ]
    }
  },
  {
    id: 'light',
    label: 'Light Exposure',
    desc: 'Complete darkness helps your body produce melatonin. Even small LED lights can disrupt sleep.',
    yesText: 'My room is dark enough',
    noText: 'There\'s too much light',
    pass: true,
    product: {
      name: 'Blackout Solutions',
      items: [
        { name: 'Blackout Curtains (Set of 2)', price: '$29', url: '#', type: 'curtains' },
        { name: 'Sleep Mask — Silk, Adjustable', price: '$18', url: '#', type: 'mask' }
      ]
    }
  },
  {
    id: 'mattress',
    label: 'Mattress Age & Comfort',
    desc: 'Most mattresses should be replaced every 7–8 years. An old or uncomfortable mattress causes back pain and restless sleep.',
    yesText: 'My mattress is < 7 years old and comfortable',
    noText: 'It\'s over 7 years old or uncomfortable',
    pass: true,
    product: {
      name: 'Recommended Mattresses',
      items: [
        { name: 'Casper Original Mattress', price: '$995+', url: '#', type: 'mattress-casper' },
        { name: 'Purple Mattress', price: '$999+', url: '#', type: 'mattress-purple' },
        { name: 'Nectar Memory Foam Mattress', price: '$699+', url: '#', type: 'mattress-nectar' }
      ]
    }
  },
  {
    id: 'pillow',
    label: 'Pillow Quality',
    desc: 'Pillows should be replaced every 1–2 years. The right pillow keeps your spine aligned.',
    yesText: 'My pillow is comfortable and supportive',
    noText: 'It\'s old or causes neck pain',
    pass: true,
    product: {
      name: 'Recommended Pillows',
      items: [
        { name: 'Coop Home Goods Adjustable Pillow', price: '$72', url: '#', type: 'pillow-coop' },
        { name: 'Purple Harmony Pillow', price: '$109', url: '#', type: 'pillow-purple' }
      ]
    }
  },
  {
    id: 'air',
    label: 'Air Quality & Humidity',
    desc: 'Dry air, dust, or poor ventilation can cause snoring, congestion, and restless sleep.',
    yesText: 'The air feels fresh and comfortable',
    noText: 'It\'s dry, dusty, or stuffy',
    pass: true,
    product: {
      name: 'Air Quality Solutions',
      items: [
        { name: 'Levoit Humidifier (Quiet, 1.5L)', price: '$39', url: '#', type: 'humidifier' },
        { name: 'Levoit Air Purifier for Bedroom', price: '$89', url: '#', type: 'purifier' }
      ]
    }
  }
];

let results = {};

const checklistEl = document.getElementById('checklist');
const checkBtn = document.getElementById('checkResultsBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsList = document.getElementById('resultsList');
const productRecs = document.getElementById('productRecs');
const passCount = document.getElementById('passCount');

// Render checklist
function renderChecklist() {
  checklistEl.innerHTML = checklistItems.map((item, idx) => `
    <div class="border border-gray-200 rounded-lg p-4">
      <div class="flex items-start justify-between mb-1">
        <label class="font-medium text-gray-900 text-sm">${item.label}</label>
        <span id="status_${item.id}" class="text-xs text-gray-400"></span>
      </div>
      <p class="text-xs text-gray-400 mb-3">${item.desc}</p>
      <div class="flex gap-2">
        <button data-item="${item.id}" data-pass="true" class="env-btn flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">${item.yesText}</button>
        <button data-item="${item.id}" data-pass="false" class="env-btn flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all">${item.noText}</button>
      </div>
    </div>
  `).join('');

  // Add event listeners
  document.querySelectorAll('.env-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.item;
      const passed = btn.dataset.pass === 'true';
      results[itemId] = passed;

      // Visual feedback
      const group = btn.closest('.border');
      group.querySelectorAll('.env-btn').forEach(b => {
        b.classList.remove('border-green-400', 'bg-green-50', 'text-green-700', 'font-medium',
                          'border-red-400', 'bg-red-50', 'text-red-700', 'font-medium');
        b.classList.add('border-gray-200');
      });
      if (passed) {
        btn.classList.remove('border-gray-200');
        btn.classList.add('border-green-400', 'bg-green-50', 'text-green-700', 'font-medium');
      } else {
        btn.classList.remove('border-gray-200');
        btn.classList.add('border-red-400', 'bg-red-50', 'text-red-700', 'font-medium');
      }

      // Update status
      const statusEl = document.getElementById(`status_${itemId}`);
      statusEl.textContent = passed ? '✅ Good' : '⚠️ Needs attention';

      // Enable button
      const answeredCount = Object.keys(results).length;
      checkBtn.disabled = answeredCount < checklistItems.length;
      if (answeredCount >= checklistItems.length) {
        checkBtn.classList.remove('disabled:opacity-40', 'disabled:cursor-not-allowed');
      }
    });
  });
}

// Show results
checkBtn.addEventListener('click', () => {
  const passed = Object.values(results).filter(v => v === true).length;
  passCount.textContent = passed;

  resultsList.innerHTML = checklistItems.map(item => {
    const passed = results[item.id];
    return `
      <div class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
        <div class="flex items-center gap-2">
          <span>${passed ? '✅' : '❌'}</span>
          <span class="text-sm ${passed ? 'text-gray-500' : 'text-gray-900 font-medium'}">${item.label}</span>
        </div>
        <span class="text-xs ${passed ? 'text-green-600' : 'text-red-500'}">${passed ? 'Pass' : 'Needs attention'}</span>
      </div>
    `;
  }).join('');

  // Show product recommendations for failed items
  const failedItems = checklistItems.filter(item => results[item.id] === false);
  if (failedItems.length > 0) {
    productRecs.innerHTML = `
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <p class="font-medium text-amber-900 text-sm mb-3">🛒 Recommended products to improve your sleep environment</p>
        ${failedItems.map(item => `
          <div class="mb-3 last:mb-0">
            <p class="text-xs font-medium text-amber-800 mb-1">${item.product.name}</p>
            ${item.product.items.map(p => `
              <div class="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2 mb-1 text-sm">
                <span class="text-gray-700">${p.name}</span>
                <a href="${p.url}" class="text-indigo-600 hover:text-indigo-800 text-xs font-medium ml-2 whitespace-nowrap">Check price →</a>
              </div>
            `).join('')}
          </div>
        `).join('')}
        <p class="text-xs text-amber-600 mt-2">As an Amazon Associate we earn from qualifying purchases.</p>
      </div>
    `;
  } else {
    productRecs.innerHTML = `
      <div class="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
        ✅ Your sleep environment looks great! Keep up the good work.
      </div>
    `;
  }

  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

renderChecklist();
