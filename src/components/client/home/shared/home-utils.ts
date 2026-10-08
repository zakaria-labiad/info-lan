export function ensureRailMinimum<T>(items: readonly T[], minimum: number) {
  if (items.length === 0) {
    return [];
  }

  if (items.length >= minimum) {
    return [...items];
  }

  return Array.from(
    { length: minimum },
    (_, index) => items[index % items.length],
  );
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
