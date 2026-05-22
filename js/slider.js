'use strict';

let currentSlide = 0;
const totalSlides = document.querySelectorAll('.slide').length;
let sliderInterval;

function goSlide(idx) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  dots[currentSlide].setAttribute('aria-selected', 'false');

  currentSlide = idx;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  dots[currentSlide].setAttribute('aria-selected', 'true');
}

function nextSlide() {
  goSlide((currentSlide + 1) % totalSlides);
}

sliderInterval = setInterval(nextSlide, 10000);

document.querySelector('.slider-dots')?.addEventListener('click', (e) => {
  const dot = e.target.closest('.dot');
  if (!dot) return;
  const idx = Number(dot.dataset.slide);
  clearInterval(sliderInterval);
  goSlide(idx);
  sliderInterval = setInterval(nextSlide, 10000);
});