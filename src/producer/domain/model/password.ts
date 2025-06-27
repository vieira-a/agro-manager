import { InvalidPasswordException } from '../exception/invalid-password.exception';

export class Password {
  private readonly value: string;

  private constructor(value: string) {
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

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;

    if (!strongPasswordRegex.test(this.value)) {
      throw new InvalidPasswordException(
        'A senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas e caracteres especiais',
      );
    }
  }

  getValue(): string {
    return this.value;
  }
}
