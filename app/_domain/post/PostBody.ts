export class PostBody {
  static readonly MAX_LENGTH = 160;

  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) {
      throw new Error("PostBody must be non-empty.");
    }

    const length = [...normalized].length;
    if (length > PostBody.MAX_LENGTH) {
      throw new Error(`PostBody must be <= ${PostBody.MAX_LENGTH} chars.`);
    }

    return new PostBody(normalized);
  }

  length() {
    return [...this.value].length;
  }

  toString() {
    return this.value;
  }
}
