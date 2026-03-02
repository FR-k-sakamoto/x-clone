export class UserId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("UserId must be non-empty.");
    }
    return new UserId(value);
  }

  toString() {
    return this.value;
  }
}
