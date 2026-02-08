AOS.init({
  duration: 900,
  once: true
});

document.querySelector('.contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Благодаря! Запитването беше изпратено успешно.');
  this.reset();
});

