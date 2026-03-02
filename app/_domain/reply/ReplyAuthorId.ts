export class ReplyAuthorId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("ReplyAuthorId must be non-empty.");
    }
    return new ReplyAuthorId(value);
  }

  equals(other: ReplyAuthorId) {
    return this.value === other.value;
  }

  toString() {
    return this.value;
  }
}
