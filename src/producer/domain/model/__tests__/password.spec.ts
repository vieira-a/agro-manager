import { InvalidPasswordException } from '../../exception/invalid-password.exception';
import { Encrypter } from '../encrypter.interface';
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
});
