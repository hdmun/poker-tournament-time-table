export class InvalidInputError extends Error {
  code: string;

  constructor(...args: any[]) {
    super(...args);

    this.code = 'ERR_INVALID_INPUT';
    this.name = 'InvalidInputError';
    this.stack = `${this.message}\n${new Error().stack}`;
  }
}

export class DuplicateKeyError extends Error {
  code: string;

  constructor(...args: any[]) {
    super(...args);

    this.code = 'ERR_DUPLICATE_KEY';
    this.name = 'DuplicateKeyError';
    this.stack = `${this.message}\n${new Error().stack}`;
  }
}
