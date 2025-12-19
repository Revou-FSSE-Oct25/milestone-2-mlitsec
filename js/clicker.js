// ================= GAME STATE =================
let score = 0;
let timeLeft = 10;
let timer = null;
let gameActive = false;

// ================= DOM =================
const clickBtn = document.getElementById("clickBtn");
const startBtn = document.getElementById("startBtn");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const statusText = document.getElementById("status");
const levelSelect = document.getElementById("levelSelect");
const bestScoreText = document.getElementById("bestScore");

// ================= LEVEL CONFIG =================
const LEVEL_SETTINGS = {
  easy: 15,
  medium: 10,
  hard: 5
};
// ================= LOAD BEST SCORE =================
let bestScore = localStorage.getItem("clickerBestScore") || 0;
bestScoreText.textContent = bestScore;

// ================= START GAME =================
function startGame() {
  score = 0;
  timeLeft = LEVEL_SETTINGS[levelSelect.value];
  gameActive = true;

  scoreText.textContent = score;
  timeText.textContent = timeLeft;
  statusText.textContent = "🔥 Game started! Click fast!";
  statusText.className = "feedback info";

  clickBtn.disabled = false;
  startBtn.disabled = true;
  levelSelect.disabled = true;

  timer = setInterval(updateTime, 1000);
}

// ================= UPDATE TIME =================
function updateTime() {
  timeLeft--;
  timeText.textContent = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

// ================= CLICK HANDLER =================
function handleClick() {
  if (!gameActive) return;

  score++;
  scoreText.textContent = score;
}

// ================= END GAME =================
function endGame() {
  clearInterval(timer);
  gameActive = false;

  clickBtn.disabled = true;
  startBtn.disabled = false;
  levelSelect.disabled = false;

  // Update best score
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("clickerBestScore", bestScore);
    bestScoreText.textContent = bestScore;
  }

  // Dynamic feedback
  let message = "";
  if (score < 20) {
    message = "🙂 Keep practicing!";
  } else if (score < 40) {
    message = "💪 Nice reflex!";
  } else {
    message = "🔥 Amazing speed!";
  }

  statusText.textContent = `⏱ Time's up! Final score: ${score}. ${message}`;
  statusText.className = "feedback success";
}

// ================= EVENTS =================
startBtn.addEventListener("click", startGame);
clickBtn.addEventListener("click", handleClick);
