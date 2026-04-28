const menuButton = document.querySelector('.menu-button');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const sidebarLinks = document.querySelectorAll('.bookmark-link');
const projectItems = document.querySelectorAll('.project-item');
const projectModalBackdrop = document.querySelector('.project-modal-backdrop');
const projectModalTitle = document.querySelector('#project-modal-title');
const projectModalIntro = document.querySelector('#project-modal-intro');
const projectModalIntroDetail = document.querySelector('#project-modal-intro-detail');
const projectModalClose = document.querySelector('.project-modal-close');
const projectModalGallery = document.querySelector('#project-modal-gallery');
const projectModalLink = document.querySelector('#project-modal-link');

if (projectModalBackdrop) {
  projectModalBackdrop.hidden = true;
}

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

function openProjectModal(title, intro, detail, images, link, linkText) {
  projectModalTitle.textContent = title;
  projectModalIntro.textContent = intro;
  projectModalIntroDetail.textContent = detail;

  projectModalGallery.innerHTML = '';
  if (images.length > 0) {
    images.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${title} 详情图`;
      projectModalGallery.appendChild(img);
    });
    projectModalGallery.hidden = false;
  } else {
    projectModalGallery.hidden = true;
  }

  if (link) {
    projectModalLink.href = link;
    projectModalLink.textContent = linkText || '查看项目链接';
    projectModalLink.hidden = false;
  } else {
    projectModalLink.hidden = true;
  }

  projectModalBackdrop.hidden = false;
}

function closeProjectModal() {
  projectModalBackdrop.hidden = true;
}

projectItems.forEach((item) => {
  const title = item.dataset.projectTitle || '项目';
  const intro = item.dataset.projectIntro || '项目介绍待补充。';
  const detail = item.dataset.projectIntroDetail || '详细介绍待补充。';
  const images = item.dataset.projectImages ? item.dataset.projectImages.split('|').map((v) => v.trim()).filter(Boolean) : [];
  const link = item.dataset.projectLink || '';
  const linkText = item.dataset.projectLinkText || '';

  item.addEventListener('click', () => openProjectModal(title, intro, detail, images, link, linkText));
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectModal(title, intro, detail, images, link, linkText);
    }
  });
});

projectModalClose.addEventListener('click', closeProjectModal);

projectModalBackdrop.addEventListener('click', (event) => {
  if (event.target === projectModalBackdrop) {
    closeProjectModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSidebarState(false);
    closeProjectModal();
  }
});
