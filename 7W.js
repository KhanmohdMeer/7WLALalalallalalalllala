document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     CONFIG (NO TEST MODE)
  ================================ */
  const START_MONTH = 1; // February (0 = Jan)
  const START_DAY   = 7;
  const END_DAY     = 14;

  const DAYS = ["rose","propose","chocolate","teddy","promise","hug","kiss"];
  let currentIndex = 0;

  /* ===============================
     DOM
  ================================ */
  const lockScreen  = document.getElementById("lockScreen");
  const mainContent = document.getElementById("mainContent");
  const countdown   = document.getElementById("countdown");
  const screens     = document.querySelectorAll("#mainContent .screen");
  const prevBtn     = document.getElementById("prevBtn");
  const nextBtn     = document.getElementById("nextBtn");
  const intro = document.getElementById("introScreen");
if (intro) {
  setTimeout(() => {
    intro.remove(); // 🔥 completely remove it
  }, 3000);
}


  /* ===============================
     DATE LOGIC (BULLETPROOF)
  ================================ */
  function getUnlockedIndex() {
    const now = new Date();

    // Normalize to local midnight
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const start = new Date(now.getFullYear(), START_MONTH, START_DAY);
    const end   = new Date(now.getFullYear(), START_MONTH, END_DAY);

    if (today < start) return -1;
    if (today > end) return DAYS.length - 1;

    const diffDays = Math.floor((today - start) / 86400000);
    return Math.min(DAYS.length - 1, diffDays);
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
  }

  function updateNav(unlocked) {
    prevBtn.classList.toggle("disabled", currentIndex === 0);
    nextBtn.classList.toggle("disabled", currentIndex >= unlocked);
  }

  /* ===============================
     COUNTDOWN
  ================================ */
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
     INIT (ORDER MATTERS)
  ================================ */
  const unlocked = getUnlockedIndex();

  if (unlocked < 0) {
    lockScreen.style.display = "flex";
    mainContent.style.display = "none";
    updateCountdown();
    return;
  }

  lockScreen.style.display = "none";
  mainContent.style.display = "block";

  showScreen(unlocked);
  updateNav(unlocked);

  /* ===============================
     NAV EVENTS
  ================================ */
  nextBtn.addEventListener("click", () => {
    if (currentIndex < unlocked) showScreen(currentIndex + 1);
    updateNav(unlocked);
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) showScreen(currentIndex - 1);
    updateNav(unlocked);
  });
});
