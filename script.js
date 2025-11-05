document.addEventListener("DOMContentLoaded", () => {
  const timeLabel = document.getElementById("timeLabel");
  const playPauseBtn = document.getElementById("playPause");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const restartBtn = document.getElementById("restart");
  const presetBtns = document.querySelectorAll(".presetBtn");
  const customBtn = document.getElementById("customBtn");
  const pomodoroBtn = document.getElementById("pomodoroBtn");
  const modal = document.getElementById("pomodoroModal");
  const closeModal = document.getElementById("closeModal");
  const circle = document.getElementById("progressCircle");
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const customModal = document.getElementById("customModal");
  const closeCustomModal = document.getElementById("closeCustomModal");
  const saveCustomTimer = document.getElementById("saveCustomTimer");
  const pomodoroInput = document.getElementById("pomodoroInput");
  const shortBreakInput = document.getElementById("shortBreakInput");
  const longBreakInput = document.getElementById("longBreakInput");
  const customImage = document.querySelector(".customImage img");
  const timerTitle = document.getElementById("timerTitle");
  const todoInput = document.getElementById("todoInput");
  const addTodoBtn = document.getElementById("addTodo");
  const todoList = document.getElementById("todoList");

  /*  MODE STATE  */
  let totalSeconds = 25 * 60;
  let remaining = totalSeconds;
  let timer = null;
  let running = false;

  const PRESETS = {
    Pomodoro: 25 * 60,
    "Short Break": 5 * 60,
    "Long Break": 15 * 60,
  };

  const presetImages = {
    Pomodoro: "assets/studying3.png",
    "Short Break": "assets/short break.png",
    "Long Break": "assets/long break.png",
  };

  const presetTitles = {
    Pomodoro: "FOCUS TIME",
    "Short Break": "SHORT BREAK",
    "Long Break": "LONG BREAK",
  };

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  /*  TIMER FUNCTIONS  */
  function formatTime(s) {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  }

  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  function updateTimeLabel() {
    timeLabel.textContent = formatTime(remaining);
    setProgress(((totalSeconds - remaining) / totalSeconds) * 100);
  }

  function startTimer() {
    if (running) return;
    running = true;
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");

    timer = setInterval(() => {
      remaining--;
      if (remaining < 0) {
        clearInterval(timer);
        running = false;
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
        updateTimeLabel();
        playFinishDing();
        notify("Session finished!");
      } else {
        updateTimeLabel();
      }
    }, 1000);
  }

  function pauseTimer() {
    running = false;
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    if (timer) clearInterval(timer);
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = null;
    remaining = totalSeconds;
    running = false;
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    updateTimeLabel();
    setProgress(0);
  }

  /*  TIMER BUTTONS  */
  playPauseBtn.addEventListener("click", () => {
    running ? pauseTimer() : startTimer();
  });

  restartBtn.addEventListener("click", resetTimer);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = btn.dataset.type || btn.textContent.trim();
      totalSeconds = PRESETS[preset];
      resetTimer();
      if (presetImages[preset]) customImage.src = presetImages[preset];
      if (presetTitles[preset]) timerTitle.textContent = presetTitles[preset];

      presetBtns.forEach((b) =>
        b.classList.remove("bg-[#7b5635]", "text-[#fdf7f2]")
      );
      btn.classList.add("bg-[#7b5635]", "text-[#fdf7f2]");
    });
  });

  customBtn.addEventListener("click", () =>
    customModal.classList.toggle("hidden")
  );
  closeCustomModal.addEventListener("click", () =>
    customModal.classList.add("hidden")
  );
  saveCustomTimer.addEventListener("click", () => {
    PRESETS.Pomodoro = (parseInt(pomodoroInput.value) || 25) * 60;
    PRESETS["Short Break"] = (parseInt(shortBreakInput.value) || 5) * 60;
    PRESETS["Long Break"] = (parseInt(longBreakInput.value) || 15) * 60;
    totalSeconds = PRESETS.Pomodoro;
    resetTimer();
    customModal.classList.add("hidden");
  });

  pomodoroBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeModal.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  /*  TODO LIST  */
  function addTodo() {
    const taskText = todoInput.value.trim();
    if (!taskText) return;

    const li = document.createElement("li");
    li.className =
      "flex items-center justify-between bg-white/70 p-2 rounded-lg shadow";

    const leftDiv = document.createElement("div");
    leftDiv.className = "flex items-center gap-2";

    const checkBtn = document.createElement("button");
    checkBtn.className =
      "w-6 h-6 rounded-full border-2 border-[#7b5635] flex items-center justify-center hover:bg-[#7b5635]/10 transition";

    const checkIcon = document.createElement("span");
    checkIcon.textContent = "✓";
    checkIcon.className = "hidden text-[#7b5635] font-bold";
    checkBtn.appendChild(checkIcon);

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    taskSpan.className = "text-brown font-medium";

    checkBtn.addEventListener("click", () => {
      const done = taskSpan.classList.toggle("line-through");
      taskSpan.classList.toggle("text-gray-400");
      if (done) {
        checkBtn.classList.add("bg-[#7b5635]");
        checkIcon.classList.remove("hidden");
        checkIcon.classList.add("text-cream");
        todoList.appendChild(li);
      } else {
        checkBtn.classList.remove("bg-[#7b5635]");
        checkIcon.classList.add("hidden");
        const firstCompleted = [...todoList.children].find((child) =>
          child.querySelector("span").classList.contains("line-through")
        );
        if (firstCompleted) {
          todoList.insertBefore(li, firstCompleted);
        } else {
          todoList.prepend(li);
        }
      }
    });

    leftDiv.appendChild(checkBtn);
    leftDiv.appendChild(taskSpan);

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "×";
    delBtn.className =
      "text-[#7b5635] hover:text-red-500 text-lg transition font-bold";
    delBtn.addEventListener("click", () => li.remove());

    li.appendChild(leftDiv);
    li.appendChild(delBtn);
    todoList.appendChild(li);

    todoInput.value = "";
  }

  addTodoBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
  });

  /*  TIMER FINISH DING  */
  function playFinishDing() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      o.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  }

  function notify(msg) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Tomato Timer", { body: msg });
    } else if (
      "Notification" in window &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    } else {
      alert(msg);
    }
  }

  updateTimeLabel();
});
