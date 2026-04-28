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

// 点赞按钮 — 乐观计数 + 礼花效果
(function () {
  const BASE = 'https://api.counterapi.dev/v1/fangtangwing-portfolio/page-likes-v1';

  const btn = document.getElementById('likeBtn');
  const countEl = document.getElementById('likeCount');

  if (!btn || !countEl) return;

  let localCount = 0;

  // 读取当前计数（带尾斜杠避免 301 重定向触发 CORS 问题）
  fetch(`${BASE}/`, { redirect: 'follow' })
    .then((r) => r.json())
    .then((data) => {
      if (typeof data.count === 'number') {
        localCount = data.count;
        countEl.textContent = localCount;
      }
    })
    .catch(() => {
      countEl.textContent = '0';
    });

  // 礼花粒子
  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const colors = ['#caa56a', '#f4f1ea', '#e8c97a', '#fff5d6', '#d4a853', '#ffffff'];
    const particles = Array.from({ length: 80 }, () => {
      const rect = btn.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: Math.random() * -16 - 4,
        size: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.3,
      };
    });

    let frame;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.vy += 0.55;
        p.y += p.vy;
        p.alpha -= 0.022;
        p.rot += p.rotV;
        if (p.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      });
      if (particles.some((p) => p.alpha > 0)) {
        frame = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(frame);
        canvas.remove();
      }
    }
    draw();
  }

  btn.addEventListener('click', () => {
    // 立即乐观更新
    localCount += 1;
    countEl.textContent = localCount;
    btn.classList.add('liked');
    launchConfetti();

    // 异步同步服务器，失败不回退（体验优先）
    fetch(`${BASE}/up`).catch(() => {});
  });
})();
