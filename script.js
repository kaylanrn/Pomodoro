document.addEventListener("DOMContentLoaded", () => {
  const pomodoroBtn = document.getElementById("pomodoroBtn");
  const modal = document.getElementById("pomodoroModal");
  const closeModal = document.getElementById("closeModal");

  const customBtn = document.getElementById("customBtn");
  const customModal = document.getElementById("customModal");
  const saveCustomTimer = document.getElementById("saveCustomTimer");
  const closeCustomModal = document.getElementById("closeCustomModal");
  const presetBtns = document.querySelectorAll(".presetBtn");
  const pomodoroInput = document.getElementById("pomodoroInput");
  const shortBreakInput = document.getElementById("shortBreakInput");
  const longBreakInput = document.getElementById("longBreakInput");
  const customImage = document.querySelector(".customImage img");

  const timerTitle = document.getElementById("timerTitle");
  const circle = document.getElementById("progressCircle");
  const timeLabel = document.getElementById("timeLabel");
  const playPauseBtn = document.getElementById("playPause");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const restartBtn = document.getElementById("restart");

  const todoInput = document.getElementById("todoInput");
  const addTodoBtn = document.getElementById("addTodo");
  const todoList = document.getElementById("todoList");

  const vinyl = document.getElementById("vinyl");
  const audio = document.getElementById("audioPlayer");
  const trackSelect = document.getElementById("trackSelect");
  const musicPlay = document.getElementById("musicPlay");
  const musicPause = document.getElementById("musicPause");
  const musicSeek = document.getElementById("musicSeek");
  const musicPrev = document.getElementById("musicPrev");
  const musicNext = document.getElementById("musicNext");
  const musicTime = document.getElementById("musicTime");
  const lofiToggle = document.getElementById("lofiToggle");

  const timerModal = document.getElementById("timerModal");
  const timerModalMessage = document.getElementById("timerModalMessage");
  const closeTimerModal = document.getElementById("closeTimerModal");

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

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
        remaining = 0;
        updateTimeLabel();
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");

        timerFinished();
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

  let currentMode = "Pomodoro";

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = btn.dataset.type || btn.textContent.trim();
      currentMode = preset;
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

    totalSeconds = PRESETS[currentMode];
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

  /*  MUSIC PLAYER  */
  const tracks = [
    "https://archive.org/download/light-music-3hrs/Classical%20Music%20%282hrs%29.mp3",
    "https://archive.org/download/light-music-3hrs/Ocean%20Breeze%20%282hrs%29.mp3",
    "https://archive.org/download/light-music-3hrs/Light%20Music%20%283hrs%29.mp3",
  ];

  trackSelect.innerHTML = "";
  tracks.forEach((track) => {
    const opt = document.createElement("option");
    opt.value = track;
    const name = decodeURIComponent(track.split("/").pop().replace(".mp3", ""));
    opt.textContent = name;
    trackSelect.appendChild(opt);
  });

  let currentTrackIndex = 0;

  function loadTrack(index) {
    currentTrackIndex = index;

    trackSelect.selectedIndex = index;

    audio.src = tracks[index];
    audio.load();
    audio
      .play()
      .then(() => {
        musicPlay.classList.add("hidden");
        musicPause.classList.remove("hidden");
        vinyl.classList.add("vinyl-spin");
      })
      .catch((err) => console.warn("Playback blocked:", err));
  }

  musicPlay.addEventListener("click", () => {
    if (!audio.src) loadTrack(currentTrackIndex);
    else {
      audio.play();
      vinyl.classList.add("vinyl-spin");
    }
    musicPlay.classList.add("hidden");
    musicPause.classList.remove("hidden");
  });

  musicPause.addEventListener("click", () => {
    audio.pause();
    musicPause.classList.add("hidden");
    musicPlay.classList.remove("hidden");
    vinyl.classList.remove("vinyl-spin");
  });

  musicPrev.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
  });

  musicNext.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
  });

  trackSelect.addEventListener("change", () => {
    loadTrack(trackSelect.selectedIndex);
  });

  audio.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    musicSeek.value = (audio.currentTime / audio.duration) * 100;

    const hours = Math.floor(audio.currentTime / 3600);
    const mins = Math.floor((audio.currentTime % 3600) / 60);
    const secs = Math.floor(audio.currentTime % 60)
      .toString()
      .padStart(2, "0");

    if (audio.duration >= 3600) {
      musicTime.textContent = `${hours}:${mins
        .toString()
        .padStart(2, "0")}:${secs}`;
    } else {
      musicTime.textContent = `${mins}:${secs}`;
    }
  });

  musicSeek.addEventListener("input", () => {
    if (audio.duration) {
      audio.currentTime = (musicSeek.value / 100) * audio.duration;
    }
  });

  /*  LOFI TOGGLE  */
  let isLofi = false;
  const playlistBox = document.getElementById("playlistBox");
  const lofiBox = document.getElementById("lofiBox");
  const lofiFrame = document.getElementById("lofiFrame");

  lofiToggle.addEventListener("click", () => {
    if (!isLofi) {
      audio.pause();
      vinyl.classList.remove("vinyl-spin");
      musicPlay.classList.remove("hidden");
      musicPause.classList.add("hidden");

      playlistBox.classList.add("hidden");
      lofiBox.classList.remove("hidden");

      lofiFrame.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );

      lofiToggle.textContent = "Back to Playlist";
    } else {
      lofiFrame.contentWindow.postMessage(
        '{"event":"command","func":"stopVideo","args":""}',
        "*"
      );

      lofiBox.classList.add("hidden");
      playlistBox.classList.remove("hidden");

      lofiToggle.textContent = "Study with Lofi?";
    }

    isLofi = !isLofi;
  });

  /*  TIMER FINISH  */
  let dingAudio = null;
  let musicWasPlaying = false;

  function playLongDing() {
    dingAudio = new Audio("assets/chime.mp3");
    dingAudio.loop = true;
    dingAudio.volume = 0.4;
    dingAudio.play().catch((err) => console.warn("Ding blocked:", err));
  }

  function stopLongDing() {
    if (dingAudio) {
      dingAudio.pause();
      dingAudio.currentTime = 0;
      dingAudio = null;
    }
  }

  function pauseLofi() {
    const lofiFrame = document.querySelector("iframe");
    if (lofiFrame && lofiFrame.src.includes("youtube.com")) {
      lofiFrame.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    }
  }

  function resumeLofi() {
    const lofiFrame = document.querySelector("iframe");
    if (lofiFrame && lofiFrame.src.includes("youtube.com")) {
      lofiFrame.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
    }
  }

  function showTimerModal(msg) {
    const modal = document.getElementById("timerModal");
    const msgEl = document.getElementById("timerModalMessage");
    const closeBtn = document.getElementById("closeTimerModal");
    const pomodoroGif = document.getElementById("pomodoroGif");
    const breakGif = document.getElementById("breakGif");

    msgEl.textContent = msg;

    pomodoroGif.classList.add("hidden");
    breakGif.classList.add("hidden");

    if (currentMode === "Pomodoro") {
      pomodoroGif.classList.remove("hidden");
    } else {
      breakGif.classList.remove("hidden");
    }

    modal.classList.remove("hidden");

    if (!audio.paused) {
      musicWasPlaying = true;
      audio.pause();
    } else {
      musicWasPlaying = false;
    }
    pauseLofi();

    playLongDing();

    closeBtn.onclick = () => {
      stopLongDing();
      modal.classList.add("hidden");

      if (musicWasPlaying) {
        audio.play().catch(() => {});
      } else {
        resumeLofi();
      }

      totalSeconds = PRESETS[currentMode];
      remaining = totalSeconds;
      updateTimeLabel();
      setProgress(0);
    };
  }

  function timerFinished() {
    const messages = {
      Pomodoro: "Break Time!",
      "Short Break": "Back to work!",
      "Long Break": "Back to work!",
    };
    const msg = messages[currentMode] || "Time's up!";
    showTimerModal(msg);
  }

  updateTimeLabel();
});
