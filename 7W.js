document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     CONFIG
  ================================ */
  const TEST_MODE = true; // 🔴 set FALSE before final release

  const START_MONTH = 1; // February (0 = Jan)
  const START_DAY = 7;
  const END_DAY = 14;

  const DAYS = ["rose","propose","chocolate","teddy","promise","hug","kiss"];
  let currentIndex = 0;
  let letterStarted = false;

  /* ===============================
     DOM
  ================================ */
  const lockScreen  = document.getElementById("lockScreen");
  const mainContent = document.getElementById("mainContent");
  const countdown   = document.getElementById("countdown");
  const screens     = document.querySelectorAll("#mainContent .screen");
  const prevBtn     = document.getElementById("prevBtn");
  const nextBtn     = document.getElementById("nextBtn");

  // Hard block rendering until ready
  if (mainContent) mainContent.style.display = "none";

  const intro = document.getElementById("introScreen");
  if (intro) setTimeout(() => intro.style.display = "none", 4500);

  /* ===============================
     FLOATING ITEMS
  ================================ */
  const FLOAT_SETS = {
    rose: ["🌹","❤️"],
    propose: ["💍","❤️"],
    chocolate: ["🍫"],
    teddy: ["🧸","🤍"],
    promise: ["🤝","✨"],
    hug: ["🤗","🤍"],
    kiss: ["😘","💖"]
  };

  function spawnFloatingItem() {
    if (lockScreen.style.display !== "none") return;

    const dayClass = [...document.body.classList].find(c => c.startsWith("day-"));
    if (!dayClass) return;

    const key = dayClass.replace("day-","");
    const symbols = FLOAT_SETS[key] || ["❤️"];

    const el = document.createElement("div");
    el.className = "floating-item";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = 14 + Math.random() * 18 + "px";
    el.style.animationDuration = 8 + Math.random() * 6 + "s";

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 15000);
  }

  setInterval(spawnFloatingItem, 1400);

  /* ===============================
     DATE / UNLOCK LOGIC (TIMEZONE SAFE)
  ================================ */
  function getUnlockedIndex() {
    if (TEST_MODE) return 0; // Rose Day only

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(now.getFullYear(), START_MONTH, START_DAY);
    const end   = new Date(now.getFullYear(), START_MONTH, END_DAY);

    if (today < start) return -1;
    if (today > end) return DAYS.length - 1;

    return Math.floor((today - start) / 86400000);
  }

  /* ===============================
     LETTER (PROPOSE DAY)
  ================================ */
  const LETTER_TEXT = `Hey Sunshine 💖🌹

I don’t usually write things like this.
Some feelings deserve time.

Somewhere along the way,
you started to matter to me quietly.

This letter isn’t meant to change anything.
Just honesty, softly written.

You don’t owe me anything.
I just wanted you to know —
you are seen and appreciated 💖`;

  function handleLetter(index) {
    const paper = document.querySelector(".secret-letter");
    const textEl = document.getElementById("letterText");
    if (!paper || !textEl) return;

    if (index !== 1) {
      paper.classList.remove("open");
      textEl.textContent = "";
      letterStarted = false;
      return;
    }

    if (letterStarted) return;
    letterStarted = true;
    paper.classList.add("open");

    let i = 0;
    textEl.textContent = "";
    setTimeout(function type() {
      if (i < LETTER_TEXT.length) {
        textEl.textContent += LETTER_TEXT.charAt(i++);
        setTimeout(type, 45);
      }
    }, 2000);
  }

  /* ===============================
     SCREEN CONTROL
  ================================ */
  function showScreen(index) {
    screens.forEach(s => s.classList.remove("active"));
    screens[index].classList.add("active");

    document.body.className = document.body.className
      .split(" ")
      .filter(c => !c.startsWith("day-"))
      .join(" ");

    document.body.classList.add("day-" + DAYS[index]);
    currentIndex = index;
    handleLetter(index);
  }

  function updateNav(unlocked) {
    prevBtn?.classList.toggle("disabled", currentIndex === 0);
    nextBtn?.classList.toggle("disabled", currentIndex >= unlocked);
  }

  /* ===============================
     MAIN UI FLOW
  ================================ */
  function updateUI() {
    const unlocked = getUnlockedIndex();

    if (unlocked < 0) {
      lockScreen.style.display = "flex";
      mainContent.style.display = "none";
      updateCountdown();
      return;
    }

    lockScreen.style.display = "none";
    document.body.classList.remove("locked");

    showScreen(unlocked);
    updateNav(unlocked);
    mainContent.style.display = "block";
  }

  function updateCountdown() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(now.getFullYear(), START_MONTH, START_DAY);

    if (today >= start) {
      countdown.textContent = "Unlocked 🤍";
      return;
    }

    const diff = Math.floor((start - today) / 86400000);
    countdown.textContent = `${diff} day(s) to go`;
  }

  /* ===============================
     NAV
  ================================ */
  nextBtn?.addEventListener("click", () => {
    if (currentIndex < getUnlockedIndex()) showScreen(currentIndex + 1);
    updateNav(getUnlockedIndex());
  });

  prevBtn?.addEventListener("click", () => {
    if (currentIndex > 0) showScreen(currentIndex - 1);
    updateNav(getUnlockedIndex());
  });

  /* ===============================
     INIT
  ================================ */
  updateUI();
});