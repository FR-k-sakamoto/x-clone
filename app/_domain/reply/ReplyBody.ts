const MAX_LENGTH = 160;

export class ReplyBody {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) {
      throw new Error("ReplyBody must be non-empty.");
    }
    if (normalized.length > MAX_LENGTH) {
      throw new Error("ReplyBody must be 160 characters or fewer.");
    }
    return new ReplyBody(normalized);
  }

  toString() {
    return this.value;
  }

  static getMaxLength() {
    return MAX_LENGTH;
  }
}
