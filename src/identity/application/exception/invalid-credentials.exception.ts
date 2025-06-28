import { ApplicationException } from '../../../shared/exception/application.exeption';

export class InvalidCredentialsException extends ApplicationException {
  constructor(message: string) {
    super(message, 401, {});
  }
}
