// ===== DIFFICULTY CONFIG =====
const DIFFICULTY_SETTINGS = {
  easy: { max: 50, attempts: 7 },
  medium: { max: 100, attempts: 5 },
  hard: { max: 200, attempts: 4 }
};

// ===== GAME STATE =====
let secretNumber;
let attemptsLeft;
let maxAttempts;
let maxNumber;
let gameEnded;
let guessHistory = [];
let score = 0;
let difficulty = "medium";

// ===== DOM =====
const gameArea = document.querySelector(".game-area");

// ===== INIT =====
renderDifficultySelector();

// ===== DIFFICULTY SELECTOR =====
function renderDifficultySelector() {
  gameArea.innerHTML = `
    <h3>Select Difficulty</h3>

    <div class="guess-controls">
      <select id="difficultySelect">
        <option value="easy">Easy (1–50)</option>
        <option value="medium" selected>Medium (1–100)</option>
        <option value="hard">Hard (1–200)</option>
      </select>
      <button id="startBtn">Start Game</button>
    </div>
  `;

  document
    .getElementById("startBtn")
    .addEventListener("click", startGame);
}

// ===== START GAME =====
function startGame() {
  difficulty =
    document.getElementById("difficultySelect")?.value || "medium";

  maxNumber = DIFFICULTY_SETTINGS[difficulty].max;
  maxAttempts = DIFFICULTY_SETTINGS[difficulty].attempts;

  secretNumber = Math.floor(Math.random() * maxNumber) + 1;
  attemptsLeft = maxAttempts;
  gameEnded = false;
  guessHistory = [];
  score = 0;

  gameArea.innerHTML = `
    <p>Difficulty: <strong>${difficulty.toUpperCase()}</strong></p>
    <p>Guess a number between <strong>1 and ${maxNumber}</strong></p>

    <div class="guess-controls">
      <input
        type="text"
        id="guessInput"
        placeholder="1 - ${maxNumber}"
        inputmode="numeric"
        pattern="[0-9]*"
      />
      <button id="guessBtn">Guess</button>
    </div>

    <p class="feedback info" id="feedback">
      Attempts left: ${attemptsLeft}
    </p>

    <p><strong>Score:</strong> <span id="score">0</span></p>

    <div class="guess-history" id="guessHistory">
      <strong>Previous guesses:</strong> None
    </div>
  `;

  const input = document.getElementById("guessInput");
  const button = document.getElementById("guessBtn");

  button.addEventListener("click", handleGuess);
  input.addEventListener("keydown", handleEnterKey);
  input.addEventListener("keydown", blockInvalidKeys);
  input.addEventListener("input", handleInput);
}

// ===== INPUT GUARDS =====
function blockInvalidKeys(e) {
  if (gameEnded) {
    e.preventDefault();
    showError("⛔ Game sudah selesai.");
    return;
  }

  const invalidKeys = ["e", "E", "+", "-", ".", ","];
  if (invalidKeys.includes(e.key)) {
    e.preventDefault();
    showError("❌ Hanya angka yang diperbolehkan.");
  }
}

function handleEnterKey(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    handleGuess();
  }
}

function handleInput(e) {
  if (gameEnded) {
    e.target.value = "";
    showError("⛔ Game sudah selesai.");
    return;
  }

  if (/\D/.test(e.target.value)) {
    e.target.value = e.target.value.replace(/\D/g, "");
    showError("❌ Hanya angka yang diperbolehkan.");
    return;
  }

  if (e.target.value === "") {
    showInfo(`Attempts left: ${attemptsLeft}`);
    return;
  }

  const number = Number(e.target.value);

  if (number < 1 || number > maxNumber) {
    showError(`❌ Angka harus antara 1 dan ${maxNumber}`);
  } else {
    showInfo("✔ Angka valid.");
  }
}

// ===== MAIN GAME LOGIC =====
function handleGuess() {
  if (gameEnded) return;

  const input = document.getElementById("guessInput");
  const historyContainer = document.getElementById("guessHistory");
  const scoreText = document.getElementById("score");
  const guess = Number(input.value);

  if (!guess || guess < 1 || guess > maxNumber) {
    showError(`❌ Masukkan angka 1–${maxNumber}`);
    return;
  }

  if (guessHistory.includes(guess)) {
    showError("⚠️ Angka ini sudah pernah ditebak.");
    input.value = "";
    return;
  }

  guessHistory.push(guess);
  updateHistory(historyContainer);

  attemptsLeft--;

  if (guess === secretNumber) {
    score = attemptsLeft * 10 + 10;
    scoreText.textContent = score;
    showSuccess(`🎉 Benar! Skor kamu: ${score}`);
    endGame();
  } else if (attemptsLeft === 0) {
    showError(`😢 Game Over! Angkanya adalah ${secretNumber}`);
    endGame();
  } else if (guess > secretNumber) {
    showInfo(`📉 Terlalu besar! Sisa attempt: ${attemptsLeft}`);
  } else {
    showInfo(`📈 Terlalu kecil! Sisa attempt: ${attemptsLeft}`);
  }

  input.value = "";
}

// ===== UPDATE HISTORY =====
function updateHistory(container) {
  container.innerHTML =
    "<strong>Previous guesses:</strong> " +
    guessHistory.map(n => `<span>${n}</span>`).join("");
}

// ===== FEEDBACK HELPERS =====
function showError(text) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = text;
  feedback.className = "feedback error";
}

function showInfo(text) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = text;
  feedback.className = "feedback info";
}

function showSuccess(text) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = text;
  feedback.className = "feedback success";
}

// ===== END GAME =====
function endGame() {
  gameEnded = true;

  const input = document.getElementById("guessInput");
  const button = document.getElementById("guessBtn");

  input.disabled = true;
  button.disabled = true;

  const actions = document.createElement("div");
  actions.style.marginTop = "20px";

  const playAgainBtn = document.createElement("button");
  playAgainBtn.textContent = "🔄 Play Again";
  playAgainBtn.className = "restart-btn";
  playAgainBtn.onclick = startGame;

  const changeDifficultyBtn = document.createElement("button");
  changeDifficultyBtn.textContent = "🎚 Change Difficulty";
  changeDifficultyBtn.className = "restart-btn";
  changeDifficultyBtn.style.marginLeft = "10px";
  changeDifficultyBtn.onclick = renderDifficultySelector;

  actions.appendChild(playAgainBtn);
  actions.appendChild(changeDifficultyBtn);

  gameArea.appendChild(actions);
}
