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

// Android waitlist form
(function () {
  var form = document.getElementById('waitlist-form');
  if (!form) return;
  var input = document.getElementById('waitlist-email');
  var button = document.getElementById('waitlist-submit');
  var status = document.getElementById('waitlist-status');
  var countEl = document.getElementById('waitlist-count');

  // Signup counter: purely decorative, so any failure just leaves it hidden.
  function refreshCount() {
    fetch('https://hybrid-api-l3mc2bddna-uc.a.run.app/v1/android-waitlist/count')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.count > 0) {
          countEl.textContent = d.count + (d.count === 1 ? ' person waiting' : ' people waiting');
          countEl.hidden = false;
        }
      })
      .catch(function () {});
  }
  refreshCount();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (input.value || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
      status.textContent = 'That doesn’t look like an email address.';
      status.className = 'waitlist-status err';
      return;
    }
    button.disabled = true;
    status.textContent = '';
    status.className = 'waitlist-status';
    fetch('https://hybrid-api-l3mc2bddna-uc.a.run.app/v1/android-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    }).then(function (r) {
      if (!r.ok) throw new Error('bad status ' + r.status);
      status.textContent = 'You’re on the list. We’ll email you when Android ships.';
      status.className = 'waitlist-status ok';
      input.value = '';
      refreshCount();
    }).catch(function () {
      status.textContent = 'Something went wrong. Please try again in a minute.';
      status.className = 'waitlist-status err';
      button.disabled = false;
    });
  });
})();
