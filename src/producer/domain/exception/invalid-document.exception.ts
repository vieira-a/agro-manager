import { DomainException } from '../../../shared/exception/domain.exeption';

export class InvalidDocumentException extends DomainException {
  constructor(document: string) {
    super(`Documento inválido: ${document}`, 422, { document });
  }
}
