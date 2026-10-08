export type ReviewCardProps = {
  name: string;
  company: string;
  comment: string;
  rating: number;
  ratingLabel: string;
  imageAlt: string;
};

export type ReviewTranslation = Omit<ReviewCardProps, "ratingLabel">;
