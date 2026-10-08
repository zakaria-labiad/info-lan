export type DomainRoute = {
  messageKey: string;
  image: string;
};

export const DOMAIN_ROUTES = {
  "tuyauterie-industrielle": {
    messageKey: "industrialPiping",
    image: "/images/home/info-lan-equipment.webp",
  },
  "chaudronnerie-industrielle": {
    messageKey: "boilermaking",
    image: "/images/home/info-lan-installation.webp",
  },
  convoyeurs: {
    messageKey: "conveyors",
    image: "/images/home/info-lan-maintenance.webp",
  },
  "quais-de-chargement": {
    messageKey: "loadingDocks",
    image: "/images/home/info-lan-installation.webp",
  },
  rayonnage: {
    messageKey: "shelving",
    image: "/images/home/info-lan-equipment.webp",
  },
  "affichage-atelier": {
    messageKey: "workshopDisplay",
    image: "/images/about/info-lan-team.webp",
  },
} satisfies Record<string, DomainRoute>;

export const domainSlugs = Object.keys(DOMAIN_ROUTES);

export function getDomainRoute(domain: string) {
  return DOMAIN_ROUTES[domain as keyof typeof DOMAIN_ROUTES];
}
