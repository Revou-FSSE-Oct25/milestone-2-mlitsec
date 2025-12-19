// ================= GAME STATE =================
let playerScore = 0;
let computerScore = 0;

// ================= DOM =================
const buttons = document.querySelectorAll(".rps-btn");
const resultText = document.getElementById("result");
const playerScoreText = document.getElementById("playerScore");
const computerScoreText = document.getElementById("computerScore");
const resetBtn = document.getElementById("resetBtn");
const levelSelect = document.getElementById("levelSelect");

// ================= COMPUTER CHOICE =================
function getComputerChoice(playerChoice) {
  const level = levelSelect.value;
  const choices = ["rock", "paper", "scissors"];

  // Easy & Medium: random
  if (level !== "hard") {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  // Hard: computer more likely to win
  switch (playerChoice) {
    case "rock":
      return Math.random() < 0.6 ? "paper" : "scissors";
    case "paper":
      return Math.random() < 0.6 ? "scissors" : "rock";
    case "scissors":
      return Math.random() < 0.6 ? "rock" : "paper";
  }
}

// ================= GAME LOGIC =================
function playGame(playerChoice) {
  const computerChoice = getComputerChoice(playerChoice);

  if (playerChoice === computerChoice) {
    resultText.textContent = `🤝 Draw! You both chose ${playerChoice}.`;
    resultText.className = "feedback info";
    return;
  }

  let playerWins = false;

  switch (playerChoice) {
    case "rock":
      playerWins = computerChoice === "scissors";
      break;
    case "paper":
      playerWins = computerChoice === "rock";
      break;
    case "scissors":
      playerWins = computerChoice === "paper";
      break;
  }

  if (playerWins) {
    playerScore++;
    playerScoreText.textContent = playerScore;
    resultText.textContent = `🎉 You win! Computer chose ${computerChoice}.`;
    resultText.className = "feedback success";
  } else {
    computerScore++;
    computerScoreText.textContent = computerScore;
    resultText.textContent = `😢 You lose! Computer chose ${computerChoice}.`;
    resultText.className = "feedback error";
  }
}
// ================= EVENTS =================
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    playGame(btn.dataset.choice);
  });
});
resetBtn.addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  playerScoreText.textContent = 0;
  computerScoreText.textContent = 0;
  resultText.textContent = "Make your move!";
  resultText.className = "feedback info";
});
