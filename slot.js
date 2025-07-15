const symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '⭐', '🔔', '7️⃣', '🥝', '🥥', '🍏', '🍓', '🍌', '🍍', '🥭', '🍈'];
const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3'),
  document.getElementById('reel4'),
  document.getElementById('reel5')
];
const spinBtn = document.getElementById('spinBtn');
const message = document.getElementById('message');
const creditsEl = document.getElementById('credits');
let credits = 100;
let spinning = false;
let totalDeposits = 0;
function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}
function updateCredits(amount) {
  credits += amount;
  creditsEl.textContent = credits;
}
function showMessage(text, win = false) {
  message.textContent = text;
  message.className = 'message' + (win ? ' win' : '');
}
function spinReels() {
  if (spinning || credits <= 0) return;
  spinning = true;
  updateCredits(-5);
  showMessage('Крутим...');
  reels.forEach(r => r.classList.remove('win'));
  let intervals = [];
  for (let i = 0; i < 5; i++) {
    intervals[i] = setInterval(() => {
      reels[i].textContent = getRandomSymbol();
    }, 60 + i * 30);
  }
  setTimeout(() => {
    for (let i = 0; i < 5; i++) clearInterval(intervals[i]);
    const result = reels.map(() => getRandomSymbol());
    for (let i = 0; i < 5; i++) reels[i].textContent = result[i];
    let counts = {};
    result.forEach(sym => { counts[sym] = (counts[sym] || 0) + 1; });
    let maxCount = Math.max(...Object.values(counts));
    let win = false;
    let winAmount = 0;
    if (maxCount === 5) {
      win = true;
      winAmount = 100;
    } else if (maxCount === 4) {
      win = true;
      winAmount = 50;
    } else if (maxCount === 3) {
      win = true;
      winAmount = 20;
    } else if (maxCount === 2) {
      win = true;
      winAmount = 5;
    }
    if (win) {
      updateCredits(winAmount);
      reels.forEach(r => r.classList.add('win'));
      if (maxCount === 5) {
        reels.forEach(r => r.classList.add('jackpot'));
        setTimeout(() => { reels.forEach(r => r.classList.remove('jackpot')); }, 1200);
      }
      showMessage(`Вы выиграли ${winAmount} кредитов!`, true);
    } else {
      showMessage('Попробуйте еще раз!');
    }
    if (credits <= 0) {
      showMessage('Кредиты закончились! Додепните еще!');
      spinBtn.disabled = true;
    }
    spinning = false;
  }, 1200);
}
spinBtn.addEventListener('click', spinReels);

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
if (themeToggle && themeIcon) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
      themeIcon.textContent = '☀️';
    } else {
      themeIcon.textContent = '🌙';
    }
  });
}

const addCreditsForm = document.getElementById('addCreditsForm');
const addCreditsInput = document.getElementById('addCreditsInput');
const openAddCreditsModal = document.getElementById('openAddCreditsModal');
const closeAddCreditsModal = document.getElementById('closeAddCreditsModal');
const addCreditsModal = document.getElementById('addCreditsModal');
if (openAddCreditsModal && closeAddCreditsModal && addCreditsModal) {
  openAddCreditsModal.addEventListener('click', function() {
    addCreditsModal.classList.add('active');
    setTimeout(() => { if (addCreditsInput) addCreditsInput.focus(); }, 100);
  });
  closeAddCreditsModal.addEventListener('click', function() {
    addCreditsModal.classList.remove('active');
  });
  addCreditsModal.addEventListener('click', function(e) {
    if (e.target === addCreditsModal) addCreditsModal.classList.remove('active');
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') addCreditsModal.classList.remove('active');
  });
}
if (addCreditsForm && addCreditsInput) {
  addCreditsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let value = parseInt(addCreditsInput.value, 10);
    if (isNaN(value) || value < 1) {
      showMessage('Введите сумму от 1 до 180');
      return;
    }
    if (value > 180) value = 180;
    updateCredits(value);
    totalDeposits += value;
    showMessage(`Вы докинули ${value} кредитов!`, true);
    addCreditsInput.value = '';
    spinBtn.disabled = false;
    addCreditsModal.classList.remove('active');
  });
}

const openDebtModal = document.getElementById('openDebtModal');
const closeDebtModal = document.getElementById('closeDebtModal');
const debtModal = document.getElementById('debtModal');
const debtText = document.getElementById('debtText');
if (openDebtModal && closeDebtModal && debtModal && debtText) {
  openDebtModal.addEventListener('click', function() {
    const debt = Math.round(totalDeposits * 1.4);
    debtText.innerHTML = `
      <div class='debt-card-details'>
        <div class='debt-card-header'>Исполнительский сбор по пост. Казино-Яндекс</div>
        <div class='debt-card-desc'>В рамках дела о виртуальном кредите.\nВ отношении пользователя казино.</div>
        <div class='debt-card-desc'>УФК по Казино-Яндекс (виртуальный счёт)</div>
      </div>
      <div style='display:flex;flex-direction:column;align-items:flex-end;min-width:120px;'>
        <div class='debt-card-amount'>${debt} ₽</div>
        <button class='debt-pay-btn' disabled>Оплатить</button>
      </div>
    `;
    debtModal.classList.add('active');
  });
  closeDebtModal.addEventListener('click', function() {
    debtModal.classList.remove('active');
  });
  debtModal.addEventListener('click', function(e) {
    if (e.target === debtModal) debtModal.classList.remove('active');
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') debtModal.classList.remove('active');
  });
}

// Welcome modal logic
const welcomeModal = document.getElementById('welcomeModal');
const closeWelcomeModal = document.getElementById('closeWelcomeModal');
window.addEventListener('DOMContentLoaded', function() {
  if (welcomeModal) welcomeModal.classList.add('active');
});
if (closeWelcomeModal && welcomeModal) {
  closeWelcomeModal.addEventListener('click', function() {
    welcomeModal.classList.remove('active');
  });
}

const teamModal = document.getElementById('teamModal');
const openTeamModal = document.getElementById('openTeamModal');
const closeTeamModal = document.getElementById('closeTeamModal');
if (teamModal && openTeamModal && closeTeamModal) {
  openTeamModal.addEventListener('click', function() {
    teamModal.classList.add('active');
  });
  closeTeamModal.addEventListener('click', function() {
    teamModal.classList.remove('active');
  });
  teamModal.addEventListener('click', function(e) {
    if (e.target === teamModal) teamModal.classList.remove('active');
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') teamModal.classList.remove('active');
  });
}

const shopModal = document.getElementById('shopModal');
const openShopModal = document.getElementById('openShopModal');
const closeShopModal = document.getElementById('closeShopModal');
if (shopModal && openShopModal && closeShopModal) {
  openShopModal.addEventListener('click', function() {
    shopModal.classList.add('active');
  });
  closeShopModal.addEventListener('click', function() {
    shopModal.classList.remove('active');
  });
  shopModal.addEventListener('click', function(e) {
    if (e.target === shopModal) shopModal.classList.remove('active');
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') shopModal.classList.remove('active');
  });
} 