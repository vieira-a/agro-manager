import { ApplicationException } from '../../../shared/exception/application.exeption';

export class PasswordNotMatchException extends ApplicationException {
  constructor() {
    super('Senha e confirmação de senha são diferentes', 422, {});
  }
}
