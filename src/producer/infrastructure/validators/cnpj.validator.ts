import { cnpj } from 'cpf-cnpj-validator';
import { DocumentValidator } from '../../domain/model/document-validator.interface';

export class CNPJValidator implements DocumentValidator {
  validate(value: string): boolean {
    return cnpj.isValid(value);
  }

  format(value: string): string {
    return cnpj.format(value);
  }
}
