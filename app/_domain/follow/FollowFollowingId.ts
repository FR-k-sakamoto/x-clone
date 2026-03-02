export class FollowFollowingId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("FollowFollowingId must be non-empty.");
    }
    return new FollowFollowingId(value);
  }

  toString() {
    return this.value;
  }
}
