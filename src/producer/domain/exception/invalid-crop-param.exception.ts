import { DomainException } from '../../../shared/exception/domain.exeption';

export class InvalidCropParamException extends DomainException {
  constructor(param: string) {
    super(`Parâmetro da Cultura inválido ou não informado: ${param}`, 422, {
      param,
    });
  }
}
