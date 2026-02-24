export class FollowFollowerId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("FollowFollowerId must be non-empty.");
    }
    return new FollowFollowerId(value);
  }

  toString() {
    return this.value;
  }
}
