import { DomainException } from '../../../shared/exception/domain.exeption';

export class InvalidFarmAreaException extends DomainException {
  constructor(params: { totalArea: number; totalSubArea: number }) {
    super(
      'Área total não pode ser menor que a soma das áreas agrícola e de vegetação',
      422,
      {
        params,
      },
    );
  }
}
