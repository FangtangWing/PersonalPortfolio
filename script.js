const menuButton = document.querySelector('.menu-button');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const sidebarLinks = document.querySelectorAll('.bookmark-link');

function setSidebarState(isOpen) {
  sidebar.classList.toggle('is-open', isOpen);
  overlay.classList.toggle('is-visible', isOpen);
  overlay.hidden = !isOpen;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  sidebar.setAttribute('aria-hidden', String(!isOpen));
}

menuButton.addEventListener('click', () => {
  const isOpen = !sidebar.classList.contains('is-open');
  setSidebarState(isOpen);
});

overlay.addEventListener('click', () => setSidebarState(false));

sidebarLinks.forEach((link) => {
  link.addEventListener('click', () => setSidebarState(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSidebarState(false);
  }
});
