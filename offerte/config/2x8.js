/* 2x8: merkconfig.
   2x8 is geen vennootschap. Juridische gegevens komen van de
   facturerende partij in entities.js. */

window.OFFERTE = window.OFFERTE || { entities: {}, brands: {} };

window.OFFERTE.brands["2x8"] = {
  id: "2x8",
  name: "2X8",
  ready: true,
  logo: "assets/2x8/logo.svg",
  logoInverse: "assets/2x8/logo-white.svg",
  tagline: "Digitale interfaces, creatie en implementatie",
  contact: { email: "hello@2x8.be", web: "2x8.be" },

  /* Facturatie via Jasper of via Florian: keuzeveld in het formulier. */
  issuers: ["jasper", "florian"],

  numbering: { prefix: "2X8", pad: 3 },

  defaults: {
    validDays: 30,
    vat: 21,
    notes: "Werkwijze in sprints. Richttermijn 2 weken, afhankelijk van de scope.",
    terms: [
      "Prijzen excl. btw.",
      "Deze offerte is geldig tot de vermelde datum.",
      "Teksten en foto's levert de klant aan. Anders AI-teksten en stockfoto's.",
    ].join("\n"),
  },

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
