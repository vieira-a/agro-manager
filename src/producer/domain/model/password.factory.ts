import { Inject, Injectable } from '@nestjs/common';
import { InvalidPasswordException } from '../exception/invalid-password.exception';
import { Encrypter } from './encrypter.interface';
import { Password } from './password';

@Injectable()
export class PasswordFactory {
  constructor(
    @Inject('Encrypter')
    private readonly ecrypter: Encrypter,
  ) {}

  async create(plainText: string): Promise<Password> {
    this.validate(plainText);
    const hashedPassword = await this.ecrypter.encrypt(plainText);
    return new Password(hashedPassword);
  }

  private validate(value: string): void {
    if (!value || value.trim() === '') {
      throw new InvalidPasswordException('Senha não informada');
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;

    if (!strongPasswordRegex.test(value)) {
      throw new InvalidPasswordException(
        'A senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas e caracteres especiais',
      );
    }
  }

  async matches(plainText: string, hashed: string): Promise<boolean> {
    return this.ecrypter.matches(plainText, hashed);
  }
}
