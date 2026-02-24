export class ReplyId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("ReplyId must be non-empty.");
    }
    return new ReplyId(value);
  }

  toString() {
    return this.value;
  }
}
