import { randomUUID } from 'crypto';
import { Harvest } from './harvest';
import { UnprocessableEntityException } from '@nestjs/common';
import { InvalidFarmParamException } from '../exception/invalid-farm-param.exception';
import { InvalidFarmAreaException } from '../exception/invalid-farm-area.exception';

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
      throw new InvalidFarmParamException('Nome');
    }

    if (!this.city) {
      throw new InvalidFarmParamException('Cidade');
    }

    if (!this.state) {
      throw new InvalidFarmParamException('Estado');
    }

    const totalSubAreas = this.agriculturalArea + this.vegetationArea;

    if (this.totalArea < totalSubAreas) {
      throw new InvalidFarmAreaException({
        totalArea: this.totalArea,
        totalSubArea: totalSubAreas,
      });
    }
  }
}
