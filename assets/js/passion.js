(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var player = document.querySelector('[data-ps-player]');
  var pv = player && player.querySelector('video');

  Array.prototype.slice.call(document.querySelectorAll('.ps-reel')).forEach(function (li) {
    var btn = li.querySelector('.ps-reel-btn');
    var v = li.querySelector('video');
    var name = btn.getAttribute('data-ps-reel');

    // Hover shows a silent preview so the row feels alive without autoplaying anything loud.
    if (canHover && !reduce) {
      btn.addEventListener('pointerenter', function () {
        li.classList.add('is-preview');
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      });
      btn.addEventListener('pointerleave', function () {
        li.classList.remove('is-preview');
        v.pause();
      });
    }

    btn.addEventListener('click', function () {
      if (!player) return;
      v.pause(); li.classList.remove('is-preview');
      pv.src = 'assets/reels/' + name + '.mp4';
      pv.muted = false;
      if (player.showModal) player.showModal(); else player.setAttribute('open', '');
      var p = pv.play(); if (p && p.catch) p.catch(function () {});
    });
  });

  if (player) {
    player.addEventListener('close', function () { pv.pause(); pv.removeAttribute('src'); pv.load(); });
    player.addEventListener('click', function (e) { if (e.target === player) player.close(); });
  }
})();
