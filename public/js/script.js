document.addEventListener('DOMContentLoaded', (event) => {
  const navbarLinks = document.querySelectorAll('.navbar-link');

  navbarLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetHref = event.target.getAttribute('onclick').match(/window\.location\.href='([^']+)'/)[1];
      window.location.href = targetHref;
    });
  });

  const navToggleBtn = document.querySelector('[data-nav-toggler]');
  const navbar = document.querySelector('[data-navbar]');

  navToggleBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });
});
