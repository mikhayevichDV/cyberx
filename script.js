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
  const slides = [...carousel.querySelectorAll('.slide')];
  const dotsWrap = carousel.querySelector('.carousel__dots');
  let idx = 0, timer;
  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel__dot';
    d.setAttribute('aria-label', `Слайд ${i + 1}`);
    d.addEventListener('click', () => go(i));
    dotsWrap.appendChild(d);
    return d;
  });
  function offsetFor(i) {
    const vw = carousel.clientWidth;
    const slideW = slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 22;
    return (vw - slideW) / 2 - i * (slideW + gap);
  }
  function render() {
    track.style.transition = '';
    track.style.transform = `translateX(${offsetFor(idx)}px)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }
  function go(i) { idx = (i + slides.length) % slides.length; render(); restart(); }
  function restart() { clearInterval(timer); timer = setInterval(() => go(idx + 1), 7000); }
  carousel.querySelector('.carousel__nav--next').addEventListener('click', () => go(idx + 1));
  carousel.querySelector('.carousel__nav--prev').addEventListener('click', () => go(idx - 1));
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => { if (!dragging) restart(); });
  window.addEventListener('resize', render);

  // ===== Перетаскивание мышью / пальцем =====
  let dragging = false, startX = 0, startOffset = 0, moved = 0;
  track.addEventListener('pointerdown', (e) => {
    dragging = true; startX = e.clientX; startOffset = offsetFor(idx); moved = 0;
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
    const threshold = slides[0].offsetWidth * 0.15;
    if (moved < -threshold) go(idx + 1);
    else if (moved > threshold) go(idx - 1);
    else { render(); restart(); }
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  render();
  restart();
}

// ===== Клик по прайс-листу → блок бронирования =====
const bookingSection = document.getElementById('booking');
document.querySelectorAll('#pricing .ptable').forEach((table) => {
  table.style.cursor = 'pointer';
  table.setAttribute('title', 'Забронировать');
  table.addEventListener('click', () => {
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
