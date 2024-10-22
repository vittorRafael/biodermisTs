export class TokenExpiredError extends Error {
  constructor() {
    super("Expired token, request a new token!");
  }
}
