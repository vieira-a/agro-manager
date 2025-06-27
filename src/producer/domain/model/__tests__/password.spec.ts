import { InvalidPasswordException } from '../../exception/invalid-password.exception';
import { Password } from '../password';

describe('Password', () => {
  it('should throw if password is empty', () => {
    const emptyPassword = '';
    expect(() => Password.create(emptyPassword)).toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw if password is weak', () => {
    const weakPassword = '123456';
    expect(() => Password.create(weakPassword)).toThrow(
      InvalidPasswordException,
    );
  });

  it('should accept strong password', () => {
    const strongPassword = 'P@ssword10';
    const password = Password.create(strongPassword);
    expect(password).toBeInstanceOf(Password);
  });
});
