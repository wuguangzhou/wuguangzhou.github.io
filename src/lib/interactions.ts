// ===== Lenis Smooth Scroll =====
export function initLenis() {
  // Lenis will be imported and initialized via a client-side <script>
  // to avoid SSR issues with the npm package
}

// ===== Scroll Progress Bar =====
export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar!.style.width = `${Math.min(progress, 100)}%`;
    requestAnimationFrame(() => {});
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ===== Custom Cursor =====
export function initCustomCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  const hoverTargets = document.querySelectorAll('a, button, .card, [data-cursor-hover]');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  function animate() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursor!.style.left = `${cx}px`;
    cursor!.style.top = `${cy}px`;
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== Scroll Reveal =====
export function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-from-left, .reveal-from-right').forEach(el => {
    observer.observe(el);
  });
}

// ===== Card Spotlight (mousemove light follow) =====
export function initCardSpotlight() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = (card as HTMLElement).getBoundingClientRect();
      (card as HTMLElement).style.setProperty('--mx', `${e.clientX - rect.left}px`);
      (card as HTMLElement).style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}
