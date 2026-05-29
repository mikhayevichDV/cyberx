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
  function render() {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }
  function go(i) { idx = (i + slides.length) % slides.length; render(); restart(); }
  function restart() { clearInterval(timer); timer = setInterval(() => go(idx + 1), 7000); }
  carousel.querySelector('.carousel__nav--next').addEventListener('click', () => go(idx + 1));
  carousel.querySelector('.carousel__nav--prev').addEventListener('click', () => go(idx - 1));
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', restart);
  render();
  restart();
}

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
