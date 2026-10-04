/* Juridische entiteiten die een offerte kunnen uitschrijven.
   Eén plek voor bedrijfsgegevens. De merkconfigs (impens.js, 2x8.js)
   verwijzen hiernaar via de sleutel ("jasper", "florian"). */

window.OFFERTE = window.OFFERTE || { entities: {}, brands: {} };

window.OFFERTE.entities.jasper = {
  label: "Jasper",
  legalName: "Impens Jasper CommV",
  street: "Wildebrake 45",
  city: "9041 Oostakker",
  country: "België",
  companyNumber: "1042.921.135",
  vat: "BE1042.921.135",
  rpr: "RPR Gent, afdeling Gent",
  iban: "BE90 0020 4092 2032",
  bic: "GEBABEBB",
  bank: "BNP Paribas Fortis",
  contact: {
    name: "Jasper Impens",
    email: "jasperimpens@gmail.com",
    phone: "+32 491 95 31 73",
    web: "jasperimpens.be",
    instagram: "instagram.com/impens.jasper",
  },
};

/* TE LEVEREN: vennootschap, adres, btw-nummer, IBAN van Florian. */
window.OFFERTE.entities.florian = {
  label: "Florian",
  legalName: "",
  street: "",
  city: "",
  country: "België",
  companyNumber: "",
  vat: "",
  rpr: "",
  iban: "",
  bic: "",
  bank: "",
  contact: {
    name: "Florian",
    email: "",
    phone: "",
    web: "2x8.be",
    instagram: "",
  },
};
