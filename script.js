// ===== Mobile nav =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  nav.classList.toggle('open');
  burger.classList.toggle('active');
});
nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => nav.classList.remove('open'))
);

// ===== Логотип → наверх =====
document.querySelectorAll('.header__logo, .footer__logo').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  });
});

// ===== Карусель галереи (автопрокрутка раз в 7 сек) =====
const carousel = document.getElementById('gallery-carousel');
if (carousel) {
  const track = carousel.querySelector('.carousel__track');
  const dotsWrap = carousel.querySelector('.carousel__dots');
  const real = [...track.children];
  const n = real.length;
  let timer, dragging = false, startX = 0, startOffset = 0, moved = 0;

  // Клоны для бесшовного зацикливания: [клон последнего, 0..n-1, клон первого]
  const firstClone = real[0].cloneNode(true);
  const lastClone = real[n - 1].cloneNode(true);
  firstClone.classList.remove('is-active');
  lastClone.classList.remove('is-active');
  track.insertBefore(lastClone, real[0]);
  track.appendChild(firstClone);
  const slides = [...track.children]; // n + 2
  let pos = 1; // реальный первый слайд

  const dots = real.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel__dot';
    d.setAttribute('aria-label', `Слайд ${i + 1}`);
    d.addEventListener('click', () => move(i + 1));
    dotsWrap.appendChild(d);
    return d;
  });

  function realIndex() {
    if (pos === 0) return n - 1;
    if (pos === n + 1) return 0;
    return pos - 1;
  }
  function offsetFor(p) {
    const vw = carousel.clientWidth;
    const slideW = slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 22;
    return (vw - slideW) / 2 - p * (slideW + gap);
  }
  function paint() {
    track.style.transform = `translateX(${offsetFor(pos)}px)`;
    const ri = realIndex();
    slides.forEach((s, i) => s.classList.toggle('is-active', i === pos));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === ri));
  }
  function move(toPos) { pos = toPos; track.style.transition = ''; paint(); restart(); }
  function next() { move(pos + 1); }
  function prev() { move(pos - 1); }

  // Незаметный «перескок» с клона на настоящий слайд после доезда
  track.addEventListener('transitionend', (e) => {
    if (e.target !== track || e.propertyName !== 'transform') return;
    if (pos !== n + 1 && pos !== 0) return;
    pos = pos === n + 1 ? 1 : n;
    track.style.transition = 'none';
    paint();
    void track.offsetWidth; // форсируем reflow, чтобы снять анимацию
    track.style.transition = '';
  });

  function restart() { clearInterval(timer); timer = setInterval(next, 7000); }

  carousel.querySelector('.carousel__nav--next').addEventListener('click', next);
  carousel.querySelector('.carousel__nav--prev').addEventListener('click', prev);
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => { if (!dragging) restart(); });
  window.addEventListener('resize', () => {
    track.style.transition = 'none';
    paint();
    requestAnimationFrame(() => { track.style.transition = ''; });
  });

  // ===== Перетаскивание мышью / пальцем =====
  track.addEventListener('pointerdown', (e) => {
    dragging = true; startX = e.clientX; startOffset = offsetFor(pos); moved = 0;
    track.style.transition = 'none';
    clearInterval(timer);
    carousel.classList.add('is-grabbing');
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    moved = e.clientX - startX;
    track.style.transform = `translateX(${startOffset + moved}px)`;
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    carousel.classList.remove('is-grabbing');
    track.style.transition = '';
    const threshold = slides[0].offsetWidth * 0.15;
    if (moved < -threshold) next();
    else if (moved > threshold) prev();
    else { paint(); restart(); }
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  paint();
  restart();
}

// ===== Клик по ячейке-кнопке прайса → блок бронирования =====
const bookingSection = document.getElementById('booking');
document.querySelectorAll('#pricing .prow b, #pricing .tvrent__cell').forEach((cell) => {
  cell.style.cursor = 'pointer';
  cell.setAttribute('title', 'Забронировать');
  cell.addEventListener('click', () => {
    if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== Header shadow on scroll =====
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll);
onScroll();

// ===== Booking form (optional) =====
const form = document.getElementById('bookingForm');
if (form) {
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (note) note.hidden = false;
    form.querySelectorAll('input, select').forEach((el) => {
      if (el.type !== 'submit') el.value = '';
    });
  });
}

// ===== Lazy background images (graceful fallback to gradient if missing) =====
document.querySelectorAll('[data-img]').forEach((el) => {
  const src = el.dataset.img;
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url("${src}")`;
    el.classList.add('has-img');
  };
  img.src = src;
});

// ===== Scroll reveal =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
}
