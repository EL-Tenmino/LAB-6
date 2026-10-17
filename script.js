"use strict";

const root = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
const themeKey = "tengis-lab6-theme";
let savedTheme;
try {
  savedTheme = localStorage.getItem(themeKey);
} catch (_) {
  // Хадгалалт хаалттай үед ч горим солих боломжтой.
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute("aria-pressed", String(theme === "dark"));
  themeButton.textContent = theme === "dark" ? "Гэгээн горим" : "Бараан горим";
}

// Анхны нээлт гэгээн; хэрэглэгчийн сонголтыг дараа нь санана.
applyTheme(savedTheme === "dark" ? "dark" : "light");
themeButton.hidden = false;
themeButton.addEventListener("click", () => {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  try { localStorage.setItem(themeKey, theme); } catch (_) {}
});

// Нүүр, арын харагдах байдлыг дэлгэц уншигчид мөн шинэчилнэ.
function setFlipped(card, flipped) {
  card.classList.toggle("is-flipped", flipped);
  const button = card.querySelector(".flip-button");
  const title = card.querySelector("h3").textContent;
  button.setAttribute("aria-pressed", String(flipped));
  button.textContent = flipped ? "Буцаах ↶" : "Мэдээлэл харах ↻";
  button.setAttribute("aria-label", `${title}: ${flipped ? "нүүр талд буцах" : "зургийн мэдээлэл харах"}`);
  [[".card-front", flipped], [".card-back", !flipped]].forEach(([selector, hidden]) => {
    const face = card.querySelector(selector);
    face.setAttribute("aria-hidden", String(hidden));
    face.inert = hidden;
  });
}

document.querySelectorAll(".card").forEach(card => {
  const button = card.querySelector(".flip-button");
  setFlipped(card, false);
  button.hidden = false;
  button.addEventListener("click", () => {
    setFlipped(card, !card.classList.contains("is-flipped"));
  });
  card.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      setFlipped(card, false);
      button.focus();
    }
  });
});
root.classList.add("interactive");

// Зөвхөн эхний харагдах зургуудыг хүлээнэ. Lazy зургууд,
// гадаад iframe нь loader-ийг удаан хүлээлгэхгүй.
const loader = document.querySelector("#loader");
const initialImages = [...document.querySelectorAll('.card img:not([loading="lazy"])')];
const pending = initialImages.filter(image => !image.complete);
let finished = false;
let fallback;
function finishGallery() {
  if (finished) return;
  finished = true;
  clearTimeout(fallback);
  loader.hidden = true;
  root.classList.add("gallery-ready");
}
if (pending.length === 0) {
  finishGallery();
} else {
  loader.hidden = false;
  let remaining = pending.length;
  pending.forEach(image => {
    const done = () => { if (--remaining === 0) finishGallery(); };
    image.addEventListener("load", done, { once: true });
    image.addEventListener("error", done, { once: true });
  });
  fallback = setTimeout(finishGallery, 4000);
}
