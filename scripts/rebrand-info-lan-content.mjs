import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

async function jsonFilesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory()
        ? jsonFilesBelow(target)
        : Promise.resolve(target.endsWith(".json") ? [target] : []);
    }),
  );
  return nested.flat();
}

const replacements = {
  fr: [
    [/Chelbab/gi, "INFO-L@N"],
    [/contact@info-l@n\.com/gi, "05 22 39 84 84"],
    [/\+123\s*\(256\)\s*568\s*58/gi, "05 22 39 84 84"],
    [/3891 Ranch view Richardson,?\s*/gi, "20 rue Banafsaj – ex-Violettes, "],
    [/California 62639/gi, "résidence Nouhayla, Casablanca"],
    [/tuyauterie industrielle/gi, "matériel informatique"],
    [/tuyauterie/gi, "matériel informatique"],
    [/chaudronnerie industrielle/gi, "installation informatique"],
    [/chaudronnerie/gi, "installation"],
    [/convoyeurs?/gi, "maintenance informatique"],
    [/quais? de chargement/gi, "réseau et connectivité"],
    [/rayonnage/gi, "périphériques et stockage"],
    [/affichage atelier/gi, "conseil et configuration"],
    [/fabrications? industrielles?/gi, "configurations informatiques"],
    [/fabrications?/gi, "configurations"],
    [/ouvrages? métalliques?/gi, "solutions informatiques"],
    [/ensembles? soudés?/gi, "équipements configurés"],
    [/soudure/gi, "maintenance"],
    [/métalliques?/gi, "informatiques"],
    [/industrielles?/gi, "informatiques"],
    [/industriels?/gi, "informatiques"],
    [/industrie/gi, "informatique"],
    [/dans tout le Maroc/gi, "à Casablanca"],
    [/ISO\s*9001|ISO\s*3834/gi, "organisation de service"],
    [/128 avis projets/gi, "Depuis 2005"],
  ],
  en: [
    [/Chelbab/gi, "INFO-L@N"],
    [/contact@info-l@n\.com/gi, "05 22 39 84 84"],
    [/\+123\s*\(256\)\s*568\s*58/gi, "05 22 39 84 84"],
    [/3891 Ranch view Richardson,?\s*/gi, "20 rue Banafsaj – ex-Violettes, "],
    [/California 62639/gi, "résidence Nouhayla, Casablanca"],
    [/industrial piping/gi, "computer equipment"],
    [/piping/gi, "computer equipment"],
    [/industrial boilermaking/gi, "IT installation"],
    [/boilermaking/gi, "installation"],
    [/conveyors?/gi, "IT maintenance"],
    [/loading docks?/gi, "network and connectivity"],
    [/shelving/gi, "peripherals and storage"],
    [/workshop display/gi, "advice and configuration"],
    [/industrial fabrications?/gi, "IT configurations"],
    [/fabrications?/gi, "configurations"],
    [/welded assemblies/gi, "configured equipment"],
    [/welding/gi, "maintenance"],
    [/metalwork|metal products?/gi, "IT solutions"],
    [/metal/gi, "computer"],
    [/industrial/gi, "IT"],
    [/industry/gi, "IT"],
    [/across Morocco/gi, "in Casablanca"],
    [/ISO\s*9001|ISO\s*3834/gi, "service organization"],
    [/128 project reviews/gi, "Since 2005"],
  ],
};

function rewriteStrings(value, locale, key = "") {
  if (typeof value === "string") {
    if (["slug", "href", "src", "srcParts"].includes(key)) return value;
    return replacements[locale].reduce(
      (current, [pattern, replacement]) => current.replace(pattern, replacement),
      value,
    );
  }
  if (Array.isArray(value)) {
    return value.map((item) => rewriteStrings(item, locale, key));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, child]) => [
        childKey,
        rewriteStrings(child, locale, childKey),
      ]),
    );
  }
  return value;
}

const categoryLabels = {
  fr: {
    piping: "Ordinateurs",
    tanks: "Serveurs & stockage",
    boilermaking: "Impression",
    conveyors: "Réseau",
    docks: "Sécurité informatique",
    structures: "Équipement de bureau",
    shelving: "Sauvegarde",
    safety: "Logiciels & protection",
    workshop: "Maintenance",
    display: "Écrans",
    specials: "Accessoires & solutions",
  },
  en: {
    piping: "Computers",
    tanks: "Servers & storage",
    boilermaking: "Printing",
    conveyors: "Networking",
    docks: "IT security",
    structures: "Office equipment",
    shelving: "Backup",
    safety: "Software & protection",
    workshop: "Maintenance",
    display: "Displays",
    specials: "Accessories & solutions",
  },
};

const productLabels = {
  fr: [
    "Ordinateur de bureau", "Ordinateur portable", "Station de travail",
    "Mini PC", "Écran professionnel", "Clavier et souris", "Serveur tour",
    "Serveur rack", "Stockage réseau NAS", "Disque de sauvegarde",
    "Onduleur", "Baie informatique", "Commutateur réseau", "Routeur",
    "Point d'accès Wi-Fi", "Câblage Ethernet", "Imprimante laser",
    "Imprimante multifonction", "Scanner de documents", "Toner et cartouches",
    "Webcam professionnelle", "Casque audio", "Station d'accueil",
    "Vidéoprojecteur", "Écran de réunion", "Téléphonie IP", "Antivirus",
    "Sauvegarde locale", "Protection électrique", "Contrôle d'accès",
    "Installation de poste", "Configuration réseau", "Migration de données",
    "Diagnostic matériel", "Entretien préventif", "Assistance utilisateur",
    "Mémoire vive", "Disque SSD", "Carte réseau", "Alimentation",
    "Câble et adaptateur", "Sacoche de transport", "Support écran",
    "Multiprise protégée", "Consommables d'impression", "Périphérique USB",
    "Kit visioconférence", "Solution de sauvegarde", "Poste personnalisé",
    "Pack petite entreprise",
  ],
  en: [
    "Desktop computer", "Laptop computer", "Workstation", "Mini PC",
    "Professional display", "Keyboard and mouse", "Tower server", "Rack server",
    "NAS network storage", "Backup drive", "UPS", "IT cabinet",
    "Network switch", "Router", "Wi-Fi access point", "Ethernet cabling",
    "Laser printer", "Multifunction printer", "Document scanner",
    "Toner and cartridges", "Professional webcam", "Headset", "Docking station",
    "Projector", "Meeting display", "IP telephony", "Antivirus",
    "Local backup", "Power protection", "Access control", "Workstation setup",
    "Network configuration", "Data migration", "Hardware diagnostics",
    "Preventive maintenance", "User support", "Memory", "SSD drive",
    "Network card", "Power supply", "Cable and adapter", "Laptop bag",
    "Monitor stand", "Protected power strip", "Printing supplies",
    "USB peripheral", "Video-conferencing kit", "Backup solution",
    "Custom workstation", "Small-business pack",
  ],
};

const services = {
  fr: [
    ["Matériel & consommables", "Choisir les ordinateurs, périphériques et consommables adaptés aux usages professionnels.", "Sélection, préparation et fourniture de matériel informatique avec un conseil clair à Casablanca."],
    ["Installation & mise en service", "Installer, configurer et vérifier les postes et équipements avant leur utilisation.", "Une mise en service structurée pour disposer d'un matériel prêt à travailler."],
    ["Maintenance & assistance", "Diagnostiquer, entretenir et accompagner les utilisateurs dans la durée.", "Un suivi local pour préserver la continuité et la durée de vie des équipements."],
    ["Réseau & connectivité", "Relier les postes et équipements avec une infrastructure réseau adaptée.", "Câblage, équipements réseau et vérification de la connectivité selon le besoin."],
    ["Périphériques & stockage", "Compléter les postes avec les bons périphériques et des solutions de stockage.", "Écrans, impression, accessoires et stockage sélectionnés pour l'activité."],
    ["Conseil & configuration", "Transformer un besoin concret en configuration informatique cohérente.", "Des choix expliqués, une préparation pratique et un accompagnement de proximité."],
  ],
  en: [
    ["Equipment & supplies", "Choose computers, peripherals, and supplies suited to professional use.", "Selection, preparation, and supply of computer equipment with clear advice in Casablanca."],
    ["Installation & setup", "Install, configure, and check workstations and equipment before use.", "A structured setup process so equipment is ready for work."],
    ["Maintenance & support", "Diagnose, maintain, and support users over time.", "Local follow-up to protect continuity and equipment life."],
    ["Network & connectivity", "Connect workstations and equipment with suitable network infrastructure.", "Cabling, network equipment, and connectivity checks matched to the need."],
    ["Peripherals & storage", "Complete workstations with appropriate peripherals and storage.", "Displays, printing, accessories, and storage selected for the activity."],
    ["Advice & configuration", "Turn a practical need into a coherent IT configuration.", "Explained choices, practical preparation, and local support."],
  ],
};

function rewriteDomainContent(messages, locale) {
  const domainEntries = Object.entries(messages.domains);
  domainEntries.forEach(([, domain], index) => {
    const [title, heroDescription, intro] = services[locale][index];
    domain.title = title;
    domain.heroDescription = heroDescription;
    domain.intro = intro;
    domain.fitTitle =
      locale === "fr" ? title + " pour votre activité" : title + " for your activity";
    domain.fitDescription =
      locale === "fr"
        ? "Chaque recommandation part des usages, du matériel existant et des priorités de l'organisation."
        : "Each recommendation starts with actual uses, existing equipment, and the organization's priorities.";
    domain.capabilityLead =
      locale === "fr"
        ? "INFO-L@N accompagne le besoin depuis le choix jusqu'à la mise en service et au suivi."
        : "INFO-L@N supports the need from selection through setup and follow-up.";

    domain.capabilities.forEach((item, itemIndex) => {
      const fr = [
        ["Écoute du besoin", "Identifier les usages, les contraintes et le matériel déjà en place."],
        ["Choix adapté", "Comparer les options utiles sans ajouter de complexité inutile."],
        ["Préparation", "Configurer et vérifier les équipements avant leur utilisation."],
        ["Suivi", "Rester disponible pour l'entretien et l'assistance."],
      ][itemIndex % 4];
      const en = [
        ["Needs review", "Identify uses, constraints, and equipment already in place."],
        ["Suitable choice", "Compare useful options without adding unnecessary complexity."],
        ["Preparation", "Configure and check equipment before use."],
        ["Follow-up", "Remain available for maintenance and support."],
      ][itemIndex % 4];
      [item.title, item.description] = locale === "fr" ? fr : en;
    });

    domain.process.forEach((item, itemIndex) => {
      const fr = [
        ["Comprendre", "Clarifier les usages, les priorités et le budget."],
        ["Préparer", "Sélectionner, configurer et contrôler le matériel."],
        ["Accompagner", "Mettre en service puis organiser le suivi utile."],
      ][itemIndex % 3];
      const en = [
        ["Understand", "Clarify uses, priorities, and budget."],
        ["Prepare", "Select, configure, and check the equipment."],
        ["Support", "Set up the equipment and arrange useful follow-up."],
      ][itemIndex % 3];
      [item.title, item.description] = locale === "fr" ? fr : en;
    });

    const productTitles =
      locale === "fr"
        ? ["Poste informatique", "Équipement réseau", "Solution de maintenance"]
        : ["Computer workstation", "Network equipment", "Maintenance solution"];
    domain.relatedProducts.forEach((item, itemIndex) => {
      item.title = productTitles[itemIndex % productTitles.length];
      item.description =
        locale === "fr"
          ? "Une solution sélectionnée et préparée selon l'usage."
          : "A solution selected and prepared for the intended use.";
      item.icon = ["equipment", "network", "maintenance"][itemIndex % 3];
    });
    domain.relatedPosts.forEach((item, itemIndex) => {
      const titles =
        locale === "fr"
          ? ["Bien choisir son matériel", "Préparer une installation", "Entretenir ses équipements", "Organiser un réseau local"]
          : ["Choosing the right equipment", "Preparing an installation", "Maintaining equipment", "Organizing a local network"];
      item.title = titles[itemIndex % titles.length];
      item.description =
        locale === "fr"
          ? "Des repères pratiques pour préparer votre besoin informatique."
          : "Practical guidance for preparing an IT requirement.";
    });
    domain.faqs.forEach((item, itemIndex) => {
      const fr = [
        ["INFO-L@N accompagne-t-il les entreprises ?", "Oui. L'accompagnement vise d'abord les entreprises, tout en restant ouvert aux particuliers."],
        ["Peut-on demander conseil avant un achat ?", "Oui. Le besoin et les usages peuvent être précisés avant de choisir le matériel."],
        ["L'installation est-elle proposée ?", "Oui. L'installation et la mise en service font partie des trois domaines de service annoncés."],
        ["La maintenance est-elle disponible ?", "Oui. INFO-L@N propose la maintenance et l'assistance du matériel informatique."],
      ][itemIndex % 4];
      const en = [
        ["Does INFO-L@N support businesses?", "Yes. Support is business-first while remaining open to individuals."],
        ["Can I ask for advice before buying?", "Yes. Needs and uses can be clarified before equipment is selected."],
        ["Is installation available?", "Yes. Installation and setup are one of the three stated service areas."],
        ["Is maintenance available?", "Yes. INFO-L@N provides computer equipment maintenance and support."],
      ][itemIndex % 4];
      [item.title, item.description] = locale === "fr" ? fr : en;
    });
    domain.detailSections.forEach((section, sectionIndex) => {
      section.title =
        locale === "fr"
          ? ["Accompagnement", "Conseil pratique", "Continuité"][sectionIndex % 3]
          : ["Support", "Practical advice", "Continuity"][sectionIndex % 3];
      section.paragraphs = section.paragraphs.map(() =>
        locale === "fr"
          ? "INFO-L@N relie le choix, la mise en service et la maintenance pour garder un parcours simple."
          : "INFO-L@N connects selection, setup, and maintenance to keep the experience simple.",
      );
      section.groups?.forEach((group, groupIndex) => {
        group.title =
          locale === "fr"
            ? ["Équipements", "Usages", "Accompagnement"][groupIndex % 3]
            : ["Equipment", "Uses", "Support"][groupIndex % 3];
        group.items =
          locale === "fr"
            ? [
                ["Ordinateurs", "Périphériques", "Réseau", "Stockage"],
                ["Bureautique", "Collaboration", "Sauvegarde", "Impression"],
                ["Conseil", "Installation", "Maintenance", "Assistance"],
              ][groupIndex % 3]
            : [
                ["Computers", "Peripherals", "Networking", "Storage"],
                ["Office work", "Collaboration", "Backup", "Printing"],
                ["Advice", "Installation", "Maintenance", "Support"],
              ][groupIndex % 3];
      });
      if (section.action) {
        section.action.label = locale === "fr" ? "Contactez-nous" : "Contact us";
      }
      section.images?.forEach((image) => {
        image.alt =
          locale === "fr"
            ? "Service informatique INFO-L@N à Casablanca"
            : "INFO-L@N IT service in Casablanca";
        image.srcParts = [
          ["/images/home/info-lan-equipment.webp", "/images/home/info-lan-installation.webp", "/images/home/info-lan-maintenance.webp"][index % 3],
        ];
        delete image.src;
      });
    });
  });
}

function rewriteBlog(messages, locale) {
  const topics =
    locale === "fr"
      ? [
          "Bien choisir un ordinateur professionnel", "Préparer un réseau local",
          "Entretenir son matériel informatique", "Organiser la sauvegarde des données",
          "Choisir un écran pour le travail", "Comprendre le rôle d'un onduleur",
          "Préparer la mise en service d'un poste", "Choisir une imprimante professionnelle",
          "Améliorer la connectivité Wi-Fi", "Quand remplacer un disque par un SSD",
          "Les périphériques utiles au bureau", "Préparer un diagnostic informatique",
          "Garder les postes de travail organisés", "Choisir un stockage réseau",
          "Protéger le matériel des coupures", "Planifier l'entretien des équipements",
          "Équiper une petite équipe", "Préparer une migration de données",
          "Choisir les consommables d'impression", "Les bases d'une configuration cohérente",
        ]
      : [
          "Choosing a professional computer", "Preparing a local network",
          "Maintaining computer equipment", "Organizing data backups",
          "Choosing a display for work", "Understanding the role of a UPS",
          "Preparing a workstation setup", "Choosing a business printer",
          "Improving Wi-Fi connectivity", "When to replace a drive with an SSD",
          "Useful office peripherals", "Preparing an IT diagnosis",
          "Keeping workstations organized", "Choosing network storage",
          "Protecting equipment from outages", "Planning equipment maintenance",
          "Equipping a small team", "Preparing a data migration",
          "Choosing printing supplies", "The basics of a coherent configuration",
        ];
  messages.categories.forEach((category, index) => {
    category.label =
      locale === "fr"
        ? ["Tous", "Matériel", "Installation", "Maintenance", "Conseils"][index] ?? "Informatique"
        : ["All", "Equipment", "Installation", "Maintenance", "Advice"][index] ?? "IT";
  });
  messages.posts.forEach((post, index) => {
    post.title = topics[index % topics.length];
    post.excerpt =
      locale === "fr"
        ? "Des repères simples pour faire un choix informatique adapté à l'usage et préparer la suite."
        : "Simple guidance for making an IT choice suited to the use and preparing what comes next.";
    post.author = locale === "fr" ? "Équipe INFO-L@N" : "INFO-L@N team";
    post.imageAlt =
      locale === "fr" ? post.title + " — conseil informatique" : post.title + " — IT guidance";
    post.body.forEach((section, sectionIndex) => {
      if (section.heading) {
        section.heading =
          locale === "fr"
            ? ["Partir des usages", "Préparer la mise en service", "Penser au suivi"][sectionIndex % 3]
            : ["Start with uses", "Prepare the setup", "Plan the follow-up"][sectionIndex % 3];
      }
      section.paragraphs = section.paragraphs.map(() =>
        locale === "fr"
          ? "Un choix utile commence par les usages, l'environnement de travail et le matériel déjà disponible. INFO-L@N aide à relier ces éléments avant l'achat, l'installation et la maintenance."
          : "A useful choice starts with uses, the working environment, and equipment already available. INFO-L@N helps connect these points before purchase, installation, and maintenance.",
      );
    });
    post.quote = {
      text:
        locale === "fr"
          ? "Un matériel bien choisi est plus simple à installer, à utiliser et à maintenir."
          : "Well-chosen equipment is easier to install, use, and maintain.",
      author: locale === "fr" ? "Équipe INFO-L@N" : "INFO-L@N team",
      role: locale === "fr" ? "Conseil informatique" : "IT guidance",
    };
    post.relatedTags = locale === "fr" ? ["Conseils", "Informatique"] : ["Advice", "IT"];
    post.authorProfile.name = locale === "fr" ? "Équipe INFO-L@N" : "INFO-L@N team";
    post.authorProfile.imageAlt =
      locale === "fr" ? "Équipe INFO-L@N" : "INFO-L@N team";
    post.authorProfile.bio =
      locale === "fr"
        ? "INFO-L@N partage des conseils pratiques autour du matériel, de l'installation et de la maintenance informatique."
        : "INFO-L@N shares practical guidance on computer equipment, installation, and maintenance.";
    post.authorProfile.socials = [];
    post.comments = [];
  });
}

function applyPageOverrides(relative, messages, locale) {
  const fr = locale === "fr";
  if (relative.endsWith("pages/categories.json")) {
    messages.hero.description = fr
      ? "Explorez notre sélection de matériel et de solutions informatiques."
      : "Explore our selection of computer equipment and IT solutions.";
    messages.categories = categoryLabels[locale];
  }
  if (relative.endsWith("pages/category-detail.json")) {
    messages.hero.description = fr
      ? "Découvrez notre gamme {label} et contactez-nous pour choisir une configuration adaptée."
      : "Explore our {label} range and contact us to choose a suitable configuration.";
    messages.productDescription = fr
      ? "{product} pour la catégorie {category}, à sélectionner selon les usages et l'équipement existant."
      : "{product} in the {category} range, to be selected for the intended uses and existing equipment.";
    messages.productImageAlt = fr ? "Photo du produit informatique {product}" : "Photo of {product} computer product";
    messages.categories = categoryLabels[locale];
    messages.filters.vessels = fr ? "Matériel" : "Equipment";
    messages.filters.handling = fr ? "Réseau" : "Networking";
    messages.filters.structures = fr ? "Périphériques" : "Peripherals";
    messages.filters.workshop = fr ? "Maintenance" : "Maintenance";
    messages.filters.safety = fr ? "Protection" : "Protection";
    messages.filters.custom = fr ? "Configuration" : "Configuration";
    Object.keys(messages.products).forEach((key, index) => {
      messages.products[key] = productLabels[locale][index % productLabels[locale].length];
    });
  }
  if (relative.endsWith("pages/product-detail.json")) {
    messages.gallery.imageAlt = fr
      ? "Vue {index} du produit informatique {product}"
      : "View {index} of {product} computer product";
    messages.productShow.badge = fr ? "Solution informatique" : "IT solution";
    messages.productShow.description = fr
      ? "{product} appartient à la gamme {category}. Le choix final dépend de l'usage, de la configuration et du matériel déjà en place."
      : "{product} belongs to the {category} range. The final choice depends on the use, configuration, and equipment already in place.";
    messages.productShow.rating.value = fr ? "Depuis 2005" : "Since 2005";
    messages.productShow.rating.reviews = "Casablanca";
    messages.productShow.colorsLabel = fr ? "Finition :" : "Finish:";
    messages.productShow.colors = fr
      ? { primaryBlue: "Bleu", white: "Blanc", black: "Noir", stainless: "Selon modèle" }
      : { primaryBlue: "Blue", white: "White", black: "Black", stainless: "Model dependent" };
    messages.productShow.sizesLabel = fr ? "Format :" : "Format:";
    messages.productShow.sizes.custom = fr ? "Selon modèle" : "Model dependent";
    messages.productShow.materialLabel = fr ? "Équipement :" : "Equipment:";
    messages.productShow.materialValue = fr ? "Selon configuration" : "Configuration dependent";
    messages.productShow.materials = fr
      ? { carbonSteel: "Ordinateur", stainlessSteel: "Périphérique", aluminum: "Réseau", paintedSteel: "Accessoire" }
      : { carbonSteel: "Computer", stainlessSteel: "Peripheral", aluminum: "Network", paintedSteel: "Accessory" };
    messages.productShow.configurationValue = fr ? "Adaptée" : "Suitable";
    messages.productShow.configurations = fr
      ? { standard: "STD", reinforced: "PRO", custom: "PERS.", installed: "INSTALLÉ" }
      : { standard: "STD", reinforced: "PRO", custom: "CUSTOM", installed: "SET UP" };
    const notes = fr
      ? [["Fourniture", "Matériel et accessoires"], ["Conseil", "Choix selon les usages"], ["Mise en service", "Configuration et vérification"]]
      : [["Supply", "Equipment and accessories"], ["Advice", "Selection for the intended uses"], ["Setup", "Configuration and checks"]];
    Object.values(messages.productShow.serviceNotes).forEach((note, index) => {
      [note.label, note.value] = notes[index];
    });
    messages.productDetails.tabs.materials = fr ? "Configuration" : "Configuration";
    messages.productDetails.tabs.dimensions = fr ? "Compatibilité" : "Compatibility";
    messages.productDetails.tabs.process = fr ? "Mise en service" : "Setup";
    messages.productDetails.description = fr
      ? "{product} peut être sélectionné et configuré selon les usages, les logiciels, les périphériques et l'environnement de travail."
      : "{product} can be selected and configured for the uses, software, peripherals, and working environment.";
    messages.productDetails.imageAlt = fr ? "Vue détaillée de {product}" : "Detailed view of {product}";
    messages.productDetails.points = fr
      ? {
          custom: "Configuration adaptée aux usages",
          materials: "Compatibilité avec les périphériques utiles",
          finish: "Choix du format et de la finition",
          installation: "Installation et mise en service disponibles",
          documentation: "Informations utiles conservées pour le suivi",
        }
      : {
          custom: "Configuration suited to the uses",
          materials: "Compatibility with useful peripherals",
          finish: "Format and finish selection",
          installation: "Installation and setup available",
          documentation: "Useful information retained for follow-up",
        };
    messages.productDetails.views.materials.title = fr ? "Configuration" : "Configuration";
    messages.productDetails.views.materials.description = fr
      ? "Mémoire, stockage, connectivité et périphériques sont considérés selon l'usage."
      : "Memory, storage, connectivity, and peripherals are considered for the intended use.";
    messages.productDetails.views.dimensions.title = fr ? "Compatibilité" : "Compatibility";
    messages.productDetails.views.dimensions.description = fr
      ? "Le format, les interfaces et les accessoires sont vérifiés avec l'environnement existant."
      : "Format, interfaces, and accessories are checked against the existing environment.";
    messages.productDetails.views.quote.description = fr
      ? "Partagez l'usage, les quantités et le matériel existant pour préciser votre besoin."
      : "Share the use, quantities, and existing equipment to clarify your requirement.";
    messages.productDetails.views.quote.points = fr
      ? {
          drawings: "Usages et logiciels identifiés",
          site: "Matériel existant et connectivité précisés",
          timeline: "Disponibilité confirmée avant validation",
        }
      : {
          drawings: "Uses and software identified",
          site: "Existing equipment and connectivity clarified",
          timeline: "Availability confirmed before validation",
        };
    messages.productDetails.views.process.title = fr ? "Mise en service" : "Setup";
    messages.productDetails.views.process.description = fr
      ? "Le matériel est préparé, configuré et vérifié avant son utilisation."
      : "Equipment is prepared, configured, and checked before use.";
    messages.productDetails.views.process.points = fr
      ? {
          review: "Validation de la configuration",
          fabrication: "Préparation et installation",
          control: "Vérification du fonctionnement",
        }
      : {
          review: "Configuration validation",
          fabrication: "Preparation and installation",
          control: "Operation check",
        };
    messages.technicalSpecifications.rows = fr
      ? {
          material: { label: "Configuration", value: "Définie selon les usages et les logiciels nécessaires." },
          finish: { label: "Connectivité", value: "Interfaces réseau et périphériques vérifiées selon le modèle." },
          capacity: { label: "Format", value: "Sélectionné selon l'espace, la mobilité et l'environnement de travail." },
        }
      : {
          material: { label: "Configuration", value: "Defined for the uses and required software." },
          finish: { label: "Connectivity", value: "Network and peripheral interfaces checked by model." },
          capacity: { label: "Format", value: "Selected for the space, mobility, and working environment." },
        };
    for (const profile of Object.values(messages.productContent.profiles)) {
      profile.showDescription = messages.productShow.description;
      profile.detailsDescription = messages.productDetails.description;
      profile.materialDescription = messages.productDetails.views.materials.description;
      profile.dimensionDescription = messages.productDetails.views.dimensions.description;
    }
    const specificationText = fr
      ? "Caractéristique à confirmer selon le modèle et l'usage."
      : "Characteristic to confirm for the model and intended use.";
    Object.values(messages.productContent.specifications).forEach((specification) => {
      specification.value = specificationText;
    });
    Object.values(messages.similarProducts.items).forEach((item, index) => {
      item.title = productLabels[locale][index % productLabels[locale].length];
      item.description = fr
        ? "Une solution complémentaire à sélectionner selon votre configuration."
        : "A complementary solution to select for your configuration.";
    });
    messages.similarProducts.imageAlt = fr
      ? "Produit informatique similaire {product}"
      : "Similar computer product {product}";
  }
  if (relative.endsWith("pages/domains.json")) {
    messages.hero.title = fr ? "Services" : "Services";
    messages.hero.description = fr
      ? "Découvrez les services INFO-L@N : matériel, installation, maintenance, réseau, périphériques et conseil."
      : "Explore INFO-L@N services: equipment, installation, maintenance, networking, peripherals, and advice.";
    Object.keys(messages.cards).forEach((key, index) => {
      messages.cards[key] = services[locale][index][0];
    });
    messages.viewDomain = fr ? "Voir le service" : "View service";
  }
  if (relative.endsWith("pages/domain-detail.json")) {
    messages.eyebrow = fr ? "Service informatique" : "IT service";
    messages.imageAlt = fr ? "Illustration informatique pour {domain}" : "IT illustration for {domain}";
    messages.proofTitle = fr ? "Du besoin au suivi" : "From need to follow-up";
    messages.faqIntro = fr
      ? "Ces réponses présentent l'accompagnement INFO-L@N autour de {domain}. Pour préciser votre besoin, contactez-nous."
      : "These answers present INFO-L@N support for {domain}. Contact us to discuss your requirement.";
    messages.sections.overview = fr ? "Ce que INFO-L@N prend en charge" : "What INFO-L@N supports";
    messages.sections.process = fr ? "Un parcours simple et lisible" : "A simple, clear process";
    messages.sections.products = fr ? "Équipements associés à ce service" : "Equipment related to this service";
    messages.sections.blog = fr ? "Conseils pour préparer votre besoin" : "Guidance for preparing your need";
    rewriteDomainContent(messages, locale);
  }
  if (relative.endsWith("pages/company.json")) {
    messages.hero.description = fr
      ? "Découvrez INFO-L@N, son implantation à Casablanca et ses services informatiques depuis 2005."
      : "Discover INFO-L@N, its Casablanca base, and its IT services since 2005.";
    messages.title = fr ? "À propos de INFO-L@N" : "About INFO-L@N";
    messages.description = fr
      ? "INFO-L@N vend, installe et maintient du matériel informatique pour les entreprises et les particuliers."
      : "INFO-L@N sells, installs, and maintains computer equipment for businesses and individuals.";
  }
  if (relative.endsWith("pages/contact.json")) {
    messages.hero.description = fr
      ? "Contactez INFO-L@N pour votre matériel, son installation ou sa maintenance à Casablanca."
      : "Contact INFO-L@N for equipment, installation, or maintenance in Casablanca.";
    messages.description = fr
      ? "Expliquez votre besoin : notre équipe vous répondra avec les informations disponibles."
      : "Tell us what you need and our team will respond with the available information.";
    messages.email = fr ? "Écrivez-nous" : "Write to us";
    messages.addressValue = "20 rue Banafsaj – ex-Violettes, résidence Nouhayla, Casablanca";
    messages.mapTitle = fr ? "Localisation de INFO-L@N à Casablanca" : "INFO-L@N location in Casablanca";
  }
  if (relative.endsWith("pages/reviews.json")) {
    messages.hero.title = fr ? "Nos engagements" : "Our commitments";
    messages.hero.description = fr
      ? "Découvrez les principes qui guident l'accompagnement INFO-L@N."
      : "Discover the principles that guide INFO-L@N support.";
    messages.ctaTitle = fr ? "Parlons de votre besoin informatique." : "Let's discuss your IT requirement.";
    messages.ratingLabel = fr ? "Engagement INFO-L@N" : "INFO-L@N commitment";
    const items = fr
      ? [
          ["Présence locale", "Casablanca", "Une adresse et un numéro de téléphone vérifiés pour échanger directement avec INFO-L@N.", "PL"],
          ["Conseil pratique", "Matériel & consommables", "Des choix expliqués selon les usages avant la mise en service.", "CP"],
          ["Continuité", "Installation & maintenance", "Un accompagnement qui relie l'achat, l'installation et la maintenance.", "CO"],
        ]
      : [
          ["Local presence", "Casablanca", "A verified address and phone number for contacting INFO-L@N directly.", "LP"],
          ["Practical advice", "Equipment & supplies", "Choices explained for the intended uses before setup.", "PA"],
          ["Continuity", "Installation & maintenance", "Support connecting purchase, setup, and maintenance.", "CO"],
        ];
    messages.items = items.map(([name, company, comment, initials]) => ({
      name,
      company,
      comment,
      rating: 1,
      initials,
      imageAlt: name,
    }));
  }
  if (relative.endsWith("pages/news.json")) {
    messages.hero.description = fr
      ? "Retrouvez les informations utiles sur les services INFO-L@N."
      : "Find useful information about INFO-L@N services.";
    messages.ctaTitle = fr ? "Un besoin informatique à Casablanca ?" : "Need IT support in Casablanca?";
    const items = fr
      ? [
          ["Matériel & consommables", "Service INFO-L@N", "Ordinateurs, périphériques et consommables sélectionnés selon les usages."],
          ["Installation & mise en service", "Service INFO-L@N", "Configuration et vérification du matériel avant son utilisation."],
          ["Maintenance & assistance", "Service INFO-L@N", "Diagnostic, entretien et accompagnement des utilisateurs."],
        ]
      : [
          ["Equipment & supplies", "INFO-L@N service", "Computers, peripherals, and supplies selected for the intended uses."],
          ["Installation & setup", "INFO-L@N service", "Equipment configuration and checks before use."],
          ["Maintenance & support", "INFO-L@N service", "Diagnostics, care, and user support."],
        ];
    messages.articles = items.map(([title, date, summary]) => ({ title, date, summary }));
  }
  if (relative.endsWith("pages/resources/blog.json")) rewriteBlog(messages, locale);
  if (relative.endsWith("pages/resources/blog-detail.json")) {
    messages.hero.description = fr
      ? "Consultez les conseils INFO-L@N sur le matériel, l'installation et la maintenance."
      : "Read INFO-L@N guidance on equipment, installation, and maintenance.";
  }
  if (relative.endsWith("pages/resources/faq.json")) {
    messages.description = fr
      ? "Matériel, installation ou maintenance : voici les points à préciser avec notre équipe."
      : "Equipment, installation, or maintenance: these are the points to discuss with our team.";
    const items = fr
      ? [
          ["Quels services propose INFO-L@N ?", "INFO-L@N vend du matériel et des consommables informatiques, assure l'installation et la mise en service, puis propose la maintenance et l'assistance."],
          ["INFO-L@N accompagne-t-il les entreprises ?", "Oui. L'entreprise cible d'abord les besoins professionnels, tout en accueillant les particuliers."],
          ["Où se trouve INFO-L@N ?", "INFO-L@N est située au 20 rue Banafsaj – ex-Violettes, résidence Nouhayla, Casablanca."],
          ["Comment contacter INFO-L@N ?", "Vous pouvez appeler le 05 22 39 84 84 ou utiliser le formulaire de contact du site."],
        ]
      : [
          ["What services does INFO-L@N provide?", "INFO-L@N sells computer equipment and supplies, provides installation and setup, and offers maintenance and support."],
          ["Does INFO-L@N support businesses?", "Yes. The company primarily serves professional needs while welcoming individuals."],
          ["Where is INFO-L@N located?", "INFO-L@N is located at 20 rue Banafsaj – ex-Violettes, résidence Nouhayla, Casablanca."],
          ["How can I contact INFO-L@N?", "Call 05 22 39 84 84 or use the website contact form."],
        ];
    messages.items = items.map(([question, answer]) => ({ question, answer }));
  }
  if (relative.endsWith("pages/resources/guides.json")) {
    messages.hero.description = fr
      ? "Consultez des repères pratiques pour choisir et entretenir votre informatique."
      : "Read practical guidance for choosing and maintaining your IT.";
    const items = fr
      ? [
          ["Guide de choix d'un poste informatique", "Usages, mémoire, stockage, écran et périphériques à considérer.", "Sur demande"],
          ["Préparer une installation réseau", "Équipements, câblage et vérifications à prévoir avant la mise en service.", "Sur demande"],
          ["Repères de maintenance informatique", "Points simples pour entretenir le matériel et préparer un diagnostic.", "Sur demande"],
        ]
      : [
          ["Computer workstation selection guide", "Uses, memory, storage, display, and peripherals to consider.", "On request"],
          ["Preparing a network installation", "Equipment, cabling, and checks to plan before setup.", "On request"],
          ["Computer maintenance guidance", "Simple points for caring for equipment and preparing a diagnosis.", "On request"],
        ];
    messages.items = items.map(([title, description, pages]) => ({
      title,
      description,
      pages,
      format: "PDF",
      href: "/contact",
    }));
  }
  if (relative.endsWith("pages/resources/downloads.json")) {
    messages.hero.description = fr
      ? "Demandez les informations utiles sur le matériel et les services INFO-L@N."
      : "Request useful information about INFO-L@N equipment and services.";
    messages.download = fr ? "Demander" : "Request";
    const sections = fr
      ? [
          ["Matériel & consommables", ["Ordinateurs et périphériques", "Impression et consommables", "Réseau et stockage"]],
          ["Installation & mise en service", ["Préparation des postes", "Configuration réseau", "Vérification du fonctionnement"]],
          ["Maintenance & assistance", ["Diagnostic matériel", "Entretien des équipements", "Accompagnement utilisateur"]],
        ]
      : [
          ["Equipment & supplies", ["Computers and peripherals", "Printing and supplies", "Networking and storage"]],
          ["Installation & setup", ["Workstation preparation", "Network configuration", "Operation checks"]],
          ["Maintenance & support", ["Hardware diagnostics", "Equipment care", "User support"]],
        ];
    messages.sections = sections.map(([category, items]) => ({
      category,
      items: items.map((name) => ({ name, size: fr ? "Sur demande" : "On request", href: "/contact" })),
    }));
  }
  if (relative.endsWith("pages/partners.json")) {
    messages.hero.title = fr ? "Nos solutions" : "Our solutions";
    messages.hero.description = fr
      ? "Découvrez les domaines dans lesquels INFO-L@N accompagne les besoins informatiques."
      : "Explore the areas in which INFO-L@N supports IT needs.";
    messages.becomeTitle = fr ? "Parlons de votre besoin" : "Let's discuss your needs";
    messages.becomeDescription = fr
      ? "Matériel, installation ou maintenance : contactez INFO-L@N."
      : "Equipment, installation, or maintenance: contact INFO-L@N.";
    messages.contact = fr ? "Contactez-nous" : "Contact us";
    messages.logoAlt = fr ? "Illustration de {partner}" : "{partner} illustration";
  }
  if (relative.endsWith("side-menu.json")) {
    messages.homeLabel = fr ? "Accueil INFO-L@N" : "INFO-L@N home";
    messages.logoAlt = fr ? "Logo INFO-L@N" : "INFO-L@N logo";
    messages.intro = fr
      ? "Accédez aux produits, services, ressources et coordonnées vérifiées de INFO-L@N."
      : "Access INFO-L@N products, services, resources, and verified contact details.";
    messages.contact.phone = "05 22 39 84 84";
    messages.contact.email = fr ? "Formulaire de contact" : "Contact form";
    messages.contact.address = "20 rue Banafsaj – ex-Violettes, résidence Nouhayla, Casablanca";
  }
}

for (const locale of ["fr", "en"]) {
  const directory = path.join(root, "src", "messages", locale, "client");
  for (const file of await jsonFilesBelow(directory)) {
    const relative = path.relative(directory, file).replaceAll("\\", "/");
    const parsed = JSON.parse(await readFile(file, "utf8"));
    const rewritten = rewriteStrings(parsed, locale);
    applyPageOverrides(relative, rewritten, locale);
    await writeFile(file, JSON.stringify(rewritten, null, 2) + "\n");
  }
}
