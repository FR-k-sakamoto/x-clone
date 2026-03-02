export class LikeUserId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("LikeUserId must be non-empty.");
    }
    return new LikeUserId(value);
  }

  toString() {
    return this.value;
  }
}
