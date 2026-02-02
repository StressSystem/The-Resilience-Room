/* ==========================
   Active nav highlight
========================== */
(function setActiveNav() {
  const page = document.body.dataset.page;
  const links = document.querySelectorAll(".nav-link");

  links.forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    if (page === "home" && href.includes("index.html")) a.classList.add("active");
    if (page === "quiz" && href.includes("quiz.html")) a.classList.add("active");
    if (page === "mental" && href.includes("mental_health.html")) a.classList.add("active");
    if (page === "services" && href.includes("services.html")) a.classList.add("active");
    if (page === "login" && href.includes("login.html")) a.classList.add("active");
  });
})();

/* ==========================
   Breathing tool (shared)
   Supports: box, steady, 4-7-8
========================== */
(function breathingTool() {
  const breathingRoot = document.querySelector("[data-breathing]");
  if (!breathingRoot) return;

  const modeSelect = document.getElementById("breath-mode");
  const breathText = document.getElementById("breath-text");

  if (!modeSelect || !breathText) return;

  let timer = null;
  let phaseIndex = 0;

  const patterns = {
    box: {
      name: "Box (4–4–4–4)",
      phases: [
        { label: "Breathe In...", seconds: 4 },
        { label: "Hold...", seconds: 4 },
        { label: "Breathe Out...", seconds: 4 },
        { label: "Hold...", seconds: 4 }
      ],
      animationSeconds: 8
    },
    steady: {
      name: "Steady (4–4)",
      phases: [
        { label: "Breathe In...", seconds: 4 },
        { label: "Breathe Out...", seconds: 4 }
      ],
      animationSeconds: 8
    },
    "478": {
      name: "4–7–8",
      phases: [
        { label: "Breathe In...", seconds: 4 },
        { label: "Hold...", seconds: 7 },
        { label: "Breathe Out...", seconds: 8 }
      ],
      animationSeconds: 12
    }
  };

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function setBreathAnimation(seconds) {
    document.documentElement.style.setProperty("--breath-duration", `${seconds}s`);
  }

  function runPattern(key) {
    clearTimer();
    phaseIndex = 0;

    const p = patterns[key] || patterns.box;
    setBreathAnimation(p.animationSeconds);

    function nextPhase() {
      const phase = p.phases[phaseIndex];
      breathText.textContent = phase.label;

      timer = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % p.phases.length;
        nextPhase();
      }, phase.seconds * 1000);
    }

    nextPhase();
  }

  modeSelect.addEventListener("change", () => runPattern(modeSelect.value));
  runPattern(modeSelect.value);
})();

/* ==========================
   Mental health "Right now" panels
========================== */
(function rightNowPanels() {
  const pills = document.querySelectorAll(".pill[data-panel]");
  if (!pills.length) return;

  const panels = document.querySelectorAll(".panel");

  function hideAll() {
    panels.forEach(p => (p.hidden = true));
  }

  pills.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.panel;
      const target = document.getElementById(id);
      if (!target) return;

      const isOpen = target.hidden === false;

      hideAll();
      if (!isOpen) target.hidden = false;
    });
  });
})();

/* ==========================
   FAQ accordion
========================== */
(function faqAccordion() {
  const qs = document.querySelectorAll(".faq-q[data-faq]");
  if (!qs.length) return;

  qs.forEach(q => {
    q.addEventListener("click", () => {
      const id = q.dataset.faq;
      const a = document.getElementById(id);
      if (!a) return;

      const expanded = q.getAttribute("aria-expanded") === "true";
      q.setAttribute("aria-expanded", String(!expanded));
      a.hidden = expanded;
    });
  });
})();

/* ==========================
   Login form toggle
========================== */
(function loginToggle() {
  const toggleLink = document.getElementById("toggle-form");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const formTitle = document.getElementById("form-title");

  if (!toggleLink || !loginForm || !signupForm || !formTitle) return;

  toggleLink.addEventListener("click", function (event) {
    event.preventDefault();

    const loginHidden = loginForm.style.display === "none";
    if (loginHidden) {
      loginForm.style.display = "block";
      signupForm.style.display = "none";
      formTitle.textContent = "Login to your account.";
      toggleLink.textContent = "Don't have an account? Sign Up";
    } else {
      loginForm.style.display = "none";
      signupForm.style.display = "block";
      formTitle.textContent = "Create a new account.";
      toggleLink.textContent = "Already have an account? Login";
    }
  });
})();

/* ==========================
   Quiz logic (4 questions -> category -> result)
========================== */
(function quizEngine() {
  const quizArea = document.getElementById("quiz-area");
  const results = document.getElementById("quiz-results");
  if (!quizArea || !results) return;

  const progressEl = document.getElementById("quiz-progress");
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const backBtn = document.getElementById("quiz-back");
  const restartBtn = document.getElementById("quiz-restart");

  const resultTitle = document.getElementById("result-title");
  const resultSummary = document.getElementById("result-summary");
  const resultCard = document.getElementById("result-card");

  const questions = [
    {
      text: "How has your sleep been lately?",
      options: [
        { text: "Restful and steady", scores: { routine: 2 } },
        { text: "A bit restless", scores: { calm: 2 } },
        { text: "I can’t seem to sleep", scores: { calm: 3, support: 1 } }
      ]
    },
    {
      text: "How has your stress level been?",
      options: [
        { text: "Manageable", scores: { routine: 2 } },
        { text: "Up and down", scores: { clarity: 2 } },
        { text: "Very high", scores: { calm: 2, clarity: 2 } }
      ]
    },
    {
      text: "What do you need most right now?",
      options: [
        { text: "Calm my body", scores: { calm: 3 } },
        { text: "Clear my head", scores: { clarity: 3 } },
        { text: "Feel supported", scores: { support: 3 } }
      ]
    },
    {
      text: "Which sounds most like you lately?",
      options: [
        { text: "I want better habits", scores: { routine: 3 } },
        { text: "I’m overwhelmed", scores: { clarity: 2, calm: 1 } },
        { text: "I feel alone with it", scores: { support: 3 } }
      ]
    }
  ];

  let index = 0;
  let answers = []; // stores option index per question
  let totals = { calm: 0, clarity: 0, support: 0, routine: 0 };

  function resetTotals() {
    totals = { calm: 0, clarity: 0, support: 0, routine: 0 };
  }

  function applyScores(optionScores, mult = 1) {
    Object.keys(optionScores).forEach(k => {
      totals[k] = (totals[k] || 0) + optionScores[k] * mult;
    });
  }

  function recomputeTotals() {
    resetTotals();
    answers.forEach((optIndex, qIndex) => {
      const opt = questions[qIndex].options[optIndex];
      if (opt) applyScores(opt.scores, 1);
    });
  }

  function renderQuestion() {
    // hide results
    results.hidden = true;
    quizArea.hidden = false;

    const q = questions[index];
    progressEl.textContent = `Question ${index + 1} of ${questions.length}`;
    questionEl.textContent = q.text;

    optionsEl.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-opt-btn";
      btn.textContent = opt.text;

      btn.addEventListener("click", () => {
        answers[index] = i;
        if (index < questions.length - 1) {
          index++;
          renderQuestion();
        } else {
          showResults();
        }
      });

      optionsEl.appendChild(btn);
    });

    backBtn.disabled = index === 0;
  }

  function getTopCategory() {
    const entries = Object.entries(totals);
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }

  function showResults() {
    recomputeTotals();
    const top = getTopCategory();

    const contentByCat = {
      calm: {
        title: "Focus: Calm your body",
        summary: "Your answers suggest your nervous system might be running a bit hot. A body-first reset may help.",
        steps: [
          "Use the breathing tool for 2–3 minutes (long exhale).",
          "Try grounding: name 5 things you can see.",
          "Drink water and relax your shoulders/jaw."
        ],
        links: [
          { text: "Try Quick Help", href: "mental_health.html" },
          { text: "Explore Services", href: "services.html" }
        ]
      },
      clarity: {
        title: "Focus: Clear your head",
        summary: "Your answers suggest overwhelm or mental clutter. A small plan can reduce the noise.",
        steps: [
          "Write the top 3 things on your mind.",
          "Circle the one you can act on next.",
          "Make it a 5-minute task and start."
        ],
        links: [
          { text: "Quick Help Tools", href: "mental_health.html" },
          { text: "Our Services", href: "services.html" }
        ]
      },
      support: {
        title: "Focus: Feel supported",
        summary: "Your answers suggest connection and support could help right now. You don’t have to carry this alone.",
        steps: [
          "Message one trusted person (even a short ‘hey’).",
          "If it’s serious or ongoing, consider professional support.",
          "Use quick tools while you reach out."
        ],
        links: [
          { text: "Our Services", href: "services.html" },
          { text: "Quick Help", href: "mental_health.html" }
        ]
      },
      routine: {
        title: "Focus: Build a steady routine",
        summary: "Your answers suggest you’re ready for habits that keep you balanced day-to-day.",
        steps: [
          "Pick one small daily habit (sleep time, walk, water).",
          "Attach it to something you already do (after brushing teeth).",
          "Track it for 7 days — keep it tiny."
        ],
        links: [
          { text: "Mental Health Basics", href: "mental_health.html#basics" },
          { text: "Our Services", href: "services.html" }
        ]
      }
    };

    const result = contentByCat[top];

    resultTitle.textContent = result.title;
    resultSummary.textContent = result.summary;

    resultCard.innerHTML = `
      <h3>Recommended next steps</h3>
      <ol>
        ${result.steps.map(s => `<li>${s}</li>`).join("")}
      </ol>
      <div style="margin-top: 10px; display:flex; gap:10px; flex-wrap:wrap;">
        ${result.links.map(l => `<a class="btn btn-small ${l.href.includes("services") ? "btn-outline" : ""}" href="${l.href}">${l.text}</a>`).join("")}
      </div>
    `;

    quizArea.hidden = true;
    results.hidden = false;
  }

  backBtn?.addEventListener("click", () => {
    if (index > 0) {
      index--;
      renderQuestion();
    }
  });

  restartBtn?.addEventListener("click", () => {
    index = 0;
    answers = [];
    resetTotals();
    renderQuestion();
  });

  renderQuestion();
})();
