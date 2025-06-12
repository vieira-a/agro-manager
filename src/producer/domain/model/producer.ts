import { randomUUID } from 'crypto';
import { Farm } from './farm';
import { CPF } from './cpf';
import { CNPJ } from './cnpj';
import { InvalidProducerParamException } from '../exception/invalid-producer-param.exception';

type ProducerProps = {
  document: CPF | CNPJ;
  name: string;
  farm?: Farm;
};

export class Producer {
  private readonly farms: Farm[] = [];

  private constructor(
    private readonly id: string,
    private readonly document: CPF | CNPJ,
    private readonly name: string,
  ) {}

  static create(props: ProducerProps) {
    const name = props.name.trim();

    const producer = new Producer(randomUUID(), props.document, name);

    if (props.farm) {
      producer.addFarm(props.farm);
    }

    producer.validate();
    return producer;
  }

  addFarm(farm: Farm): void {
    farm.validate();
    this.farms.push(farm);
  }

  getFarms(): ReadonlyArray<Farm> {
    return [...this.farms];
  }

  validate(): void {
    if (!this.name) {
      throw new InvalidProducerParamException('Nome');
    }

    if (!this.document || this.document === undefined) {
      throw new InvalidProducerParamException('CPF ou CNPJ');
    }
  }
}
