import { InvalidPasswordException } from '../../exception/invalid-password.exception';
import { Encrypter } from '../encrypter.interface';
import { Password } from '../password';
import { PasswordFactory } from '../password.factory';

describe('PasswordFactory', () => {
  let encrypterMock: Encrypter;
  let factory: PasswordFactory;

  beforeEach(() => {
    encrypterMock = {
      encrypt: jest.fn().mockResolvedValue('hashed-password'),
      matches: jest.fn().mockResolvedValue(true),
    };
    factory = new PasswordFactory(encrypterMock);
  });

  describe('create', () => {
    it('should throw if password is null, undefined or empty', async () => {
      const invalidPasswords = [null, undefined, '', '   '];

      for (const pwd of invalidPasswords) {
        await expect(factory.create(pwd as any)).rejects.toThrow(
          InvalidPasswordException,
        );
      }
    });

    it('should throw if password is weak', async () => {
      const weakPasswords = [
        '123456',
        'password',
        'PASSWORD1',
        'Password!',
        'Password1',
        'p@ssword10',
        'P@SSWORD10',
      ];

      for (const pwd of weakPasswords) {
        await expect(factory.create(pwd)).rejects.toThrow(
          InvalidPasswordException,
        );
      }
    });

    it('should accept strong password', async () => {
      const strongPassword = 'P@ssword10';
      const password = await factory.create(strongPassword);
      expect(password.getHashedValue()).toBe('hashed-password');
      expect(encrypterMock.encrypt).toHaveBeenCalledWith(strongPassword);
    });
  });

  describe('Password VO', () => {
    it('should throw if created with empty or invalid hash', () => {
      const invalidHashes = ['', '   ', null, undefined];

      for (const hash of invalidHashes) {
        expect(() => new Password(hash as any)).toThrow(
          InvalidPasswordException,
        );
      }
    });

    it('should return the hashed value correctly', () => {
      const hash = 'some-hash-value';
      const password = new Password(hash);
      expect(password.getHashedValue()).toBe(hash);
    });
  });
});
