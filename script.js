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
