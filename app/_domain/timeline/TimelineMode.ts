export type TimelineModeValue = "all" | "following";

export class TimelineMode {
  private constructor(private readonly value: TimelineModeValue) {}

  static fromString(raw: string | null | undefined) {
    return raw === "following" ? new TimelineMode("following") : new TimelineMode("all");
  }

  toString(): TimelineModeValue {
    return this.value;
  }
}
