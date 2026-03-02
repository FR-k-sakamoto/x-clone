export class ReplyParentPostId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("ReplyParentPostId must be non-empty.");
    }
    return new ReplyParentPostId(value);
  }

  toString() {
    return this.value;
  }
}
