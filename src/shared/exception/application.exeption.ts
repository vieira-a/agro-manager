export abstract class ApplicationException extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly params?: Record<string, unknown>,
  ) {
    super(`Erro de aplicação: ${message}`);
    this.name = new.target.name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
