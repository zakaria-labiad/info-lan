export type CatalogProductRoute = {
  id: string;
  family: string;
};

export type CatalogCategoryRoute = {
  messageKey: string;
  products: CatalogProductRoute[];
};

export const CATEGORY_ROUTES = {
  tuyauterie: {
    messageKey: "piping",
    products: [
      { id: "process-skid", family: "custom" },
      { id: "storage-tank", family: "vessels" },
      { id: "pressure-vessel", family: "vessels" },
      { id: "mixing-vat", family: "custom" },
      { id: "technical-platform", family: "structures" },
      { id: "industrial-fixture", family: "handling" },
    ],
  },
  cuves: {
    messageKey: "tanks",
    products: [
      { id: "storage-tank", family: "vessels" },
      { id: "pressure-vessel", family: "vessels" },
      { id: "mixing-vat", family: "custom" },
      { id: "dosing-hopper", family: "vessels" },
      { id: "metal-silo", family: "vessels" },
      { id: "industrial-tank", family: "vessels" },
      { id: "storage-silo", family: "vessels" },
      { id: "material-hopper", family: "vessels" },
      { id: "retention-tray", family: "workshop" },
    ],
  },
  chaudronnerie: {
    messageKey: "boilermaking",
    products: [
      { id: "boilermade-part", family: "vessels" },
      { id: "custom-frame", family: "structures" },
      { id: "machine-cover", family: "custom" },
      { id: "machine-support", family: "structures" },
      { id: "prototype-assembly", family: "workshop" },
      { id: "process-skid", family: "custom" },
    ],
  },
  convoyeurs: {
    messageKey: "conveyors",
    products: [
      { id: "belt-conveyor", family: "handling" },
      { id: "roller-conveyor", family: "handling" },
      { id: "screw-conveyor", family: "handling" },
      { id: "transfer-cart", family: "handling" },
      { id: "handling-trolley", family: "handling" },
      { id: "tilting-skip", family: "handling" },
      { id: "industrial-fixture", family: "handling" },
    ],
  },
  quais: {
    messageKey: "docks",
    products: [
      { id: "loading-frame", family: "structures" },
      { id: "loading-platform", family: "structures" },
      { id: "mobile-dock", family: "handling" },
      { id: "maintenance-platform", family: "safety" },
      { id: "tilting-skip", family: "handling" },
      { id: "transfer-cart", family: "handling" },
      { id: "guardrail", family: "safety" },
      { id: "platform-protection", family: "structures" },
    ],
  },
  structures: {
    messageKey: "structures",
    products: [
      { id: "light-frame", family: "structures" },
      { id: "technical-platform", family: "structures" },
      { id: "industrial-stairs", family: "structures" },
      { id: "access-stair", family: "structures" },
      { id: "machine-support", family: "structures" },
      { id: "walkway", family: "safety" },
      { id: "access-ladder", family: "safety" },
      { id: "custom-frame", family: "structures" },
    ],
  },
  rayonnage: {
    messageKey: "shelving",
    products: [
      { id: "custom-rack", family: "custom" },
      { id: "tool-storage", family: "workshop" },
      { id: "technical-platform", family: "structures" },
      { id: "metal-workbench", family: "workshop" },
      { id: "handling-trolley", family: "handling" },
      { id: "platform-protection", family: "structures" },
    ],
  },
  securite: {
    messageKey: "safety",
    products: [
      { id: "guardrail", family: "safety" },
      { id: "safety-gate", family: "safety" },
      { id: "zone-barrier", family: "safety" },
      { id: "lifeline-support", family: "safety" },
      { id: "stair-railing", family: "structures" },
      { id: "platform-protection", family: "structures" },
      { id: "machine-guard", family: "safety" },
    ],
  },
  atelier: {
    messageKey: "workshop",
    products: [
      { id: "metal-workbench", family: "workshop" },
      { id: "tool-storage", family: "workshop" },
      { id: "welding-table", family: "workshop" },
      { id: "handling-trolley", family: "handling" },
      { id: "retention-tray", family: "workshop" },
      { id: "machine-guard", family: "safety" },
    ],
  },
  affichage: {
    messageKey: "display",
    products: [
      { id: "display-board", family: "workshop" },
      { id: "notice-case", family: "workshop" },
      { id: "magnetic-board", family: "workshop" },
      { id: "document-holder", family: "workshop" },
      { id: "workshop-panel", family: "workshop" },
      { id: "floor-stand", family: "structures" },
    ],
  },
  speciaux: {
    messageKey: "specials",
    products: [
      { id: "process-skid", family: "custom" },
      { id: "custom-frame", family: "structures" },
      { id: "machine-cover", family: "custom" },
      { id: "prototype-assembly", family: "workshop" },
      { id: "industrial-fixture", family: "handling" },
      { id: "boilermade-part", family: "vessels" },
    ],
  },
} satisfies Record<string, CatalogCategoryRoute>;

export const categorySlugs = Object.keys(CATEGORY_ROUTES);

export function getCatalogCategory(category: string) {
  return CATEGORY_ROUTES[category as keyof typeof CATEGORY_ROUTES];
}

export function hasCatalogProduct(category: string, product: string) {
  return getCatalogCategory(category)?.products.some((item) => item.id === product) ?? false;
}

export function getProductCategory(product: string) {
  return Object.entries(CATEGORY_ROUTES).find(([, category]) =>
    category.products.some((item) => item.id === product),
  )?.[0];
}
