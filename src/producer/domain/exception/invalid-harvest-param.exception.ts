import { DomainException } from '../../../shared/exception/domain.exeption';

export class InvalidHarvestParamException extends DomainException {
  constructor(param: string) {
    super(`Parâmetro da Safra inválido ou não informado: ${param}`, 422, {
      param,
    });
  }
}
