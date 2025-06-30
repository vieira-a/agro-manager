import { Encrypter } from './encrypter.interface';
import { hash, compare } from 'bcrypt';

export class EncryptPassword implements Encrypter {
  async encrypt(plainText: string): Promise<string> {
    const salt = 10;
    return hash(plainText, salt);
  }

  async matches(plainText: string, hashed: string): Promise<boolean> {
    return compare(plainText, hashed);
  }
}
