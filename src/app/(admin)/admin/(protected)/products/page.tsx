import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { PageHeader } from "@/components/admin/shared";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

export default async function ProductsPage() {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const products = await prisma.product.findMany({ where: { deletedAt: null }, include: { translations: true, categories: { include: { category: true } }, media: true }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  return <><PageHeader title={locale === "fr" ? "Produits" : "Products"} description={locale === "fr" ? "Gérez le catalogue bilingue sans modifier sa présentation publique." : "Manage the bilingual catalog without changing its public presentation."} action={<Button asChild><Link href="/admin/products/new"><Plus />{locale === "fr" ? "Nouveau produit" : "New product"}</Link></Button>} /><Card><CardContent className="p-2">{products.length ? <div className="overflow-hidden rounded-md border"><Table><TableHeader><TableRow><TableHead>{locale === "fr" ? "Produit" : "Product"}</TableHead><TableHead>Status</TableHead><TableHead>{locale === "fr" ? "Catégories" : "Categories"}</TableHead><TableHead>{locale === "fr" ? "Médias" : "Media"}</TableHead><TableHead>{locale === "fr" ? "Ordre" : "Order"}</TableHead></TableRow></TableHeader><TableBody>{products.map((product) => { const value = product.translations.find((item) => item.locale === (locale === "fr" ? "FR" : "EN")) ?? product.translations[0]; return <TableRow key={product.id}><TableCell><Link href={`/admin/products/${product.id}/edit`} className="font-medium hover:underline">{value?.title || (locale === "fr" ? "Sans titre" : "Untitled")}</Link><div className="text-xs text-muted-foreground">{product.family}</div></TableCell><TableCell><Badge variant={product.status === "PUBLISHED" ? "success" : "secondary"}>{product.status}</Badge></TableCell><TableCell>{product.categories.length}</TableCell><TableCell>{product.media.length}</TableCell><TableCell>{product.sortOrder}</TableCell></TableRow>; })}</TableBody></Table></div> : <EmptyState icon={<Package className="size-full" />} title={locale === "fr" ? "Aucun produit" : "No products"} />}</CardContent></Card></>;
}
