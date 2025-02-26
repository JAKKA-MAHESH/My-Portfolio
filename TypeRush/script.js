const levels = [
    { id: 1, goal: "Home Row Basics", text: "a s d f j k l ;", wpm: 10, accuracy: 90, time: 60 },
    { id: 2, goal: "Two-Letter Combos", text: "as df jk kl", wpm: 15, accuracy: 90, time: 60 },
    { id: 3, goal: "Simple Words", text: "sad fad ask lid", wpm: 20, accuracy: 85, time: 90 },
    { id: 4, goal: "Top Row Intro", text: "quit wet top rip", wpm: 25, accuracy: 85, time: 90 },
    { id: 5, goal: "Bottom Row Intro", text: "zip cat van bin", wpm: 30, accuracy: 85, time: 120 },
    { id: 6, goal: "Mixed Row Words", text: "cake jump bird rope", wpm: 35, accuracy: 80, time: 120 },
    { id: 7, goal: "Sentences & Spaces", text: "the cat is big", wpm: 40, accuracy: 80, time: 150 },
    { id: 8, goal: "Punctuation Basics", text: "it's hot, i'm tired", wpm: 40, accuracy: 80, time: 150 },
    { id: 9, goal: "Numbers & Symbols", text: "buy 2 apples! price = $5", wpm: 40, accuracy: 75, time: 180 },
    { id: 10, goal: "Real-World Challenge", text: "In 2025, AI helps humans explore Mars, code faster, and solve climate issues.", wpm: 30, accuracy: 75, time: 180 }
];

let currentLevel = null;
let timeLeft = 0;
let timerInterval = null;
let typedChars = 0;
let correctChars = 0;

const keypressSound = document.getElementById("keypress-sound");
const victorySound = document.getElementById("victory-sound");
const championSound = document.getElementById("champion-sound");

function initializeGame() {
    const welcomeScreen = document.getElementById("welcome-screen");
    const gameContainer = document.getElementById("game-container");
    const gameScreen = document.getElementById("game");
    const victoryScreen = document.getElementById("victory-screen");

    welcomeScreen.classList.remove("hidden");
    gameContainer.classList.add("hidden");
    gameScreen.classList.add("hidden");
    victoryScreen.classList.add("hidden");
}

initializeGame();
window.addEventListener("load", initializeGame);

function startGame() {
    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    resetLevelButtons();
}

function startLevel(levelId) {
    currentLevel = levels.find(l => l.id === levelId);
    if (!currentLevel) return;

    timeLeft = currentLevel.time;
    typedChars = 0;
    correctChars = 0;

    document.getElementById("level-select").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    document.getElementById("victory-screen").classList.add("hidden");
    document.getElementById("display-text").textContent = currentLevel.text;
    document.getElementById("input-field").value = "";
    document.getElementById("timer").textContent = `Time: ${timeLeft}s`;
    document.getElementById("stats").textContent = "WPM: 0 | Accuracy: 100%";

    startTimer();
    document.getElementById("input-field").focus();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Time: ${timeLeft}s`;
        updateStats();
        if (timeLeft <= 0) {
            endLevel(false);
        }
    }, 1000);
}

document.getElementById("input-field").addEventListener("input", (e) => {
    if (keypressSound) {
        keypressSound.currentTime = 0;
        keypressSound.play().catch(err => console.log("Audio play failed:", err));
    }
    const input = e.target.value;
    const target = currentLevel.text;
    typedChars = input.length;

    if (input === target) {
        correctChars = typedChars;
        e.target.classList.add("correct");
        e.target.classList.remove("error");
        clearInterval(timerInterval);
        setTimeout(() => endLevel(true), 100);
    } else if (target.startsWith(input)) {
        correctChars = input.length;
        e.target.classList.add("correct");
        e.target.classList.remove("error");
    } else {
        e.target.classList.add("error");
        e.target.classList.remove("correct");
    }
    updateStats();
});

function updateStats() {
    const elapsedTime = (currentLevel.time - timeLeft) / 60;
    const wpm = elapsedTime > 0 ? Math.round((typedChars / 5) / elapsedTime) : 0;
    const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
    document.getElementById("stats").textContent = `WPM: ${wpm} | Accuracy: ${accuracy}%`;
    return { wpm, accuracy };
}

function endLevel(completed = false) {
    clearInterval(timerInterval);
    const { wpm, accuracy } = updateStats();
    console.log(`Level ${currentLevel.id} - Completed: ${completed}, WPM: ${wpm}, Accuracy: ${accuracy}%`);

    if (completed && wpm >= currentLevel.wpm && accuracy >= currentLevel.accuracy) {
        if (victorySound) victorySound.play().catch(err => console.log("Victory sound failed:", err));
        launchConfetti(200);
        if (currentLevel.id === 10) {
            showVictoryScreen();
        } else {
            alert(`Level ${currentLevel.id} Complete! WPM: ${wpm}, Accuracy: ${accuracy}%`);
            unlockNextLevel();
            document.getElementById("game").classList.add("hidden");
            document.getElementById("level-select").classList.remove("hidden");
        }
    } else {
        alert(`Failed! WPM: ${wpm} (Target: ${currentLevel.wpm}), Accuracy: ${accuracy}% (Target: ${currentLevel.accuracy}%). Try again!`);
        document.getElementById("game").classList.add("hidden");
        document.getElementById("level-select").classList.remove("hidden");
    }
}

function unlockNextLevel() {
    const nextLevelId = currentLevel.id + 1;
    const nextButton = document.querySelector(`button[onclick="startLevel(${nextLevelId})"]`);
    if (nextButton) nextButton.disabled = false;
}

function restartLevel() {
    if (!currentLevel) return;
    clearInterval(timerInterval);
    startLevel(currentLevel.id);
}

function launchConfetti(amount) {
    for (let i = 0; i < amount; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.background = ["#00FFFF", "#FF00FF", "#00FF00", "#FFFF00", "#FF5555"][Math.floor(Math.random() * 5)];
        confetti.style.width = Math.random() * 10 + 5 + "px";
        confetti.style.height = Math.random() * 10 + 5 + "px";
        confetti.style.animationDuration = (Math.random() * 3 + 2) + "s";
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

function showVictoryScreen() {
    if (championSound) championSound.play().catch(err => console.log("Champion sound failed:", err));
    launchConfetti(300);
    document.getElementById("game").classList.add("hidden");
    document.getElementById("level-select").classList.add("hidden");
    document.getElementById("victory-screen").classList.remove("hidden");
}

function resetGame() {
    clearInterval(timerInterval);
    document.getElementById("victory-screen").classList.add("hidden");
    document.getElementById("game").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    document.getElementById("level-select").classList.remove("hidden");
    resetLevelButtons();
    currentLevel = null;
    console.log("Game reset: Level select shown, victory hidden");
}

function resetLevelButtons() {
    document.querySelectorAll("#level-select button").forEach((btn, index) => {
        btn.disabled = index !== 0;
    });
}