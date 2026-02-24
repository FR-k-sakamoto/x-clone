export class RepostUserId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("RepostUserId must be non-empty.");
    }
    return new RepostUserId(value);
  }

  toString() {
    return this.value;
  }
}
