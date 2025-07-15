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
let boostSpins = 0;
let freeSpin = false;
let vipSpins = 0;
let stickerSpins = 0;
const boostIndicator = document.getElementById('boostIndicator');
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
function updateBoostIndicator() {
  let arr = [];
  if (boostSpins > 0) arr.push(`Повышенные шансы: ${boostSpins} спинов`);
  if (vipSpins > 0) arr.push(`VIP: ${vipSpins} спинов`);
  if (stickerSpins > 0) arr.push('Стикер "Везунчик"');
  boostIndicator.style.display = arr.length ? '' : 'none';
  boostIndicator.textContent = arr.join(' | ');
}
function canBuy(cost) {
  return credits >= cost;
}
function showShopMessage(msg) {
  showMessage(msg, true);
  setTimeout(() => { if (message.textContent === msg) showMessage(''); }, 1800);
}
function updateShopButtons() {
  const buyLuck = document.getElementById('buyLuck');
  if (buyLuck) buyLuck.disabled = !canBuy(120) || boostSpins > 0;
  const buyFreeSpin = document.getElementById('buyFreeSpin');
  if (buyFreeSpin) buyFreeSpin.disabled = !canBuy(30) || freeSpin;
  const buyVip = document.getElementById('buyVip');
  if (buyVip) buyVip.disabled = !canBuy(100) || vipSpins > 0;
  const buySticker = document.getElementById('buySticker');
  if (buySticker) buySticker.disabled = !canBuy(60) || stickerSpins > 0;
}
updateBoostIndicator();
updateShopButtons();

function spinReels() {
  if (spinning || credits <= 0 && !freeSpin) return;
  spinning = true;
  if (freeSpin) {
    freeSpin = false;
  } else {
    updateCredits(-5);
  }
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
    if (boostSpins > 0) {
      if (Math.random() < 0.25) {
        maxCount = 5;
        for (let i = 0; i < 5; i++) result[i] = result[0];
      } else if (Math.random() < 0.35) {
        maxCount = 4;
        let sym = result[0];
        for (let i = 0; i < 4; i++) result[i] = sym;
      } else if (Math.random() < 0.5) {
        maxCount = 3;
        let sym = result[0];
        for (let i = 0; i < 3; i++) result[i] = sym;
      }
    }
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
    if (credits <= 0 && !freeSpin) {
      showMessage('Кредиты закончились! Обновите страницу, чтобы начать заново.');
      spinBtn.disabled = true;
    }
    if (boostSpins > 0) {
      boostSpins--;
    }
    if (vipSpins > 0) {
      vipSpins--;
    }
    if (stickerSpins > 0) {
      stickerSpins--;
    }
    updateBoostIndicator();
    updateShopButtons();
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
        <div class='debt-card-header'>Исполнительский сбор по пост. Я-казик</div>
        <div class='debt-card-desc'>В рамках дела о виртуальном кредите.\nВ отношении пользователя казино.</div>
        <div class='debt-card-desc'>УФК по Я-казик (виртуальный счёт)</div>
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

const buyLuck = document.getElementById('buyLuck');
if (buyLuck) {
  buyLuck.addEventListener('click', function() {
    if (boostSpins > 0 || !canBuy(120)) return;
    updateCredits(-120);
    boostSpins = 10;
    updateBoostIndicator();
    updateShopButtons();
    showShopMessage('Повышенные шансы активированы на 10 спинов!');
  });
}
const buyFreeSpin = document.getElementById('buyFreeSpin');
if (buyFreeSpin) {
  buyFreeSpin.addEventListener('click', function() {
    if (!canBuy(30) || freeSpin) return;
    updateCredits(-30);
    freeSpin = true;
    updateBoostIndicator();
    updateShopButtons();
    showShopMessage('Бесплатный спин куплен! Следующий спин бесплатный.');
  });
}
const buyVip = document.getElementById('buyVip');
if (buyVip) {
  buyVip.addEventListener('click', function() {
    if (!canBuy(100) || vipSpins > 0) return;
    updateCredits(-100);
    vipSpins = 10;
    updateBoostIndicator();
    updateShopButtons();
    showShopMessage('VIP-статус активирован на 10 спинов!');
  });
}
const buySticker = document.getElementById('buySticker');
if (buySticker) {
  buySticker.addEventListener('click', function() {
    if (!canBuy(60) || stickerSpins > 0) return;
    updateCredits(-60);
    stickerSpins = 10;
    updateBoostIndicator();
    updateShopButtons();
    showShopMessage('Стикер "Везунчик" активирован на 10 спинов!');
  });
} 
