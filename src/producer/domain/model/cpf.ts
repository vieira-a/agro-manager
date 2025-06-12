import { DocumentValidator } from './document-validator.interface';
import { InvalidDocumentException } from '../exception';

export class CPF {
  private readonly value: string;

  constructor(
    value: string,
    private readonly validator: DocumentValidator,
  ) {
    const normalized = value.replace(/\D/g, '');

    if (!validator.validate(normalized)) {
      throw new InvalidDocumentException(`CPF: ${value}`);
    }

    this.value = normalized;
  }

  format(): string {
    if (this.validator.format) {
      return this.validator.format(this.value);
    }

    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
