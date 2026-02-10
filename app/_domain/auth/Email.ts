export class Email {
  private constructor(private readonly value: string) {}

  static fromString(value: string) {
    const v = value.trim();
    // Intentionally simple. Tighten later if needed.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      throw new Error("Invalid email format.");
    }
    return new Email(v);
  }

  toString() {
    return this.value;
  }
}

