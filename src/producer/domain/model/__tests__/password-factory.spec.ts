import { PasswordFactory } from '../password.factory';
import { InvalidPasswordException } from '../../exception/invalid-password.exception';
import { Password } from '../password';

describe('PasswordFactory', () => {
  let passwordFactory: PasswordFactory;
  let mockEncrypter: any;

  beforeEach(() => {
    mockEncrypter = {
      encrypt: jest.fn(async (plain) => `hashed-${plain}`),
      matches: jest.fn(
        async (plain, hash) => plain === hash.replace('hashed-', ''),
      ),
    };
    passwordFactory = new PasswordFactory(mockEncrypter);
  });

  describe('create', () => {
    it('should create Password with hashed value for valid password', async () => {
      const password = await passwordFactory.create('Valid@123');

      expect(mockEncrypter.encrypt).toHaveBeenCalledWith('Valid@123');
      expect(password).toBeInstanceOf(Password);
      expect(password.getHashedValue()).toBe('hashed-Valid@123');
    });

    it('should throw InvalidPasswordException for null or empty password', async () => {
      const invalids = [null, undefined, '', '   '];

      for (const val of invalids) {
        await expect(passwordFactory.create(val as any)).rejects.toThrow(
          InvalidPasswordException,
        );
      }
    });

    it('should throw InvalidPasswordException for weak passwords', async () => {
      const weakPasswords = [
        'short1!',
        'NoNumber!',
        'nonumberorspecial',
        'NOLOWERCASE1!',
        'nouppercase1!',
        'NoSpecial123',
      ];

      for (const val of weakPasswords) {
        await expect(passwordFactory.create(val)).rejects.toThrow(
          InvalidPasswordException,
        );
      }
    });
  });

  describe('matches', () => {
    it('should return true for matching password and hash', async () => {
      const result = await passwordFactory.matches(
        'Valid@123',
        'hashed-Valid@123',
      );
      expect(mockEncrypter.matches).toHaveBeenCalledWith(
        'Valid@123',
        'hashed-Valid@123',
      );
      expect(result).toBe(true);
    });
  });
});
