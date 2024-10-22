export class MissingInformationError extends Error {
  constructor(missingField: string) {
    super(`Missing information: ${missingField}`);
  }
}
