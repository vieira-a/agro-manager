import { InvalidPasswordException } from '../../exception/invalid-password.exception';
import { Encrypter } from '../encrypter.interface';
import { Password } from '../password';
import { PasswordFactory } from '../password.factory';

describe('Password', () => {
  let encrypterMock: Encrypter;
  let factoryMock: PasswordFactory;

  beforeEach(() => {
    encrypterMock = {
      encrypt: jest.fn().mockReturnValue('hashed-password'),
      matches: jest.fn().mockReturnValue(true),
    };
    factoryMock = new PasswordFactory(encrypterMock);
  });

  it('should throw if password is empty', async () => {
    const emptyPassword = '';
    await expect(factoryMock.create(emptyPassword)).rejects.toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw if password is weak', async () => {
    const weakPassword = '123456';
    await expect(factoryMock.create(weakPassword)).rejects.toThrow(
      InvalidPasswordException,
    );
  });

  it('should accept strong password', async () => {
    const strongPassword = 'P@ssword10';
    const password = await factoryMock.create(strongPassword);
    expect(password.getHashedValue()).toBe('hashed-password');
    expect(encrypterMock.encrypt).toHaveBeenLastCalledWith(strongPassword);
  });

  it('should throw if password is null or undefined', async () => {
    await expect(factoryMock.create(null as any)).rejects.toThrow(
      InvalidPasswordException,
    );
    await expect(factoryMock.create(undefined as any)).rejects.toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw for password without uppercase letters', async () => {
    const pwd = 'p@ssword10';
    await expect(factoryMock.create(pwd)).rejects.toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw for password without lowercase letters', async () => {
    const pwd = 'P@SSWORD10';
    await expect(factoryMock.create(pwd)).rejects.toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw for password without numbers', async () => {
    const pwd = 'Password@!';
    await expect(factoryMock.create(pwd)).rejects.toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw for password without special characters', async () => {
    const pwd = 'Password10';
    await expect(factoryMock.create(pwd)).rejects.toThrow(
      InvalidPasswordException,
    );
  });

  describe('Password VO', () => {
    it('should throw if created with empty or null hash', () => {
      expect(() => new Password('')).toThrow(InvalidPasswordException);
      expect(() => new Password('   ')).toThrow(InvalidPasswordException);
      expect(() => new Password(null as any)).toThrow(InvalidPasswordException);
      expect(() => new Password(undefined as any)).toThrow(
        InvalidPasswordException,
      );
    });

    it('should return the hashed value correctly', () => {
      const hash = 'some-hash-value';
      const password = new Password(hash);
      expect(password.getHashedValue()).toBe(hash);
    });
  });
});
