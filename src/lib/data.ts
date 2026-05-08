export const propertyTypes = ["All", "Residential", "Commercial", "Land"] as const;
export const propertyTags = ["Featured", "New", "Hot", "Premium", "Luxury", "Investment"] as const;
export const propertyStatuses = ["available", "pending", "sold"] as const;
export const cities = ["All", "Enugu", "Nsukka"] as const;

export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
