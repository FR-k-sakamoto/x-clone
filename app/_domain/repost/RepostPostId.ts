export class RepostPostId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("RepostPostId must be non-empty.");
    }
    return new RepostPostId(value);
  }

  toString() {
    return this.value;
  }
}
