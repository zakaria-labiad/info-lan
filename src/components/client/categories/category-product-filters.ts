const SEARCH_DEBOUNCE_MS = 700;

type ProductAvailability = "active" | "unavailable";
type ProductAvailabilityFilter = "all" | ProductAvailability;

type FilterableCategoryProduct = {
  title: string;
  description: string;
  availability: ProductAvailability;
  isBestSeller: boolean;
};

type CategoryProductFilters = {
  query: string;
  availability: ProductAvailabilityFilter;
  bestSellerOnly: boolean;
};

function filterCategoryProducts<TProduct extends FilterableCategoryProduct>(
  products: TProduct[],
  filters: CategoryProductFilters,
) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesAvailability =
      filters.availability === "all" ||
      filters.availability === product.availability;
    const matchesBestSeller =
      !filters.bestSellerOnly || product.isBestSeller;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      product.title.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery);

    return matchesAvailability && matchesBestSeller && matchesQuery;
  });
}

export {
  SEARCH_DEBOUNCE_MS,
  filterCategoryProducts,
  type CategoryProductFilters,
  type FilterableCategoryProduct,
  type ProductAvailability,
  type ProductAvailabilityFilter,
};
