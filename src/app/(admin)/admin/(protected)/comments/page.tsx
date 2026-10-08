import { MessageCircle } from "lucide-react";
import { getLocale } from "next-intl/server";

import { CommentModerationActions } from "@/components/admin/blog";
import { PageHeader } from "@/components/admin/shared";
import { Badge } from "@/components/admin/ui/badge";
import { Card, CardContent } from "@/components/admin/ui/card";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

export default async function AdminCommentsPage() {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const comments = await prisma.blogComment.findMany({
    where: { deletedAt: null },
    include: { post: { include: { translations: true } }, moderatedBy: { select: { name: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  const formatDate = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  return <>
    <PageHeader title={locale === "fr" ? "Commentaires" : "Comments"} description={locale === "fr" ? "Modérez les commentaires publics avant leur publication." : "Moderate public comments before publication."} />
    <Card><CardContent className="p-2">
      {comments.length ? <div className="overflow-hidden rounded-md border"><Table>
        <TableHeader><TableRow><TableHead>{locale === "fr" ? "Auteur" : "Author"}</TableHead><TableHead>{locale === "fr" ? "Commentaire" : "Comment"}</TableHead><TableHead>{locale === "fr" ? "Article" : "Post"}</TableHead><TableHead>{locale === "fr" ? "Statut" : "Status"}</TableHead><TableHead>{locale === "fr" ? "Actions" : "Actions"}</TableHead></TableRow></TableHeader>
        <TableBody>{comments.map((comment) => {
          const translation = comment.post.translations.find((item) => item.locale === comment.locale) ?? comment.post.translations[0];
          return <TableRow key={comment.id}>
            <TableCell><strong>{comment.authorName}</strong><div className="text-xs text-muted-foreground">{comment.authorEmail}</div><div className="text-xs text-muted-foreground">{formatDate.format(comment.createdAt)}</div></TableCell>
            <TableCell className="max-w-sm"><div className="font-medium">{comment.subject}</div><p className="line-clamp-3 text-sm text-muted-foreground">{comment.body}</p></TableCell>
            <TableCell>{translation?.title ?? `#${comment.postId}`}</TableCell>
            <TableCell><Badge variant={comment.status === "APPROVED" ? "success" : comment.status === "SPAM" ? "destructive" : "secondary"}>{comment.status}</Badge></TableCell>
            <TableCell><CommentModerationActions id={comment.id} locale={locale} /></TableCell>
          </TableRow>;
        })}</TableBody>
      </Table></div> : <EmptyState icon={<MessageCircle className="size-full" aria-hidden="true" />} title={locale === "fr" ? "Aucun commentaire" : "No comments"} />}
    </CardContent></Card>
  </>;
}
