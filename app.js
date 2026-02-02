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
   NO dropdown now ✅
========================== */
(function breathingTool() {
  const breathingRoot = document.querySelector("[data-breathing]");
  if (!breathingRoot) return;

  const breathText = document.getElementById("breath-text");
  if (!breathText) return;

  let timer = null;
  let phaseIndex = 0;

  // simple steady loop (4 in / 4 out)
  const phases = [
    { label: "Breathe In...", seconds: 4 },
    { label: "Breathe Out...", seconds: 4 }
  ];

  document.documentElement.style.setProperty("--breath-duration", `8s`);

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function nextPhase() {
    const phase = phases[phaseIndex];
    breathText.textContent = phase.label;

    timer = setTimeout(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      nextPhase();
    }, phase.seconds * 1000);
  }

  clearTimer();
  nextPhase();
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

  // Ensure initial state matches your HTML (login visible, signup hidden)
  if (!loginForm.style.display) loginForm.style.display = "block";
  if (!signupForm.style.display) signupForm.style.display = "none";

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
   Quiz logic (8 questions ✅)
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
      text: "How has your energy been recently?",
      options: [
        { text: "Pretty normal", scores: { routine: 2 } },
        { text: "Low", scores: { support: 1, routine: 1 } },
        { text: "All over the place", scores: { calm: 2, clarity: 1 } }
      ]
    },
    {
      text: "How easy is it to focus right now?",
      options: [
        { text: "Mostly fine", scores: { routine: 2 } },
        { text: "Hard to concentrate", scores: { clarity: 3 } },
        { text: "My mind races", scores: { calm: 2, clarity: 2 } }
      ]
    },
    {
      text: "How often have you felt tense in your body?",
      options: [
        { text: "Not much", scores: { routine: 2 } },
        { text: "Sometimes", scores: { calm: 2 } },
        { text: "A lot", scores: { calm: 3 } }
      ]
    },
    {
      text: "How connected do you feel to others lately?",
      options: [
        { text: "Pretty connected", scores: { routine: 2 } },
        { text: "A little distant", scores: { support: 2 } },
        { text: "Very alone", scores: { support: 3 } }
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
        { text: "I feel stuck", scores: { support: 2, clarity: 1 } }
      ]
    }
  ];

  let index = 0;
  let answers = [];
  let totals = { calm: 0, clarity: 0, support: 0, routine: 0 };

  function resetTotals() {
    totals = { calm: 0, clarity: 0, support: 0, routine: 0 };
  }

  function applyScores(optionScores) {
    Object.keys(optionScores).forEach(k => {
      totals[k] = (totals[k] || 0) + optionScores[k];
    });
  }

  function recomputeTotals() {
    resetTotals();
    answers.forEach((optIndex, qIndex) => {
      const opt = questions[qIndex]?.options?.[optIndex];
      if (opt) applyScores(opt.scores);
    });
  }

  function renderQuestion() {
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
        summary: "Your answers suggest your system may be running a bit hot. A body-first reset may help.",
        steps: [
          "Use the breathing tool on the Home page for 2–3 minutes.",
          "Try grounding: name 5 things you can see.",
          "Relax shoulders + unclench jaw + slow exhale."
        ]
      },
      clarity: {
        title: "Focus: Clear your head",
        summary: "Your answers suggest overwhelm or mental clutter. A small plan can reduce the noise.",
        steps: [
          "Write the top 3 things on your mind.",
          "Circle the one you can act on next.",
          "Make it a 5-minute task and start."
        ]
      },
      support: {
        title: "Focus: Feel supported",
        summary: "Your answers suggest connection could help. You don’t have to carry this alone.",
        steps: [
          "Message one trusted person (even a short ‘hey’).",
          "If it’s serious or ongoing, consider professional support.",
          "Use quick tools while you reach out."
        ]
      },
      routine: {
        title: "Focus: Build a steady routine",
        summary: "Your answers suggest you’re ready for habits that keep you balanced day-to-day.",
        steps: [
          "Pick one tiny daily habit (water, walk, consistent bedtime).",
          "Attach it to something you already do.",
          "Track it for 7 days — keep it small."
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

/* ==========================
   Supabase auth (login.html)
   - keeps your UI the same
   - makes forms actually work
========================== */
(function supabaseAuth() {
  // Only runs on the login page where the forms exist
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  if (!loginForm || !signupForm) return;

  const sb = window.supabaseClient;
  if (!sb) {
    console.warn("Supabase client not found. Make sure supabase-js + supabaseClient.js are loaded on login.html");
    return;
  }

  // Create (or reuse) a message area without changing your layout
  let msg = document.getElementById("auth-msg");
  if (!msg) {
    msg = document.createElement("p");
    msg.id = "auth-msg";
    msg.className = "hint";
    msg.style.marginTop = "10px";
    signupForm.insertAdjacentElement("afterend", msg);
  }

  function setMsg(text) {
    msg.textContent = text || "";
  }

  // LOGIN
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("Logging in...");

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value;

    const { error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Logged in!");
    window.location.href = "index.html";
  });

  // SIGNUP
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("Creating account...");

    const email = document.getElementById("new-email")?.value?.trim();
    const password = document.getElementById("new-password")?.value;

    const { error } = await sb.auth.signUp({ email, password });

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Account created! You can log in now.");
  });
})();

/* ==========================
   Auth UI (nav + profile page)
========================== */
(function authUi() {
  const sb = window.supabaseClient;
  if (!sb) return;

  const navSlot = document.getElementById("auth-nav-slot");

  async function refreshNav() {
    if (!navSlot) return;

    const { data: { session } } = await sb.auth.getSession();

    if (!session) {
      navSlot.innerHTML = `<a class="nav-link" href="login.html">Login</a>`;
      return;
    }

    const email = session.user?.email || "Logged in";
    navSlot.innerHTML = `
      <a class="nav-link" href="profile.html">${email}</a>
      <a class="nav-link" href="#" id="nav-logout">Logout</a>
    `;

    const logoutLink = document.getElementById("nav-logout");
    logoutLink?.addEventListener("click", async (e) => {
      e.preventDefault();
      await sb.auth.signOut();
      window.location.href = "index.html";
    });
  }

  // Profile page wiring (if those elements exist)
  async function refreshProfilePage() {
    const profilePanel = document.getElementById("profile-panel");
    const loggedOutPanel = document.getElementById("profile-logged-out");
    if (!profilePanel || !loggedOutPanel) return;

    const emailEl = document.getElementById("profile-email");
    const idEl = document.getElementById("profile-id");
    const logoutBtn = document.getElementById("logout-btn");

    const { data: { session } } = await sb.auth.getSession();

    if (!session) {
      profilePanel.hidden = true;
      loggedOutPanel.hidden = false;
      return;
    }

    loggedOutPanel.hidden = true;
    profilePanel.hidden = false;

    if (emailEl) emailEl.textContent = session.user?.email || "";
    if (idEl) idEl.textContent = session.user?.id || "";

    logoutBtn?.addEventListener("click", async () => {
      await sb.auth.signOut();
      window.location.href = "index.html";
    });
  }

  // Run once on load
  refreshNav();
  refreshProfilePage();

  // Keep UI in sync if auth state changes (login/logout in another tab)
  sb.auth.onAuthStateChange(() => {
    refreshNav();
    refreshProfilePage();
  });
})();

/* ==========================
   Profile page: local display name (optional)
========================== */
(function profileLocalName() {
  const input = document.getElementById("display-name");
  const saveBtn = document.getElementById("save-display-btn");
  const clearBtn = document.getElementById("clear-display-btn");
  const msg = document.getElementById("display-save-msg");
  if (!input || !saveBtn || !clearBtn) return;

  // Load saved name
  const saved = localStorage.getItem("rr_display_name");
  if (saved) input.value = saved;

  function setMsg(t) {
    if (msg) msg.textContent = t || "";
  }

  saveBtn.addEventListener("click", () => {
    const name = input.value.trim();
    localStorage.setItem("rr_display_name", name);
    setMsg(name ? "Saved locally ✅" : "Saved (blank) ✅");
  });

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("rr_display_name");
    input.value = "";
    setMsg("Cleared ✅");
  });
})();

