import { randomUUID } from 'crypto';
import { Farm } from './farm';
import { CPF } from './cpf';
import { CNPJ } from './cnpj';
import { UnprocessableEntityException } from '@nestjs/common';
import { InvalidProducerParamException } from '../exception/invalid-producer-param.exception';

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
    const name = props.name.trim();

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
      throw new InvalidProducerParamException('Nome');
    }

    if (!this.document || this.document === undefined) {
      throw new InvalidProducerParamException('CPF ou CNPJ');
    }

    if (!this.farm) {
      throw new InvalidProducerParamException('Fazenda');
    }
  }
}
