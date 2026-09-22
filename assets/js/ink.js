(function () {
  // Ink hover for the plain buttons (subpage nav, CTAs, closing and footer buttons).
  // Same effect as the .btn-fill ink in main.js: a turbulence-edged circle spreads from where
  // the pointer enters and drains toward where it leaves, revealing a recolored copy of the label.
  // Standalone (no GSAP) so it runs on every page.
  var BUTTONS = [
    { sel: '.wk-nav-item:not(.is-current)', ink: '--content--brand', text: '--content--lime' },
    { sel: '.pj-video-btn', ink: '--content--brand', text: '--content--lime' },
    { sel: '.pj-visit', ink: '--content--brand', text: '--content--lime' },
    { sel: '.wk-empty-link', ink: '--wk-ink', text: '--content--lime' },
    { sel: '.ps-follow', ink: '--wk-ink', text: '--content--lime' },
    { sel: '.closing-btn', ink: '--content--paper', text: '--content--primary' },
    { sel: '.ft-btn:not(.ft-btn-hot)', ink: '--content--brand', text: '--content--lime' },
    { sel: '.ft-btn-hot', ink: '--ft-ink', text: '--content--lime' },
    { sel: '.pj-lightbox-close', ink: '--content--paper', text: '--content--primary' },
  ];
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var PAD = 14; // shape overhang so the displaced edge never shows along the button border
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var defs = null;
  var uid = 0;

  var ease = {
    'power1.in': function (t) { return t * t; },
    'power2.out': function (t) { return 1 - Math.pow(1 - t, 3); },
    'power2.inOut': function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    'power3.inOut': function (t) { return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; },
  };

  // Minimal timeline: each track tweens one key of `state` from its value when the track starts.
  // Later tracks on the same key win, like overlapping GSAP tweens.
  function Tween(state, draw) {
    var tracks = [];
    var frame = null;
    var t0 = 0;
    function tick(now) {
      var t = (now - t0) / 1000;
      var live = false;
      tracks.forEach(function (tr) {
        if (t < tr.at) { live = true; return; }
        if (tr.from === null) tr.from = state[tr.key];
        var p = Math.min(1, (t - tr.at) / tr.dur);
        state[tr.key] = tr.from + (tr.to - tr.from) * ease[tr.ease](p);
        if (p < 1) live = true;
      });
      draw();
      frame = live ? requestAnimationFrame(tick) : null;
    }
    return {
      play: function (list) {
        this.kill();
        tracks = list.map(function (tr) { return { key: tr.key, to: tr.to, at: tr.at || 0, dur: tr.dur, ease: tr.ease, from: null }; });
        t0 = performance.now();
        frame = requestAnimationFrame(tick);
      },
      kill: function () {
        if (frame) cancelAnimationFrame(frame);
        frame = null;
        tracks = [];
      },
    };
  }

  function svgEl(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }
  // One filter per button so each edge's "wetness" can animate independently.
  function createFilter() {
    if (!defs) {
      defs = svgEl('svg', { 'aria-hidden': 'true', width: '0', height: '0' });
      defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      document.body.appendChild(defs);
    }
    var filter = svgEl('filter', { id: 'ink-fx-' + ++uid, x: '-30%', y: '-60%', width: '160%', height: '220%' });
    filter.appendChild(svgEl('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.07', numOctaves: '2', seed: String((uid % 9) + 1), result: 'n' }));
    filter.appendChild(svgEl('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '8', xChannelSelector: 'R', yChannelSelector: 'G' }));
    defs.appendChild(filter);
    return filter;
  }

  // Colors come from theme.css custom properties only; no hardcoded fallbacks.
  function resolve(el, prop) {
    return getComputedStyle(el).getPropertyValue(prop).trim();
  }

  function setup(u, cfg) {
    if (u.hasAttribute('data-ink')) return;
    u.setAttribute('data-ink', '');
    var cs = getComputedStyle(u);
    // Pin the resting colors so CSS :hover rules don't swap the fill before the ink arrives.
    u.style.color = cs.color;
    u.style.backgroundColor = cs.backgroundColor;
    u.classList.add('ink-fx');
    if (cs.position === 'static') u.style.position = 'relative';

    var bg = document.createElement('span');
    var shape = document.createElement('span');
    bg.className = 'ink-fx-bg';
    shape.className = 'ink-fx-shape';
    shape.style.cssText = 'inset:-' + PAD + 'px;background-color:' + resolve(u, cfg.ink);
    var filter = createFilter();
    var disp = filter.querySelector('feDisplacementMap');
    bg.style.filter = 'url(#' + filter.id + ')';
    bg.appendChild(shape);

    // A light copy of the button, laid out by the same classes, on top of the ink.
    var top = u.cloneNode(false);
    top.removeAttribute('id');
    top.removeAttribute('href');
    top.removeAttribute('style');
    top.removeAttribute('data-ink');
    Array.prototype.slice.call(top.attributes).forEach(function (a) {
      if (/^(data-|aria-|on)/.test(a.name)) top.removeAttribute(a.name);
    });
    top.classList.add('ink-fx-top');
    top.setAttribute('aria-hidden', 'true');
    top.setAttribute('tabindex', '-1');
    top.inert = true;
    top.style.color = resolve(u, cfg.text);

    var syncing = false;
    var sync = function () {
      syncing = true;
      top.innerHTML = '';
      Array.prototype.slice.call(u.childNodes).forEach(function (n) {
        if (n === bg || n === top) return;
        var c = n.cloneNode(true);
        if (c.querySelectorAll) {
          c.removeAttribute && c.removeAttribute('id');
          Array.prototype.slice.call(c.querySelectorAll('[id]')).forEach(function (e) { e.removeAttribute('id'); });
        }
        top.appendChild(c);
      });
      syncing = false;
    };
    sync();
    u.append(bg, top);
    // Keep the copy in step when a label changes (e.g. the video Pause/Play toggle).
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(function (list) {
        if (syncing) return;
        var own = list.some(function (m) { return !bg.contains(m.target) && !top.contains(m.target) && m.target !== top && m.target !== bg; });
        if (own) sync();
      }).observe(u, { childList: true, characterData: true, subtree: true });
    }

    var border = { top: 0, left: 0 };
    var measure = function () {
      var s = getComputedStyle(u);
      border = { top: parseFloat(s.borderTopWidth) || 0, left: parseFloat(s.borderLeftWidth) || 0 };
      top.style.top = -border.top + 'px';
      top.style.left = -border.left + 'px';
      // fractional border-box size: offsetWidth rounds down and can make the copy's label wrap
      var extraW = s.boxSizing === 'border-box' ? 0 : parseFloat(s.paddingLeft) + parseFloat(s.paddingRight) + border.left + (parseFloat(s.borderRightWidth) || 0);
      var extraH = s.boxSizing === 'border-box' ? 0 : parseFloat(s.paddingTop) + parseFloat(s.paddingBottom) + border.top + (parseFloat(s.borderBottomWidth) || 0);
      top.style.width = (parseFloat(s.width) || u.offsetWidth) + extraW + 'px';
      top.style.height = (parseFloat(s.height) || u.offsetHeight) + extraH + 'px';
    };
    measure();
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(measure).observe(u);

    var s = { r: 0, x: 0, y: 0, wet: 8 };
    var draw = function () {
      // bg sits inside the border and the shape overhangs it by PAD; top shares the button's border box
      shape.style.clipPath = 'circle(' + s.r + 'px at ' + (s.x - border.left + PAD) + 'px ' + (s.y - border.top + PAD) + 'px)';
      top.style.clipPath = 'circle(' + Math.max(s.r - 6, 0) + 'px at ' + s.x + 'px ' + s.y + 'px)';
      bg.style.visibility = top.style.visibility = s.r > 0 ? 'visible' : 'hidden';
      disp.setAttribute('scale', s.wet.toFixed(2));
    };
    draw();
    var tween = Tween(s, draw);

    var point = function (e) {
      var r = u.getBoundingClientRect();
      if (!e) return { x: r.width / 2, y: r.height / 2, w: r.width, h: r.height };
      return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
    };
    var reach = function (p) { return Math.hypot(Math.max(p.x, p.w - p.x), Math.max(p.y, p.h - p.y)) + PAD; };

    var fill = function (e) {
      var p = point(e);
      if (reduced.matches) {
        tween.kill();
        s.r = reach(p); s.x = p.x; s.y = p.y; s.wet = 8;
        draw();
        return;
      }
      var fresh = s.r < 1;
      var list = [];
      if (fresh) {
        // fresh drop: a small blot soaks in at the pointer before spreading
        s.r = 0; s.x = p.x; s.y = p.y; s.wet = 18;
        list.push({ key: 'r', to: 7, dur: 0.12, ease: 'power2.out' });
      }
      var at = fresh ? 0.08 : 0;
      list.push(
        { key: 'r', to: reach(p), at: at, dur: 0.95, ease: 'power2.inOut' },
        { key: 'x', to: p.x, at: at, dur: 0.95, ease: 'power2.inOut' },
        { key: 'y', to: p.y, at: at, dur: 0.95, ease: 'power2.inOut' },
        { key: 'wet', to: 8, dur: 1, ease: 'power1.in' }
      );
      tween.play(list);
    };
    var drain = function (e) {
      var p = point(e);
      if (reduced.matches) {
        tween.kill();
        s.r = 0;
        draw();
        return;
      }
      tween.play([
        { key: 'r', to: 0, dur: 0.65, ease: 'power3.inOut' },
        { key: 'x', to: p.x, dur: 0.65, ease: 'power3.inOut' },
        { key: 'y', to: p.y, dur: 0.65, ease: 'power3.inOut' },
        { key: 'wet', to: 16, dur: 0.65, ease: 'power1.in' },
      ]);
    };

    u.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') fill(e); });
    u.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch' && !u.matches(':focus-visible')) drain(e); });
    // Keyboard focus inks from the center.
    u.addEventListener('focus', function () { if (u.matches(':focus-visible')) fill(null); });
    u.addEventListener('blur', function () { if (!u.matches(':hover')) drain(null); });
  }

  function init(root) {
    BUTTONS.forEach(function (cfg) {
      Array.prototype.slice.call((root || document).querySelectorAll(cfg.sel)).forEach(function (u) { setup(u, cfg); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();
