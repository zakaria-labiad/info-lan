import { BookOpen, Plus } from "lucide-react";
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

const statusLabels = {
  DRAFT: { fr: "Brouillon", en: "Draft" },
  SCHEDULED: { fr: "Programmé", en: "Scheduled" },
  PUBLISHED: { fr: "Publié", en: "Published" },
  ARCHIVED: { fr: "Archivé", en: "Archived" },
} as const;

export default async function AdminBlogPage() {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const posts = await prisma.blogPost.findMany({
    where: { deletedAt: null },
    include: { translations: true, creator: { select: { name: true } }, _count: { select: { comments: true } } },
    orderBy: { updatedAt: "desc" },
  });
  const formatDate = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <>
      <PageHeader
        title={locale === "fr" ? "Blog" : "Blog"}
        description={locale === "fr" ? "Créez, traduisez, programmez et publiez vos articles." : "Create, translate, schedule, and publish posts."}
        action={<Button asChild><Link href="/admin/blog/new"><Plus aria-hidden="true" />{locale === "fr" ? "Nouvel article" : "New post"}</Link></Button>}
      />
      <Card>
        <CardContent className="p-2">
          {posts.length ? (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader><TableRow><TableHead>{locale === "fr" ? "Article" : "Post"}</TableHead><TableHead>{locale === "fr" ? "Statut" : "Status"}</TableHead><TableHead>{locale === "fr" ? "Langues" : "Languages"}</TableHead><TableHead className="hidden md:table-cell">{locale === "fr" ? "Auteur" : "Author"}</TableHead><TableHead className="text-right">{locale === "fr" ? "Modifié" : "Updated"}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {posts.map((post) => {
                    const fr = post.translations.find((item) => item.locale === "FR");
                    const en = post.translations.find((item) => item.locale === "EN");
                    return <TableRow key={post.id}>
                      <TableCell><Link href={`/admin/blog/${post.id}/edit`} className="font-medium hover:underline">{fr?.title || en?.title || (locale === "fr" ? "Article sans titre" : "Untitled post")}</Link><div className="text-xs text-muted-foreground">{post._count.comments} {locale === "fr" ? "commentaire(s)" : "comment(s)"}</div></TableCell>
                      <TableCell><Badge variant={post.status === "PUBLISHED" ? "success" : "secondary"}>{statusLabels[post.status][locale]}</Badge></TableCell>
                      <TableCell><span title={fr?.isReady ? "FR ready" : "FR draft"}>FR {fr?.isReady ? "✓" : "—"}</span> · <span title={en?.isReady ? "EN ready" : "EN draft"}>EN {en?.isReady ? "✓" : "—"}</span></TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">{post.creator.name}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{formatDate.format(post.updatedAt)}</TableCell>
                    </TableRow>;
                  })}
                </TableBody>
              </Table>
            </div>
          ) : <EmptyState icon={<BookOpen className="size-full" aria-hidden="true" />} title={locale === "fr" ? "Aucun article" : "No posts"} description={locale === "fr" ? "Commencez par rédiger votre premier article." : "Start by writing your first post."} action={<Button asChild><Link href="/admin/blog/new">{locale === "fr" ? "Créer un article" : "Create a post"}</Link></Button>} />}
        </CardContent>
      </Card>
    </>
  );
}
