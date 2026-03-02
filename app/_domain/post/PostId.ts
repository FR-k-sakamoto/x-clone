export class PostId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("PostId must be non-empty.");
    }
    return new PostId(value);
  }

  toString() {
    return this.value;
  }
}
