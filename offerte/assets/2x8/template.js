/* 2x8: offertedocument. Geeft HTML terug voor <article class="doc">.
   Styling in doc.css. 2x8 is geen vennootschap: de juridische gegevens
   komen van de facturerende partij (entity). */

window.OFFERTE = window.OFFERTE || { entities: {}, brands: {} };
window.OFFERTE.templates = window.OFFERTE.templates || {};

window.OFFERTE.templates["2x8"] = function (ctx) {
  const { q, brand, entity, totals, money, date, esc, qtyLabel, priceLabel, amountLabel } = ctx;
  const c = q.client || {};
  const pad = (n) => String(n).padStart(2, "0");

  const lineRows = (lines, offset) =>
    lines
      .map((l, i) => {
        const [first, ...rest] = String(l.desc || "").split("\n");
        return `
        <div class="x-row">
          <span class="x-idx">${pad(offset + i + 1)}</span>
          <span class="x-desc"><b>${esc(first)}</b>${rest.length ? `<small>${esc(rest.join("\n"))}</small>` : ""}</span>
          <span class="x-num">${esc(qtyLabel(l))}</span>
          <span class="x-num">${esc(priceLabel(l))}</span>
          <span class="x-num">${esc(String(l.vat))}%</span>
          <span class="x-num x-amt">${esc(amountLabel(l))}</span>
        </div>`;
      })
      .join("");

  const tableHead = `
    <div class="x-row x-row-head">
      <span class="x-idx">Nr</span>
      <span class="x-desc">Omschrijving</span>
      <span class="x-num">Aantal</span>
      <span class="x-num">Prijs</span>
      <span class="x-num">Btw</span>
      <span class="x-num">Bedrag</span>
    </div>`;

  const section = (title, note) =>
    `<h2 class="x-h2">${esc(title)}${note ? `<small>${esc(note)}</small>` : ""}</h2>`;

  const included = totals.included;
  const optional = totals.optional;

  const clientLines = [c.company, c.name, c.street, c.city, c.country && c.country !== "België" ? c.country : "", c.vat ? `Btw ${c.vat}` : "", c.email]
    .filter(Boolean)
    .map(esc)
    .join("<br>");

  const vatRows = totals.byRate
    .map(
      (r) => `
      <dt>Btw ${r.rate}%${totals.byRate.length > 1 ? ` <small>over ${money(r.base)}</small>` : ""}</dt>
      <dd>${money(r.vat)}</dd>`
    )
    .join("");

  const entityComplete = entity.legalName && entity.vat && entity.iban;

  const legal = entityComplete
    ? [
        [entity.legalName, entity.street, entity.city],
        [entity.vat && `Btw ${entity.vat}`, entity.companyNumber && `Ond.nr. ${entity.companyNumber}`, entity.rpr],
        [entity.iban && `IBAN ${entity.iban}`, entity.bic && `BIC ${entity.bic}`, entity.bank],
        [brand.contact.web, brand.contact.email, entity.contact.phone],
      ]
        .map((col) => col.filter(Boolean).map(esc).join("<br>"))
        .filter(Boolean)
        .map((html) => `<p>${html}</p>`)
        .join("")
    : `<p class="x-missing">Gegevens ${esc(entity.label)} ontbreken. Vul aan in config/entities.js.</p>`;

  return `
  <table class="x-frame" role="presentation">
    <thead><tr><td><div class="x-space-top"></div></td></tr></thead>
    <tfoot><tr><td><div class="x-space-bottom"></div></td></tr></tfoot>
    <tbody><tr><td class="x-body">

      <header class="x-band">
        <img class="x-logo" src="${esc(brand.logoInverse || brand.logo)}" alt="${esc(brand.name)}">
        <p class="x-label">Offerte ${esc(q.number || "")}</p>
      </header>

      <h1 class="x-title">${esc(q.subject || "Offerte")}<span class="x-dot">.</span></h1>

      <section class="x-meta">
        <div>
          <h3 class="x-label">Datum</h3>
          <p>${esc(date(q.date))}</p>
          <h3 class="x-label">Geldig tot</h3>
          <p>${esc(date(totals.validUntil))}</p>
        </div>
        <div>
          <h3 class="x-label">Van</h3>
          <p>2X8<br>${esc(entity.contact.name)}<br>${esc(brand.contact.email)}<br>${esc(entity.contact.phone || "")}</p>
        </div>
        <div>
          <h3 class="x-label">Aan</h3>
          <p>${clientLines || '<span class="x-empty">Klant</span>'}</p>
        </div>
      </section>

      <section class="x-block">
        ${section("Prijs")}
        ${included.length ? `${tableHead}${lineRows(included, 0)}` : `<p class="x-empty x-noline">Nog geen lijnen.</p>`}
        <div class="x-totals">
          <dl>
            <dt>Subtotaal</dt><dd>${money(totals.subtotal)}</dd>
            ${vatRows}
            <dt class="x-total">Totaal<small>incl. btw</small></dt><dd class="x-total">${money(totals.total)}</dd>
          </dl>
        </div>
      </section>

      ${
        optional.length
          ? `<section class="x-block">
              ${section("Opties", "Niet inbegrepen in het totaal. Prijzen excl. btw.")}
              ${tableHead}${lineRows(optional, included.length)}
            </section>`
          : ""
      }

      ${
        q.notes || q.terms || q.showSignature
          ? `<section class="x-block x-close">
              <div class="x-close-grid">
                <div class="x-text">
                  ${q.notes ? `<div><h3 class="x-label">Opmerkingen</h3><p>${esc(q.notes)}</p></div>` : ""}
                  ${q.terms ? `<div><h3 class="x-label">Voorwaarden</h3><p>${esc(q.terms)}</p></div>` : ""}
                </div>
                ${
                  q.showSignature
                    ? `<div class="x-sign">
                        <h3 class="x-label">Voor akkoord</h3>
                        <span>Naam</span>
                        <span>Datum</span>
                        <span class="x-sign-big">Handtekening</span>
                      </div>`
                    : ""
                }
              </div>
            </section>`
          : ""
      }

    </td></tr></tbody>
  </table>

  <footer class="x-foot">
    <p class="x-foot-note">2X8 is een samenwerking van Jasper en Florian. Deze offerte wordt uitgeschreven door ${esc(
      entity.legalName || entity.label
    )}.</p>
    ${legal}
  </footer>`;
};
