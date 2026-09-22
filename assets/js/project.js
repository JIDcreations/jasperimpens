(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Videos play while they are on screen and rest when they are not.
  var figures = Array.prototype.slice.call(document.querySelectorAll('[data-pj-video]'));
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target.querySelector('video');
      if (!v || v.dataset.userPaused === '1') return;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
  }, { threshold: 0.35 }) : null;

  figures.forEach(function (fig) {
    var v = fig.querySelector('video');
    var btn = fig.querySelector('[data-pj-toggle]');
    var label = fig.querySelector('[data-pj-toggle-label]');
    if (reduce) { v.dataset.userPaused = '1'; if (label) label.textContent = 'Play'; if (btn) btn.setAttribute('aria-label', 'Play video'); }
    else if (io) io.observe(fig);
    if (btn) btn.addEventListener('click', function () {
      if (v.paused) {
        v.dataset.userPaused = '0';
        var p = v.play(); if (p && p.catch) p.catch(function () {});
        label.textContent = 'Pause'; btn.setAttribute('aria-label', 'Pause video');
      } else {
        v.dataset.userPaused = '1'; v.pause();
        label.textContent = 'Play'; btn.setAttribute('aria-label', 'Play video');
      }
    });
  });

  // Floating "visit the live site" pill: shown once the hero button has scrolled
  // away, tucked away again when the next-project block or the footer arrives.
  var dock = document.querySelector('[data-pj-dock]');
  var visit = document.querySelector('.pj-visit');
  if (dock && visit && 'IntersectionObserver' in window) {
    var heroGone = false;
    var endSeen = false;
    var ends = Array.prototype.slice.call(document.querySelectorAll('.pj-next, .closing-footer'));
    var shown = {};
    var update = function () { dock.classList.toggle('is-shown', heroGone && !endSeen); };
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // only "gone" once it has left through the top, not before it has been reached
        heroGone = !e.isIntersecting && e.boundingClientRect.top < 0;
      });
      update();
    }).observe(visit);
    var endIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { shown[ends.indexOf(e.target)] = e.isIntersecting; });
      endSeen = Object.keys(shown).some(function (k) { return shown[k]; });
      update();
    });
    ends.forEach(function (el) { endIo.observe(el); });
  }

  // Click a screen to see it large.
  var box = document.querySelector('[data-pj-lightbox]');
  if (box) {
    var big = box.querySelector('img');
    Array.prototype.slice.call(document.querySelectorAll('[data-pj-open]')).forEach(function (b) {
      b.addEventListener('click', function () {
        var img = b.querySelector('img');
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        if (box.showModal) box.showModal(); else box.setAttribute('open', '');
      });
    });
    box.addEventListener('click', function (e) { if (e.target === box || e.target === big) box.close(); });
  }
})();
