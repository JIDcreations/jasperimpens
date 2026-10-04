/* Offertetool. Alles client-side, opslag in localStorage. */

(function () {
  "use strict";

  const { entities, brands, templates } = window.OFFERTE;
  const STORE_KEY = "offerte-os/v1";
  const VAT_RATES = [21, 12, 6, 0];

  /* ---- Opmaak ------------------------------------------------------------ */

  const moneyFmt = new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" });
  const numFmt = new Intl.NumberFormat("nl-BE", { maximumFractionDigits: 2 });
  const money = (n) => moneyFmt.format(n || 0);
  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  /* "1.900,50", "1900.5" en "1 900" worden allemaal een getal. */
  function parseNum(v) {
    if (typeof v === "number") return v;
    let s = String(v ?? "").replace(/[\s€]/g, "");
    if (!s) return 0;
    if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }
  const numInput = (n) => (n === 0 || n ? String(n).replace(".", ",") : "");

  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  function addDays(iso, days) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d + (parseInt(days, 10) || 0));
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  }
  function date(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
  }

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

  /* ---- Opslag ------------------------------------------------------------ */

  let store = { quotes: {}, counters: {}, currentId: null };

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) store = Object.assign(store, JSON.parse(raw));
    } catch (e) {
      status("Opslag niet beschikbaar");
    }
  }

  let saveTimer = null;
  function save(now) {
    clearTimeout(saveTimer);
    const run = () => {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
        status(`Bewaard ${new Date().toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}`);
      } catch (e) {
        status("Niet bewaard. Exporteer als JSON.");
      }
    };
    now ? run() : (saveTimer = setTimeout(run, 300));
  }

  const statusEl = document.getElementById("status");
  function status(text) {
    statusEl.textContent = text;
  }

  /* ---- Nummering: aparte reeks per merk en per jaar ---------------------- */

  function seqOf(number, prefix, year) {
    const m = String(number || "").match(new RegExp(`^${prefix}-${year}-(\\d+)$`));
    return m ? parseInt(m[1], 10) : 0;
  }

  function nextNumber(brandId, year) {
    const { prefix, pad } = brands[brandId].numbering;
    const key = `${brandId}-${year}`;
    let max = store.counters[key] || 0;
    for (const q of Object.values(store.quotes)) {
      if (q.brand === brandId) max = Math.max(max, seqOf(q.number, prefix, year));
    }
    store.counters[key] = max + 1;
    return `${prefix}-${year}-${String(max + 1).padStart(pad, "0")}`;
  }

  /* Na import of handmatige aanpassing de teller bijwerken, nooit verlagen. */
  function syncCounters() {
    for (const q of Object.values(store.quotes)) {
      const b = brands[q.brand];
      if (!b) continue;
      const year = (q.number || "").split("-")[1];
      const seq = seqOf(q.number, b.numbering.prefix, year);
      const key = `${q.brand}-${year}`;
      if (seq > (store.counters[key] || 0)) store.counters[key] = seq;
    }
  }

  /* ---- Offertes ---------------------------------------------------------- */

  function newLine(brand, partial) {
    return Object.assign({ id: uid(), desc: "", qty: 1, unit: "stuk", price: 0, vat: brand.defaults.vat, optional: false }, partial);
  }

  function createQuote(brandId) {
    const brand = brands[brandId];
    const d = todayISO();
    const q = {
      id: uid(),
      brand: brandId,
      number: nextNumber(brandId, d.slice(0, 4)),
      date: d,
      validDays: brand.defaults.validDays,
      issuer: brand.issuers[0],
      subject: "",
      client: { company: "", name: "", street: "", city: "", country: "", vat: "", email: "" },
      lines: [newLine(brand)],
      notes: brand.defaults.notes,
      terms: brand.defaults.terms,
      showSignature: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    store.quotes[q.id] = q;
    store.currentId = q.id;
    save(true);
    return q;
  }

  function duplicateQuote(id) {
    const src = store.quotes[id];
    const d = todayISO();
    const q = JSON.parse(JSON.stringify(src));
    Object.assign(q, {
      id: uid(),
      number: nextNumber(src.brand, d.slice(0, 4)),
      date: d,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    q.lines.forEach((l) => (l.id = uid()));
    store.quotes[q.id] = q;
    store.currentId = q.id;
    save(true);
    return q;
  }

  const current = () => store.quotes[store.currentId];

  function touch() {
    current().updatedAt = Date.now();
    save();
  }

  /* ---- Berekening -------------------------------------------------------- */

  const lineAmount = (l) => round2(parseNum(l.qty) * parseNum(l.price));
  const hasContent = (l) => String(l.desc || "").trim() || parseNum(l.price);

  function compute(q) {
    const visible = q.lines.filter(hasContent);
    const included = visible.filter((l) => !l.optional);
    const optional = visible.filter((l) => l.optional);
    const rates = new Map();
    for (const l of included) {
      const r = Number(l.vat) || 0;
      rates.set(r, round2((rates.get(r) || 0) + lineAmount(l)));
    }
    const byRate = [...rates.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([rate, base]) => ({ rate, base, vat: round2((base * rate) / 100) }));
    const subtotal = round2(byRate.reduce((s, r) => s + r.base, 0));
    const vat = round2(byRate.reduce((s, r) => s + r.vat, 0));
    return {
      included,
      optional,
      byRate,
      subtotal,
      vat,
      total: round2(subtotal + vat),
      validUntil: addDays(q.date, q.validDays),
    };
  }

  const isCustom = (l) => String(l.unit || "").trim() === "op maat" && !parseNum(l.price);
  function qtyLabel(l) {
    if (isCustom(l)) return "";
    const unit = String(l.unit || "").trim();
    const qty = numFmt.format(parseNum(l.qty));
    return !unit || unit === "stuk" ? qty : `${qty} ${unit}`;
  }
  const priceLabel = (l) => (isCustom(l) ? "op maat" : money(parseNum(l.price)));
  const amountLabel = (l) => (isCustom(l) ? "op maat" : money(lineAmount(l)));

  /* ---- Formulier --------------------------------------------------------- */

  const form = document.getElementById("form");
  const linesEl = document.getElementById("lines");
  const sumEl = document.getElementById("sum");

  const getPath = (obj, path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  function setPath(obj, path, value) {
    const keys = path.split(".");
    const last = keys.pop();
    const target = keys.reduce((o, k) => (o[k] = o[k] || {}), obj);
    target[last] = value;
  }

  function fillForm() {
    const q = current();
    const brand = brands[q.brand];
    document.body.dataset.brand = q.brand;
    renderBrandSwitch();
    form.querySelectorAll("[data-field]").forEach((el) => {
      const f = el.dataset.field;
      const v = getPath(q, f);
      if (el.type === "checkbox") el.checked = !!v;
      else el.value = v ?? "";
    });

    const issuerField = document.getElementById("issuerField");
    const issuerSel = issuerField.querySelector("select");
    issuerField.hidden = brand.issuers.length < 2;
    issuerSel.innerHTML = brand.issuers
      .map((key) => `<option value="${esc(key)}">${esc(entities[key].label)}${entities[key].legalName ? `, ${esc(entities[key].legalName)}` : ""}</option>`)
      .join("");
    issuerSel.value = q.issuer;

    document.getElementById("services").innerHTML = brand.services
      .map(
        (s, i) =>
          `<button type="button" class="chip" data-service="${i}">${esc(s.label)} <b>${
            s.price ? numFmt.format(s.price) : "op maat"
          }</b></button>`
      )
      .join("");

    renderLines();
  }

  function renderLines() {
    const q = current();
    const n = q.lines.length;
    linesEl.innerHTML = q.lines
      .map(
        (l, i) => `
      <div class="line${l.optional ? " is-optional" : ""}" data-line="${l.id}">
        <div class="line-head">
          <span class="line-idx">${String(i + 1).padStart(2, "0")}</span>
          <label class="check"><input type="checkbox" data-k="optional"${l.optional ? " checked" : ""}> Optie</label>
          <span class="line-tools">
            <button type="button" class="icon-btn" data-line-act="up" aria-label="Lijn omhoog"${i === 0 ? " disabled" : ""}>↑</button>
            <button type="button" class="icon-btn" data-line-act="down" aria-label="Lijn omlaag"${i === n - 1 ? " disabled" : ""}>↓</button>
            <button type="button" class="icon-btn" data-line-act="remove">Wis</button>
          </span>
        </div>
        <label class="sr" for="d-${l.id}">Omschrijving</label>
        <textarea id="d-${l.id}" data-k="desc" rows="2" placeholder="Omschrijving. Extra regels worden detail.">${esc(l.desc)}</textarea>
        <div class="line-nums">
          <label>Aantal<input data-k="qty" inputmode="decimal" value="${esc(numInput(l.qty))}"></label>
          <label>Eenheid<input data-k="unit" list="units" value="${esc(l.unit)}"></label>
          <label>Prijs<input data-k="price" inputmode="decimal" value="${esc(numInput(l.price))}"></label>
          <label>Btw<select data-k="vat">${VAT_RATES.map(
            (r) => `<option value="${r}"${Number(l.vat) === r ? " selected" : ""}>${r}%</option>`
          ).join("")}</select></label>
        </div>
        <div class="line-total"><span>${l.optional ? "Optie" : "Bedrag"}</span>${esc(amountLabel(l))}</div>
      </div>`
      )
      .join("");
  }

  function renderSum(t) {
    sumEl.innerHTML = `
      <dt>Subtotaal</dt><dd>${money(t.subtotal)}</dd>
      ${t.byRate.map((r) => `<dt>Btw ${r.rate}%</dt><dd>${money(r.vat)}</dd>`).join("")}
      <dt class="sum-total">Totaal</dt><dd class="sum-total">${money(t.total)}</dd>`;
    document.getElementById("validUntil").textContent = t.validUntil ? `tot ${date(t.validUntil)}` : "";
  }

  form.addEventListener("input", (e) => {
    const el = e.target;
    const q = current();

    if (el.dataset.field) {
      let v = el.type === "checkbox" ? el.checked : el.value;
      if (el.dataset.field === "validDays") v = parseInt(v, 10) || 0;
      setPath(q, el.dataset.field, v);
    } else if (el.dataset.k) {
      const row = el.closest("[data-line]");
      const line = q.lines.find((l) => l.id === row.dataset.line);
      const k = el.dataset.k;
      if (k === "optional") {
        line.optional = el.checked;
        row.classList.toggle("is-optional", el.checked);
        row.querySelector(".line-total span").textContent = el.checked ? "Optie" : "Bedrag";
      } else if (k === "qty" || k === "price") line[k] = parseNum(el.value);
      else if (k === "vat") line.vat = Number(el.value);
      else line[k] = el.value;
      row.querySelector(".line-total").lastChild.textContent = amountLabel(line);
    } else return;

    touch();
    renderDoc();
  });

  /* Getallen netjes tonen zodra het veld verlaten wordt. */
  form.addEventListener("focusout", (e) => {
    const k = e.target.dataset && e.target.dataset.k;
    if (k === "qty" || k === "price") {
      const line = current().lines.find((l) => l.id === e.target.closest("[data-line]").dataset.line);
      if (line) e.target.value = numInput(line[k]);
    }
  });

  form.addEventListener("click", (e) => {
    const q = current();
    const brand = brands[q.brand];

    const chip = e.target.closest("[data-service]");
    if (chip) {
      const s = brand.services[Number(chip.dataset.service)];
      const line = newLine(brand, { desc: s.desc, unit: s.unit, price: s.price });
      /* Lege startlijn vervangen in plaats van ernaast te zetten. */
      const emptyIdx = q.lines.findIndex((l) => !hasContent(l));
      if (emptyIdx > -1 && q.lines.length === 1) q.lines.splice(emptyIdx, 1, line);
      else q.lines.push(line);
      afterLinesChange();
      return;
    }

    const lineBtn = e.target.closest("[data-line-act]");
    if (lineBtn) {
      const id = lineBtn.closest("[data-line]").dataset.line;
      const i = q.lines.findIndex((l) => l.id === id);
      const act = lineBtn.dataset.lineAct;
      if (act === "remove") q.lines.splice(i, 1);
      if (act === "up" && i > 0) q.lines.splice(i - 1, 0, q.lines.splice(i, 1)[0]);
      if (act === "down" && i < q.lines.length - 1) q.lines.splice(i + 1, 0, q.lines.splice(i, 1)[0]);
      if (!q.lines.length) q.lines.push(newLine(brand));
      afterLinesChange();
      return;
    }

    if (e.target.closest('[data-act="add-line"]')) {
      q.lines.push(newLine(brand));
      afterLinesChange();
      const last = linesEl.querySelector(".line:last-child textarea");
      if (last) last.focus();
    }
  });

  function afterLinesChange() {
    touch();
    renderLines();
    renderDoc();
  }

  /* ---- Merkkeuze ------------------------------------------------------- */

  const brandSwitch = document.getElementById("brandSwitch");

  function renderBrandSwitch() {
    const active = current().brand;
    brandSwitch.innerHTML = Object.values(brands)
      .filter((b) => b.ready)
      .map(
        (b) =>
          `<button type="button" class="brand-opt" data-brand="${esc(b.id)}" aria-pressed="${b.id === active}" title="${esc(b.name)}">` +
          `<img src="${esc(b.logo)}" alt="${esc(b.name)}"></button>`
      )
      .join("");
  }

  /* Naar een merk gaan: laatste offerte van dat merk, anders een nieuwe. */
  function switchBrand(id) {
    if (current().brand === id) return;
    const last = Object.values(store.quotes)
      .filter((q) => q.brand === id)
      .sort((a, b) => b.updatedAt - a.updatedAt)[0];
    if (last) {
      openQuote(last.id);
      status(`${brands[id].name}. ${last.number} geopend`);
    } else {
      createQuote(id);
      fillForm();
      renderDoc();
      status(`${brands[id].name}. Nieuwe offerte`);
    }
  }

  brandSwitch.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-brand]");
    if (btn) switchBrand(btn.dataset.brand);
  });

  /* ---- Preview ----------------------------------------------------------- */

  const docEl = document.getElementById("doc");
  const scaler = document.getElementById("scaler");

  function renderDoc() {
    const q = current();
    const brand = brands[q.brand];
    const entity = entities[q.issuer] || entities[brand.issuers[0]];
    const totals = compute(q);
    renderSum(totals);
    docEl.dataset.brand = q.brand;
    docEl.innerHTML = templates[q.brand]({
      q,
      brand,
      entity,
      totals,
      money,
      date,
      esc,
      qtyLabel,
      priceLabel,
      amountLabel,
    });
    fitPreview();
  }

  function fitPreview() {
    const pane = scaler.parentElement;
    if (!pane.offsetWidth) return;
    const style = getComputedStyle(pane);
    const avail = pane.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const w = docEl.offsetWidth;
    const scale = Math.min(1, avail / w);
    scaler.style.transform = `scale(${scale})`;
    scaler.style.width = `${w}px`;
    scaler.style.height = `${docEl.offsetHeight * scale}px`;
    scaler.style.marginLeft = `${Math.max(0, (avail - w * scale) / 2)}px`;
  }
  new ResizeObserver(fitPreview).observe(scaler.parentElement);
  document.fonts && document.fonts.ready.then(fitPreview);

  /* ---- Weergave (mobiel) ------------------------------------------------- */

  const layout = document.querySelector(".layout");
  document.querySelector(".tabs").addEventListener("click", (e) => {
    const tab = e.target.closest("[data-tab]");
    if (!tab) return;
    layout.dataset.view = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t === tab));
    window.scrollTo(0, 0);
    fitPreview();
  });

  /* ---- PDF --------------------------------------------------------------- */

  const baseTitle = document.title;
  window.addEventListener("beforeprint", () => {
    const q = current();
    const who = (q.client.company || q.client.name || "").trim();
    document.title = `Offerte ${q.number}${who ? ` ${who}` : ""}`;
  });
  window.addEventListener("afterprint", () => (document.title = baseTitle));

  /* ---- Archief ----------------------------------------------------------- */

  const archive = document.getElementById("archive");
  const listEl = document.getElementById("archiveList");

  function renderArchive() {
    document.getElementById("newBrands").innerHTML =
      `<p>Nieuwe offerte</p>` +
      Object.values(brands)
        .map((b) =>
          b.ready
            ? `<button type="button" class="btn" data-new="${esc(b.id)}">${esc(b.name)}</button>`
            : `<button type="button" class="btn" disabled>${esc(b.name)} volgt</button>`
        )
        .join("");

    const quotes = Object.values(store.quotes).sort((a, b) => b.updatedAt - a.updatedAt);
    if (!quotes.length) {
      listEl.innerHTML = `<li class="archive-empty">Nog geen offertes.</li>`;
      return;
    }
    listEl.innerHTML = quotes
      .map((q) => {
        const t = compute(q);
        const who = q.client.company || q.client.name || "Zonder klant";
        return `
        <li class="archive-item${q.id === store.currentId ? " is-current" : ""}" data-id="${q.id}">
          <button type="button" class="archive-open" data-a="open">
            <span class="a-num">${esc(q.number)} <span class="archive-tag">${esc(brands[q.brand].name)}</span></span>
            <span class="a-total">${money(t.total)}</span>
            <span class="a-client">${esc(who)}</span>
            <span></span>
            <span class="a-meta">${esc(date(q.date))}${q.subject ? `. ${esc(q.subject)}` : ""}</span>
          </button>
          <div class="archive-tools">
            <button type="button" class="icon-btn" data-a="dup">Dupliceer</button>
            <button type="button" class="icon-btn" data-a="del">Verwijder</button>
          </div>
        </li>`;
      })
      .join("");
  }

  function openQuote(id) {
    store.currentId = id;
    save(true);
    fillForm();
    renderDoc();
  }

  archive.addEventListener("click", (e) => {
    if (e.target === archive || e.target.closest('[data-act="close"]')) return archive.close();

    const nb = e.target.closest("[data-new]");
    if (nb) {
      createQuote(nb.dataset.new);
      fillForm();
      renderDoc();
      return archive.close();
    }

    const btn = e.target.closest("[data-a]");
    if (!btn) return;
    const id = btn.closest("[data-id]").dataset.id;
    const act = btn.dataset.a;
    if (act === "open") {
      openQuote(id);
      archive.close();
    } else if (act === "dup") {
      duplicateQuote(id);
      fillForm();
      renderDoc();
      archive.close();
    } else if (act === "del") {
      const q = store.quotes[id];
      if (!confirm(`Offerte ${q.number} verwijderen?`)) return;
      delete store.quotes[id];
      if (store.currentId === id) {
        const rest = Object.values(store.quotes).sort((a, b) => b.updatedAt - a.updatedAt);
        store.currentId = rest.length ? rest[0].id : createQuote(q.brand).id;
        fillForm();
        renderDoc();
      }
      save(true);
      renderArchive();
    }
  });

  /* ---- Export en import -------------------------------------------------- */

  function exportJSON() {
    const data = { app: "offerte-os", version: 1, exportedAt: new Date().toISOString(), counters: store.counters, quotes: Object.values(store.quotes) };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `offertes-${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const quotes = Array.isArray(data) ? data : data.quotes;
        if (!Array.isArray(quotes)) throw new Error("Geen offertes gevonden");
        let added = 0;
        for (const q of quotes) {
          if (!q || !q.id || !brands[q.brand]) continue;
          const existing = store.quotes[q.id];
          if (!existing || (q.updatedAt || 0) >= (existing.updatedAt || 0)) {
            store.quotes[q.id] = q;
            added++;
          }
        }
        if (data.counters) {
          for (const [k, v] of Object.entries(data.counters)) store.counters[k] = Math.max(store.counters[k] || 0, v);
        }
        syncCounters();
        if (!store.quotes[store.currentId]) store.currentId = Object.keys(store.quotes)[0];
        save(true);
        fillForm();
        renderDoc();
        renderArchive();
        status(`${added} offerte${added === 1 ? "" : "s"} geïmporteerd`);
      } catch (err) {
        status(`Import mislukt. ${err.message}`);
      }
    };
    reader.readAsText(file);
  }

  document.getElementById("importFile").addEventListener("change", (e) => {
    if (e.target.files[0]) importJSON(e.target.files[0]);
    e.target.value = "";
  });

  /* ---- Bar --------------------------------------------------------------- */

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn || btn.closest("#form") || btn.closest("#archive")) {
      if (btn && btn.dataset.act === "export") exportJSON();
      return;
    }
    e.preventDefault();
    const act = btn.dataset.act;
    if (act === "new") {
      createQuote(current().brand);
      fillForm();
      renderDoc();
    } else if (act === "archive") {
      renderArchive();
      archive.showModal();
    } else if (act === "print") {
      window.print();
    }
  });

  /* ---- Start ------------------------------------------------------------- */

  load();
  syncCounters();
  if (!current()) {
    const first = Object.values(brands).find((b) => b.ready);
    createQuote(first.id);
  }
  fillForm();
  renderDoc();
})();
