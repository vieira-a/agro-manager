import { InvalidPasswordException } from '../exception/invalid-password.exception';

export class Password {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    const password = new Password(value);
    password.validate();
    return password;
  }

  validate(): void {
    if (!this.value || this.value === '') {
      throw new InvalidPasswordException('Senha não informada');
    }
  }

  getValue(): string {
    return this.value;
  }
}
