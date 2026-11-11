// Database of Movie Questions with Multiple Clues
const moviesDatabase = {
  action: [
    {
      title: "The Dark Knight",
      images: [
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop"
      ],
      hint: "Directed by Christopher Nolan, featuring Gotham City and the Joker.",
      options: ["Batman Begins", "The Dark Knight", "The Dark Knight Rises", "The Joker"]
    },
    {
      title: "Mad Max: Fury Road",
      images: [
        "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542362567-b07eac79094d?q=80&w=800&auto=format&fit=crop"
      ],
      hint: "Set in a desert wasteland where motorized convoys battle for scarce resources.",
      options: ["Mad Max: Fury Road", "Dune", "Waterworld", "The Book of Eli"]
    },
    {
      title: "Inception",
      images: [
        "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop"
      ],
      hint: "Involves entering dreams within dreams, using a spinning top as a totem.",
      options: ["Inception", "Interstellar", "Tenet", "The Matrix"]
    }
  ],
  comedy: [
    {
      title: "The Hangover",
      images: [
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop"
      ],
      hint: "A bachelor party in Las Vegas turns chaotic after the groom disappears.",
      options: ["Old School", "The Hangover", "Due Date", "Superbad"]
    },
    {
      title: "Free Guy",
      images: [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552824722-ddab1374e60e?q=80&w=800&auto=format&fit=crop"
      ],
      hint: "A video game NPC becomes self-aware and attempts to save his world.",
      options: ["Wreck-it Ralph", "Free Guy", "Ready Player One", "Pixels"]
    },
    {
      title: "Toy Story",
      images: [
        "https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop"
      ],
      hint: "Toys secretly come alive when humans leave; stars Woody and Buzz.",
      options: ["Inside Out", "The Lego Movie", "Toy Story", "Monsters, Inc."]
    }
  ]
};

// Game State
let currentGenre = "action";
let questionsPool = [];
let currentQuestionIdx = 0;
let currentScore = 0;
let hasAnswered = false;
let hintUsed = false;
let timerInterval = null;
let timeRemaining = 20;
let currentImageIndex = 0;

const stats = {
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  hintsCount: 0
};

// DOM References
const welcomeScreen = document.getElementById("welcome-screen");
const categoryScreen = document.getElementById("category-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

// Audio Elements
const audioCorrect = document.getElementById("audio-correct");
const audioIncorrect = document.getElementById("audio-incorrect");
const audioComplete = document.getElementById("audio-complete");

function showScreen(screenEl) {
  document.querySelectorAll(".screen").forEach(sc => sc.classList.remove("active"));
  screenEl.classList.add("active");
}

// Navigation & Screen Setup
document.getElementById("start-btn").addEventListener("click", () => {
  showScreen(categoryScreen);
  renderCategories();
});

document.querySelectorAll(".back-to-welcome").forEach(btn => {
  btn.addEventListener("click", () => showScreen(welcomeScreen));
});

document.getElementById("hint-btn").addEventListener("click", revealHint);
document.getElementById("clue-toggle-btn").addEventListener("click", toggleClueImage);
document.getElementById("next-btn").addEventListener("click", handleNextButton);
document.getElementById("exit-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to quit the current game?")) {
    clearInterval(timerInterval);
    showScreen(categoryScreen);
  }
});
document.getElementById("play-again-btn").addEventListener("click", () => startCategoryQuiz(currentGenre));
document.getElementById("results-home-btn").addEventListener("click", () => showScreen(categoryScreen));

// Render Categories with semantic button cards
function renderCategories() {
  const grid = document.getElementById("genre-grid");
  grid.innerHTML = "";

  const genres = [
    { id: "action", name: "Action Movies", icon: "fa-fire-flame-curved" },
    { id: "comedy", name: "Comedy Movies", icon: "fa-face-laugh-squint" }
  ];

  genres.forEach(genre => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "category-card";
    card.innerHTML = `
      <i class="fa-solid ${genre.icon}" aria-hidden="true"></i>
      <h3>${genre.name}</h3>
    `;
    card.addEventListener("click", () => startCategoryQuiz(genre.id));
    grid.appendChild(card);
  });
}

function startCategoryQuiz(genreId) {
  currentGenre = genreId;
  questionsPool = [...moviesDatabase[genreId]];

  currentQuestionIdx = 0;
  currentScore = 0;
  stats.correct = 0;
  stats.incorrect = 0;
  stats.unanswered = 0;
  stats.hintsCount = 0;

  showScreen(gameScreen);
  loadQuestion();
}

function loadQuestion() {
  const qData = questionsPool[currentQuestionIdx];
  hasAnswered = false;
  hintUsed = false;
  currentImageIndex = 0;

  document.getElementById("current-question-num").textContent = currentQuestionIdx + 1;
  document.getElementById("total-questions-num").textContent = questionsPool.length;
  document.getElementById("current-genre-label").textContent = currentGenre.toUpperCase();
  document.getElementById("live-score").value = currentScore;

  // Clue Image & Caption
  const clueImg = document.getElementById("movie-clue-img");
  clueImg.src = qData.images[0];
  clueImg.alt = `Clue 1 image for ${currentGenre} question ${currentQuestionIdx + 1}`;
  document.getElementById("clue-tag").textContent = "Clue 1 of 2";

  // Clue Hints
  const hintBtn = document.getElementById("hint-btn");
  hintBtn.disabled = false;
  document.getElementById("hint-display-box").style.display = "none";
  document.getElementById("hint-text").textContent = qData.hint;

  document.getElementById("next-btn").disabled = true;

  // Render Options
  const container = document.getElementById("options-container");
  container.innerHTML = "";

  qData.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", "false");
    btn.innerHTML = `<span>${opt}</span><i class="fa-regular fa-circle" aria-hidden="true"></i>`;
    btn.addEventListener("click", () => checkAnswer(opt, btn, qData.title));
    container.appendChild(btn);
  });

  // 20-Second Countdown
  timeRemaining = 20;
  const timerCount = document.getElementById("timer-count");
  timerCount.textContent = timeRemaining;
  timerCount.setAttribute("datetime", `PT${timeRemaining}S`);

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeRemaining--;
    timerCount.textContent = timeRemaining;
    timerCount.setAttribute("datetime", `PT${timeRemaining}S`);

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function revealHint() {
  if (hintUsed || hasAnswered) return;
  hintUsed = true;
  stats.hintsCount++;
  document.getElementById("hint-display-box").style.display = "block";
  document.getElementById("hint-btn").disabled = true;
}

function toggleClueImage() {
  const qData = questionsPool[currentQuestionIdx];
  currentImageIndex = currentImageIndex === 0 ? 1 : 0;
  const clueImg = document.getElementById("movie-clue-img");
  clueImg.src = qData.images[currentImageIndex];
  clueImg.alt = `Clue ${currentImageIndex + 1} image for ${currentGenre} question ${currentQuestionIdx + 1}`;
  document.getElementById("clue-tag").textContent = `Clue ${currentImageIndex + 1} of 2`;
}

function checkAnswer(selectedOpt, btnElement, correctTitle) {
  if (hasAnswered) return;
  hasAnswered = true;
  clearInterval(timerInterval);

  const allBtns = document.querySelectorAll(".option-btn");
  allBtns.forEach(b => {
    b.disabled = true;
    b.setAttribute("aria-checked", b === btnElement ? "true" : "false");
  });

  if (selectedOpt === correctTitle) {
    btnElement.classList.add("correct");
    btnElement.querySelector("i").className = "fa-solid fa-circle-check";

    audioCorrect.currentTime = 0;
    audioCorrect.play().catch(() => {});

    const pointsEarned = hintUsed ? 5 : 10;
    currentScore += pointsEarned;
    stats.correct++;
  } else {
    btnElement.classList.add("incorrect");
    btnElement.querySelector("i").className = "fa-solid fa-circle-xmark";

    audioIncorrect.currentTime = 0;
    audioIncorrect.play().catch(() => {});

    stats.incorrect++;

    allBtns.forEach(b => {
      if (b.textContent.trim() === correctTitle) {
        b.classList.add("correct");
      }
    });
  }

  document.getElementById("live-score").value = currentScore;
  document.getElementById("next-btn").disabled = false;
}

function handleTimeout() {
  if (hasAnswered) return;
  hasAnswered = true;

  audioIncorrect.currentTime = 0;
  audioIncorrect.play().catch(() => {});

  stats.unanswered++;

  const allBtns = document.querySelectorAll(".option-btn");
  const correctTitle = questionsPool[currentQuestionIdx].title;
  allBtns.forEach(b => {
    b.disabled = true;
    if (b.textContent.trim() === correctTitle) {
      b.classList.add("correct");
    }
  });

  document.getElementById("next-btn").disabled = false;
}

function handleNextButton() {
  currentQuestionIdx++;
  if (currentQuestionIdx < questionsPool.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  showScreen(resultScreen);
  clearInterval(timerInterval);

  audioComplete.currentTime = 0;
  audioComplete.play().catch(() => {});

  const total = questionsPool.length;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

  document.getElementById("final-score-badge").value = `${currentScore} / ${total * 10}`;
  document.getElementById("res-total").textContent = total;
  document.getElementById("res-correct").textContent = stats.correct;
  document.getElementById("res-incorrect").textContent = stats.incorrect;
  document.getElementById("res-unanswered").textContent = stats.unanswered;
  document.getElementById("res-accuracy").textContent = `${accuracy}%`;
  document.getElementById("res-total-points").textContent = `${currentScore} Pts`;

  const summaryMsg = document.getElementById("final-summary");
  if (accuracy === 100) {
    summaryMsg.textContent = "Outstanding! Perfect score on movie identification.";
  } else if (accuracy >= 60) {
    summaryMsg.textContent = "Good job! You know your movies well.";
  } else {
    summaryMsg.textContent = "Nice attempt! Try another genre or revisit clues.";
  }
}