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
  // cursor, blue ink bleeds through the logo around it (one layer across all
  // letters, so no seams), the nearest letter shows its measured width, and
  // a click stamps a numbered mark onto the sheet.
  var board = document.querySelector('[data-ft-board]');
  if (board) {
    var letters = Array.prototype.slice.call(board.querySelectorAll('.ft-letter'));
    var ink = createInk(board.querySelector('[data-ft-ink]'));
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
        if (d < best) { best = d; nearest = i; }
      });
      letters.forEach(function (el, i) { el.classList.toggle('is-near', i === nearest && best === 0); });
      ink.aim(pending.cx, pending.cy);
    };
    var queue = function (e) {
      var b = board.getBoundingClientRect();
      pending = { x: e.clientX - b.left, y: e.clientY - b.top, cx: e.clientX, cy: e.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    board.addEventListener('pointermove', queue);
    board.addEventListener('pointerenter', function (e) {
      measure();
      board.classList.add('is-active');
      ink.enter(e.clientX, e.clientY);
      queue(e);
    });
    board.addEventListener('pointerleave', function () {
      board.classList.remove('is-active');
      ink.leave();
      letters.forEach(function (el) { el.classList.remove('is-near'); });
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

  // Ink blob in logo units: a head that eases after the cursor and swells,
  // dropping blots along its path that spread out before they dry up. While the
  // cursor rests the pool keeps flooding outward, slowly, until the whole logo
  // is inked, with liquid fingers creeping ahead of its edge. The SVG filter
  // merges everything into one wet shape and its noise drifts so the edge
  // keeps moving; the logo mask keeps it inside.
  function createInk(svg) {
    var noop = { enter: function () {}, aim: function () {}, leave: function () {} };
    if (!svg || !svg.getScreenCTM) return noop;
    var layer = svg.querySelector('[data-ft-ink-drops]');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var NS = 'http://www.w3.org/2000/svg';
    var RADIUS = 24; // head size while moving, in logo units (logo is ~68 tall)
    var POOL = 1.6; // the head grows to RADIUS * POOL while the cursor rests
    var SPREAD = 0.45; // blots grow by this much before they dry
    var LIFE = 2.6; // seconds a blot takes to dry up
    var FLOOD = 5; // logo units per second the resting pool keeps growing by
    var FULL = 240; // radius that covers the whole logo from anywhere on it
    var noise = document.querySelector('#ft-ink-filter feTurbulence');
    var head = { x: 0, y: 0, r: 0, v: 0 };
    var aim = { x: 0, y: 0 };
    var last = null;
    var drops = [];
    var fingers = [];
    var flood = 0; // extra radius built up while resting
    var sprout = 0;
    var clock = 0;
    var pool = [];
    var on = false;
    var frame = null;
    var then = 0;

    var toLogo = function (cx, cy) {
      var m = svg.getScreenCTM();
      if (!m) return null;
      return new DOMPoint(cx, cy).matrixTransform(m.inverse());
    };
    var circle = function (i) {
      if (!pool[i]) { pool[i] = document.createElementNS(NS, 'circle'); layer.appendChild(pool[i]); }
      return pool[i];
    };
    var draw = function () {
      var list = [head].concat(drops, fingers);
      list.forEach(function (d, i) {
        var c = circle(i);
        c.setAttribute('cx', d.x.toFixed(2));
        c.setAttribute('cy', d.y.toFixed(2));
        c.setAttribute('r', Math.max(0, d.r).toFixed(2));
      });
      for (var i = list.length; i < pool.length; i++) pool[i].setAttribute('r', '0');
    };
    var step = function (now) {
      var dt = Math.min(0.05, (now - then) / 1000 || 0.016);
      then = now;
      var still = reduced.matches;
      var k = still ? 1 : 1 - Math.pow(0.001, dt); // ~ease toward the cursor
      var dx = (aim.x - head.x) * k;
      var dy = (aim.y - head.y) * k;
      head.x += dx;
      head.y += dy;
      // Smoothed speed (logo units / s): fast strokes stay lean, a resting cursor pools.
      head.v += (Math.hypot(dx, dy) / dt - head.v) * (1 - Math.pow(0.02, dt));
      var rest = Math.max(0, 1 - head.v / 60);
      // Resting floods further and further; moving lets the flood recede slowly.
      if (on && rest > 0.6) flood = Math.min(FULL, flood + FLOOD * dt * (1 + flood / 90));
      else flood *= Math.pow(on ? 0.35 : 0.2, dt);
      var goal = on ? RADIUS * (1 + (POOL - 1) * rest) + flood : 0;
      head.r += (goal - head.r) * (still ? 1 : 1 - Math.pow(on ? 0.2 : 0.02, dt));

      // Fingers: small blots that crawl out from the pool edge, so the flood
      // advances like liquid finding its way rather than a growing circle.
      sprout += dt;
      if (!still && on && rest > 0.6 && head.r < FULL && sprout > 0.08) {
        sprout = 0;
        var ang = Math.random() * Math.PI * 2;
        fingers.push({
          ang: ang, dist: head.r * 0.8, speed: FLOOD * 1.6 + Math.random() * 9,
          r0: RADIUS * (0.3 + Math.random() * 0.35), r: 0, age: 0, life: 2 + Math.random() * 2,
          x: head.x, y: head.y,
        });
        if (fingers.length > 60) fingers.shift();
      }
      fingers = fingers.filter(function (f) {
        f.age += dt;
        f.dist += f.speed * dt;
        f.ang += Math.sin(clock * 0.9 + f.r0) * 0.15 * dt; // meander a little
        f.x = head.x + Math.cos(f.ang) * f.dist;
        f.y = head.y + Math.sin(f.ang) * f.dist * 0.8;
        var a = Math.min(1, f.age / f.life);
        f.r = f.r0 * Math.min(1, f.age / 0.4) * (1 - Math.pow(a, 4));
        return a < 1;
      });

      // Let the noise drift so the ink edge keeps moving like wet ink.
      clock += dt;
      if (noise && !still) {
        noise.setAttribute('baseFrequency',
          (0.028 + Math.sin(clock * 0.8) * 0.004).toFixed(4) + ' ' + (0.03 + Math.cos(clock * 0.6) * 0.004).toFixed(4));
      }

      if (!still && on && (!last || Math.hypot(head.x - last.x, head.y - last.y) > 3)) {
        // Blots land a little off the path and vary in size, so the trail reads as ink, not a tube.
        var j = head.r * 0.35;
        var r0 = head.r * (0.75 + Math.random() * 0.3);
        drops.push({ x: head.x + (Math.random() - 0.5) * j, y: head.y + (Math.random() - 0.5) * j, r0: r0, r: r0, age: 0 });
        last = { x: head.x, y: head.y };
        if (drops.length > 48) drops.shift();
      }
      drops = drops.filter(function (d) {
        d.age += dt / LIFE;
        var a = Math.min(1, d.age);
        d.r = d.r0 * (1 + SPREAD * (1 - Math.pow(1 - a, 3))) * (1 - Math.pow(a, 3));
        return d.age < 1;
      });
      draw();
      frame = on || head.r > 0.05 || drops.length || fingers.length ? requestAnimationFrame(step) : null;
    };
    var run = function () {
      if (!frame) { then = performance.now(); frame = requestAnimationFrame(step); }
    };
    return {
      enter: function (cx, cy) {
        var p = toLogo(cx, cy);
        if (!p) return;
        on = true;
        aim.x = head.x = p.x;
        aim.y = head.y = p.y;
        last = null;
        flood = 0;
        run();
      },
      aim: function (cx, cy) {
        var p = toLogo(cx, cy);
        if (!p) return;
        aim.x = p.x;
        aim.y = p.y;
        if (!on) { on = true; head.x = p.x; head.y = p.y; }
        run();
      },
      leave: function () {
        on = false;
        run();
      },
    };
  }
})();
