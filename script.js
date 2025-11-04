(() => {
  // Elements
  const timeLabel = document.getElementById("timeLabel");
  const playPauseBtn = document.getElementById("playPause");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const restartBtn = document.getElementById("restart");
  const presetBtns = document.querySelectorAll(".presetBtn");
  const customBtn = document.getElementById("customBtn");
  const customArea = document.getElementById("customArea");
  const customMinutes = document.getElementById("customMinutes");
  const setCustom = document.getElementById("setCustom");
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

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

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
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const preset = e.target.dataset.type || e.target.textContent.trim();

      totalSeconds = PRESETS[preset];
      resetTimer();

      if (presetImages[preset]) {
        customImage.src = presetImages[preset];
      }

      if (presetTitles[preset]) {
        timerTitle.textContent = presetTitles[preset];
      }
    });
  });

  // Show modal
  customBtn.addEventListener("click", () => {
    customModal.classList.remove("hidden");
    customModal.classList.add("flex");
  });

  // Close modal
  closeCustomModal.addEventListener("click", () => {
    customModal.classList.add("hidden");
    customModal.classList.remove("flex");
  });

  // Save new custom times
  saveCustomTimer.addEventListener("click", () => {
    const pomodoro = parseInt(pomodoroInput.value) || 25;
    const shortBreak = parseInt(shortBreakInput.value) || 5;
    const longBreak = parseInt(longBreakInput.value) || 15;

    // Update presets
    PRESETS["Pomodoro"] = pomodoro * 60;
    PRESETS["Short Break"] = shortBreak * 60;
    PRESETS["Long Break"] = longBreak * 60;

    // Optionally reset current timer
    totalSeconds = PRESETS["Pomodoro"];
    remaining = totalSeconds;
    resetTimer();

    // Close modal
    customModal.classList.add("hidden");
    customModal.classList.remove("flex");
  });

  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  pomodoroBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  // Timer state
  let totalSeconds = 25 * 60;
  let remaining = totalSeconds;
  let timer = null;
  let running = false;

  // Default presets
  const PRESETS = {
    Pomodoro: 25 * 60,
    "Short Break": 5 * 60,
    "Long Break": 15 * 60,
  };

  // update UI time
  function formatTime(s) {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  }

  function updateTimeLabel() {
    timeLabel.textContent = formatTime(remaining);
    const pct = ((totalSeconds - remaining) / totalSeconds) * 100;
    setProgress(pct);
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
        alert("Session finished!");
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
    remaining = totalSeconds;
    running = false;
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    updateTimeLabel();
  }

  // Controls bindings
  playPauseBtn.addEventListener("click", () => {
    if (!running) startTimer();
    else pauseTimer();
  });

  restartBtn.addEventListener("click", () => {
    remaining = totalSeconds;
    updateTimeLabel();
  });

  // Presets
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const txt = e.target.textContent.trim();
      totalSeconds = PRESETS[txt];
      resetTimer();
    });
  });

  // Custom
  customBtn.addEventListener("click", () => {
    customArea.classList.toggle("hidden");
  });

  setCustom.addEventListener("click", () => {
    const mins = parseInt(customMinutes.value || "25", 10);
    if (mins > 0) {
      totalSeconds = mins * 60;
      resetTimer();
      customArea.classList.add("hidden");
    }
  });

  // init
  updateTimeLabel();

  /* ======= TODO LIST ======= */
  const todoListEl = document.getElementById("todoList");
  const todoInput = document.getElementById("todoInput");
  const addTodoBtn = document.getElementById("addTodo");

  let todos = JSON.parse(localStorage.getItem("tomato_todos") || "[]");

  function saveTodos() {
    localStorage.setItem("tomato_todos", JSON.stringify(todos));
  }

  function renderTodos() {
    todoListEl.innerHTML = "";
    todos.forEach((t, i) => {
      const li = document.createElement("li");
      li.className = "flex items-center justify-between";
      li.innerHTML = `
        <label class="flex items-center gap-3 w-full">
          <input type="checkbox" ${t.done ? "checked" : ""} data-i="${i}" />
          <span class="flex-1 ${
            t.done ? "line-through text-brown/50" : ""
          }">${escapeHtml(t.text)}</span>
        </label>
        <button data-i="${i}" class="text-red-400">🗑</button>
      `;
      todoListEl.appendChild(li);
    });

    // events
    todoListEl.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const idx = parseInt(e.target.dataset.i, 10);
        todos[idx].done = e.target.checked;
        saveTodos();
        renderTodos();
      });
    });

    todoListEl.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", (e) => {
        const idx = parseInt(e.target.dataset.i, 10);
        todos.splice(idx, 1);
        saveTodos();
        renderTodos();
      });
    });
  }

  addTodoBtn.addEventListener("click", () => {
    const val = todoInput.value.trim();
    if (!val) return;
    todos.push({ text: val, done: false });
    todoInput.value = "";
    saveTodos();
    renderTodos();
  });

  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodoBtn.click();
  });

  function escapeHtml(s) {
    return s.replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }

  renderTodos();

  /* ======= MUSIC PLAYER ======= */
  const audio = document.getElementById("audioPlayer");
  const trackSelect = document.getElementById("trackSelect");
  const musicPlay = document.getElementById("musicPlay");
  const musicPause = document.getElementById("musicPause");
  const musicSeek = document.getElementById("musicSeek");
  const musicTime = document.getElementById("musicTime");

  // Load default track
  audio.src = trackSelect.value;
  audio.loop = true;

  trackSelect.addEventListener("change", () => {
    audio.src = trackSelect.value;
    audio.play();
    updateMusicButtons(true);
  });

  function secToMMSS(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  }

  audio.addEventListener("loadedmetadata", () => {
    musicSeek.max = Math.floor(audio.duration || 0);
  });

  audio.addEventListener("timeupdate", () => {
    musicSeek.value = Math.floor(audio.currentTime);
    musicTime.textContent = secToMMSS(audio.currentTime);
  });

  musicPlay.addEventListener("click", () => {
    audio.play();
    updateMusicButtons(true);
  });

  musicPause.addEventListener("click", () => {
    audio.pause();
    updateMusicButtons(false);
  });

  function updateMusicButtons(isPlaying) {
    if (isPlaying) {
      musicPlay.classList.add("hidden");
      musicPause.classList.remove("hidden");
    } else {
      musicPlay.classList.remove("hidden");
      musicPause.classList.add("hidden");
    }
  }

  musicSeek.addEventListener("input", (e) => {
    audio.currentTime = e.target.value;
  });

  // Start paused
  updateMusicButtons(false);

  //when timer finishes, play a short ding:
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

  const originalStart = startTimer;
  startTimer = function () {
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
        // simple notification if permission granted
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Tomato Timer", { body: "Session finished!" });
        } else if (
          "Notification" in window &&
          Notification.permission !== "denied"
        ) {
          Notification.requestPermission().then(() => {});
        } else {
          alert("Session finished!");
        }
      } else {
        updateTimeLabel();
      }
    }, 1000);
  };
})();
