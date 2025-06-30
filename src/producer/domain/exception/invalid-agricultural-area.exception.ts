import { DomainException } from '../../../shared/exception/domain.exeption';

export class InvalidAgriculturalAreaException extends DomainException {
  constructor(params: number) {
    super('Área de agricultura inválida.', 422, {
      params,
    });
  }
}
