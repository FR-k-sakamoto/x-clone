export class ReplyId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) {
      throw new Error("ReplyId must be non-empty.");
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalized)) {
      throw new Error("ReplyId must be a valid UUID.");
    }
    return new ReplyId(normalized);
  }

  toString() {
    return this.value;
  }
}
