export class ProfileName {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) {
      throw new Error("ProfileName must be non-empty.");
    }
    if (normalized.length > 50) {
      throw new Error("ProfileName must be 50 chars or fewer.");
    }
    return new ProfileName(normalized);
  }

  toString() {
    return this.value;
  }
}
