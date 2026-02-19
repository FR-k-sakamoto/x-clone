export class UserBio {
  private constructor(private readonly value: string | null) {}

  static fromString(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) {
      return new UserBio(null);
    }
    if (normalized.length > 160) {
      throw new Error("UserBio must be 160 chars or fewer.");
    }
    return new UserBio(normalized);
  }

  toString() {
    return this.value;
  }
}
