/* IMPENS: offertedocument. Geeft HTML terug voor <article class="doc">.
   Styling in doc.css. Alle data komt uit ctx (zie renderDoc in app.js). */

window.OFFERTE = window.OFFERTE || { entities: {}, brands: {} };
window.OFFERTE.templates = window.OFFERTE.templates || {};

window.OFFERTE.templates.impens = function (ctx) {
  const { q, brand, entity, totals, money, date, esc, qtyLabel, priceLabel, amountLabel } = ctx;
  const c = q.client || {};
  const pad = (n) => String(n).padStart(2, "0");

  const lineRows = (lines, offset) =>
    lines
      .map((l, i) => {
        const [first, ...rest] = String(l.desc || "").split("\n");
        return `
        <div class="d-row">
          <span class="d-idx">${pad(offset + i + 1)}</span>
          <span class="d-desc">${esc(first)}${rest.length ? `<small>${esc(rest.join("\n"))}</small>` : ""}</span>
          <span class="d-qty">${esc(qtyLabel(l))}</span>
          <span class="d-price">${esc(priceLabel(l))}</span>
          <span class="d-vat">${esc(String(l.vat))}%</span>
          <span class="d-amt">${esc(amountLabel(l))}</span>
        </div>`;
      })
      .join("");

  const tableHead = `
    <div class="d-row d-row-head">
      <span class="d-idx">#</span>
      <span class="d-desc">Omschrijving</span>
      <span class="d-qty">Aantal</span>
      <span class="d-price">Prijs</span>
      <span class="d-vat">Btw</span>
      <span class="d-amt">Bedrag</span>
    </div>`;

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

  const legal = [
    [entity.legalName, entity.street, entity.city],
    [entity.vat && `BTW ${entity.vat}`, entity.companyNumber && `Ond.nr. ${entity.companyNumber}`, entity.rpr],
    [entity.iban && `IBAN ${entity.iban}`, entity.bic && `BIC ${entity.bic}`, entity.bank],
    [entity.contact.web, entity.contact.email, entity.contact.phone],
  ]
    .map((col) => col.filter(Boolean).map(esc).join("<br>"))
    .filter(Boolean)
    .map((html) => `<p>${html}</p>`)
    .join("");

  return `
  <table class="d-frame" role="presentation">
    <thead><tr><td><div class="d-space-top"></div></td></tr></thead>
    <tfoot><tr><td><div class="d-space-bottom"></div></td></tr></tfoot>
    <tbody><tr><td class="d-body">

      <header class="d-head">
        <img class="d-logo" src="${esc(brand.logo)}" alt="${esc(brand.name)}">
        <p class="d-docname">Offerte</p>
      </header>

      <section class="d-meta">
        <dl class="d-spec">
          <dt>Nummer</dt><dd>${esc(q.number || "")}</dd>
          <dt>Datum</dt><dd>${esc(date(q.date))}</dd>
          <dt>Geldig tot</dt><dd>${esc(date(totals.validUntil))}</dd>
        </dl>
        <div class="d-party">
          <h3>Van</h3>
          <p>${esc(entity.contact.name)}<br>${esc(entity.contact.email)}<br>${esc(entity.contact.phone)}<br>${esc(entity.contact.web)}</p>
        </div>
        <div class="d-party">
          <h3>Aan</h3>
          <p>${clientLines || '<span class="d-empty">Klant</span>'}</p>
        </div>
      </section>

      <h1 class="d-subject">${esc(q.subject || "Offerte")}</h1>

      ${
        included.length
          ? `<section class="d-table">${tableHead}${lineRows(included, 0)}</section>`
          : `<p class="d-empty d-noline">Nog geen lijnen.</p>`
      }

      <section class="d-totals">
        <dl>
          <dt>Subtotaal</dt><dd>${money(totals.subtotal)}</dd>
          ${vatRows}
          <dt class="d-total">Totaal</dt><dd class="d-total">${money(totals.total)}</dd>
        </dl>
      </section>

      ${
        optional.length
          ? `<section class="d-table d-options">
              <h2 class="d-h2">Opties <small>Niet inbegrepen in het totaal. Prijzen excl. btw.</small></h2>
              ${tableHead}${lineRows(optional, included.length)}
            </section>`
          : ""
      }

      ${
        q.notes || q.terms || q.showSignature
          ? `<section class="d-close">
              <div class="d-text">
                ${q.notes ? `<div><h3>Opmerkingen</h3><p>${esc(q.notes)}</p></div>` : ""}
                ${q.terms ? `<div><h3>Voorwaarden</h3><p>${esc(q.terms)}</p></div>` : ""}
              </div>
              ${
                q.showSignature
                  ? `<div class="d-sign">
                      <h3>Voor akkoord</h3>
                      <span>Naam</span>
                      <span>Datum</span>
                      <span class="d-sign-big">Handtekening</span>
                    </div>`
                  : ""
              }
            </section>`
          : ""
      }

    </td></tr></tbody>
  </table>

  <footer class="d-foot">
    ${legal}
  </footer>`;
};
