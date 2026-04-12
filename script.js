/* BOOT — percentage counter */
const boot = document.getElementById('boot');
const main = document.getElementById('main');
const bpf = document.getElementById('bpf');
const bpct = document.getElementById('bpct');
const bskip = document.getElementById('bskip');
let hasLaunched = false;

function launch() {
  if (hasLaunched || !boot || !main) return;
  hasLaunched = true;
  boot.classList.add('gone');
  setTimeout(() => boot.style.display = 'none', 850);
  main.classList.add('show');
  // Trigger the typing effect after boot transition completes.
  setTimeout(typeTerminal, 1000);
}

if (bpf) {
  setTimeout(() => {
    bpf.style.width = '100%';
  }, 80);
}

/* Count percentage */
let pct = 0;
const pctTimer = setInterval(() => {
  if (!bpct) {
    clearInterval(pctTimer);
    launch();
    return;
  }

  pct = Math.min(pct + 1, 100);
  bpct.textContent = pct + '%';
  if (pct >= 100) {
    clearInterval(pctTimer);
    setTimeout(launch, 300);
  }
}, 54);

if (bskip) {
  bskip.addEventListener('click', () => {
    clearInterval(pctTimer);
    launch();
  });
}

/* SCROLL REVEAL */
const io = new IntersectionObserver(entries => {
  entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), i * 80); io.unobserve(e.target); } });
}, { threshold: 0.07 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* COUNT UP */
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

/* NAV scroll shadow + active */
const nav = document.getElementById('nav');
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
let scrollTicking = false;

function updateNavState() {
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

/* TERMINAL TYPING EFFECT */
const terminalLines = [
  "Transforming complex requirements into elegant, fast,",
  "and future-proof web applications with cutting-edge tech."
];
let currentLineIndex = 0;
let currentCharIndex = 0;
const terminalElement = document.getElementById('terminal-text');

function typeTerminal() {
  if (!terminalElement) return;

  if (currentLineIndex < terminalLines.length) {
    if (currentCharIndex < terminalLines[currentLineIndex].length) {
      terminalElement.textContent += terminalLines[currentLineIndex].charAt(currentCharIndex);
      currentCharIndex++;
      setTimeout(typeTerminal, 40);
    } else {
      terminalElement.appendChild(document.createElement('br'));
      currentLineIndex++;
      currentCharIndex = 0;
      setTimeout(typeTerminal, 350);
    }
  }
}
