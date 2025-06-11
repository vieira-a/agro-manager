import { randomUUID } from 'crypto';
import { Farm } from './farm';
import { CPF } from './cpf';
import { CNPJ } from './cnpj';
import { UnprocessableEntityException } from '@nestjs/common';

type ProducerProps = {
  document: CPF | CNPJ;
  name: string;
  farm: Farm;
};

export class Producer {
  private constructor(
    private readonly id: string,
    private readonly document: CPF | CNPJ,
    private readonly name: string,
    private readonly farm: Farm,
  ) {}

  static create(props: ProducerProps) {
    const name = this.name.trim();

    const producer = new Producer(
      randomUUID(),
      props.document,
      name,
      props.farm,
    );

    producer.validate();
    return producer;
  }

  validate() {
    if (!this.name) {
      throw new UnprocessableEntityException('Nome do Produtor é obrigatório');
    }

    if (!this.farm) {
      throw new UnprocessableEntityException(
        'Produtor deve possuir ao menos uma propriedade',
      );
    }
  }
}
