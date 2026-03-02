export class TimelineViewerUserId {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    if (value.trim().length === 0) {
      throw new Error("TimelineViewerUserId must be non-empty.");
    }
    return new TimelineViewerUserId(value);
  }

  toString() {
    return this.value;
  }
}
