"use strict";
const root = document.documentElement;
const themeButton = document.querySelector('#theme-toggle');
let saved;
try { saved = localStorage.getItem('lab6-theme'); } catch (_) {}
const preference = matchMedia('(prefers-color-scheme: dark)');
function applyTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  themeButton.textContent = theme === 'dark' ? 'Гэгээн горим' : 'Бараан горим';
}
applyTheme(['light', 'dark'].includes(saved) ? saved : preference.matches ? 'dark' : 'light');
themeButton.addEventListener('click', () => {
  saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(saved);
  try { localStorage.setItem('lab6-theme', saved); } catch (_) {}
});
preference.addEventListener('change', event => { if (!saved) applyTheme(event.matches ? 'dark' : 'light'); });
document.querySelectorAll('.flip-button').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    const flipped = card.classList.toggle('is-flipped');
    button.setAttribute('aria-pressed', String(flipped));
    button.textContent = flipped ? 'Буцаах ↶' : 'Дэлгэрэнгүй ↻';
    const title = card.querySelector('h3').textContent;
    button.setAttribute('aria-label', title + (flipped ? ': нүүр талд буцах' : ': дэлгэрэнгүйг харах'));
    for (const [selector, hidden] of [['.card-front', flipped], ['.card-back', !flipped]]) {
      const face = card.querySelector(selector);
      face.setAttribute('aria-hidden', String(hidden));
      face.inert = hidden;
    }
  });
});
