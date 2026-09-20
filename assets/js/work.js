(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.wk-card'));
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.wk-filter'));
  var empty = document.querySelector('[data-wk-empty]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var valid = buttons.map(function (b) { return b.getAttribute('data-filter'); });

  // The first visible card is the wide one; when the rest would leave an odd
  // one out, the last visible card goes wide too (and flips), so rows stay full.
  function layout(visible) {
    cards.forEach(function (c) { c.classList.remove('is-feature', 'is-reverse'); });
    if (!visible.length) return;
    visible[0].classList.add('is-feature');
    if (visible.length > 1 && (visible.length - 1) % 2 === 1) {
      var last = visible[visible.length - 1];
      last.classList.add('is-feature', 'is-reverse');
    }
  }

  function apply(filter, animate) {
    var visible = [];
    cards.forEach(function (c) {
      var show = filter === 'all' || c.getAttribute('data-type') === filter;
      c.hidden = !show;
      if (show) visible.push(c);
    });
    layout(visible);
    if (empty) empty.hidden = visible.length > 0;
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === filter));
    });
    if (animate && !reduce && visible[0] && visible[0].animate) {
      visible.forEach(function (c, i) {
        c.animate(
          [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
          { duration: 650, delay: i * 70, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' }
        );
      });
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      apply(f, true);
      try { history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f); } catch (e) {}
    });
  });

  var start = (location.hash || '').replace('#', '');
  apply(valid.indexOf(start) > -1 ? start : 'all', false);
})();
