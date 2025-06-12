import { randomUUID } from 'crypto';
import { Harvest } from './harvest';
import {
  InvalidFarmParamException,
  InvalidFarmAreaException,
} from '../exception/';

type FarmProps = {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  agriculturalArea: number;
  vegetationArea: number;
  harvest?: Harvest;
};

export class Farm {
  private harvest?: Harvest;

  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly city: string,
    private readonly state: string,
    private readonly totalArea: number,
    private readonly agriculturalArea: number,
    private readonly vegetationArea: number,
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
    );

    if (props.harvest) {
      farm.addHarvest(props.harvest);
    }

    farm.validate();
    return farm;
  }

  addHarvest(harvest: Harvest) {
    harvest.validate();
    this.harvest = harvest;
  }

  getHarvest(): Harvest | undefined {
    return this.harvest;
  }

  validate() {
    if (!this.name) throw new InvalidFarmParamException('Nome');
    if (!this.city) throw new InvalidFarmParamException('Cidade');
    if (!this.state) throw new InvalidFarmParamException('Estado');

    const totalSubAreas = this.agriculturalArea + this.vegetationArea;

    if (this.totalArea < totalSubAreas) {
      throw new InvalidFarmAreaException({
        totalArea: this.totalArea,
        totalSubArea: totalSubAreas,
      });
    }
  }
}
