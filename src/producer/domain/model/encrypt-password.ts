import { Encrypter } from './encrypter.interface';
import { hash } from 'bcrypt';

export class EncryptPassword implements Encrypter {
  async encrypt(plainText: string): Promise<string> {
    const salt = 10;
    return hash(plainText, salt);
  }
}
