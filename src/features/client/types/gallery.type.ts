export type GalleryCategory = "all" | "boilermaking" | "piping" | "handling";

export type GalleryItem = {
  id: string;
  src: string;
  altKey: Exclude<GalleryCategory, "all">;
  category: Exclude<GalleryCategory, "all">;
};
