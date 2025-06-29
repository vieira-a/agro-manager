import { DomainException } from '../../../shared/exception/domain.exeption';

export class InvalidVegetationAreaException extends DomainException {
  constructor(params: number) {
    super('Área de vegetação inválida.', 422, {
      params,
    });
  }
}
