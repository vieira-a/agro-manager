import { DomainException } from '../../../shared/exception/domain.exeption';

export class InvalidPasswordException extends DomainException {
  constructor(message: string) {
    super('Senha inválida', 422, { message });
  }
}
