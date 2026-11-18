(function () {
  var nav = document.querySelector('nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 10); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Stagger grid children
  document.querySelectorAll('.features, .pricing-cards').forEach(function (grid) {
    Array.prototype.forEach.call(grid.children, function (c, i) {
      c.style.setProperty('--d', (i * 70) + 'ms');
    });
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll(
    '.feature-card, .pricing-card, ' +
    'section > .section-label, section > h2, section > p'
  );
  targets.forEach(function (el) { el.classList.add('pre-reveal'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();
