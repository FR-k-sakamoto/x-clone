export class PostAuthorId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("PostAuthorId must be non-empty.");
    }
    return new PostAuthorId(value);
  }

  equals(other: PostAuthorId) {
    return this.value === other.value;
  }

  toString() {
    return this.value;
  }
}
