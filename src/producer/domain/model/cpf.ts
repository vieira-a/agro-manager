import { UnprocessableEntityException } from '@nestjs/common';
import { DocumentValidator } from './document-validator.interface';

export class CPF {
  private readonly value: string;

  constructor(
    value: string,
    private readonly validator: DocumentValidator,
  ) {
    const normalized = value.replace(/\D/g, '');

    if (!validator.validate(normalized)) {
      throw new UnprocessableEntityException('CPF inválido');
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
