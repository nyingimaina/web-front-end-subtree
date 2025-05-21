const industriesList = [
  "Property Management Company",
  "Other",
  // Future industries can be added here
] as const; // Ensures autocomplete

export type Industries = (typeof industriesList)[number]; // Creates a union type

export function getIndustries(): Industries[] {
  return [...industriesList]; // Preserves type safety and prevents mutation
}
