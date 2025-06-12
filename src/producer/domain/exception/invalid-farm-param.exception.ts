import { DomainException } from '../../../shared/exception/domain.exeption';

export class InvalidFarmParamException extends DomainException {
  constructor(param: string) {
    super(`Parâmetro da Fazenda inválido ou não informado: ${param}`, 422, {
      param,
    });
  }
}
