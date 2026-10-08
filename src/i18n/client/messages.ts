import enCommon from "@/messages/en/common.json";
import enFooter from "@/messages/en/client/footer.json";
import enHeader from "@/messages/en/client/header.json";
import enSideMenu from "@/messages/en/client/side-menu.json";
import enAbout from "@/messages/en/client/pages/about.json";
import enCategories from "@/messages/en/client/pages/categories.json";
import enCategoryDetail from "@/messages/en/client/pages/category-detail.json";
import enCompany from "@/messages/en/client/pages/company.json";
import enContact from "@/messages/en/client/pages/contact.json";
import enDevis from "@/messages/en/client/pages/devis.json";
import enDomainDetail from "@/messages/en/client/pages/domain-detail.json";
import enDomains from "@/messages/en/client/pages/domains.json";
import enHome from "@/messages/en/client/pages/home.json";
import enNews from "@/messages/en/client/pages/news.json";
import enPartners from "@/messages/en/client/pages/partners.json";
import enProductDetail from "@/messages/en/client/pages/product-detail.json";
import enQuote from "@/messages/en/client/pages/quote.json";
import enReviews from "@/messages/en/client/pages/reviews.json";
import enBlog from "@/messages/en/client/pages/resources/blog.json";
import enBlogDetail from "@/messages/en/client/pages/resources/blog-detail.json";
import enDownloads from "@/messages/en/client/pages/resources/downloads.json";
import enFaq from "@/messages/en/client/pages/resources/faq.json";
import enGaleries from "@/messages/en/client/pages/resources/galeries.json";
import enGuides from "@/messages/en/client/pages/resources/guides.json";
import frCommon from "@/messages/fr/common.json";
import frFooter from "@/messages/fr/client/footer.json";
import frHeader from "@/messages/fr/client/header.json";
import frSideMenu from "@/messages/fr/client/side-menu.json";
import frAbout from "@/messages/fr/client/pages/about.json";
import frCategories from "@/messages/fr/client/pages/categories.json";
import frCategoryDetail from "@/messages/fr/client/pages/category-detail.json";
import frCompany from "@/messages/fr/client/pages/company.json";
import frContact from "@/messages/fr/client/pages/contact.json";
import frDevis from "@/messages/fr/client/pages/devis.json";
import frDomainDetail from "@/messages/fr/client/pages/domain-detail.json";
import frDomains from "@/messages/fr/client/pages/domains.json";
import frHome from "@/messages/fr/client/pages/home.json";
import frNews from "@/messages/fr/client/pages/news.json";
import frPartners from "@/messages/fr/client/pages/partners.json";
import frProductDetail from "@/messages/fr/client/pages/product-detail.json";
import frQuote from "@/messages/fr/client/pages/quote.json";
import frReviews from "@/messages/fr/client/pages/reviews.json";
import frBlog from "@/messages/fr/client/pages/resources/blog.json";
import frBlogDetail from "@/messages/fr/client/pages/resources/blog-detail.json";
import frDownloads from "@/messages/fr/client/pages/resources/downloads.json";
import frFaq from "@/messages/fr/client/pages/resources/faq.json";
import frGaleries from "@/messages/fr/client/pages/resources/galeries.json";
import frGuides from "@/messages/fr/client/pages/resources/guides.json";

import type { Locale } from "@/i18n/shared/config";

type PageMessages = {
  about: unknown;
  blog: unknown;
  blogDetail: unknown;
  company: unknown;
  contact: unknown;
  devis: unknown;
  domainDetail: unknown;
  domains: unknown;
  downloads: unknown;
  faq: unknown;
  galeries: unknown;
  guides: unknown;
  home: unknown;
  news: unknown;
  partners: unknown;
  categories: unknown;
  categoryDetail: unknown;
  productDetail: unknown;
  quote: unknown;
  reviews: unknown;
};

function buildPagesMessages(messages: PageMessages) {
  const { blog, blogDetail, downloads, faq, galeries, guides, ...pages } =
    messages;

  return {
    ...pages,
    resources: { blog, blogDetail, downloads, faq, galeries, guides },
  };
}

const clientMessagesByLocale = {
  en: {
    common: enCommon,
    header: enHeader,
    footer: enFooter,
    sideMenu: enSideMenu,
    pages: buildPagesMessages({
      about: enAbout,
      blog: enBlog,
      blogDetail: enBlogDetail,
      company: enCompany,
      contact: enContact,
      devis: enDevis,
      domainDetail: enDomainDetail,
      domains: enDomains,
      downloads: enDownloads,
      faq: enFaq,
      galeries: enGaleries,
      guides: enGuides,
      home: enHome,
      news: enNews,
      partners: enPartners,
      categories: enCategories,
      categoryDetail: enCategoryDetail,
      productDetail: enProductDetail,
      quote: enQuote,
      reviews: enReviews,
    }),
  },
  fr: {
    common: frCommon,
    header: frHeader,
    footer: frFooter,
    sideMenu: frSideMenu,
    pages: buildPagesMessages({
      about: frAbout,
      blog: frBlog,
      blogDetail: frBlogDetail,
      company: frCompany,
      contact: frContact,
      devis: frDevis,
      domainDetail: frDomainDetail,
      domains: frDomains,
      downloads: frDownloads,
      faq: frFaq,
      galeries: frGaleries,
      guides: frGuides,
      home: frHome,
      news: frNews,
      partners: frPartners,
      categories: frCategories,
      categoryDetail: frCategoryDetail,
      productDetail: frProductDetail,
      quote: frQuote,
      reviews: frReviews,
    }),
  },
} satisfies Record<Locale, Record<string, unknown>>;

export { clientMessagesByLocale };
