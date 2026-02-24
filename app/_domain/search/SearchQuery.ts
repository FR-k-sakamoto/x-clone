const MAX_LENGTH = 100;

export class SearchQuery {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) {
      throw new Error("SearchQuery must be non-empty.");
    }
    if (normalized.length > MAX_LENGTH) {
      throw new Error("SearchQuery is too long.");
    }
    return new SearchQuery(normalized);
  }

  toString() {
    return this.value;
  }

  static getMaxLength() {
    return MAX_LENGTH;
  }
}
