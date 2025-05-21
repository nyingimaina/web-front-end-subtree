export default class Statics {
  public static get defaultv4Guid(): string {
    return "00000000-0000-0000-0000-000000000000";
  }

  public static IsminCSharpDate(date?: Date | string): boolean {
    if (!date) return true;

    const minCSharpDate = new Date("0001-01-01T00:00:00Z");

    if (typeof date === "string") {
      const parsedDate = new Date(date);
      const isValidDate = !isNaN(parsedDate.getTime());
      const result = isValidDate && parsedDate <= minCSharpDate;

      return result;
    }

    return date >= minCSharpDate;
  }

  public static get appName(): string {
    return "Lucent Ledger";
  }
}
