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
  const audio = document.getElementById("audioPlayer");
  const trackSelect = document.getElementById("trackSelect");
  const musicPlay = document.getElementById("musicPlay");
  const musicPause = document.getElementById("musicPause");
  const musicSeek = document.getElementById("musicSeek");
  const musicPrev = document.getElementById("musicPrev");
  const musicNext = document.getElementById("musicNext");
  const musicTime = document.getElementById("musicTime");
  const vinyl = document.getElementById("vinyl");
  const lofiToggle = document.getElementById("lofiToggle");
  const musicBox = document.querySelector(".musicBox");
  const originalMusicHTML = musicBox.innerHTML;

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

    // update totalSeconds for current mode
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
    "https://archive.org/details/light-music-3hrs/Classical+Music+(2hrs).mp3",
    "https://archive.org/details/light-music-3hrs/Light+Music+(3hrs).mp3",
    "https://archive.org/details/light-music-3hrs/Ocean+Breeze+(2hrs).mp3",
  ];

  trackSelect.innerHTML = "";

  tracks.forEach((track) => {
    const opt = document.createElement("option");
    opt.value = track;

    let name = track.split("/").pop().replace(".mp3", "");
    name = name.replace(/\+/g, " ").replace(/\%28/g, "(").replace(/\%29/g, ")");

    opt.textContent = name;
    trackSelect.appendChild(opt);
  });

  let currentTrackIndex = 0;

  function loadTrack(index) {
    currentTrackIndex = index;
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

  let isLofi = false;

  lofiToggle.addEventListener("click", () => {
    if (!isLofi) {
      musicBox.innerHTML = `
      <div class="w-full flex flex-col items-center">
        <div class="w-full h-50 rounded-xl overflow-hidden shadow">
          <iframe
            width="100%"
            height="100%"
            style="border-radius: 12px"
            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1"
            title="lofi hip hop radio - beats to relax/study to"
            frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    `;
      lofiToggle.textContent = "Back to Playlist";
    } else {
      musicBox.innerHTML = originalMusicHTML;
      lofiToggle.textContent = "Study with Lofi?";
    }

    isLofi = !isLofi;
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
