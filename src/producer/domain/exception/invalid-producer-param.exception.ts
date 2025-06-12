import { DomainException } from '../../../shared/exception/domain.exeption';

export class InvalidProducerParamException extends DomainException {
  constructor(param: string) {
    super(`Parâmetro do Produtor inválido ou não informado: ${param}`, 422, {
      param,
    });
  }
}
