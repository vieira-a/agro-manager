import { InvalidPasswordException } from '../../exception/invalid-password.exception';
import { Password } from '../password';

describe('Password', () => {
  it('should throw if password is empty', () => {
    const emptyPassword = '';
    expect(() => Password.create(emptyPassword)).toThrow(
      InvalidPasswordException,
    );
  });
});
