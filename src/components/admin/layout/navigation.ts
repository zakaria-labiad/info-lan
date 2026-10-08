import {
  BookOpen,
  Boxes,
  FileText,
  FolderTree,
  Gauge,
  Images,
  MessageSquare,
  MessagesSquare,
  Package,
  ScrollText,
  Settings,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavigationItem = {
  id: string;
  title: { fr: string; en: string };
  href?: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  children?: AdminNavigationItem[];
};

export const adminNavigation: AdminNavigationItem[] = [
  { id: "dashboard", title: { fr: "Tableau de bord", en: "Dashboard" }, href: "/admin/dashboard", icon: Gauge },
  { id: "messages", title: { fr: "Messages", en: "Messages" }, href: "/admin/messages", icon: MessagesSquare },
  {
    id: "blog",
    title: { fr: "Blog", en: "Blog" },
    icon: BookOpen,
    children: [
      { id: "posts", title: { fr: "Articles", en: "Posts" }, href: "/admin/blog", icon: FileText },
      { id: "comments", title: { fr: "Commentaires", en: "Comments" }, href: "/admin/comments", icon: MessageSquare },
      { id: "blog-categories", title: { fr: "Catégories", en: "Categories" }, href: "/admin/blog/categories", icon: FolderTree },
      { id: "blog-tags", title: { fr: "Étiquettes", en: "Tags" }, href: "/admin/blog/tags", icon: Tags },
    ],
  },
  {
    id: "catalog",
    title: { fr: "Catalogue", en: "Catalog" },
    icon: Boxes,
    children: [
      { id: "products", title: { fr: "Produits", en: "Products" }, href: "/admin/products", icon: Package },
      { id: "product-categories", title: { fr: "Catégories produits", en: "Product categories" }, href: "/admin/product-categories", icon: FolderTree },
      { id: "media", title: { fr: "Médias", en: "Media" }, href: "/admin/media", icon: Images },
    ],
  },
  { id: "users", title: { fr: "Utilisateurs", en: "Users" }, href: "/admin/users", icon: Users, adminOnly: true },
  { id: "audit", title: { fr: "Journal d’audit", en: "Audit log" }, href: "/admin/audit", icon: ScrollText, adminOnly: true },
  { id: "settings", title: { fr: "Paramètres", en: "Settings" }, href: "/admin/settings", icon: Settings, adminOnly: true },
];
