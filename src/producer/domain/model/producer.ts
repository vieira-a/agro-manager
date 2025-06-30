import { randomUUID } from 'crypto';
import { CPF } from './cpf';
import { CNPJ } from './cnpj';
import { InvalidProducerParamException } from '../exception';
import { Farm } from './farm';
import { Password } from './password';
import { ProducerRole } from '../enum/producer-role.enum';

type ProducerProps = {
  document: CPF | CNPJ;
  name: string;
  role: ProducerRole;
  password: Password;
  farms?: Farm[];
};

export class Producer {
  private readonly farms: Farm[] = [];

  private constructor(
    private readonly id: string,
    private readonly document: CPF | CNPJ,
    private name: string,
    private role: ProducerRole,
    private password: Password,
  ) {}

  static create(props: ProducerProps): Producer {
    const name = props.name.trim();

    const producer = new Producer(
      randomUUID(),
      props.document,
      name,
      props.role,
      props.password,
    );

    if (props.farms && props.farms.length > 0) {
      props.farms.forEach((farm) => producer.addFarm(farm));
    }

    producer.validate();

    return producer;
  }

  static restore(
    props: ProducerProps & { id: string; farms?: Farm[] },
  ): Producer {
    const producer = new Producer(
      props.id,
      props.document,
      props.name,
      props.role,
      props.password,
    );

    if (props.farms && props.farms.length > 0) {
      props.farms.forEach((farm) => producer.addFarm(farm));
    }

    return producer;
  }

  addFarm(farm: Farm): void {
    if (!farm) {
      throw new InvalidProducerParamException('Fazenda');
    }

    farm.validate();
    this.farms.push(farm);
  }

  getId(): string {
    return this.id;
  }

  getDocument(): string {
    return this.document.toString();
  }

  getName(): string {
    return this.name;
  }

  getPassword(): string {
    return this.password.getHashedValue();
  }

  getFarms(): ReadonlyArray<Farm> {
    return [...this.farms];
  }

  updateName(newName: string): void {
    if (typeof newName !== 'string') {
      throw new InvalidProducerParamException('Nome');
    }

    const normalized = newName.trim();

    if (!normalized) {
      throw new InvalidProducerParamException('Nome');
    }

    this.name = normalized;
  }

  validate(): void {
    if (!this.name) {
      throw new InvalidProducerParamException('Nome');
    }

    if (!this.document) {
      throw new InvalidProducerParamException('CPF ou CNPJ');
    }

    if (!this.password) {
      throw new InvalidProducerParamException('Senha');
    }
  }
}
