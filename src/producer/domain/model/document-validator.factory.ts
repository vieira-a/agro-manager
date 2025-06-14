import { UnprocessableEntityException } from '@nestjs/common';
import { CNPJ } from './cnpj';
import { CNPJValidator } from '../../infrastructure/validators/cnpj.validator';
import { CPF } from './cpf';
import { CPFValidator } from '../../infrastructure/validators/cpf.validator';
import { InvalidDocumentException } from '../exception';

export class DocumentValidatorFactory {
  private static cpfValidator = new CPFValidator();
  private static cnpjValidator = new CNPJValidator();

  static create(document: string): CPF | CNPJ {
    const normalized = document.replace(/\D/g, '');

    if (normalized.length === 11) {
      return new CPF(normalized, this.cpfValidator);
    }

    if (normalized.length === 14) {
      return new CNPJ(normalized, this.cnpjValidator);
    }

    throw new InvalidDocumentException(document);
  }
}
