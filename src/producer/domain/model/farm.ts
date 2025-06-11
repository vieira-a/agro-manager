import { randomUUID } from 'crypto';
import { Harvest } from './harvest';
import { UnprocessableEntityException } from '@nestjs/common';

type FarmProps = {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  agriculturalArea: number;
  vegetationArea: number;
  harvest: Harvest[];
};

export class Farm {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly city: string,
    private readonly state: string,
    private readonly totalArea: number,
    private readonly agriculturalArea: number,
    private readonly vegetationArea: number,
    private readonly harvest: Harvest[],
  ) {}

  static create(props: FarmProps): Farm {
    const name = props.name.trim();
    const city = props.city.trim();
    const state = props.state.trim();

    const farm = new Farm(
      randomUUID(),
      name,
      city,
      state,
      props.totalArea,
      props.agriculturalArea,
      props.vegetationArea,
      props.harvest,
    );

    farm.validate();
    return farm;
  }

  validate() {
    if (!this.name) {
      throw new UnprocessableEntityException('Nome da fazenda é obrigatória');
    }

    if (!this.city) {
      throw new UnprocessableEntityException('Nome da cidade é obrigatória');
    }

    if (!this.state) {
      throw new UnprocessableEntityException('Nome do estado é obrigatório');
    }

    const totalSubAreas = this.agriculturalArea + this.vegetationArea;
    if (this.totalArea < totalSubAreas) {
      throw new UnprocessableEntityException(
        'Área total não pode ser menor que a soma das áreas agrícola e de vegetação',
      );
    }
  }
}
