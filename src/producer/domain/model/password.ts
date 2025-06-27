import { InvalidPasswordException } from '../exception/invalid-password.exception';
export class Password {
  constructor(private readonly hashedPassword: string) {
    if (!hashedPassword || hashedPassword.trim() === '') {
      throw new InvalidPasswordException('Senha inválida');
    }
  }

  getHashedValue(): string {
    return this.hashedPassword;
  }
}
