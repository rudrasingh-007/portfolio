/*
  Portfolio behavior script.
  Handles scroll-based reveal effects, animated counters, nav state tracking,
  mobile menu toggling, and the looping terminal typing line in the hero.
*/

/* Scroll reveal observer: fades sections in as they enter the viewport. */
const io = new IntersectionObserver(entries => {
  entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), i * 80); io.unobserve(e.target); } });
}, { threshold: 0.07 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* Count-up observer: animates stats once they become visible. */
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    let n = 0; const inc = target / 75;
    const t = setInterval(() => { n = Math.min(n + inc, target); el.textContent = Math.round(n) + '×'; if (n >= target) clearInterval(t); }, 16);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* Nav tracker: adds the scroll shadow and highlights the active section link. */
const nav = document.getElementById('nav');
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
let scrollTicking = false;

function updateNavState() {
  /* Keeps the nav state in sync with the current scroll position. */
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  if (!navLinks.length || !sections.length) return;

  let currentId = '';
  for (const section of sections) {
    if (window.scrollY >= section.offsetTop - 180) {
      currentId = section.id;
    }
  }

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
  });
}

window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateNavState();
    scrollTicking = false;
  });
}, { passive: true });

updateNavState();

/* Burger menu toggle: opens and closes the mobile nav drawer. */
const burger = document.getElementById('navBurger');
const navLinksEl = document.querySelector('.nav-links');
if (burger && navLinksEl) {
  burger.addEventListener('click', () => navLinksEl.classList.toggle('open'));
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navLinksEl) {
      navLinksEl.classList.remove('open');
    }
  });
});

/* Terminal typing effect: loops the hero subtitle copy character by character. */
const terminalLines = [
  "Breaking systems to understand them. Securing them to protect them.",
  "Triage, threat hunting, privacy auditing — automated."
];
let currentLineIndex = 0;
let currentCharIndex = 0;
const terminalElement = document.getElementById('terminal-text');

/* Renders the looping terminal line one character at a time for the hero intro. */
function typeTerminal() {
  if (!terminalElement) return;

  if (currentLineIndex >= terminalLines.length) {
    setTimeout(() => {
      terminalElement.textContent = '';
      currentLineIndex = 0;
      currentCharIndex = 0;
      typeTerminal();
    }, 1500);
    return;
  }

  if (currentLineIndex < terminalLines.length) {
    if (currentCharIndex < terminalLines[currentLineIndex].length) {
      terminalElement.textContent += terminalLines[currentLineIndex].charAt(currentCharIndex);
      currentCharIndex++;
      setTimeout(typeTerminal, 40);
    } else {
      terminalElement.appendChild(document.createElement('br'));
      currentLineIndex++;
      currentCharIndex = 0;
      if (currentLineIndex >= terminalLines.length) {
        setTimeout(() => {
          terminalElement.textContent = '';
          currentLineIndex = 0;
          currentCharIndex = 0;
          typeTerminal();
        }, 1500);
      } else {
        setTimeout(typeTerminal, 350);
      }
    }
  }
}

typeTerminal();
