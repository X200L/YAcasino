const symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '⭐', '🔔', '7️⃣'];
const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3')
];
const spinBtn = document.getElementById('spinBtn');
const message = document.getElementById('message');
const creditsEl = document.getElementById('credits');
let credits = 100;
let spinning = false;
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
  for (let i = 0; i < 3; i++) {
    intervals[i] = setInterval(() => {
      reels[i].textContent = getRandomSymbol();
    }, 60 + i * 30);
  }
  setTimeout(() => {
    for (let i = 0; i < 3; i++) clearInterval(intervals[i]);
    const result = reels.map(() => getRandomSymbol());
    for (let i = 0; i < 3; i++) reels[i].textContent = result[i];
    let win = false;
    let winAmount = 0;
    if (result[0] === result[1] && result[1] === result[2]) {
      win = true;
      winAmount = 50;
    } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
      win = true;
      winAmount = 10;
    }
    if (win) {
      updateCredits(winAmount);
      reels.forEach(r => r.classList.add('win'));
      showMessage(`Вы выиграли ${winAmount} кредитов!`, true);
    } else {
      showMessage('Попробуйте еще раз!');
    }
    if (credits <= 0) {
      showMessage('Кредиты закончились! Обновите страницу, чтобы начать заново.');
      spinBtn.disabled = true;
    }
    spinning = false;
  }, 1200);
}
spinBtn.addEventListener('click', spinReels); 
