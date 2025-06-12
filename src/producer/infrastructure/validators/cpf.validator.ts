import { cpf } from 'cpf-cnpj-validator';
import { DocumentValidator } from '../../domain/model/document-validator.interface';

export class CPFValidator implements DocumentValidator {
  validate(value: string): boolean {
    return cpf.isValid(value);
  }

  format(value: string): string {
    return cpf.format(value);
  }
}
