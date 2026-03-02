export class AuthUserId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("AuthUserId must be non-empty.");
    }
    return new AuthUserId(value);
  }

  toString() {
    return this.value;
  }
}

