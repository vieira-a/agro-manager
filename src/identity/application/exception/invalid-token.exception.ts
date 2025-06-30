import { ApplicationException } from '../../../shared/exception/application.exeption';

export class InvalidTokenException extends ApplicationException {
  constructor(message: string) {
    super(message, 403, {});
  }
}
