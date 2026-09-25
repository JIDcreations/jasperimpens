(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tiles = Array.prototype.slice.call(document.querySelectorAll('[data-mo-open]'));
  var player = document.querySelector('[data-mo-player]');
  var big = player && player.querySelector('video');
  var visible = [];

  var play = function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); };

  // Loops only run while they are on screen, so the page never has more
  // than a handful moving at once. With reduced motion they stay on the poster.
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target.querySelector('video');
        if (e.isIntersecting) {
          if (visible.indexOf(v) < 0) visible.push(v);
          v.preload = 'auto';
          if (!player || !player.open) play(v);
        } else {
          visible = visible.filter(function (x) { return x !== v; });
          v.pause();
        }
      });
    }, { threshold: 0.4 });
    tiles.forEach(function (t) { io.observe(t); });
  }

  // Click a loop to watch it large; the grid rests while the player is open.
  if (player) {
    tiles.forEach(function (t) {
      t.addEventListener('click', function () {
        visible.forEach(function (v) { v.pause(); });
        big.src = t.getAttribute('data-mo-src');
        big.poster = t.querySelector('video').poster;
        if (player.showModal) player.showModal(); else player.setAttribute('open', '');
        play(big);
      });
    });
    player.addEventListener('click', function (e) { if (e.target === player) player.close(); });
    player.addEventListener('close', function () {
      big.pause();
      big.removeAttribute('src');
      big.load();
      if (!reduce) visible.forEach(play);
    });
  }
})();
