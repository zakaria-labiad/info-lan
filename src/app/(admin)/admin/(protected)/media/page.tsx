import { getLocale } from "next-intl/server";
import { MediaManager } from "@/components/admin/media";
import { PageHeader } from "@/components/admin/shared";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

export default async function MediaPage() {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const items = await prisma.media.findMany({ where: { deletedAt: null }, select: { id: true, secureUrl: true, fileName: true, width: true, height: true, altTextFr: true, altTextEn: true, _count: { select: { blogPosts: true, products: true } } }, orderBy: { createdAt: "desc" } });
  return <><PageHeader title={locale === "fr" ? "Médiathèque" : "Media library"} description={locale === "fr" ? "Téléversements signés Cloudinary et protection des médias utilisés." : "Signed Cloudinary uploads with referenced-media protection."} /><MediaManager items={items} locale={locale} /></>;
}
