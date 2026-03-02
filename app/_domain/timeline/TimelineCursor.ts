type TimelineCursorPayload = {
  createdAtIso: string;
  sortKey: string;
};

export class TimelineCursor {
  private constructor(
    private readonly createdAt: Date,
    private readonly sortKey: string,
    private readonly rawValue: string
  ) {}

  static fromString(value: string) {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const payload = JSON.parse(decoded) as Partial<TimelineCursorPayload>;

    if (
      typeof payload.createdAtIso !== "string" ||
      typeof payload.sortKey !== "string" ||
      payload.sortKey.length === 0
    ) {
      throw new Error("Invalid timeline cursor.");
    }

    const createdAt = new Date(payload.createdAtIso);
    if (Number.isNaN(createdAt.getTime())) {
      throw new Error("Invalid timeline cursor date.");
    }

    return new TimelineCursor(createdAt, payload.sortKey, value);
  }

  static fromParts(parts: { createdAt: Date; sortKey: string }) {
    if (parts.sortKey.length === 0) {
      throw new Error("Timeline cursor sortKey must be non-empty.");
    }

    const raw = Buffer.from(
      JSON.stringify({
        createdAtIso: parts.createdAt.toISOString(),
        sortKey: parts.sortKey,
      } satisfies TimelineCursorPayload)
    ).toString("base64url");

    return new TimelineCursor(parts.createdAt, parts.sortKey, raw);
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getSortKey() {
    return this.sortKey;
  }

  toString() {
    return this.rawValue;
  }
}
