(function (W) {
  if (typeof define == "function" && define.amd) {
    define(W);
  } else {
    W();
  }
})(function () {
  "use strict";

  const _0 = (i) => {
    return (i / 10) * parseFloat(getComputedStyle(document.querySelector("html")).fontSize);
  };
  function V0() {
    const g = window.innerWidth;
    let v = g > 991 ? "dsk" : window.innerWidth > 767 ? "tb" : "mb";
    let C = g;
    const T = g <= 767;
    const d = g > 767 && g <= 991;
    const w = g > 991;
    return {
      type: v,
      size: C,
      isMobile: T,
      isDesktop: w,
      isTablet: d,
    };
  }
  function Bx(i) {
    i.childNodes.forEach((v) => {
      if (v.nodeType === Node.TEXT_NODE) {
        v.nodeValue = v.nodeValue.replace(/-/g, "‑");
      }
    });
  }
  const k0 = (i) => {
    if (i) {
      if (i.jquery) {
        if (i.length) {
          return i.toArray();
        } else {
          return null;
        }
      } else if (Array.isArray(i)) {
        if (i.length) {
          return i;
        } else {
          return null;
        }
      } else {
        return i;
      }
    } else {
      return null;
    }
  };
  const Z0 = (i) => {
    const g = k0(i);
    if (Array.isArray(g)) {
      return g[0];
    } else {
      return g;
    }
  };
  class U {
    constructor({
      triggerInit: e,
      timeline: g,
      tweenArr: v,
      stagger: C = 0.1,
      scrollTrigger: T,
      allowMobile: d,
    }) {
      this.timeline = g;
      this.triggerInit = e;
      this.scrollTrigger = T;
      this.tweenArr = v;
      this.stagger = C;
      this.allowMobile = V0().isMobile ? d : true;
      document.fonts.ready.then(() => this.setup());
    }
    setup() {
      if (!this.allowMobile) {
        return;
      }
      const v = this.tweenArr.filter((C) => (C == null ? undefined : C.animation));
      if (this.triggerInit) {
        gsap.timeline({
          scrollTrigger: {
            trigger: this.triggerInit,
            start: "top bottom+=100vh",
            end: "bottom top",
            once: true,
            scrub: false,
            onEnter: () => {
              v.forEach((T) => {
                var d;
                if ((d = T.init) == null) {
                  return undefined;
                } else {
                  return d.call(T);
                }
              });
            },
          },
        });
      } else {
        v.forEach((C) => {
          var T;
          if ((T = C.init) == null) {
            return undefined;
          } else {
            return T.call(C);
          }
        });
      }
      if (!this.timeline) {
        this.timeline = gsap.timeline({
          scrollTrigger: {
            start: "top top+=70%",
            end: "+=100%",
            scrub: false,
            once: true,
            ...this.scrollTrigger,
          },
        });
      }
      v.forEach((C) => this.timeline.add(C.animation, C.delay || "<=" + this.stagger));
    }
  }
  class p {
    constructor({
      el: e,
      delay: g,
      headingType: v,
      splitType: C,
      duration: T,
      stagger: d,
      isDisableRevert: w,
      ...M
    }) {
      if (!e || e.textContent === "") {
        return;
      }
      this.DOM = {
        el: e,
      };
      this.delay = g;
      this.textSplit = null;
      this.splitType = C || "words";
      this.headingType = v || "false";
      this.duration = T || 0.8;
      this.stagger = d || 0.02;
      let V;
      document.fonts.ready.then(() => {
        this.textSplit = SplitText.create(this.DOM.el, {
          type: this.splitType === "words" ? "lines words" : "lines",
          mask: "lines",
          linesClass: v ? "bp-line heading-line" : "bp-line",
          autoSplit: true,
          onSplit: (E) => {
            gsap.set(E[this.splitType], {
              autoAlpha: 0,
              yPercent: 100,
            });
            V = gsap.to(E[this.splitType], {
              autoAlpha: 1,
              yPercent: 0,
              stagger: this.stagger,
              duration: this.duration,
              ease: "power2.out",
              onComplete: () => {
                if (!w) {
                  E.revert();
                  Bx(E.elements[0]);
                }
              },
              ...M,
            });
          },
        });
        this.animation = V;
      });
    }
    init() {
      document.fonts.ready.then(() => {});
    }
  }
  class X {
    constructor({ el: e, type: g, delay: v, isDisableRevert: C, from: T, to: d, ...w }) {
      var Y;
      var q;
      this.DOM = {
        el: k0(e),
      };
      this.type = g || "default";
      this.delay = v;
      this.options = {
        bottom: {
          set: {
            opacity: 0,
            y: _0(32),
            ...T,
          },
          to: {
            opacity: 1,
            y: 0,
            ...d,
          },
        },
        top: {
          set: {
            opacity: 0,
            y: _0(-32),
            ...T,
          },
          to: {
            opacity: 1,
            y: 0,
            ...d,
          },
        },
        left: {
          set: {
            opacity: 0,
            x: _0(32),
            ...T,
          },
          to: {
            opacity: 1,
            x: 0,
            ...d,
          },
        },
        right: {
          set: {
            opacity: 0,
            x: _0(-32),
            ...T,
          },
          to: {
            opacity: 1,
            x: 0,
            ...d,
          },
        },
        none: {
          set: {
            opacity: 0,
            ...T,
          },
          to: {
            opacity: 1,
            ...d,
          },
        },
        default: {
          set: {
            opacity: 0,
            y: _0(32),
            ...T,
          },
          to: {
            opacity: 1,
            y: 0,
            ...d,
          },
        },
      };
      if (!this.DOM.el) {
        return;
      }
      this.animation = gsap.fromTo(
        this.DOM.el,
        {
          ...(((Y = this.options[this.type]) == null ? undefined : Y.set) || this.options.default.set),
        },
        {
          ...(((q = this.options[this.type]) == null ? undefined : q.to) || this.options.default.to),
          duration: 1,
          ease: "power3",
          clearProps: C ? "" : "all",
          ...w,
        },
      );
    }
    init() {
      var g;
      if (this.DOM.el) {
        gsap.set(this.DOM.el, {
          ...(((g = this.options[this.type]) == null ? undefined : g.set) || this.options.default.set),
        });
      }
    }
  }
  class g0 {
    constructor({ el: e, type: g, isCenter: v, delay: C, isDisableRevert: T, ...d }) {
      var V;
      var Y;
      this.DOM = {
        el: Z0(e),
      };
      if (!this.DOM.el) {
        return;
      }
      this.type = g || "default";
      this.delay = C;
      this.widthItem = this.DOM.el.offsetWidth || 0;
      this.heightItem = this.DOM.el.offsetHeight || 0;
      this.options = {
        top: {
          set: {
            height: 0,
            transformOrigin: v ? "center center" : "top left",
          },
          to: {
            height: this.heightItem,
          },
        },
        bottom: {
          set: {
            height: 0,
            transformOrigin: v ? "center center" : "bottom left",
          },
          to: {
            height: this.heightItem,
          },
        },
        left: {
          set: {
            width: 0,
            transformOrigin: v ? "center center" : "top left",
          },
          to: {
            width: this.widthItem,
          },
        },
        right: {
          set: {
            width: 0,
            transformOrigin: v ? "center center" : "top right",
          },
          to: {
            width: this.widthItem,
          },
        },
        default: {
          set: {
            height: 0,
            transformOrigin: v ? "center center" : "top left",
          },
          to: {
            height: this.heightItem,
          },
        },
      };
      this.animation = gsap.fromTo(
        this.DOM.el,
        {
          ...(((V = this.options[this.type]) == null ? undefined : V.set) || this.options.default.set),
        },
        {
          ...(((Y = this.options[this.type]) == null ? undefined : Y.to) || this.options.default.to),
          duration: 1.2,
          ease: "power1.out",
          clearProps: T ? "" : "all",
          ...d,
        },
      );
    }
    init() {
      var g;
      var v;
      if ((g = this.DOM) != null && g.el) {
        gsap.set(this.DOM.el, {
          ...(((v = this.options[this.type]) == null ? undefined : v.set) || this.options.default.set),
        });
      }
    }
  }
  class B0 {
    constructor({ el: e, type: g, isCenter: v, delay: C, isDisableRevert: T, ...d }) {
      var V;
      var Y;
      if (!e) {
        return;
      }
      this.DOM = {
        el: e,
      };
      this.type = g || "default";
      this.delay = C;
      this.options = {
        top: {
          set: {
            scaleY: 0,
            transformOrigin: v ? "center center" : "top left",
          },
          to: {
            scaleY: 1,
          },
        },
        left: {
          set: {
            scaleX: 0,
            transformOrigin: v ? "center center" : "top left",
          },
          to: {
            scaleX: 1,
          },
        },
        right: {
          set: {
            scaleX: 0,
            transformOrigin: v ? "center center" : "top right",
          },
          to: {
            scaleX: 1,
          },
        },
        bottom: {
          set: {
            scaleY: 0,
            transformOrigin: v ? "center center" : "bottom right",
          },
          to: {
            scaleY: 1,
          },
        },
        default: {
          set: {
            scaleX: 0,
            transformOrigin: v ? "center center" : "top left",
          },
          to: {
            scaleX: 1,
          },
        },
      };
      this.animation = gsap.fromTo(
        this.DOM.el,
        {
          ...(((V = this.options[this.type]) == null ? undefined : V.set) || this.options.default.set),
        },
        {
          ...(((Y = this.options[this.type]) == null ? undefined : Y.to) || this.options.default.to),
          duration: 1.2,
          ease: "none",
          clearProps: T ? "" : "all",
          ...d,
        },
      );
    }
    init() {
      var g;
      var v;
      if ((g = this.DOM) != null && g.el) {
        gsap.set(this.DOM.el, {
          ...(((v = this.options[this.type]) == null ? undefined : v.set) || this.options.default.set),
        });
      }
    }
  }
  class s0 {
    constructor({ el: e, delay: g, duration: v, isDisableRevert: C, onComplete: T }) {
      this.DOM = {
        el: Z0(e),
      };
      if (!this.DOM.el) {
        return;
      }
      this.delay = g;
      const M = {
        scale: 1,
        duration: 1.6,
        autoAlpha: 1,
        ease: "expo.out",
        clearProps: C ? "" : "all",
        overwrite: true,
      };
      if (T) {
        M.onComplete = T;
      }
      this.animation = gsap.timeline().to(this.DOM.el, M);
    }
    init() {
      if (this.DOM.el) {
        gsap.set(this.DOM.el, {
          scale: 1.25,
          autoAlpha: 0,
        });
      }
    }
  }
  const J0 = "cookie_consent";
  const F0 = 1;
  const Cx = 15724800;
  let r0 = null;
  let Q0 = false;
  function Dx(i) {
    const g = i + "=";
    const v = document.cookie
      .split(";")
      .map((C) => C.trim())
      .find((C) => C.startsWith(g));
    if (v) {
      return decodeURIComponent(v.slice(g.length));
    } else {
      return null;
    }
  }
  function mx() {
    try {
      const g = JSON.parse(Dx(J0));
      if (g.revision !== F0 || !g.categories) {
        return null;
      } else {
        return {
          necessary: true,
          analytics: g.categories.includes("analytics"),
        };
      }
    } catch {
      return null;
    }
  }
  function px(i) {
    const v = Object.entries(i)
      .filter(([, d]) => d)
      .map(([d]) => d);
    const C = encodeURIComponent(
      JSON.stringify({
        revision: F0,
        categories: v,
        consentDate: new Date().toISOString(),
      }),
    );
    const T = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = J0 + "=" + C + "; Max-Age=" + Cx + "; Path=/; SameSite=Lax" + T;
  }
  function nx(i) {
    r0 = {
      necessary: true,
      analytics: !!i.analytics,
    };
    px(r0);
    ix();
  }
  function Yx() {
    document.addEventListener("click", (g) => {
      if (!(g.target instanceof Element)) {
        return;
      }
      const C = g.target.closest(["[data-cookie-accept-all]", "[data-cookie-reject-all]"].join(","));
      if (C) {
        g.preventDefault();
        if (C.matches("[data-cookie-accept-all]")) {
          nx({
            analytics: true,
          });
        } else if (C.matches("[data-cookie-reject-all]")) {
          nx({
            analytics: false,
          });
        }
      }
    });
  }
  function Px() {
    const g = () => (document.getElementById("cookie-root") ? (r0 ? ix() : Nx(), true) : false);
    if (g()) {
      return;
    }
    const v = new MutationObserver(() => {
      if (g()) {
        v.disconnect();
      }
    });
    v.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
  function Nx() {
    var g;
    if ((g = document.querySelector("[data-cookie-banner]")) != null) {
      g.classList.add("is-visible");
    }
  }
  function ix() {
    var g;
    if ((g = document.querySelector("[data-cookie-banner]")) != null) {
      g.classList.remove("is-visible");
    }
  }
  function sx() {
    Yx();
    Px();
  }
  function Kx() {
    if (Q0) {
      return;
    }
    Q0 = true;
    r0 = mx();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", sx, {
        once: true,
      });
    } else {
      sx();
    }
  }
  const jx = () => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    ScrollTrigger.defaults({
      invalidateOnRefresh: true,
      scroller: ".main-inner",
    });
    const g = (t) => gsap.quickSetter(t, "x", "px");
    const v = (t) => gsap.quickSetter(t, "y", "px");
    const d = {
      get w() {
        return window.innerWidth;
      },
      get h() {
        return window.innerHeight;
      },
    };
    const w = () => {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    };
    const z = (t, x) => {
      let s;
      switch (true) {
        case x === "vw":
          s = window.innerWidth * (t / 100);
          break;
        case x === "vh":
          s = window.innerHeight * (t / 100);
          break;
        case x === "rem":
          s = (t / 10) * parseFloat($("html").css("font-size"));
          break;
      }
      return s;
    };
    const N = (t, x = "vertical") => {
      if (!t) {
        return;
      }
      const r = t.getBoundingClientRect();
      if (x == "horizontal") {
        return r.left <= window.innerWidth && r.right >= 0;
      } else {
        return r.top <= window.innerHeight && r.bottom >= 0;
      }
    };
    const Y = (t, x = 300) => {
      let s;
      return (...r) => {
        clearTimeout(s);
        s = setTimeout(() => {
          t.apply(undefined, r);
        }, x);
      };
    };
    const q = (t, x, n) => (1 - n) * t + n * x;
    const E = (t, x, n, s) => Math.hypot(n - t, s - x);
    const Q = (t, x) => (t / x - 0.5) * 2;
    const M0 = (t) => {
      ScrollTrigger.getAll().forEach((r) => {
        var o;
        var f;
        if (t === "refresh") {
          if (r.progress === 0) {
            if ((o = r[t]) != null) {
              o.call(r);
            }
          }
        } else if ((f = r[t]) != null) {
          f.call(r);
        }
      });
    };
    let c0 = null;
    function z0(t, x, n) {
      let c;
      let o = x == null ? undefined : x.next.container.querySelector(".main-content");
      let f = o == null ? undefined : o.scrollHeight;
      function l() {
        clearTimeout(c);
        c = setTimeout(() => {
          const b = o.scrollHeight;
          if (b !== f) {
            if (S.lenis) {
              S.lenis.resize();
              ScrollTrigger.refresh();
            }
            f = b;
          }
        }, 200);
      }
      if (t === "init") {
        if (!o) {
          return;
        }
        if (c0 != null) {
          c0.disconnect();
        }
        c0 = new ResizeObserver(l);
        c0.observe(o);
      } else if (t === "disconnect") {
        if (c0 != null) {
          c0.disconnect();
        }
        c0 = null;
      }
    }
    function D0(t) {
      $(t).each((s, r) => {
        $(r)
          .find(".number-index")
          .text(s <= 9 ? "0" + (s + 1) : s + 1);
      });
    }
    function Y0(t) {
      const n = {
        wLYsS: function (s) {
          if (s == null) {
            return undefined;
          } else {
            return s();
          }
        },
      };
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      S.scrollToTop({
        onComplete: () => {
          n.wLYsS(t);
          M0("refresh");
        },
      });
    }
    class P0 {
      constructor({ el: x, scaleOffset: n = 0.1 }) {
        this.el = x;
        this.elWrap = null;
        this.scaleOffset = n;
        if (d.w > 991) {
          this.init();
        }
      }
      init() {
        this.elWrap = this.el.parentElement;
        this.elWrapHeight = this.elWrap.offsetHeight;
        this.setup();
      }
      setup() {
        105 + (this.scaleOffset - 0.1) * 100;
        this.scrub();
      }
      scrub() {
        let n = this.el.offsetHeight - this.elWrapHeight;
        let s = this.elWrapHeight + window.innerHeight;
        this.updateOnScroll(n, s);
        S.lenis.on("scroll", () => {
          this.updateOnScroll(n, s);
        });
      }
      updateOnScroll(x, n) {
        if (this.el && N(this.elWrap)) {
          let r = (this.elWrap.getBoundingClientRect().top + window.innerHeight) / n;
          gsap.quickSetter(this.el, "y", "px")(-x * (1 - r) * 1.2);
          gsap.set(this.el, {
            scale: 1 + this.scaleOffset - r * this.scaleOffset,
          });
        }
      }
    }
    class I0 {
      constructor(x, n, s = 40, r) {
        this.list = x;
        this.item = n;
        this.duration = s;
        this.direction = r || "left";
      }
      setup() {
        let n = this.item.width();
        const s = $(window).width();
        if (!n || n <= 0 || !s || s <= 0) {
          return;
        }
        const r = Math.ceil(s / n) + 1;
        if (!Number.isFinite(r) || r <= 0 || r > 1000) {
          return;
        }
        let c = this.item.clone();
        this.list.html("");
        new Array(r).fill().forEach(() => {
          let f = c.clone();
          f.css("animation-duration", Math.ceil(n / this.duration) + "s");
          if (this.direction == "left") {
            f.addClass("marquee-left");
          } else {
            f.addClass("marquee-right");
          }
          this.list.append(f);
        });
      }
      play() {
        if (this.direction == "left") {
          $(this.list).find(".marquee-left").addClass("anim");
        } else {
          $(this.list).find(".marquee-right").addClass("anim");
        }
      }
    }
    class Vx {
      constructor() {
        this.lenis = null;
        this.scroller = {
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          velocity: 0,
          direction: 0,
        };
        this.lastScroller = {
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          velocity: 0,
          direction: 0,
        };
      }
      init(x) {
        this.reInit(x);
        $.easing.lenisEase = function (r) {
          return Math.min(1, 1.001 - Math.pow(2, r * -10));
        };
        gsap.ticker.add((r) => {
          if (this.lenis) {
            this.lenis.raf(r * 1000);
          }
        });
        gsap.ticker.lagSmoothing(0);
      }
      reInit(x) {
        var r;
        var c;
        var o;
        if (this.lenis) {
          this.lenis.destroy();
        }
        this.lenis = new Lenis({
          wrapper:
            ((r = x == null ? undefined : x.next) == null ? undefined : r.container) ||
            document.querySelector(".main-inner"),
          content:
            ((o = (c = x == null ? undefined : x.next) == null ? undefined : c.container) == null
              ? undefined
              : o.querySelector(".main-content")) || document.querySelector(".main-content"),
          syncTouch: true,
          smoothWheel: true,
          smoothTouch: false,
          infinite: false,
        });
        let s = null;
        this.lenis.on("scroll", (f) => {
          var h;
          this.updateOnScroll(f);
          ScrollTrigger.update();
          clearTimeout(s);
          if (Math.abs(f.velocity) > 0.1) {
            if ((h = x == null ? undefined : x.next) != null) {
              h.container.classList.remove("lenis-stopped");
            }
          }
          s = setTimeout(() => {
            var D;
            if ((D = x == null ? undefined : x.next) != null) {
              D.container.classList.add("lenis-stopped");
            }
          }, 150);
        });
      }
      updateOnScroll(x) {
        this.scroller.scrollX = x.scroll;
        this.scroller.scrollY = x.scroll;
        this.scroller.velocity = x.velocity;
        this.scroller.direction = x.direction;
        if (x0) {
          x0.updateOnScroll(S.lenis);
        }
        if ($(".header-menu").hasClass("active")) {
          $(".header-menu").removeClass("active");
        }
        if ($(".header-menu-btn").hasClass("active")) {
          $(".header-menu-btn").removeClass("active");
        }
      }
      scrollToTop(x = {}) {
        if (this.lenis) {
          this.lenis.scrollTo("top", {
            duration: 0.0001,
            immediate: true,
            lock: true,
            ...x,
          });
        }
      }
    }
    const S = new Vx();
    class Wx {
      constructor() {
        this.lerpCursorPos = () => {
          this.normalizeMousePos.current.x = q(
            this.normalizeMousePos.current.x,
            this.normalizeMousePos.target.x,
            0.1,
          );
          this.normalizeMousePos.current.y = q(
            this.normalizeMousePos.current.y,
            this.normalizeMousePos.target.y,
            0.1,
          );
          if (
            E(
              this.normalizeMousePos.target.x,
              this.normalizeMousePos.current.x,
              this.normalizeMousePos.target.y,
              this.normalizeMousePos.current.y,
            ) < 0.001 &&
            this.cursorRaf
          ) {
            cancelAnimationFrame(this.cursorRaf);
            this.cursorRaf = null;
            this.resetCursor();
            return;
          } else {
            this.cursorRaf = requestAnimationFrame(this.lerpCursorPos.bind(this));
            this.toggleCursor();
          }
        };
        this.mousePos = {
          x: 0,
          y: 0,
        };
        this.cacheMousePos = {
          ...this.mousePos,
        };
        this.lastMousePos = {
          ...this.mousePos,
        };
        this.normalizeMousePos = {
          current: {
            x: 0.5,
            y: 0.5,
          },
          target: {
            x: 0.5,
            y: 0.5,
          },
        };
        this.cursorRaf = null;
        this.init();
        window.addEventListener("mousemove", (r) => {
          this.mousePos = this.getPointerPos(r);
        });
        window.addEventListener("touchmove", (r) => {
          this.mousePos = this.getPointerPos(r);
        });
      }
      init() {
        if (d.w > 991) {
          requestAnimationFrame(this.update.bind(this));
        }
      }
      update() {
        this.cacheMousePos.x = q(this.cacheMousePos.x, this.mousePos.x, 0.1);
        this.cacheMousePos.y = q(this.cacheMousePos.y, this.mousePos.y, 0.1);
        this.normalizeMousePos.target.x = this.mousePos.x / window.innerWidth;
        this.normalizeMousePos.target.y = this.mousePos.y / window.innerHeight;
        if (!this.cursorRaf) {
          this.cursorRaf = requestAnimationFrame(this.lerpCursorPos.bind(this));
        }
        requestAnimationFrame(this.update.bind(this));
      }
      getPointerPos(x) {
        if (x.touches) {
          return {
            x: x.touches[0].clientX,
            y: x.touches[0].clientY,
          };
        } else {
          return {
            x: x.clientX,
            y: x.clientY,
          };
        }
      }
      toggleCursor() {
        const n = $("[data-cursor]:hover");
        const s = $(".cursor-main");
        if (n.length) {
          g(s)(this.normalizeMousePos.current.x * window.innerWidth);
          v(s)(this.normalizeMousePos.current.y * window.innerHeight);
          switch ($(n[n.length - 1]).attr("data-cursor")) {
            case "drag":
              s.removeClass("hidden");
              $(".cursor-drag").addClass("active");
              break;
            case "hidden":
              s.addClass("hidden");
              break;
            default:
              s.removeClass("hidden");
              $(".cursor-drag").removeClass("active");
              break;
          }
        } else {
          this.resetCursor();
        }
      }
      resetCursor() {
        $(".cursor-drag").removeClass("active");
      }
    }
    const f0 = new Wx();
    const ax = () => {
      var t;
      var x;
      return (
        ((t = window.matchMedia) == null
          ? undefined
          : t.call(window, "(hover: hover) and (pointer: fine)").matches) &&
        ((x = window.matchMedia) == null || !x.call(window, "(prefers-reduced-motion: reduce)").matches)
      );
    };
    class $x {
      constructor() {
        this.canvas = null;
        this.context = null;
        this.hoverSquare = null;
        this.raf = null;
        this.isDestroyed = false;
        this.squareRenderState = {
          opacity: null,
          transform: null,
          mode: null,
          borderColor: null,
        };
        this.width = 0;
        this.height = 0;
        this.dpr = 1;
        this.target = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        };
        this.current = {
          ...this.target,
        };
        this.trail = [];
        this.trailLength = 34;
        this.hoverProgress = 0;
        this.pressProgress = 0;
        this.visibilityProgress = 0;
        this.darkProgress = 0;
        this.speed = 0;
        this.isInteractive = false;
        this.isPressed = false;
        this.isDotHidden = false;
        this.isCursorHidden = false;
        this.isVisible = false;
        this.useDarkColor = false;
        this.interactiveSelector = [
          "a",
          "button",
          "input",
          "textarea",
          "select",
          '[role="button"]',
          '[data-cursor]:not([data-cursor="hidden"])',
        ].join(",");
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.wake = this.wake.bind(this);
        this.resize = this.resize.bind(this);
        this.render = this.render.bind(this);
      }
      init() {
        if (!ax()) {
          return;
        }
        document.querySelectorAll("#canvas-cursor, #canvas-cursor-hover").forEach((r) => {
          r.remove();
        });
        this.canvas = document.createElement("canvas");
        this.canvas.id = "canvas-cursor";
        this.canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483600";
        document.body.appendChild(this.canvas);
        this.hoverSquare = document.createElement("div");
        this.hoverSquare.id = "canvas-cursor-hover";
        this.hoverSquare.style.cssText = [
          "position:fixed",
          "top:0",
          "left:0",
          "width:2.8rem",
          "height:2.8rem",
          "pointer-events:none",
          "z-index:2147483601",
          'background-image:url("assets/images/paper-texture.svg")',
          "background-repeat:no-repeat",
          "background-size:cover",
          "background-position:center",
          "mix-blend-mode:saturation",
          "border:1.25px solid transparent",
          "box-sizing:border-box",
          "opacity:0",
          "transform-origin:center",
          "will-change:transform,opacity",
        ].join(";");
        document.body.appendChild(this.hoverSquare);
        this.context = this.canvas.getContext("2d");
        if (!this.context) {
          this.canvas.remove();
          this.hoverSquare.remove();
          this.canvas = null;
          this.hoverSquare = null;
          return;
        }
        const n = getComputedStyle(document.documentElement);
        const s =
          n.getPropertyValue("--content--brand").trim() ||
          n.getPropertyValue("--color--accent").trim() ||
          "#3967bc";
        this.accentRgb = this.hexToRgb(s, "#3967bc");
        this.darkRgb = this.hexToRgb("#160a05", "#160a05");
        this.resize();
        window.addEventListener("resize", this.resize);
        document.addEventListener("mousemove", this.onMouseMove, {
          passive: true,
        });
        document.addEventListener("mouseleave", this.onMouseLeave);
        document.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener("blur", this.onMouseUp);
        this.wake();
      }
      wake() {
        if (this.raf === null && !this.isDestroyed && !!this.context) {
          this.raf = requestAnimationFrame(this.render);
        }
      }
      hexToRgb(x, n) {
        const r = /^#[0-9a-f]{6}$/i.test(x) ? x : n;
        const c = r.slice(1);
        return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
      }
      resize() {
        if (!!this.canvas && !!this.context) {
          this.width = window.innerWidth;
          this.height = window.innerHeight;
          this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1, 3072 / Math.max(1, this.width)));
          this.canvas.width = this.width * this.dpr;
          this.canvas.height = this.height * this.dpr;
          this.canvas.style.width = this.width + "px";
          this.canvas.style.height = this.height + "px";
          this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
          this.wake();
        }
      }
      onMouseMove(x) {
        var c;
        var o;
        var f;
        var u;
        this.target.x = x.clientX;
        this.target.y = x.clientY;
        this.isVisible = true;
        const s = x.target;
        const r = Boolean(
          (c = s == null ? undefined : s.closest) == null ? undefined : c.call(s, '[data-cursor="hidden"]'),
        );
        this.isDotHidden = r;
        if (this.isCursorHidden !== r) {
          this.isCursorHidden = r;
          const a = r ? "hidden" : "visible";
          this.canvas.style.visibility = a;
          this.hoverSquare.style.visibility = a;
          if (r) {
            this.isPressed = false;
          }
        }
        this.isInteractive =
          (o = s == null ? undefined : s.closest) != null &&
          !!o.call(s, this.interactiveSelector) &&
          ((f = s == null ? undefined : s.closest) == null || !f.call(s, ".btn-fill"));
        this.useDarkColor = Boolean(
          (u = s == null ? undefined : s.closest) == null
            ? undefined
            : u.call(s, '[data-logo-theme="black"],[data-cursor-theme="dark"]'),
        );
        this.wake();
      }
      onMouseLeave() {
        this.isVisible = false;
        this.isPressed = false;
        this.wake();
      }
      onMouseDown() {
        this.pressProgress = 0;
        this.isPressed = true;
        this.hoverProgress = Math.max(this.hoverProgress, 0.6);
        this.wake();
      }
      onMouseUp() {
        this.isPressed = false;
        this.wake();
      }
      mixColor(x, n, s) {
        return (
          "rgb(" +
          Math.round(x[0] + (n[0] - x[0]) * s) +
          "," +
          (Math.round(x[1] + (n[1] - x[1]) * s) + ",") +
          (Math.round(x[2] + (n[2] - x[2]) * s) + ")")
        );
      }
      approach(x, n, s, r = 0.001) {
        const o = x + (n - x) * s;
        if (Math.abs(n - o) <= r) {
          return n;
        } else {
          return o;
        }
      }
      updateHoverSquare({ opacity: x, scale: n, borderColor: s }) {
        if (!this.hoverSquare) {
          return;
        }
        const c = Math.min(1, Math.max(0, x)).toFixed(3);
        const o =
          "translate3d(" +
          this.current.x.toFixed(2) +
          "px," +
          this.current.y.toFixed(2) +
          "px,0) " +
          ("translate(-50%,-50%) scale(" + n.toFixed(3) + ")");
        const f = this.isPressed ? "pressed" : "hover";
        if (this.squareRenderState.opacity !== c) {
          this.hoverSquare.style.opacity = c;
          this.squareRenderState.opacity = c;
        }
        if (this.squareRenderState.transform !== o) {
          this.hoverSquare.style.transform = o;
          this.squareRenderState.transform = o;
        }
        if (this.squareRenderState.mode !== f) {
          this.hoverSquare.style.backgroundImage = this.isPressed
            ? "none"
            : 'url("assets/images/paper-texture.svg")';
          this.hoverSquare.style.mixBlendMode = this.isPressed ? "normal" : "saturation";
          this.squareRenderState.mode = f;
        }
        if (this.squareRenderState.borderColor !== s) {
          this.hoverSquare.style.borderColor = s;
          this.squareRenderState.borderColor = s;
        }
      }
      render() {
        this.raf = null;
        if (document.hidden || this.isDestroyed || !this.context) {
          return;
        }
        const n = this.current.x;
        const s = this.current.y;
        const r = this.hoverProgress;
        const c = this.pressProgress;
        const o = this.visibilityProgress;
        const f = this.darkProgress;
        const l = this.speed;
        this.current.x = this.approach(this.current.x, this.target.x, 0.18, 0.01);
        this.current.y = this.approach(this.current.y, this.target.y, 0.18, 0.01);
        this.hoverProgress = this.approach(this.hoverProgress, this.isInteractive ? 1 : 0, 0.15);
        this.pressProgress = this.isPressed ? this.approach(this.pressProgress, 1, 0.2) : 0;
        this.visibilityProgress = this.approach(this.visibilityProgress, this.isVisible ? 1 : 0, 0.12);
        this.darkProgress = this.approach(this.darkProgress, this.useDarkColor ? 1 : 0, 0.15);
        const u = this.mixColor(this.accentRgb, this.darkRgb, this.darkProgress);
        const a = this.accentRgb.map((k, O) => k + (this.darkRgb[O] - k) * this.darkProgress);
        const h = this.mixColor(a, [255, 255, 255], 0.3);
        const b = (6 + this.hoverProgress * 8) / 14;
        const D = 0.5 + this.pressProgress * 0.3;
        const B = this.isPressed ? D : b;
        const y = this.isPressed ? 1 : this.hoverProgress;
        this.updateHoverSquare({
          opacity: y * this.visibilityProgress,
          scale: B,
          borderColor: this.isPressed ? h : "transparent",
        });
        const _ = this.current.x - n;
        const A = this.current.y - s;
        const H = Math.hypot(_, A);
        this.speed += (H - this.speed) * 0.2;
        if (H > 0.05) {
          this.trail.push({
            x: this.current.x,
            y: this.current.y,
          });
          if (this.trail.length > this.trailLength) {
            this.trail.shift();
          }
        }
        const I = this.speed > 1.5 || l > 1.5;
        if (
          this.current.x !== n ||
          this.current.y !== s ||
          this.hoverProgress !== r ||
          this.pressProgress !== c ||
          this.visibilityProgress !== o ||
          this.darkProgress !== f ||
          (I && this.speed !== l)
        ) {
          this.context.clearRect(0, 0, this.width, this.height);
          if (this.visibilityProgress > 0) {
            const k = Math.min(1, Math.max(0, (this.speed - 1.5) / 6));
            if (k > 0.02) {
              this.context.strokeStyle = u;
              this.context.lineWidth = 1.4;
              this.context.lineCap = "round";
              for (let J = 1; J < this.trail.length; J++) {
                const o0 = J / this.trail.length;
                this.context.globalAlpha = o0 * o0 * 0.7 * this.visibilityProgress * k;
                this.context.beginPath();
                this.context.moveTo(this.trail[J - 1].x, this.trail[J - 1].y);
                this.context.lineTo(this.trail[J].x, this.trail[J].y);
                this.context.stroke();
              }
            }
            const O = 9;
            if ((this.isPressed || this.hoverProgress < 0.99) && !this.isDotHidden) {
              const J = this.isPressed ? 1 : 1 - this.hoverProgress;
              this.context.globalAlpha = J * this.visibilityProgress;
              this.context.fillStyle = u;
              this.context.fillRect(this.current.x - O / 2, this.current.y - O / 2, O, O);
            }
          }
          this.context.globalAlpha = 1;
          if (!I && H <= 0.05) {
            this.trail = [
              {
                x: this.current.x,
                y: this.current.y,
              },
            ];
          }
          this.wake();
        }
      }
    }
    if (ax()) {
      new $x().init();
    }
    class ox {
      constructor(x = {}) {
        var c;
        this.wrapper = typeof x.wrapper === "string" ? document.querySelector(x.wrapper) : x.wrapper;
        this.$container = x.container ? $(x.container) : this.wrapper ? $(this.wrapper) : null;
        this.selectors = {
          verticalLine: x.verticalLine || ".line-vertical",
          horizontalLine: x.horizontalLine || ".line-horizital",
          plus: x.plus || ".plus",
          coordi: x.coordi || ".coordi",
          interact: x.interact || null,
          hoverVisibility: x.hoverVisibility || null,
          attrX: x.attrX || '[data-control="x"]',
          attrY: x.attrY || '[data-control="y"]',
        };
        this.currentX = 0;
        this.currentY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.offset = z(16, "rem");
        this.$hoverVisibility = this.selectors.hoverVisibility
          ? (c = this.$container) == null
            ? undefined
            : c.find(this.selectors.hoverVisibility)
          : null;
        this.pauseOutside = Boolean(x.pauseOutside);
        this.isPointerInside = false;
        this.isStarted = false;
        this.isAnimating = false;
        this.raf = null;
        this.onPointerEnter = this.onPointerEnter.bind(this);
        this.onPointerLeave = this.onPointerLeave.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
      }
      updateTargetPosition() {
        if (!this.wrapper) {
          return;
        }
        const n = this.wrapper.getBoundingClientRect();
        this.targetX = f0.mousePos.x - n.left;
        this.targetY = f0.mousePos.y - n.top;
      }
      animateRuler() {
        if (!this.wrapper || !this.$container) {
          return;
        }
        this.minX = this.offset;
        this.maxX = this.wrapper.offsetWidth - this.offset;
        this.minY = this.offset;
        this.maxY = this.wrapper.offsetHeight - this.offset;
        this.currentX = Math.max(this.minX, Math.min(q(this.currentX, this.targetX, 0.3), this.maxX));
        this.currentY = Math.max(this.minY, Math.min(q(this.currentY, this.targetY, 0.3), this.maxY));
        const n = this.$container.find(this.selectors.verticalLine);
        const s = this.$container.find(this.selectors.horizontalLine);
        const r = this.$container.find(this.selectors.plus);
        const c = this.$container.find(this.selectors.coordi);
        const o = this.selectors.interact ? this.$container.find(this.selectors.interact) : null;
        const f = o && o.length ? o.width() : 0;
        const l = o && o.length ? o.height() : 0;
        const u = c.length ? c.width() : 0;
        const a = c.length ? c.height() : 0;
        const h = z(4, "rem");
        const b = z(20, "rem");
        const D = this.wrapper.offsetWidth / 2;
        const B = this.wrapper.offsetHeight / 2;
        const y = Q(this.currentX, this.wrapper.offsetWidth) * D;
        const _ = Q(this.currentY, this.wrapper.offsetHeight) * B;
        const A = this.currentX === this.minX || this.currentX === this.maxX;
        const H = this.currentY === this.minY || this.currentY === this.maxY;
        const I = this.currentX <= this.minX + u + b;
        const Z = this.currentY >= this.maxY - a - b;
        const k = this.currentX <= this.maxX - f - b;
        const O = this.currentY >= this.maxY - l - b;
        const J = (r.length && gsap.getProperty(r.get(0), "scale")) || 1;
        const o0 = q(J, A || H ? 1.2 : 1, 0.08);
        const w0 = (n.length && gsap.getProperty(n.get(0), "opacity")) || 0.16;
        const j = (s.length && gsap.getProperty(s.get(0), "opacity")) || 0.16;
        const L = q(w0, A ? 0 : 0.16, 0.1);
        const m = q(j, H ? 0 : 0.16, 0.1);
        const P = r.length ? gsap.getProperty(r.get(0), "backgroundColor") : "";
        const F = (typeof P == "string" && P.includes(",") && parseFloat(P.split(",")[3])) || 0;
        const t0 = A && H ? 1 : 0;
        const G = q(F, t0, 0.08);
        const i0 = f / 2 + h;
        const d0 = l / 2 + h;
        const yx = u / 2 + h;
        const X0 = a / 2 + h;
        const Lt = k ? y + i0 : y - i0;
        const Mt = O ? _ - d0 : _ + d0;
        const vx = y - yx;
        const zt = y >= 0 ? vx : y + yx;
        const _x = I ? _ - X0 : _ + X0;
        const Dt = _ >= 0 ? _ - X0 : _x;
        if (n.length) {
          gsap.set(n, {
            x: y,
            autoAlpha: L,
          });
        }
        if (s.length) {
          gsap.set(s, {
            y: _,
            autoAlpha: m,
          });
        }
        if (r.length) {
          gsap.set(r, {
            x: y,
            y: _,
            scale: o0,
            color: "rgba(57, 103, 188, " + (1 - G) + ")",
          });
        }
        if (o && o.length) {
          gsap.set(o, {
            x: Lt,
            y: k ? Mt : _ - d0,
            autoAlpha: k && !O ? 1 - G : 0,
          });
        }
        if (c.length) {
          gsap.set(c, {
            x: I ? zt : vx,
            y: Z ? Dt : _x,
            autoAlpha: 1 - G,
          });
        }
        if (this.selectors.attrX) {
          const G0 = this.selectors.attrX + ', [data-loading-control="x"], [data-control="x"]';
          $(G0).text(this.targetX.toFixed(0));
        }
        if (this.selectors.attrY) {
          const G0 = this.selectors.attrY + ', [data-loading-control="y"], [data-control="y"]';
          $(G0).text(this.targetY.toFixed(0));
        }
      }
      renderLoop() {
        if (this.isAnimating) {
          this.updateTargetPosition();
          this.animateRuler();
          this.raf = requestAnimationFrame(() => this.renderLoop());
        }
      }
      updateHoverVisibility(x = false) {
        var s;
        if ((s = this.$hoverVisibility) != null && s.length) {
          gsap.to(this.$hoverVisibility, {
            autoAlpha: this.isPointerInside ? 1 : 0,
            duration: x ? 0 : 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
      onPointerEnter() {
        this.isPointerInside = true;
        this.updateHoverVisibility();
        if (this.pauseOutside) {
          this.resume();
        }
      }
      onPointerLeave() {
        this.isPointerInside = false;
        this.updateHoverVisibility();
        if (this.pauseOutside) {
          this.pause();
        }
      }
      onPointerMove() {
        if (!this.isPointerInside) {
          this.onPointerEnter();
        }
      }
      resume() {
        if (!!this.wrapper && !this.isAnimating) {
          this.isAnimating = true;
          this.renderLoop();
        }
      }
      pause() {
        this.isAnimating = false;
        if (this.raf !== null) {
          cancelAnimationFrame(this.raf);
        }
        this.raf = null;
      }
      start() {
        var n;
        if (!!this.wrapper && !this.isStarted) {
          this.isStarted = true;
          this.isPointerInside = this.wrapper.matches(":hover");
          if (((n = this.$hoverVisibility) != null && n.length) || this.pauseOutside) {
            this.wrapper.addEventListener("mouseenter", this.onPointerEnter);
            this.wrapper.addEventListener("mouseleave", this.onPointerLeave);
            this.wrapper.addEventListener("mousemove", this.onPointerMove);
          }
          this.updateHoverVisibility(true);
          if (!this.pauseOutside || this.isPointerInside) {
            this.resume();
          }
        }
      }
    }
    class Ix {
      constructor() {
        this.tlLoadDone = null;
        this.tlLoadMaster = null;
        this.el = null;
        this.rulerWrap = null;
        this.rulerController = null;
      }
      init(x) {
        this.setupDOM();
        this.setupAnim(x);
        if (!w()) {
          this.rulerController = new ox({
            wrapper: ".loading",
            container: ".loading",
            verticalLine: ".loading-ruler-line.line-vertical",
            horizontalLine: ".loading-ruler-line.line-horizital",
            plus: ".loading-ruler-plus",
            coordi: ".loading-ruler-coordi",
            hoverVisibility: ".loading-ruler",
            pauseOutside: true,
            attrX: '[data-loading-control="x"]',
            attrY: '[data-loading-control="y"]',
          });
          this.rulerController.start();
          $(window).one("mousemove", () => {
            $(".loading-inner").find(".loading-ruler").addClass("active");
          });
        }
      }
      setupDOM(x) {
        this.rulerWrap = document.querySelector(".loading-inner");
        this.el = document.querySelector(".loading");
        let s = $(".home-hero-img-wrap");
        if (s.length > 0) {
          let u = s.width();
          let a = s.height();
          gsap.set(".loading-img", {
            width: u,
            height: a,
          });
        }
        this.svgElements = document.querySelectorAll(".loading-img svg path, .loading-img svg line");
        this.svgElements.forEach((u) => {
          let h = 0;
          try {
            h = u.getTotalLength();
          } catch {}
          if (!h || h === 0) {
            h = 2000;
          }
          gsap.set(u, {
            strokeDasharray: h,
            strokeDashoffset: h,
          });
        });
        this.heroHeight = $(".home-hero-content").height() || 0;
        this.headerHeight = $(".header").height() || 0;
        let r = $(".loading");
        let c = r.length ? r.offset().top : 0;
        let o = r.length ? r.outerHeight() : window.innerHeight;
        let f = $(".loading-progress-item.item-top");
        if (f.length) {
          let u = f.offset().top - c;
          let a = this.headerHeight;
          this.deltaTopY = a - u - 1;
        } else {
          this.deltaTopY = this.headerHeight - 1;
        }
        let l = $(".loading-progress-item.item-bot");
        if (l.length) {
          let u = l.offset().top - c;
          let a = o - this.heroHeight - l.outerHeight();
          this.deltaBotY = a - u + 1;
        } else {
          this.deltaBotY = -this.heroHeight + 1;
        }
        this.title = new SplitText(".loading-content-title .heading", {
          type: "lines, words",
          linesClass: "bp-line",
          mask: "lines",
        });
        gsap.set(this.title.words, {
          opacity: 0,
          yPercent: 100,
        });
        gsap.set(".loading-content-sub .loading-content-sub-item-txt", {
          opacity: 0,
        });
      }
      setupAnim(x) {
        this.tlLoading = gsap.timeline({
          paused: true,
        });
        this.tlLoadMaster = gsap.timeline({
          paused: true,
          onStart: () => {
            this.onceSetup(x);
          },
          onComplete: () => {
            gsap.to(".loading-content, .loading-content-title, .loading-progress-text", {
              opacity: 0,
              duration: 0.4,
              ease: "power2.out",
            });
            const f = document.querySelector(".loading-progress-item.item-top");
            const l = document.querySelector(".loading-progress-item.item-bot");
            const u = window.innerHeight;
            gsap.to(".loading-progress-item.item-bot", {
              y: this.deltaBotY,
              backgroundColor: "#b3b3af",
              duration: 0.4,
              ease: "cubic-bezier(1, 0, 0.44, 1)",
            });
            gsap.to(".loading-progress-item.item-top", {
              y: this.deltaTopY,
              backgroundColor: "#b3b3af",
              duration: 0.4,
              ease: "cubic-bezier(1, 0, 0.44, 1)",
              onUpdate: () => {
                let b = f ? f.getBoundingClientRect().bottom : this.headerHeight;
                let D = l ? l.getBoundingClientRect().top : u - this.heroHeight;
                let B = Math.max(0, Math.min(100, (b / u) * 100));
                let y = Math.max(0, Math.min(100, (D / u) * 100));
                gsap.set(".loading-main", {
                  clipPath:
                    "polygon(0% 0%, 100% 0%, 100% " +
                    B +
                    "%, 0% " +
                    B +
                    "%, 0% " +
                    y +
                    "%, 100% " +
                    y +
                    "%, 100% 100%, 0% 100%)",
                });
              },
              onComplete: () => {
                let b = (this.headerHeight / u) * 100;
                let D = ((u - this.heroHeight) / u) * 100;
                let B = {
                  top: b,
                  bot: D,
                };
                gsap.to(B, {
                  top: 0,
                  bot: 100,
                  duration: 0,
                  ease: "power2.inOut",
                  onUpdate: () => {
                    gsap.set(".loading-main", {
                      clipPath:
                        "polygon(0% 0%, 100% 0%, 100% " +
                        B.top +
                        "%, 0% " +
                        B.top +
                        "%, 0% " +
                        B.bot +
                        "%, 100% " +
                        B.bot +
                        "%, 100% 100%, 0% 100%)",
                    });
                  },
                  onComplete: () => {
                    this.oncePlay(x);
                  },
                });
              },
            });
          },
        });
        let r = {
          value: 0,
        };
        this.tlLoadMaster
          .to(
            this.svgElements,
            {
              strokeDashoffset: 0,
              duration: 1.3,
              stagger: {
                amount: 3,
                from: "start",
              },
              ease: "power1.out",
            },
            0,
          )
          .to(
            this.title.words,
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.5,
              stagger: 0.02,
              ease: "power2.out",
              onComplete: () => {
                this.title.revert();
              },
            },
            0,
          )
          .to(
            ".loading-progress-text",
            {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            },
            0,
          )
          .to(
            r,
            {
              value: 100,
              keyframes: [
                {
                  value: 60,
                  duration: 3,
                  ease: "power2.out",
                },
                {
                  value: 100,
                  duration: 2.5,
                  ease: "power3.out",
                },
              ],
              onUpdate: () => {
                const o = Math.round(r.value);
                gsap.set(".loading-progress-item-wrap", {
                  width: o + "%",
                });
                $(".loading-progress-txt-percent").text("" + o);
              },
            },
            0,
          )
          .to(
            ".loading-content-sub .loading-content-sub-item-txt",
            {
              opacity: 1,
              duration: 0.25,
              stagger: 0.3,
              ease: "power3.out",
            },
            0,
          );
      }
      play(x) {
        $("[df-init]").removeAttr("df-init");
        if (this.tlLoadMaster) {
          this.tlLoadMaster.timeScale(12).play();
        }
      }
      onceSetup(x) {
        K0.triggerOnceSetup(x);
      }
      oncePlay(x) {
        K0.triggerOncePlay(x);
        if (typeof x0 !== "undefined") {
          x0.animateHeaderOnHome(x);
        }
        setTimeout(() => {
          $(".loading").addClass("loaded");
        }, 100);
        setTimeout(() => {
          Kx();
        }, 1500);
        if (d.w > 767) {
          $(".body").css({
            overflow: "initial",
            position: "relative",
            "max-height": "none",
            inset: "auto",
          });
        }
      }
    }
    const lx = new Ix();
    // Ink hover for .btn-fill: a turbulence-edged circle spreads from where the pointer enters
    // and drains toward where it leaves. A light copy of the label is revealed by the same circle.
    const y0 = (() => {
      const SVG_NS = "http://www.w3.org/2000/svg";
      const PAD = 14; // shape overhang so the displaced edge never shows along the button border
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const seen = new WeakSet();
      let defs = null;
      let uid = 0;
      function svgEl(tag, attrs) {
        const node = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
        return node;
      }
      // One filter per button so each edge's "wetness" can animate independently.
      function createFilter() {
        if (!defs) {
          defs = svgEl("svg", { "aria-hidden": "true", width: "0", height: "0" });
          defs.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
          document.body.appendChild(defs);
        }
        const filter = svgEl("filter", { id: "btn-ink-" + ++uid, x: "-30%", y: "-60%", width: "160%", height: "220%" });
        filter.append(
          svgEl("feTurbulence", { type: "fractalNoise", baseFrequency: "0.07", numOctaves: "2", seed: String((uid % 9) + 1), result: "n" }),
          svgEl("feDisplacementMap", { in: "SourceGraphic", in2: "n", scale: "8", xChannelSelector: "R", yChannelSelector: "G" }),
        );
        defs.appendChild(filter);
        return filter;
      }
      function f(root = document) {
        if (root) {
          root.querySelectorAll(".btn-fill").forEach(l);
        }
      }
      function l(u) {
        if (seen.has(u)) {
          return;
        }
        const bg = u.querySelector(".btn-fill-bg");
        if (!bg) {
          return;
        }
        seen.add(u);
        const root = getComputedStyle(document.documentElement);
        const restingColor = getComputedStyle(u).color;
        const activeColor = (u.dataset.fillColor || "").trim() || root.getPropertyValue("--content--white").trim() || "#fff";
        const inkColor = getComputedStyle(bg).backgroundColor;

        const top = u.cloneNode(true);
        top.querySelector(".btn-fill-bg")?.remove();
        top.classList.add("btn-ink-top");
        top.setAttribute("aria-hidden", "true");
        top.style.color = activeColor;
        u.appendChild(top);
        // Pin the resting color so CSS :hover rules don't turn the base label white before the ink arrives.
        u.style.color = restingColor;

        const filter = createFilter();
        const disp = filter.querySelector("feDisplacementMap");
        const shape = document.createElement("div");
        shape.className = "btn-ink-shape";
        shape.style.cssText = `inset:-${PAD}px;background-color:${inkColor}`;
        bg.style.background = "none";
        bg.style.filter = `url(#${filter.id})`;
        bg.appendChild(shape);

        let border = { top: 0, left: 0 };
        const measure = () => {
          const cs = getComputedStyle(u);
          border = { top: parseFloat(cs.borderTopWidth) || 0, left: parseFloat(cs.borderLeftWidth) || 0 };
          top.style.top = -border.top + "px";
          top.style.left = -border.left + "px";
          top.style.width = u.offsetWidth + "px";
          top.style.height = u.offsetHeight + "px";
        };
        measure();
        if (typeof ResizeObserver !== "undefined") {
          new ResizeObserver(measure).observe(u);
        }

        const s = { r: 0, x: 0, y: 0, wet: 8 };
        const draw = () => {
          // bg sits inside the border and the shape overhangs it by PAD; top shares the button's border box
          const sx = s.x - border.left + PAD;
          const sy = s.y - border.top + PAD;
          shape.style.clipPath = `circle(${s.r}px at ${sx}px ${sy}px)`;
          top.style.clipPath = `circle(${Math.max(s.r - 6, 0)}px at ${s.x}px ${s.y}px)`;
          bg.style.visibility = s.r > 0 ? "visible" : "hidden";
          disp.setAttribute("scale", s.wet.toFixed(2));
        };
        draw();
        const point = (e) => {
          const rect = u.getBoundingClientRect();
          return { x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width, h: rect.height };
        };
        const reach = (p) => Math.hypot(Math.max(p.x, p.w - p.x), Math.max(p.y, p.h - p.y)) + PAD;

        u.addEventListener("pointerenter", (e) => {
          if (e.pointerType === "touch") {
            return;
          }
          const p = point(e);
          gsap.killTweensOf(s);
          if (reduced.matches) {
            Object.assign(s, { r: reach(p), x: p.x, y: p.y, wet: 8 });
            draw();
            return;
          }
          const tl = gsap.timeline({ onUpdate: draw });
          if (s.r < 1) {
            // fresh drop: a small blot soaks in at the pointer before spreading
            Object.assign(s, { r: 0, x: p.x, y: p.y, wet: 18 });
            tl.to(s, { r: 7, duration: 0.12, ease: "power2.out" }, 0);
          }
          tl.to(s, { r: reach(p), x: p.x, y: p.y, duration: 0.95, ease: "power2.inOut" }, s.r < 1 ? 0.08 : 0).to(
            s,
            { wet: 8, duration: 1, ease: "power1.in" },
            0,
          );
        });
        u.addEventListener("pointerleave", (e) => {
          if (e.pointerType === "touch") {
            return;
          }
          const p = point(e);
          gsap.killTweensOf(s);
          if (reduced.matches) {
            s.r = 0;
            draw();
            return;
          }
          gsap
            .timeline({ onUpdate: draw })
            .to(s, { r: 0, x: p.x, y: p.y, duration: 0.65, ease: "power3.inOut" }, 0)
            .to(s, { wet: 16, duration: 0.65, ease: "power1.in" }, 0);
        });
      }
      return {
        init: f,
      };
    })();
    class Xx {
      constructor() {
        this.namespace = null;
      }
      init(x) {
        this.namespace = x.next.namespace;
        this.refreshOnBreakpoint();
        this.updateLink(x);
        if (d.w > 991) {
          y0.init(document.querySelector(".header"));
          y0.init(document.querySelector(".cookie"));
          y0.init(x.next.container);
        }
      }
      updateLink(x) {
        var b;
        var D;
        const r = (B) => B.replace(/\/+$/, "") || "/";
        const c = (B) => {
          if (!B || B.trim() === "#" || /^(mailto:|tel:|javascript:)/i.test(B)) {
            return null;
          }
          try {
            const A = new URL(B, window.location.origin);
            if (A.origin === window.location.origin) {
              return A;
            } else {
              return null;
            }
          } catch {
            return null;
          }
        };
        const o = (B) => {
          const _ = c(B);
          if (!_) {
            return null;
          }
          const A = r(_.pathname);
          const H = _.hash.slice(1) || _.searchParams.get("sc") || "";
          return "" + A + (H ? "#" + H : "");
        };
        const f =
          ((D = (b = x == null ? undefined : x.next) == null ? undefined : b.url) == null
            ? undefined
            : D.href) || window.location.href;
        const l = c(f) || new URL(window.location.href);
        const u = r(l.pathname);
        const a = o(f) || o(window.location.href);
        const h = (B = o(window.location.href)) => {
          $("a").each(function () {
            const _ = o($(this).attr("href")) === B;
            $(this).toggleClass("is-current", _);
            $(this).attr("aria-current", _ ? "page" : "");
          });
        };
        $("a").each(function () {
          const y = $(this);
          let _ = y.attr("href") || "/";
          if (y.attr("data-sub-link") && !_.includes("#") && !_.includes("?sc=")) {
            _ = (_.replace(/\/+$/, "") || "/") + "#" + y.attr("data-sub-link");
            y.attr("href", _);
            y.attr("data-barba-history", "replace");
          }
          const A = c(_);
          if (!A) {
            return;
          }
          const H = r(A.pathname);
          const I = A.hash.slice(1) || A.searchParams.get("sc") || "";
          if (I) {
            y.attr("href", H === u ? u + "#" + I : H + "?sc=" + encodeURIComponent(I));
          }
        });
        h(a);
      }
      refreshOnBreakpoint() {}
      refreshOnBreakpoint() {
        const s = [479, 767, 991];
        const r = d.w || document.documentElement.clientWidth;
        const c = s.find((o) => r < o) || s[s.length - 1];
        window.addEventListener(
          "resize",
          Y(function () {
            const l = d.w || document.documentElement.clientWidth;
            if ((r < c && l >= c) || (r >= c && l < c)) {
              location.reload();
            }
          }),
        );
      }
    }
    const N0 = new Xx();
    class Gx {
      constructor() {}
      triggerEvent(x, n) {
        const r = new CustomEvent(x, {
          detail: n,
        });
        n.next.container.dispatchEvent(r);
      }
      triggerOnceSetup(x) {
        fx(x);
        this.triggerEvent("onceSetup", x);
      }
      triggerOncePlay(x) {
        this.triggerEvent("oncePlay", x);
        requestAnimationFrame(() => window.scrollY === 0 && window.scrollTo(0, 1));
      }
    }
    const K0 = new Gx();
    class a0 {
      constructor() {
        this.tlTrigger = null;
        this.once = true;
      }
      setTrigger(x, n) {
        this.tlTrigger = gsap.timeline({
          scrollTrigger: {
            trigger: x,
            start: "clamp(top bottom+=50%)",
            end: "bottom top-=50%",
            onEnter: () => {
              if (this.once) {
                this.once = false;
                this.onTrigger();
              }
            },
            onEnterBack: () => {
              if (this.once) {
                this.once = false;
                this.onTrigger();
              }
            },
          },
        });
      }
    }
    class kx {
      constructor() {
        this.el = null;
        this.hideTimeout = null;
      }
      init(x) {
        this.el = document.querySelector(".header");
        if (d.w <= 991) {
          this.toggleNav();
        }
      }
      animateHeaderOnHome(x) {
        let r = this.el || document.querySelector(".header");
        if (r) {
          this.tlHeader = gsap.timeline({
            delay: 0.1,
          });
          new U({
            timeline: this.tlHeader,
            allowMobile: true,
            tweenArr: [
              ...Array.from($(r).find(".line-vertical")).flatMap((o, f) => {
                return new B0({
                  el: o,
                  type: "bottom",
                  delay: f * 0.0001,
                });
              }),
              new X({
                el: $(r).find(".header-logo"),
                type: "none",
                delay: 0.2,
              }),
              ...Array.from($(r).find(".header-menu-item, .header-nav-item")).map(
                (o, f) =>
                  new X({
                    el: o,
                    type: "none",
                    delay: f * 0 + 0.25,
                  }),
              ),
              new X({
                el: $(r).find(".header-menu-btn .txt"),
                type: "none",
                delay: 0.2,
              }),
              new X({
                el: $(r).find(".header-menu-btn-ic"),
                type: "none",
                delay: 0.2,
              }),
            ],
          });
          this.tlHeader.play();
        }
      }
      updateOnScroll(x) {
        if (d.w > 991) {
          this.toggleHide(x);
        }
        this.toggleScroll(x);
      }
      toggleScroll(x) {
        if (x.scroll > $(this.el).height() * 1) {
          $(this.el).addClass("on-scroll");
        } else {
          $(this.el).removeClass("on-scroll");
        }
      }
      toggleHide(x) {
        if (x.direction == 1) {
          if (x.scroll > $(this.el).height() * 5) {
            $(this.el).addClass("on-hide");
          }
        } else if (x.direction == -1) {
          if (x.scroll > $(this.el).height() * 5) {
            $(this.el).addClass("on-hide");
            $(this.el).removeClass("on-hide");
            if (
              x.scroll > $(this.el).height() * 5 &&
              x.scroll === S.scroller.scrollY &&
              x.velocity === 0 &&
              !$(this.el).hasClass("on-hide") &&
              !$(this.el).is(":hover")
            ) {
              this.hideTimeout = setTimeout(() => {
                $(this.el).addClass("on-hide");
              }, 100);
            }
          }
        } else {
          $(this.el).removeClass("on-hide");
        }
      }
      toggleNav() {
        $(this.el)
          .find(".header-menu-btn")
          .on("click", (s) => {
            s.preventDefault();
            $(s.currentTarget).closest(".header-menu-btn").toggleClass("active");
            $(this.el).find(".header-menu").toggleClass("active");
          });
        if (d.w < 991) {
          $(this.el)
            .find(".header-menu-item.has-submenu")
            .on("click", function (s) {
              s.preventDefault();
              $(this).toggleClass("active");
              $(this).next(".header-menu-dropdown").slideToggle();
            });
        }
      }
    }
    const x0 = new kx();
    let Zx = 0;
    class Jx {
      constructor(x) {
        var s;
        var r;
        var c;
        var o;
        var f;
        var l;
        var u;
        var a;
        var h;
        var b;
        var D;
        var B;
        var y;
        var _;
        this.el = x;
        this.backdrop = (s = this.el) == null ? undefined : s.querySelector(".ink-mask-img.main");
        this.svg = (r = this.el) == null ? undefined : r.querySelector(".ink-mask-img.sub .layer");
        this.mask = (c = this.svg) == null ? undefined : c.querySelector(".mask");
        this.filter = (o = this.svg) == null ? undefined : o.querySelector("filter");
        this.turbulence = (f = this.filter) == null ? undefined : f.querySelector("feTurbulence");
        this.displacement = (l = this.filter) == null ? undefined : l.querySelector("feDisplacementMap");
        this.blur = (u = this.filter) == null ? undefined : u.querySelector("feGaussianBlur");
        this.alphaTransfer = (a = this.filter) == null ? undefined : a.querySelector("feFuncA");
        this.maskRoot = (h = this.mask) == null ? undefined : h.closest("mask");
        this.pulseMasks = [];
        this.raf = null;
        this.isEntered = false;
        this.current = {
          x: 0,
          y: 0,
        };
        this.pulseCurrent = {
          x: 0,
          y: 0,
        };
        this.target = {
          x: 0,
          y: 0,
        };
        this.viewBox = {
          width: 1000,
          height: 1000,
        };
        this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.isReady = false;
        if (
          !!this.el &&
          !!this.backdrop &&
          !!this.svg &&
          !!this.mask &&
          this.mask.tagName.toLowerCase() === "circle"
        ) {
          this.onPointerEnter = this.handlePointerEnter.bind(this);
          this.onPointerMove = this.handlePointerMove.bind(this);
          this.onPointerLeave = this.handlePointerLeave.bind(this);
          this.onResize = Y(() => this.updateMetrics(), 100);
          this.svg.style.pointerEvents = "none";
          this.mask.setAttribute("r", "0");
          if (this.filter) {
            const A = "pointerInkFilter-" + ++Zx;
            this.filter.setAttribute("id", A);
            this.filter.setAttribute("x", "-25%");
            this.filter.setAttribute("y", "-25%");
            this.filter.setAttribute("width", "150%");
            this.filter.setAttribute("height", "150%");
            this.mask.style.filter = "url(#" + A + ")";
          }
          this.setupPulseMasks();
          if ((b = this.turbulence) != null) {
            b.setAttribute("baseFrequency", "0.028 0.04");
          }
          if ((D = this.turbulence) != null) {
            D.setAttribute("numOctaves", "3");
          }
          if ((B = this.blur) != null) {
            B.setAttribute("stdDeviation", "0.55");
          }
          if ((y = this.alphaTransfer) != null) {
            y.setAttribute("slope", "5");
          }
          if ((_ = this.alphaTransfer) != null) {
            _.setAttribute("intercept", "-2.15");
          }
          this.updateMetrics();
          this.el.addEventListener("pointerenter", this.onPointerEnter);
          this.el.addEventListener("pointermove", this.onPointerMove);
          this.el.addEventListener("pointerleave", this.onPointerLeave);
          window.addEventListener("resize", this.onResize);
          this.isReady = true;
        }
      }
      setupPulseMasks() {
        if (this.maskRoot) {
          this.pulseMasks = Array.from(
            {
              length: 1,
            },
            () => {
              const n = this.mask.cloneNode(false);
              n.removeAttribute("class");
              n.setAttribute("r", "0");
              n.setAttribute("opacity", "0");
              n.setAttribute("data-pointer-ink-pulse", "");
              this.maskRoot.appendChild(n);
              return n;
            },
          );
        }
      }
      updateMetrics() {
        var s;
        var r;
        var c;
        var o;
        var f;
        if (!this.el || !this.svg || !this.mask) {
          return;
        }
        const n = this.el.getBoundingClientRect();
        if (!!n.width && !!n.height) {
          this.viewBox.width = 1000;
          this.viewBox.height = (n.height / n.width) * this.viewBox.width;
          this.radius = Math.min(this.viewBox.width, this.viewBox.height) * 0.45;
          this.svg.setAttribute("viewBox", "0 0 " + this.viewBox.width + " " + this.viewBox.height);
          if ((s = this.maskRoot) != null) {
            s.setAttribute("maskUnits", "userSpaceOnUse");
          }
          if ((r = this.maskRoot) != null) {
            r.setAttribute("x", "0");
          }
          if ((c = this.maskRoot) != null) {
            c.setAttribute("y", "0");
          }
          if ((o = this.maskRoot) != null) {
            o.setAttribute("width", this.viewBox.width);
          }
          if ((f = this.maskRoot) != null) {
            f.setAttribute("height", this.viewBox.height);
          }
          if (this.displacement) {
            this.displacement.setAttribute("scale", Math.min(150, this.radius * 0.7));
          }
        }
      }
      setPointer(x, n = false) {
        const r = this.el.getBoundingClientRect();
        if (!!r.width && !!r.height) {
          this.target.x = Math.max(
            0,
            Math.min(this.viewBox.width, ((x.clientX - r.left) / r.width) * this.viewBox.width),
          );
          this.target.y = Math.max(
            0,
            Math.min(this.viewBox.height, ((x.clientY - r.top) / r.height) * this.viewBox.height),
          );
          if (n || this.reducedMotion) {
            this.current.x = this.target.x;
            this.current.y = this.target.y;
            this.pulseCurrent.x = this.target.x;
            this.pulseCurrent.y = this.target.y;
            this.render();
          } else {
            this.requestRender();
          }
        }
      }
      handlePointerEnter(x) {
        this.isEntered = true;
        this.setPointer(x, true);
        this.requestRender();
        gsap.killTweensOf(this.mask);
        gsap.to(this.mask, {
          attr: {
            r: this.radius,
          },
          duration: this.reducedMotion ? 0 : 0.55,
          ease: "linear",
          overwrite: true,
        });
        const s = this.pulseMasks[0];
        if (s) {
          gsap.killTweensOf(s);
          gsap.to(s, {
            attr: {
              r: this.radius * 1.05,
            },
            opacity: 0.2,
            duration: this.reducedMotion ? 0 : 0.45,
            ease: "linear",
            overwrite: true,
          });
        }
      }
      handlePointerMove(x) {
        if (this.isEntered) {
          this.setPointer(x);
        }
      }
      handlePointerLeave() {
        this.isEntered = false;
        gsap.killTweensOf(this.mask);
        gsap.to(this.mask, {
          attr: {
            r: 0,
          },
          duration: this.reducedMotion ? 0 : 0.8,
          ease: "linear",
          overwrite: true,
        });
        const n = this.pulseMasks[0];
        if (n) {
          gsap.killTweensOf(n);
          gsap.to(n, {
            attr: {
              r: 0,
            },
            opacity: 0,
            duration: this.reducedMotion ? 0 : 1,
            ease: "linear",
            overwrite: true,
          });
        }
      }
      requestRender() {
        this.raf ||= requestAnimationFrame(() => this.render());
      }
      render() {
        this.raf = null;
        if (!this.mask) {
          return;
        }
        this.current.x = q(this.current.x, this.target.x, 0.09);
        this.current.y = q(this.current.y, this.target.y, 0.09);
        this.pulseCurrent.x = q(this.pulseCurrent.x, this.target.x, 0.15);
        this.pulseCurrent.y = q(this.pulseCurrent.y, this.target.y, 0.15);
        this.mask.setAttribute("cx", this.current.x);
        this.mask.setAttribute("cy", this.current.y);
        this.pulseMasks.forEach((r) => {
          r.setAttribute("cx", this.pulseCurrent.x);
          r.setAttribute("cy", this.pulseCurrent.y);
        });
        if (
          this.isEntered &&
          (Math.abs(this.target.x - this.current.x) > 0.1 || Math.abs(this.target.y - this.current.y) > 0.1)
        ) {
          this.requestRender();
        }
      }
    }
    class ux {
      constructor() {
        this.el = null;
        this.tlOverlap = null;
        this.raf = null;
        this.tlTitle = null;
        this.tlMenu = null;
        this.tlInfo = null;
        this.tlLogo = null;
        this.tlImg = null;
        this.copyright = null;
        this.footerLogoWrap = null;
        this.logoInk = null;
      }
      init(x) {
        this.el = x.next.container.querySelector(".footer");
        this.onTrigger();
      }
      onTrigger() {
        this.animationReveal();
        this.interact();
      }
      animationReveal() {
        this.tlTitle = gsap.timeline({
          scrollTrigger: {
            trigger: $(this.el).find(".footer-title-wrap"),
            start: "top+=55% bottom",
            once: true,
          },
        });
        new U({
          timeline: this.tlTitle,
          triggerInit: this.el,
          tweenArr: [
            new p({
              el: $(this.el).find(".footer-title").get(0),
            }),
          ],
        });
        this.tlMenu = gsap.timeline({
          scrollTrigger: {
            trigger: $(this.el).find(".footer-menu"),
            start: "top+=55% bottom",
            once: true,
          },
        });
        $(this.el)
          .find(".footer-menu-item")
          .each((s, r) => {
            new U({
              stagger: 0.05,
              timeline: this.tlMenu,
              triggerInit: this.el,
              tweenArr: [
                new p({
                  el: $(r).find(".footer-menu-item-label .txt").get(0),
                }),
                ...Array.from($(r).find(".footer-menu-item-link")).flatMap((o) => [
                  new p({
                    el: $(o).find(".txt").get(0),
                  }),
                ]),
              ],
            });
          });
        this.tlInfo = gsap.timeline({
          scrollTrigger: {
            trigger: $(this.el).find(".footer-info-wrap"),
            start: "top+=55% bottom",
            once: true,
          },
        });
        $(this.el)
          .find(".footer-info-item")
          .each((s, r) => {
            new U({
              timeline: this.tlInfo,
              triggerInit: this.el,
              tweenArr: [
                ...Array.from($(r).find(".footer-info-item-label")).flatMap((o) => [
                  new p({
                    el: $(o).find(".txt").get(0),
                  }),
                ]),
                ...Array.from($(r).find(".footer-info-item-title")).flatMap((o) => [
                  new p({
                    el: $(o).find(".txt").get(0),
                  }),
                ]),
              ],
            });
          });
        this.tlLogo = gsap.timeline({
          scrollTrigger: {
            trigger: $(this.el).find(".footer-logo"),
            start: "top+=55% bottom",
            once: true,
          },
        });
        new U({
          timeline: this.tlLogo,
          triggerInit: this.el,
          tweenArr: [
            new s0({
              el: $(this.el).find(".footer-logo-inner").get(0),
            }),
          ],
        });
        this.tlImg = gsap.timeline({
          scrollTrigger: {
            trigger: $(this.el).find(".footer-img-wrap"),
            start: "top+=55% bottom",
            once: true,
          },
        });
        new U({
          timeline: this.tlImg,
          triggerInit: this.el,
          tweenArr: [
            ...Array.from($(this.el).find(".footer-img-plus")).flatMap((s) => [
              new s0({
                el: $(s).get(0),
              }),
            ]),
          ],
        });
        this.copyright = gsap.timeline({
          scrollTrigger: {
            trigger: $(this.el).find(".footer-copyright-wrap"),
            start: "top+=35% bottom",
            once: true,
          },
        });
        new U({
          timeline: this.copyright,
          triggerInit: this.el,
          tweenArr: [
            new p({
              el: $(this.el).find(".footer-copyright-txt .txt").get(0),
            }),
            ...Array.from($(this.el).find(".footer-policy-item")).flatMap((s) => [
              new p({
                el: $(s).find(".txt").get(0),
              }),
            ]),
          ],
        });
        new P0({
          el: $(this.el).find(".footer-logo-inner .ic-embed").get(0),
          speed: 0.2,
        });
      }
      interact() {
        this.hoverLogo();
      }
      hoverLogo() {
        var r;
        this.footerLogoWrap = $(this.el).find(".footer-img-wrap").get(0);
        const n = (r = this.footerLogoWrap) == null ? undefined : r.querySelector(".ink-mask");
        const s = window.matchMedia
          ? window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches
          : !w();
        if (!!n && !!s) {
          this.logoInk = new Jx(n);
        }
      }
    }
    const b0 = new ux();
    function fx(t) {
      $(t.next.container)
        .find(".ink-mask")
        .each(function (n) {
          const r = $(this);
          const c = "inkCircleMask-" + n;
          r.find("mask").attr("id", c);
          const f = r.find("image");
          f.attr("mask", "url(#" + c + ")");
          f.css({
            "-webkit-mask-image": "url(#" + c + ")",
          });
        });
    }
    class p0 {
      constructor(x) {
        this.DOM = {
          el: null,
          svg: null,
          mask: null,
          image: null,
        };
        this.DOM.el = x;
        if (
          !this.DOM.el ||
          ((this.DOM.backdrop = this.DOM.el.querySelector(".ink-mask-img.main")),
          (this.DOM.imgsub = this.DOM.el.querySelector(".ink-mask-img.sub")),
          (this.DOM.svg = this.DOM.el.querySelector(".layer")),
          !this.DOM.backdrop || !this.DOM.svg) ||
          ((this.DOM.mask = this.DOM.svg.querySelector(".mask")),
          (this.DOM.image = this.DOM.svg.querySelector("image")),
          !this.DOM.mask || !this.DOM.image)
        ) {
          return;
        }
        this.start = (parseFloat($(this.DOM.backdrop).attr("data-start")) / 100) * window.innerHeight;
        this.end = (parseFloat($(this.DOM.backdrop).attr("data-end")) / 100) * window.innerHeight;
        this.isSafari =
          /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
          /firefox|fxios/i.test(navigator.userAgent);
        if (this.isSafari) {
          if (!this.DOM.imgsub) {
            return;
          }
          $(this.DOM.imgsub).find("filter").remove();
          $(this.DOM.imgsub).find("image").removeAttr("mask");
          $(this.DOM.imgsub).find("image").css("mask-image", "unset");
        }
        const s = 1000;
        const r = this.DOM.el.offsetWidth;
        const c = this.DOM.el.offsetHeight;
        if (!r || !c) {
          return;
        }
        const o = (c / r) * s;
        this.DOM.svg.setAttribute("viewBox", "0 0 " + s + " " + o);
        this.isCircle = this.DOM.mask.tagName.toLowerCase() === "circle";
        if (this.isCircle) {
          this.startVal = parseFloat(this.DOM.mask.getAttribute("r")) || 0;
          this.endVal = Math.sqrt(s * s + o * o) / 2;
        } else {
          this.startPath = this.DOM.mask.getAttribute("d");
          this.endPath = this.DOM.mask.dataset.valueFinal;
          this.startNums = this.parsePath(this.startPath);
          this.endNums = this.parsePath(this.endPath);
          const f = o / s;
          this.startNums = this.scalePathY(this.startNums, f);
          this.endNums = this.scalePathY(this.endNums, f);
          this.startPath = this.buildPath(this.startPath, this.startNums);
          this.endPath = this.buildPath(this.endPath, this.endNums);
          this.DOM.mask.setAttribute("d", this.startPath);
          if (this.isSafari) {
            this.DOM.mask.setAttribute("d", this.endPath);
            this.translateYStart = this.startNums[1] - this.endNums[1];
          } else {
            this.pathChunks = this.startPath.split(/-?\d+\.?\d*/g);
          }
        }
        this.updateMetrics();
        window.addEventListener("resize", () => {
          this.updateMetrics();
          this.updateOnScroll();
        });
        this.scrub();
      }
      updateMetrics() {
        if (!this.DOM.el) {
          return;
        }
        const n = this.DOM.el.getBoundingClientRect();
        this.cachedHeight = n.height;
        const s = typeof S !== "undefined" && S.lenis ? S.lenis.scroll : window.scrollY;
        this.cachedTop = n.top + s;
        this.totalTravel = this.start - this.end + this.cachedHeight;
      }
      scrub() {
        this.updateOnScroll();
        S.lenis.on("scroll", () => {
          this.updateOnScroll();
        });
      }
      parsePath(x) {
        return x.match(/-?\d+\.?\d*/g).map(Number);
      }
      scalePathY(x, n) {
        return x.map((r, c) => (c % 2 === 1 ? r * n : r));
      }
      buildPath(x, n) {
        const r = x.split(/-?\d+\.?\d*/g);
        let c = "";
        n.forEach((o, f) => {
          c += r[f] + o;
        });
        return c + r[n.length];
      }
      updateOnScroll() {
        if (!this.DOM.el) {
          return;
        }
        this.updateMetrics();
        const n = typeof S !== "undefined" && S.lenis ? S.lenis.scroll : window.scrollY;
        const s = this.cachedTop - n;
        if (s >= window.innerHeight || s + this.cachedHeight <= 0) {
          return;
        }
        const r = this.start - s;
        const c = Math.max(0, Math.min(1, r / this.totalTravel));
        if (this.isCircle) {
          const o = this.startVal + (this.endVal - this.startVal) * c;
          this.DOM.mask.setAttribute("r", o);
        } else {
          if (this.isSafari) {
            return;
          }
          {
            let o = "";
            for (let f = 0; f < this.startNums.length; f++) {
              const l = this.startNums[f] + (this.endNums[f] - this.startNums[f]) * c;
              o += this.pathChunks[f] + l;
            }
            o += this.pathChunks[this.startNums.length];
            this.DOM.mask.setAttribute("d", o);
          }
        }
      }
    }
    class Fx {
      constructor() {
        this.el = null;
        this.tlContent = null;
        this.tlImage = null;
      }
      init(x) {
        this.el = x.next.container.querySelector(".cta-wrap");
        this.onTrigger();
      }
      onTrigger() {
        this.animationReveal();
      }
      animationReveal() {
        new p0($(this.el).find(".cta-deco-item-img-inner").get(0));
        this.tlContent = gsap.timeline({
          scrollTrigger: {
            trigger: $(this.el).find(".cta-main"),
            start: "top+=40% bottom",
            once: true,
          },
        });
        new U({
          timeline: this.tlContent,
          triggerInit: this.el,
          stagger: 0.15,
          tweenArr: [
            ...Array.from($(this.el).find(".cta-head-item-txt")).flatMap((n) => [
              new X({
                el: $(n),
                type: "bottom",
              }),
            ]),
            new p({
              el: $(this.el).find(".cta-main-item-title .heading").get(0),
            }),
            new p({
              el: $(this.el).find(".cta-main-item-sub .txt").get(0),
            }),
            new X({
              el: $(this.el).find(".cta-main-item-btn"),
              type: "bottom",
            }),
          ],
        });
        this.tlImage = gsap.timeline({
          scrollTrigger: {
            trigger: $(this.el).find(".cta-deco"),
            start: "top+=40% bottom",
            once: true,
          },
        });
        new U({
          timeline: this.tlImage,
          triggerInit: this.el,
          tweenArr: [
            new s0({
              el: $(this.el).find(".cta-deco-item-img").get(0),
            }),
          ],
        });
      }
    }
    const v0 = new Fx();
    const Qx = {
      Hero: class {
        constructor() {
          this.el = null;
          this.tlOnce = null;
          this.taglineMarquee = null;
          this.splits = [];
        }
        setup(t, x) {
          this.el = t.next.container.querySelector(".home-hero-wrap");
          this.taglineMarquee = new I0(
            $(this.el).find(".home-hero-work"),
            $(this.el).find(".home-hero-work-inner"),
            40,
          );
          const r = $(this.el).find(".home-hero-title ");
          if (r.length > 1) {
            r.each((c, o) => {
              let u = $(o);
              u.css("display", "block");
              let a = new SplitText($(u).find(".heading"), {
                type: "words, chars",
              });
              let h = a.chars;
              $(u)
                .find(".heading")
                .each(function () {
                  const D = this.getBoundingClientRect();
                  this.style.minHeight = Math.ceil(D.height) + "px";
                  this.style.height = Math.ceil(D.height) + "px";
                  this.style.textAlign = "left";
                });
              h.forEach((b) => {
                b.dataset.original = b.innerHTML;
              });
              if (c === 0) {
                u.css("display", "block");
              } else {
                u.css("display", "none");
              }
              this.splits.push({
                el: u,
                chars: h,
                st: a,
              });
            });
          }
          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && $(window).width() > 767) {
            this.initRuler();
            this.drawBox();
            this.drawImageContainer();
          } else {
            $(".home-hero-ruler, .home-hero-img-interact-wrap").hide();
          }
          this.setupOnce(t);
          if (this.taglineMarquee) {
            this.taglineMarquee.setup();
          }
          this.interact();
        }
        setupOnce(t) {
          this.tlOnce = gsap.timeline({
            paused: true,
            delay: 0.3,
            onStart: () => {
              this.rotateText();
            },
            onComplete: () => {
              if (this.taglineMarquee) {
                this.taglineMarquee.play();
              }
            },
          });
          this.animationReveal(this.tlOnce);
        }
        playOnce() {
          if (this.tlOnce) {
            this.tlOnce.play();
          }
        }
        rotateText() {
          if (
            this.splits.length === 0 ||
            (this.splits.forEach((c, o) => {
              if (o === 0) {
                c.el.css({
                  display: "block",
                  opacity: 1,
                });
              } else {
                c.el.css({
                  display: "none",
                  opacity: 0,
                });
              }
            }),
            this.splits.length === 1)
          ) {
            return;
          }
          const n = "abcdefghijklmnopqrstuvwxyz";
          const s = 2.5;
          let r = gsap.timeline({
            repeat: -1,
          });
          for (let c = 0; c < this.splits.length; c++) {
            let o = this.splits[c];
            this.splits[(c + 1) % this.splits.length];
            let f = "heading" + c;
            r.addLabel(f);
            r.call(
              () => {
                this.splits.forEach((h) =>
                  h.el.css({
                    display: "none",
                  }),
                );
                o.el.css({
                  display: "block",
                  opacity: 1,
                });
                o.chars.forEach((h) => {
                  if (h._scrambleInterval) {
                    clearInterval(h._scrambleInterval);
                    h._scrambleInterval = null;
                  }
                  h.innerHTML = h.dataset.original;
                });
                gsap.set(o.chars, {
                  opacity: 1,
                  filter: "blur(0px)",
                });
              },
              [],
              f,
            );
            let l = 0;
            o.chars.forEach((a, h) => {
              let B = h * 0.02;
              let y = 0.6 + h * 0.04 + gsap.utils.random(0, 0.05);
              if (B + y > l) {
                l = B + y;
              }
              r.to(
                a,
                {
                  duration: y,
                  opacity: 1,
                  filter: "blur(0px)",
                  ease: "none",
                  onStart: () => {
                    const A = a.textContent || "";
                    const H = A.length;
                    if (A.trim() !== "" && H > 0) {
                      if (!a.dataset.origWidth) {
                        a.dataset.origWidth = a.offsetWidth;
                      }
                      const Z = parseFloat(a.dataset.origWidth);
                      a._scrambleInterval = setInterval(() => {
                        let O = "";
                        for (let J = 0; J < H; J++) {
                          O += n[Math.floor(Math.random() * n.length)];
                        }
                        a.innerText = O;
                        if (a.offsetWidth > Z + 1) {
                          a.innerText = a.dataset.original;
                        }
                      }, 60);
                    }
                  },
                  onComplete: () => {
                    if (a._scrambleInterval) {
                      clearInterval(a._scrambleInterval);
                      a._scrambleInterval = null;
                    }
                    a.innerHTML = a.dataset.original;
                  },
                },
                f,
              );
            });
            let u = "hold" + c;
            r.addLabel(u, f + "+" + l);
            r.to(
              {},
              {
                duration: s,
              },
              u,
            );
          }
          this.tlRotate = r;
        }
        animationReveal(t) {
          new U({
            timeline: t,
            allowMobile: true,
            tweenArr: [
              ...Array.from(
                $(this.el).find(".home-hero-title-wrap .line-vertical, .home-hero-sub-wrap .line-vertical"),
              ).map(
                (n, s) =>
                  new B0({
                    el: n,
                    type: "top",
                    delay: s * 0.001,
                  }),
              ),
              ...Array.from(
                $(this.el).find(".home-hero-title-wrap .line-horizital, .home-hero-sub-wrap .line-horizital"),
              ).map(
                (n, s) =>
                  new B0({
                    el: n,
                    type: "left",
                    delay: s * 0.001,
                  }),
              ),
              new X({
                el: $(this.el).find(".home-hero .bg-border"),
                type: "none",
              }),
              ...Array.from($(this.el).find(".home-hero-img-deco-bg")).map(
                (n, s) =>
                  new X({
                    el: n,
                    type: "none",
                    delay: s * 0.1,
                  }),
              ),
              new p({
                el: $(this.el).find(".home-hero-title:first-child .heading").get(0),
                delay: 0.1,
              }),
              new p({
                el: $(this.el).find(".home-hero-sub .txt:first-child").get(0),
                delay: 0.4,
              }),
              new p({
                el: $(this.el).find(".home-hero-btn .txt").get(0),
                delay: 0.4,
              }),
              new X({
                el: $(this.el).find(".home-hero-work"),
                type: "bottom",
                delay: 0.4,
              }),
            ],
          });
        }
        interact() {
          $(this.el)
            .find(".home-hero-img-deco")
            .on("click", function () {
              $(this).removeClass("active");
            });
        }
        initRuler() {
          let x = $(this.el).find(".home-hero-img-wrap").get(0);
          if (x) {
            this.rulerWrap = x;
            this.rulerController = new ox({
              wrapper: x,
              container: this.el,
              verticalLine: ".home-hero-cursor-line.line-vertical, .home-hero-curor-line.line-vertical",
              horizontalLine:
                ".home-hero-cursor-line.line-horizital, .home-hero-cursor-line.line-horizontal, .home-hero-curor-line.line-horizital, .home-hero-curor-line.line-horizontal",
              plus: ".home-hero-img-plus",
              coordi: ".home-hero-img-coordi",
              interact: ".home-hero-interact",
              hoverVisibility: ".home-hero-img-interact-wrap",
              pauseOutside: true,
              attrX: '[data-hero-control="x"]',
              attrY: '[data-hero-control="y"]',
            });
            this.rulerController.start();
          }
        }
        drawBox() {
          if (!this.rulerWrap) {
            return;
          }
          this.box = null;
          let n = false;
          const s = 2;
          const r = $(this.el).find(".home-hero-img-plus").get(0);
          const c = () => {
            this.box = document.createElement("div");
            this.box.className = "home-hero-img-plus-box";
            this.box.style.display = "block";
            this.box.style.position = "absolute";
            this.box.style.top = f0.mousePos.y + "px";
            this.box.style.left = f0.mousePos.x + "px";
            this.box.style.border = "1px solid #3967bc";
            this.box.style.zIndex = "100";
            this.box.style.pointerEvents = "none";
            this.rulerWrap.prepend(this.box);
            return this.box;
          };
          const o = (u) => {
            if ((u && u.button === 2) || (u && u.which === 3)) {
              return;
            }
            if (this.box) {
              this.box.remove();
              this.box = null;
            }
            this.box = c();
            const h = u.type.includes("touch") ? u.touches[0].clientX : u.clientX;
            const b = u.type.includes("touch") ? u.touches[0].clientY : u.clientY;
            r.dataset.mouseXDownAt = h - this.rulerWrap.getBoundingClientRect().left;
            r.dataset.mouseYDownAt = b - this.rulerWrap.getBoundingClientRect().top;
            r.dataset.initialX = r.dataset.mouseXDownAt;
            r.dataset.initialY = r.dataset.mouseYDownAt;
            this.box.style.left = r.dataset.mouseXDownAt + "px";
            this.box.style.top = r.dataset.mouseYDownAt + "px";
            n = true;
          };
          const f = (u) => {
            if (!n) {
              return;
            }
            const h = this.rulerWrap.getBoundingClientRect();
            const b = u.type.includes("touch") ? u.touches[0].clientX : u.clientX;
            const D = u.type.includes("touch") ? u.touches[0].clientY : u.clientY;
            const B = b - h.left;
            const y = D - h.top;
            const _ = parseFloat(r.dataset.initialX);
            const A = parseFloat(r.dataset.initialY);
            r.dataset.currentX = String(B);
            r.dataset.currentY = String(y);
            const H = E(B, y, _, A);
            if (H > s) {
              r.dataset.mouseXDownAt = String(_);
              r.dataset.mouseYDownAt = String(A);
              let I = 0;
              let Z = 0;
              let k = 0;
              let O = 0;
              let J = "";
              const o0 = B > _;
              const w0 = y > A;
              if (o0) {
                I = B - _;
                k = _;
                if (w0) {
                  J = "315deg";
                  Z = y - A;
                  O = A;
                } else {
                  J = "225deg";
                  Z = A - y;
                  O = y;
                }
              } else {
                I = _ - B;
                k = B;
                if (w0) {
                  J = "45deg";
                  Z = y - A;
                  O = A;
                } else {
                  J = "135deg";
                  Z = A - y;
                  O = y;
                }
              }
              this.box.style.background =
                "linear-gradient(" + J + ", rgba(57, 103, 188, 0.64) 0%, rgba(245, 245, 239, 0.00) 67.05%)";
              this.box.style.width = I + "px";
              this.box.style.height = Z + "px";
              this.box.style.left = k + "px";
              this.box.style.top = O + "px";
              const j = this.box.getBoundingClientRect();
              $(".home-hero-img-deco").each((L, m) => {
                const F = $(m).get(0).getBoundingClientRect();
                if (
                  !(j.right < F.left) &&
                  !(j.left > F.right) &&
                  !(j.bottom < F.top) &&
                  !(j.top > F.bottom)
                ) {
                  if (!$(".home-hero-interact").hasClass("hidden")) {
                    $(".home-hero-interact").addClass("hidden");
                  }
                  $(m).addClass("active");
                }
              });
            }
          };
          const l = (u) => {
            r.dataset.mouseDownAt = "0";
            n = false;
            if (this.box) {
              this.box.remove();
              this.box = null;
            }
          };
          this.rulerWrap.oncontextmenu = (u) => {
            u.preventDefault();
            return false;
          };
          this.rulerWrap.onmousedown = (u) => o(u);
          this.rulerWrap.ontouchstart = (u) => o(u);
          this.rulerWrap.onmouseup = (u) => l();
          this.rulerWrap.ontouchend = (u) => l();
          this.rulerWrap.onmousemove = (u) => f(u);
          this.rulerWrap.ontouchmove = (u) => f(u);
        }
        drawImageContainer() {
          const n = $(".home-hero-img-inner img");
          const s = n.parent();
          const r = s.width();
          const c = s.height();
          const o = n[0].naturalWidth;
          const f = n[0].naturalHeight;
          const l = r / c;
          const u = o / f;
          let a;
          let h;
          if (u > l) {
            a = r;
            h = r / u;
            $(".home-hero-img-deco").each((j, L) => {
              let P = h / n.height();
              let F = ($(L).width() * (1 - P)) / 2;
              let t0 = ($(L).height() * (1 - P)) / 2;
              let G = (a * parseFloat($(L).css("left"))) / r;
              let i0 = (h * parseFloat($(L).css("bottom"))) / c;
              $(L).css({
                transform: "scale(" + P + ")",
                left: F + G + "px",
                bottom: t0 + i0 + "px",
              });
            });
          } else {
            h = c;
            a = c * u;
            $(".home-hero-img-deco").each((j, L) => {
              let P = a / n.width();
              let F = ($(L).height() * (1 - P)) / 2;
              let t0 = ($(L).width() * (1 - P)) / 2;
              let G = (a * parseFloat($(L).css("left"))) / r;
              let i0 = (h * parseFloat($(L).css("bottom"))) / c;
              $(L).css({
                transform: "scale(" + P + ")",
                bottom: F + i0 + "px",
                left: G + t0 + "px",
              });
            });
          }
          $(".home-hero-img-deco-main").css({
            width: a + "px",
            height: h + "px",
          });
          const b = 829;
          const D = 1648;
          const B = (j) => (h * j) / b + (c - h) / 2;
          const y = (j) => (((r - a) / 2 + (a * j) / D) / r) * 100;
          const _ = (j) => (a * j) / D + (r - a) / 2;
          const A = (j) => {
            return (((c - h) / 2 + h * (1 - j / b)) / c) * 100;
          };
          const H = 168;
          const I = 275;
          const Z = 516;
          const k = 1098;
          $(".home-hero-ruler-item.left .home-hero-ruler-item-line-vertical")
            .css("height", (h * Z) / b + "px")
            .css("top", B(H) + "px");
          $(".home-hero-ruler-item.right .home-hero-ruler-item-line-vertical")
            .css("height", (h * Z) / b + "px")
            .css("top", B(H) + "px");
          $(".home-hero-ruler-item.top .home-hero-ruler-item-line-horizital")
            .css("width", (a * k) / D + "px")
            .css("left", _(I) + "px");
          $(".home-hero-ruler-item.bot .home-hero-ruler-item-line-horizital")
            .css("width", (a * k) / D + "px")
            .css("left", _(I) + "px");
          const O = [
            {
              y: 167,
              x: 940,
            },
            {
              y: 195,
              x: 1223,
            },
            {
              y: 355,
              x: 1223,
            },
            {
              y: 396,
              x: 1223,
            },
            {
              y: 414,
              x: 1223,
            },
            {
              y: 583,
              x: 1375,
            },
            {
              y: 683,
              x: 1438,
            },
          ];
          const J = [
            {
              y: 167,
              x: 939,
            },
            {
              y: 355,
              x: 1223,
            },
            {
              y: 396,
              x: 1223,
            },
            {
              y: 414,
              x: 1223,
            },
            {
              y: 583,
              x: 1374,
            },
            {
              y: 683,
              x: 1438,
            },
          ];
          const o0 = [
            {
              y: 239,
              x: 275,
            },
            {
              y: 635,
              x: 417,
            },
            {
              y: 456,
              x: 432,
            },
            {
              y: 635,
              x: 526,
            },
            {
              y: 635,
              x: 581,
            },
            {
              y: 660,
              x: 710,
            },
            {
              y: 660,
              x: 724,
            },
            {
              y: 660,
              x: 924,
            },
            {
              y: 660,
              x: 939,
            },
            {
              y: 635,
              x: 1057,
            },
            {
              y: 635,
              x: 1085,
            },
            {
              y: 635,
              x: 1233,
            },
            {
              y: 244,
              x: 1373,
            },
          ];
          const w0 = [
            {
              y: 680,
              x: 275,
            },
            {
              y: 680,
              x: 290,
            },
            {
              y: 678,
              x: 562,
            },
            {
              y: 678,
              x: 581,
            },
            {
              y: 678,
              x: 710,
            },
            {
              y: 678,
              x: 724,
            },
            {
              y: 678,
              x: 924,
            },
            {
              y: 678,
              x: 939,
            },
            {
              y: 678,
              x: 1066,
            },
            {
              y: 678,
              x: 1085,
            },
            {
              y: 678,
              x: 1148,
            },
            {
              y: 678,
              x: 1233,
            },
            {
              y: 678,
              x: 1373,
            },
          ];
          O.forEach((j, L) => {
            let P = 100 - y(j.x);
            $(".home-hero-ruler-item.left").each((F, t0) => {
              $(t0)
                .find(".home-hero-ruler-item-line-horizital")
                .eq(L)
                .css("top", B(j.y) + "px")
                .css("--clip-half", P + "%");
            });
          });
          J.forEach((j, L) => {
            $(".home-hero-ruler-item.right").each((F, t0) => {
              $(t0)
                .find(".home-hero-ruler-item-line-horizital")
                .eq(L)
                .css("top", B(j.y) + "px")
                .css("--clip-half", y(j.x) + "%");
            });
          });
          o0.forEach((j, L) => {
            $(".home-hero-ruler-item.top").each((F, t0) => {
              $(t0)
                .find(".home-hero-ruler-item-line-vertical")
                .eq(L)
                .css("left", _(j.x) + "px")
                .css("--clip-half", A(j.y) + "%");
            });
          });
          w0.forEach((j, L) => {
            const F = 100 - A(j.y);
            $(".home-hero-ruler-item.bot").each((t0, G) => {
              $(G)
                .find(".home-hero-ruler-item-line-vertical")
                .eq(L)
                .css("left", _(j.x) + "px")
                .css("--clip-half", F + "%");
            });
          });
        }
      },
      Intro: class extends a0 {
        constructor() {
          super();
          this.el = null;
          this.tlStickFade = null;
          this.tlBody = null;
        }
        trigger(t) {
          this.el = t.next.container.querySelector(".home-intro-wrap");
          super.setTrigger(this.el, this.onTrigger.bind(this));
        }
        onTrigger() {
          if (d.w > 767) {
            this.animationReveal();
          }
          this.animationScrub();
        }
        setup() {
          this.tlStickFade = gsap.timeline({
            scrollTrigger: {
              trigger: $(this.el).find(".home-intro-content-title").get(0),
              start: "center bottom+=10%",
              end: "center top+=40%",
              scrub: true,
            },
          });
          this.tlBody = gsap.timeline({
            scrollTrigger: {
              trigger: $(this.el).find(".home-intro-body").get(0),
              start: "top+=45% bottom",
            },
          });
          let x = new SplitText($(this.el).find(".home-intro-content-title .heading").get(0), {
            type: "chars,words, lines",
          });
          this.tlStickFade.fromTo(
            x.chars,
            {
              color: "#b3b3af",
            },
            {
              color: "#282828",
              stagger: 0.03,
            },
          );
        }
        animationReveal() {
          new U({
            timeline: this.tlBody,
            triggerInit: this.el,
            tweenArr: [
              new p({
                el: $(this.el).find(".home-intro-content-title .heading").get(0),
                duration: 0.6,
                stagger: 0.004,
                isDisableRevert: true,
                splitType: "words",
              }),
            ],
          });
        }
        animationScrub() {
          new p0($(this.el).find(".home-intro-img").get(0));
        }
      },
      Platform: class extends a0 {
        constructor() {
          super();
          this.el = null;
          this.tl = null;
          this.tlContent = null;
          this.tlImage = null;
        }
        trigger(t) {
          this.el = t.next.container.querySelector(".home-platform-wrap");
          super.setTrigger(this.el, this.onTrigger.bind(this));
        }
        onTrigger() {
          this.animationScrub();
        }
        setup() {
          if (d.w > 991) {
            let n = (d.h - $(this.el).find(".home-platform-content-inner").height()) / 2;
            $(this.el)
              .find(".home-platform-content-inner")
              .css("top", n + "px");
          }
          this.tlContent = gsap.timeline({
            scrollTrigger: {
              trigger: $(this.el).find(".home-platform-content").get(0),
              start: "top+=40% bottom",
              once: true,
            },
          });
          new U({
            timeline: this.tlContent,
            tweenArr: [
              new X({
                el: $(this.el)
                  .find(".home-platform-content-inner.active .home-platform-content-number")
                  .get(0),
              }),
              new p({
                el: $(this.el)
                  .find(".home-platform-content-inner.active .home-platform-content-title .heading")
                  .get(0),
              }),
              new p({
                el: $(this.el)
                  .find(".home-platform-content-inner.active .home-platform-content-sub .txt")
                  .get(0),
              }),
            ],
          });
          $(".home-platform-img-item").each((n, s) => {
            this.tlImage = gsap.timeline({
              scrollTrigger: {
                trigger: s,
                start: "top+=45% bottom",
                once: true,
              },
            });
          });
        }
        animationScrub() {
          $(this.el)
            .find(".home-platform-img-item-inner")
            .each((r, c) => new p0($(c).get(0)));
          const n = $(this.el).find(".home-platform-content-inner");
          const s = n.length;
          this.tl = gsap.timeline({
            scrollTrigger: {
              trigger: $(this.el).find(".home-platform-content").get(0),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              onUpdate: (r) => {
                const o = r.progress;
                const f = 1 / s;
                n.each((l, u) => {
                  const h = l * f;
                  const b = (l + 1) * f;
                  if (o >= h && o < b) {
                    $(u).addClass("active");
                  } else {
                    $(u).removeClass("active");
                  }
                });
              },
            },
          });
        }
      },
      UseCase: class extends a0 {
        constructor() {
          super();
          this.el = null;
          this.tlContent = null;
          this.tlImage = null;
          this.tlList = null;
        }
        trigger(t) {
          this.el = t.next.container.querySelector(".home-usecase-wrap");
          super.setTrigger(this.el, this.onTrigger.bind(this));
        }
        onTrigger() {
          this.animationReveal();
          this.animationScrub();
          this.interact();
        }
        setup() {
          D0($(this.el).find(".home-usecase-faq-item"));
        }
        animationScrub() {
          $(this.el)
            .find(".home-usecase-img-item img")
            .each(
              (x, n) =>
                new P0({
                  el: n,
                }),
            );
        }
        animationReveal() {
          this.tlImage = gsap.timeline({
            scrollTrigger: {
              trigger: $(this.el).find(".home-usecase-img-list").get(0),
              start: "top+=35% bottom",
              once: true,
            },
          });
          new U({
            timeline: this.tlImage,
            triggerInit: this.el,
            tweenArr: [
              new s0({
                el: $(this.el).find(".home-usecase-img-item:first-child").get(0),
              }),
            ],
          });
          this.tlContent = gsap.timeline({
            scrollTrigger: {
              trigger: $(this.el).find(".home-usecase-title-wrap").get(0),
              start: "top+=40% bottom",
              once: true,
            },
          });
          new U({
            timeline: this.tlContent,
            triggerInit: this.el,
            tweenArr: [
              new p({
                el: $(this.el).find(".home-usecase-label .txt").get(0),
              }),
              new p({
                el: $(this.el).find(".home-usecase-title .heading").get(0),
              }),
            ],
          });
          this.tlList = gsap.timeline({
            scrollTrigger: {
              trigger: $(this.el).find(".home-usecase-faq-list").get(0),
              start: "top+=65% bottom",
              once: true,
            },
          });
          $(this.el)
            .find(".home-usecase-faq-item")
            .each((n, s) => {
              new U({
                timeline: this.tlList,
                triggerInit: this.el,
                stagger: 0.03,
                tweenArr: [
                  n === 0
                    ? new B0({
                        el: $(s).find(".line.top").get(0),
                        type: "left",
                      })
                    : null,
                  new p({
                    el: $(s).find(".home-usecase-faq-item-numb .txt").get(0),
                  }),
                  new p({
                    el: $(s).find(".home-usecase-faq-item-title .heading").get(0),
                  }),
                  new X({
                    el: $(s).find(".home-usecase-faq-item-ic"),
                    type: "bottom",
                  }),
                  n === 0
                    ? new p({
                        el: $(s).find(".home-usecase-faq-item-sub .txt").get(0),
                      })
                    : null,
                  new g0({
                    el: $(s).find(".line.bot").get(0),
                    type: "left",
                  }),
                ].filter(Boolean),
              });
            });
        }
        interact() {
          const n = (s) => {
            $(this.el)
              .find(".home-usecase-img-item")
              .eq(s)
              .addClass("active")
              .siblings()
              .removeClass("active");
            $(this.el)
              .find(".home-usecase-faq-item")
              .eq(s)
              .toggleClass("active")
              .siblings()
              .removeClass("active");
            $(this.el)
              .find(".home-usecase-faq-item")
              .eq(s)
              .siblings()
              .find(".home-usecase-faq-item-sub")
              .slideUp();
            $(this.el).find(".home-usecase-faq-item").eq(s).find(".home-usecase-faq-item-sub").slideToggle();
          };
          $(this.el).find(".home-usecase-faq-item-sub").hide();
          $(this.el)
            .find(".home-usecase-faq-item")
            .on("click", function () {
              n($(this).index());
            });
          n(0);
        }
      },
      Cta: class {
        constructor() {}
        setup(t) {
          v0.init(t);
        }
      },
      footer: class {
        constructor() {}
        setup(t) {
          b0.init(t);
        }
      },
    };
    class h0 {
      constructor(x) {
        this.sections = Object.values(x).map((r) => new r());
        this.boundSetupHandler = this.setupHandler.bind(this);
        this.boundOnceSetupHandler = (r) => {
          this.boundSetupHandler({
            detail: r.detail,
            mode: "once",
          });
        };
        this.boundOncePlayHandler = this.oncePlayHandler.bind(this);
      }
      initOnce(x) {
        const s = x.next.container;
        s.addEventListener("onceSetup", this.boundOnceSetupHandler);
        s.addEventListener("oncePlay", this.boundOncePlayHandler);
      }
      oncePlayHandler(x) {
        this.sections.forEach((s) => {
          if (s.playOnce) {
            s.playOnce(x.detail);
          }
        });
      }
      setupHandler(x) {
        const s = x.detail;
        const r = x.mode;
        this.sections.forEach((c) => {
          if (c.trigger) {
            c.trigger(s);
          }
          if (c.setup) {
            c.setup(s, r);
          }
        });
      }
    }
    class ot extends h0 {
      constructor(x) {
        super(x);
      }
    }
    const n0 = {
      home: new ot(Qx),
    };
    class _t {
      constructor() {
        this.onPageShow = this.onPageShow.bind(this);
      }
      init() {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }
        window.addEventListener("pageshow", this.onPageShow);
      }
      onPageShow(x) {
        if (x.persisted) {
          window.location.reload();
        }
      }
    }
    new _t().init();
    const pageData = {
      next: {
        container: document.querySelector(".main-inner"),
        namespace: "home",
      },
    };
    S.init(pageData);
    N0.init(pageData);
    z0("init", pageData);
    lx.init(pageData);
    lx.play(pageData);
    Y0(n0.home.initOnce(pageData));
    x0.init(pageData);
  };
  const rx = () => {
    if (!window.__siteInitialized) {
      window.__siteInitialized = true;
      jx();
    }
  };
  if (document.readyState === "complete") {
    rx();
  } else {
    window.addEventListener("load", rx, {
      once: true,
    });
  }
});
