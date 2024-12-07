export class TokenError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "TokenError";
  }
}

export function handleTokenError(error: Error & { code: string }): string {
  if (error instanceof TokenError) {
    return error.message;
  }

  if (error.code === "CALL_EXCEPTION") {
    return "Invalid token contract or token does not exist";
  }

  if (error.code === "NETWORK_ERROR") {
    return "Network error. Please check your connection";
  }

  return "An unexpected error occurred";
}
