const DISALLOWED_CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function normalizeUserInput(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(DISALLOWED_CONTROL_CHARS, "")
    .trim();
}
