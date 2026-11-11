// Sai Teja & Kreethna — invitation interactions
const eventDate = new Date(2026, 10, 11, 0, 0, 0); // Local date: 11 November 2026
const $ = (id) => document.getElementById(id);

function updateCountdown() {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  if (diff <= 0) {
    $("days").textContent = "00";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";
    $("countdownNote").textContent = now.toDateString() === eventDate.toDateString()
      ? "Today is the day — let the celebration begin!"
      : "A beautiful day to remember. Here's to forever.";
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  $("days").textContent = String(days).padStart(2, "0");
  $("hours").textContent = String(hours).padStart(2, "0");
  $("minutes").textContent = String(minutes).padStart(2, "0");
  $("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Original browser-generated soft instrumental motif. No copyrighted recording is bundled.
// Browsers require a user gesture before audio can play.
let audioContext;
let musicTimer;
let musicStep = 0;
let musicOn = false;
const notes = [261.63, 329.63, 392.00, 329.63, 293.66, 349.23, 440.00, 349.23];
function playNote(frequency, start, duration, volume) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}
function musicTick() {
  if (!musicOn) return;
  const now = audioContext.currentTime;
  const note = notes[musicStep % notes.length];
  playNote(note, now, 1.25, 0.055);
  if (musicStep % 2 === 0) playNote(note / 2, now, 1.7, 0.025);
  musicStep++;
}
async function toggleMusic() {
  const button = $("musicToggle");
  if (!musicOn) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      $("musicLabel").textContent = "Audio unavailable";
      return;
    }
    audioContext = audioContext || new AudioCtx();
    await audioContext.resume();
    musicOn = true;
    musicTick();
    musicTimer = setInterval(musicTick, 700);
    button.classList.add("playing");
    button.setAttribute("aria-pressed", "true");
    $("musicLabel").textContent = "Pause music";
  } else {
    musicOn = false;
    clearInterval(musicTimer);
    if (audioContext) await audioContext.suspend();
    button.classList.remove("playing");
    button.setAttribute("aria-pressed", "false");
    $("musicLabel").textContent = "Play music";
  }
}
$("musicToggle").addEventListener("click", toggleMusic);
