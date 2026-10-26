import {
  animate, createTimeline, onScroll, stagger, splitText, svg,
} from './vendor/anime.esm.min.js';
import { blocks } from './data.js';

const $ = (s, root = document) => root.querySelector(s);

/* ---------- Helpers ---------- */
// Timeline sincronizada con el scroll de una sección "sticky".
const scrollTimeline = (target) => createTimeline({
  defaults: { ease: 'linear', duration: 200 },
  autoplay: onScroll({ target, enter: 'top top', leave: 'bottom bottom', sync: .35 }),
});

const counterTween = (tl, el, to, pos, duration = 500) => {
  const o = { v: 0 };
  tl.add(o, {
    v: to, duration, ease: 'out(3)',
    onUpdate: () => { el.textContent = Math.round(o.v); },
  }, pos);
};

/* ---------- HUD ---------- */
const $tc = $('#timecode');
const $progress = $('#progress');
const $scene = $('#scene');
const pad = n => String(n).padStart(2, '0');
const t0 = performance.now();
(function tick() {
  const f = Math.floor((performance.now() - t0) / (1000 / 60));
  const s = Math.floor(f / 60);
  $tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 60)}`;
  requestAnimationFrame(tick);
})();

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  $progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) $scene.textContent = e.target.dataset.scene; });
}, { rootMargin: '-50% 0px -50% 0px' });
document.querySelectorAll('[data-scene]').forEach(el => io.observe(el));

/* ---------- HERO ---------- */
const heroChars = [...document.querySelectorAll('.hero-title .split')]
  .flatMap(el => splitText(el, { words: true, chars: true }).chars);

createTimeline({ defaults: { ease: 'out(4)' } })
  .add('.hero-eyebrow', { opacity: [0, 1], y: [12, 0], duration: 700 }, 200)
  .add('.hero-logo', { opacity: [0, 1], scale: [1.15, 1], filter: ['blur(14px)', 'blur(0px)'], duration: 1400 }, 300)
  .add(heroChars, { opacity: [0, 1], y: ['60%', '0%'], rotate: [8, 0], duration: 900, delay: stagger(18) }, 900)
  .add('.hero-meta span', { opacity: [0, 1], y: [10, 0], duration: 600, delay: stagger(80) }, 1500)
  .add('.scroll-cue', { opacity: [0, 1], duration: 800 }, 2000);

// El logo se aleja al hacer scroll
animate('.hero-inner', {
  opacity: [1, 0], scale: [1, .9], y: [0, -80], ease: 'linear',
  autoplay: onScroll({ target: '.hero', enter: 'top top', leave: 'top bottom', sync: true }),
});

/* ---------- CONCEPTO ---------- */
const conceptWords = splitText('#conceptText', { words: true }).words;
animate(conceptWords, {
  opacity: [.15, 1], ease: 'linear', delay: stagger(40), duration: 300,
  autoplay: onScroll({ target: '.concept', enter: 'bottom top', leave: 'center center', sync: .5 }),
});

/* ---------- TRÍPODES ---------- */
scrollTimeline('#tripodScene')
  .add('#tripodScene .scene-copy > *', { opacity: [0, 1], y: [30, 0], delay: stagger(40) }, 0)
  .add('#tripod', { opacity: [0, 1], y: [120, 0], duration: 250, ease: 'out(2)' }, 0)
  .add(svg.createDrawable('#tripod .leg-up'), { draw: ['0 0', '0 1'], duration: 250 }, 80)
  .add('#tripod .leg-low', { y: [-120, 0], duration: 250, ease: 'inOut(2)' }, 300)
  .add('#tripod .leg-l', { rotate: [0, 22], duration: 260, ease: 'inOut(2)' }, 560)
  .add('#tripod .leg-r', { rotate: [0, -22], duration: 260, ease: 'inOut(2)' }, 560)
  .add('#tripod .leg-back', { rotate: [0, 8], scaleY: [1, .88], duration: 260, ease: 'inOut(2)' }, 560)
  .add('#tripod .column', { y: [70, 0], duration: 220, ease: 'out(2)' }, 820)
  .add(svg.createDrawable('.dim-line line'), { draw: ['0 0', '0 1'], duration: 200 }, 1000)
  .add('.measure-label', { opacity: [0, 1], x: [-14, 0], duration: 150 }, 1150)
  .add('#tripodSecond', { opacity: [0, 1], x: [80, 0], duration: 250, ease: 'out(2)' }, 1300)
  .add('#tripodX2', { opacity: [0, 1], scale: [1.4, 1], duration: 200, ease: 'out(3)' }, 1400)
  .add({}, { duration: 150 }, 1600)
  .init();

/* ---------- CÁMARA ---------- */
const camTl = scrollTimeline('#cameraScene')
  .add('#cameraScene .scene-copy > *', { opacity: [0, 1], y: [30, 0], delay: stagger(40) }, 0)
  .add('.cam-body', { opacity: [0, 1], scale: [.85, 1], duration: 250, ease: 'out(3)' }, 0)
  .add('.lens', { opacity: [0, 1], x: [-40, 0], delay: stagger(30) }, 100)
  .add('.cam-monitor', { opacity: [0, 1], y: [60, 0], duration: 220, ease: 'out(2)' }, 250)
  .add('.l1', { x: 12, duration: 300, ease: 'inOut(2)' }, 500)
  .add('.l2', { x: 34, duration: 300, ease: 'inOut(2)' }, 500)
  .add('.l3', { x: 62, duration: 300, ease: 'inOut(2)' }, 500)
  .add('.l4', { x: 96, duration: 300, ease: 'inOut(2)' }, 500)
  .add('.l5', { x: 122, duration: 300, ease: 'inOut(2)' }, 500)
  .add('.cam-monitor', { y: -24, x: -30, duration: 300, ease: 'inOut(2)' }, 500)
  .add('.cam-sensor', { opacity: [0, 1], x: [60, -70], duration: 300, ease: 'inOut(2)' }, 500)
  .add('.lab', { opacity: [0, 1], y: [14, 0], delay: stagger(60), duration: 180 }, 800);
counterTween(camTl, $('#cRes'), 3840, 300, 600);
counterTween(camTl, $('#cFps'), 60, 400, 600);
camTl.add({}, { duration: 150 }, 1150).init();

/* ---------- LUZ ---------- */
scrollTimeline('#lightScene')
  .add('#lightScene .scene-copy > *', { opacity: [0, 1], y: [30, 0], delay: stagger(40) }, 0)
  .add('.booth', { opacity: [0, 1], y: [50, 0], duration: 250, ease: 'out(2)' }, 0)
  .add('.deck', { opacity: [0, 1], y: [-20, 0], delay: stagger(50) }, 150)
  .add('.lamp', { opacity: [0, 1], x: [-60, 0], duration: 250, ease: 'out(2)' }, 300)
  .add('.beam', { opacity: [0, 1], scale: [.05, 1], duration: 350, ease: 'out(3)' }, 600)
  .add('.beam', { opacity: [1, .55, 1, .8, 1], duration: 250 }, 950)
  .add('.pool', { opacity: [0, 1], duration: 250 }, 800)
  .add({}, { duration: 150 }, 1200)
  .init();

animate('.platter', { strokeDashoffset: [0, -28], duration: 700, ease: 'linear', loop: true });

/* ---------- ÁNGULOS ---------- */
scrollTimeline('#angleScene')
  .add('#angleScene .scene-copy > *', { opacity: [0, 1], y: [30, 0], delay: stagger(40) }, 0)
  .add('.radar circle', { opacity: [0, 1], scale: [.4, 1], delay: stagger(60), duration: 300, ease: 'out(2)' }, 0)
  .add('.booth-top', { opacity: [0, 1], scaleX: [0, 1], duration: 200, ease: 'out(2)' }, 150)
  .add('.lightpos', { opacity: [0, 1], duration: 150 }, 300)
  .add('.cam-a', { opacity: [0, 1], scale: [0, 1], duration: 150, ease: 'out(3)' }, 400)
  .add('.fov-a', { opacity: [0, 1], scale: [0, 1], duration: 220, ease: 'out(2)' }, 480)
  .add('.cam-b', { opacity: [0, 1], scale: [0, 1], duration: 150, ease: 'out(3)' }, 650)
  .add('.fov-b', { opacity: [0, 1], scale: [0, 1], duration: 220, ease: 'out(2)' }, 730)
  .add('.cam-c', { opacity: [0, 1], scale: [0, 1], duration: 150, ease: 'out(3)' }, 900)
  .add('.fov-c', { opacity: [0, 1], scale: [0, 1], duration: 220, ease: 'out(2)' }, 980)
  .add('.cam-legend li', { opacity: [.2, 1], x: [-10, 0], delay: stagger(250), duration: 150 }, 450)
  .add({}, { duration: 150 }, 1200)
  .init();

/* ---------- VINILO ---------- */
const totalTracks = blocks.reduce((n, b) => n + b.tracks.length, 0);
const mainBlocks = blocks.filter(b => !b.cue).length;
const cueCount = blocks.find(b => b.cue).tracks.length;
const isNarrow = matchMedia('(max-width: 860px)').matches;

const recTl = scrollTimeline('#recordScene')
  .add('#recordScene .scene-copy > *', { opacity: [0, 1], y: [30, 0], delay: stagger(40) }, 0)
  .add('.sleeve', { opacity: [0, 1], rotateY: [-75, 0], rotateX: [12, 0], z: [-300, 0], duration: 350, ease: 'out(3)' }, 0)
  .add('.vinyl', { x: ['0%', isNarrow ? '40%' : '52%'], duration: 350, ease: 'inOut(2)' }, 380)
  .add('.sleeve', { x: ['0%', isNarrow ? '-18%' : '-14%'], rotateY: [0, 18], duration: 350, ease: 'inOut(2)' }, 380)
  .add('.vinyl', { rotate: [0, 900], duration: 900, ease: 'inOut(1.5)' }, 380);
counterTween(recTl, $('#cTracks'), totalTracks, 500, 600);
counterTween(recTl, $('#cBlocks'), mainBlocks, 550, 500);
counterTween(recTl, $('#cCue'), cueCount, 600, 500);
recTl.add({}, { duration: 120 }, 1280).init();

/* ---------- TRACKLIST ---------- */
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtTitle = t => esc(t).replace(/(\([^)]*\))/g, '<em>$1</em>');

// Rueda Camelot: anillo exterior B (mayores), interior A (menores); 12 arriba.
const $wheel = $('#camelot');
const NS = 'http://www.w3.org/2000/svg';
const arc = (r0, r1, a0, a1) => {
  const p = (r, a) => `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`;
  return `M${p(r1, a0)} A${r1} ${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`;
};
const segs = {};
for (let n = 1; n <= 12; n++) {
  const mid = (n % 12) * Math.PI / 6;
  const a0 = mid - Math.PI / 12, a1 = mid + Math.PI / 12;
  [['B', 108, 156], ['A', 62, 106]].forEach(([m, r0, r1]) => {
    const key = `${n}${m}`;
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', arc(r0, r1, a0, a1));
    path.setAttribute('class', 'wheel-seg');
    const txt = document.createElementNS(NS, 'text');
    const rm = (r0 + r1) / 2;
    txt.setAttribute('x', (rm * Math.sin(mid)).toFixed(2));
    txt.setAttribute('y', (-rm * Math.cos(mid)).toFixed(2));
    txt.setAttribute('class', 'wheel-txt');
    txt.textContent = key;
    $wheel.append(path, txt);
    segs[key] = { path, txt };
  });
}
const $wc = document.createElementNS(NS, 'text');
$wc.setAttribute('class', 'wheel-center'); $wc.setAttribute('y', '-4');
const $wcs = document.createElementNS(NS, 'text');
$wcs.setAttribute('class', 'wheel-center-sub'); $wcs.setAttribute('y', '20');
$wheel.append($wc, $wcs);

const $tabs = $('#tabs');
const $list = $('#trackList');
blocks.forEach((b, i) => {
  const btn = document.createElement('button');
  btn.className = 'tab';
  btn.setAttribute('role', 'tab');
  btn.innerHTML = `${b.cue ? 'Cue show' : b.id}<small>${b.tracks.length}</small>`;
  btn.addEventListener('click', () => selectBlock(i));
  $tabs.append(btn);
});

function selectBlock(i) {
  const b = blocks[i];
  [...$tabs.children].forEach((t, j) => t.setAttribute('aria-selected', String(i === j)));
  $('#blockName').textContent = b.name;
  $('#blockNote').textContent = b.note;
  $('#blockCount').textContent = `${b.tracks.length} temas`;

  const rows = b.tracks.map(line => line.split('|'));
  $list.innerHTML = rows.map(([key, title], j) => `
    <li class="track" data-key="${key}">
      <span class="t-num">${pad(j + 1)}</span>
      <span class="t-key${key ? '' : ' none'}">${key || '—'}</span>
      <span class="t-title">${fmtTitle(title)}</span>
    </li>`).join('');

  const used = new Set(rows.map(r => r[0]).filter(Boolean));
  Object.entries(segs).forEach(([k, s]) => {
    s.path.classList.toggle('on', used.has(k));
    s.txt.classList.toggle('on', used.has(k));
    s.path.classList.remove('hot');
  });
  $wc.textContent = b.cue ? 'CUE' : b.id;
  $wcs.textContent = used.size ? `${used.size} CLAVES` : 'SIN CLAVES';
  $('#wheelCap').textContent = used.size
    ? 'Claves Camelot usadas en el bloque'
    : 'Bloque de edits / mashups sin clave marcada';

  animate($list.children, {
    opacity: [0, 1], x: [-24, 0], duration: 500, ease: 'out(3)', delay: stagger(18, { start: 50 }),
  });
  animate([...used].map(k => segs[k].path), {
    scale: [.85, 1], duration: 600, ease: 'out(3)', delay: stagger(30),
  });
}

// Resalta la clave en la rueda al pasar por un tema
$list.addEventListener('pointerover', e => {
  const key = e.target.closest('.track')?.dataset.key;
  Object.values(segs).forEach(s => s.path.classList.remove('hot'));
  if (key && segs[key]) segs[key].path.classList.add('hot');
});
$list.addEventListener('pointerleave', () => Object.values(segs).forEach(s => s.path.classList.remove('hot')));

selectBlock(0);

animate('.tl-title', {
  opacity: [0, 1], y: [60, 0], duration: 1000, ease: 'out(4)',
  autoplay: onScroll({ target: '.tracklist', enter: 'bottom top+=100' }),
});

/* ---------- VIDEO SET ---------- */
const $reel = $('.reel-frame');
const $video = $('#reelVideo');
$('#reelPlay').addEventListener('click', () => {
  $video.controls = true;
  $video.play();
});
$video.addEventListener('play', () => $reel.classList.add('playing'));
$video.addEventListener('pause', () => $reel.classList.remove('playing'));
$video.addEventListener('ended', () => $reel.classList.remove('playing'));

createTimeline({
  defaults: { ease: 'out(4)' },
  autoplay: onScroll({ target: '.reel', enter: 'bottom top+=120' }),
})
  .add('.reel-head > *', { opacity: [0, 1], y: [40, 0], duration: 900, delay: stagger(100) }, 0)
  .add('.reel-frame', { opacity: [0, 1], scale: [.92, 1], clipPath: ['inset(12% 20% round 4px)', 'inset(0% 0% round 0px)'], duration: 1400 }, 200);

/* ---------- CONTACTO ---------- */
const contactChars = [...document.querySelectorAll('.contact-title .split')]
  .flatMap(el => splitText(el, { words: true, chars: true }).chars);
createTimeline({
  defaults: { ease: 'out(4)' },
  autoplay: onScroll({ target: '.contact', enter: 'bottom top+=150' }),
})
  .add(contactChars, { opacity: [0, 1], y: ['80%', '0%'], duration: 800, delay: stagger(22) }, 0)
  .add('.contact-card', { opacity: [0, 1], y: [30, 0], duration: 700, delay: stagger(120) }, 300)
  .add('.footer-logo', { opacity: [0, .9], scale: [.8, 1], duration: 900 }, 600);

