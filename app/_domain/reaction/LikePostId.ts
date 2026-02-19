export class LikePostId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("LikePostId must be non-empty.");
    }
    return new LikePostId(value);
  }

  toString() {
    return this.value;
  }
}
