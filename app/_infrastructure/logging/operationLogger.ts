type OperationMeta = Record<string, unknown>;

function withTimestamp(meta: OperationMeta) {
  return {
    ...meta,
    at: new Date().toISOString(),
  };
}

export function logOperationInfo(event: string, meta: OperationMeta = {}) {
  console.info(`[operation][${event}]`, withTimestamp(meta));
}

export function logOperationWarn(event: string, meta: OperationMeta = {}) {
  console.warn(`[operation][${event}]`, withTimestamp(meta));
}

export function logOperationError(event: string, error: unknown, meta: OperationMeta = {}) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[operation][${event}]`, withTimestamp({ ...meta, error: message }));
}
