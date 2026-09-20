(function () {
  // Footer: live Belgian clock and the drafting board.
  var clock = document.querySelector('[data-ft-clock]');
  if (clock) {
    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Brussels', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    var tick = function () { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 1000);
  }

  // Drafting board: crosshair guides + coordinate readout follow the
  // cursor, letters fill with blue by proximity and show their measured
  // width, and a click stamps a numbered mark onto the sheet.
  var board = document.querySelector('[data-ft-board]');
  if (board) {
    var letters = Array.prototype.slice.call(board.querySelectorAll('.ft-letter'));
    var readout = board.querySelector('[data-ft-readout]');
    var stamps = board.querySelector('[data-ft-stamps]');
    var MAX_STAMPS = 14;
    var count = 0;
    var geo = [];
    var measure = function () {
      var b = board.getBoundingClientRect();
      geo = letters.map(function (el) {
        var r = el.getBoundingClientRect();
        el.setAttribute('data-w', Math.round(r.width));
        return { cx: r.left - b.left + r.width / 2, cy: r.top - b.top + r.height / 2, w: r.width, h: r.height };
      });
    };
    measure();
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    var pad = function (n) { return String(Math.max(0, Math.round(n))).padStart(3, '0'); };
    var pending = null;
    var frame = null;
    var update = function () {
      frame = null;
      if (!pending) return;
      var x = pending.x, y = pending.y;
      board.style.setProperty('--mx', x + 'px');
      board.style.setProperty('--my', y + 'px');
      readout.innerHTML = 'X ' + pad(x) + ' &nbsp; Y ' + pad(y);
      var nearest = -1, best = Infinity;
      geo.forEach(function (g, i) {
        var dx = Math.max(0, Math.abs(x - g.cx) - g.w / 2);
        var dy = Math.max(0, Math.abs(y - g.cy) - g.h / 2);
        var d = Math.sqrt(dx * dx + dy * dy);
        var p = Math.max(0, 1 - d / (g.w * 0.9));
        letters[i].style.setProperty('--p', (p * p).toFixed(3));
        if (d < best) { best = d; nearest = i; }
      });
      letters.forEach(function (el, i) { el.classList.toggle('is-near', i === nearest && best === 0); });
    };
    var queue = function (e) {
      var b = board.getBoundingClientRect();
      pending = { x: e.clientX - b.left, y: e.clientY - b.top };
      if (!frame) frame = requestAnimationFrame(update);
    };
    board.addEventListener('pointermove', queue);
    board.addEventListener('pointerenter', function (e) {
      measure();
      board.classList.add('is-active');
      queue(e);
    });
    board.addEventListener('pointerleave', function () {
      board.classList.remove('is-active');
      letters.forEach(function (el) { el.style.setProperty('--p', 0); el.classList.remove('is-near'); });
    });
    board.addEventListener('pointerdown', function (e) {
      var b = board.getBoundingClientRect();
      var x = e.clientX - b.left, y = e.clientY - b.top;
      count += 1;
      var s = document.createElement('span');
      s.className = 'ft-stamp';
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.innerHTML = '<i></i><b class="txt txt-font-mono txt-12">' + String(count).padStart(2, '0') + ' &nbsp;' + pad(x) + ', ' + pad(y) + '</b>';
      stamps.appendChild(s);
      while (stamps.children.length > MAX_STAMPS) stamps.removeChild(stamps.firstChild);
    });
  }
})();
