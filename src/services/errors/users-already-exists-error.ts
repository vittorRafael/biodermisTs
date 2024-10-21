export class UserAlreadyExistsError extends Error {
  constructor() {
    super("E-mail or Cpf already exists");
  }
}
