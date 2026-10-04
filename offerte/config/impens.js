/* IMPENS: merkconfig.
   Juridische gegevens staan in entities.js. Hier: merk, nummering,
   prijslijst en standaardteksten. */

window.OFFERTE = window.OFFERTE || { entities: {}, brands: {} };

window.OFFERTE.brands.impens = {
  id: "impens",
  name: "IMPENS",
  ready: true,
  logo: "assets/impens/logo.svg",
  tagline: "impens. digital interfaces. creation and implementation.",

  /* Wie mag factureren. Meer dan één: keuzeveld in het formulier. */
  issuers: ["jasper"],

  /* Offertenummer: PREFIX-JAAR-REEKS, bv. IMP-2026-001 */
  numbering: { prefix: "IMP", pad: 3 },

  defaults: {
    validDays: 30,
    vat: 21,
    notes: "",
    /* TE BEVESTIGEN: voorwaarden staan nog open in de brief. */
    terms: [
      "Prijzen excl. btw.",
      "Deze offerte is geldig tot de vermelde datum.",
      "Voorschot van 50% bij akkoord. Saldo bij oplevering.",
      "Betaling binnen 14 dagen na factuurdatum.",
      "Teksten en foto's levert de klant aan. Anders AI-teksten en stockfoto's.",
    ].join("\n"),
  },

  /* Snelkeuze. Prijs excl. btw, blijft aanpasbaar per offerte.
     Eigen IMPENS-prijzen: TE BEVESTIGEN, nu gelijk aan de 2x8-startprijzen. */
  services: [
    { label: "Onepager", desc: "Onepager", unit: "stuk", price: 900 },
    { label: "Website", desc: "Website met meerdere pagina's", unit: "stuk", price: 1900 },
    { label: "Webshop", desc: "Webshop", unit: "stuk", price: 2900 },
    { label: "Animaties", desc: "Animaties, parallax, extra's", unit: "op maat", price: 0 },
    { label: "Hosting", desc: "Hosting cloudserver\nIncl. updates en onderhoud", unit: "jaar", price: 350 },
    { label: "Domeinnaam", desc: "Domeinnaam", unit: "jaar", price: 50 },
    { label: "E-mailinbox", desc: "E-mailinbox", unit: "jaar", price: 50 },
    { label: "Standaard setup", desc: "Standaard setup\nHosting, 1 domein, 1 inbox", unit: "jaar", price: 450 },
  ],
};
