export class UserHandle {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!/^[a-z0-9_]{1,24}$/.test(normalized)) {
      throw new Error(
        "UserHandle must be 1-24 chars of lowercase letters, numbers, and underscores."
      );
    }
    return new UserHandle(normalized);
  }

  toString() {
    return this.value;
  }
}
