import { randomUUID } from 'crypto';
import { Harvest } from './harvest';
import {
  InvalidFarmParamException,
  InvalidFarmAreaException,
  InvalidAgriculturalAreaException,
} from '../exception/';

type FarmProps = {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  agriculturalArea: number;
  vegetationArea: number;
  harvests?: Harvest[];
};

export class Farm {
  private harvests?: Harvest[] = [];

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

    if (props.harvests && props.harvests.length) {
      props.harvests.forEach((harvest) => farm.addHarvest(harvest));
    }

    farm.validate();
    return farm;
  }

  static restore(
    props: FarmProps & { id: string; harvests?: Harvest[] },
  ): Farm {
    const farm = new Farm(
      props.id,
      props.name,
      props.city,
      props.state,
      props.totalArea,
      props.agriculturalArea,
      props.vegetationArea,
    );

    if (props.harvests && props.harvests.length > 0) {
      props.harvests.forEach((harvest) => farm.addHarvest(harvest));
    }

    return farm;
  }

  addHarvest(harvest: Harvest) {
    if (!harvest) {
      throw new InvalidFarmParamException('Safra');
    }

    const harvestExists = this.harvests?.some(
      (existantHarvest) =>
        existantHarvest.getDescription() === harvest.getDescription() &&
        existantHarvest.getYear() === harvest.getYear(),
    );

    if (harvestExists) return;

    harvest.validate();
    this.harvests?.push(harvest);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getCity(): string {
    return this.city;
  }

  getState(): string {
    return this.state;
  }

  getTotalArea(): number {
    return this.totalArea;
  }

  getAgriculturalArea(): number {
    return this.agriculturalArea;
  }

  getVegetationArea(): number {
    return this.vegetationArea;
  }

  getHarvests(): Harvest[] {
    return this.harvests ?? [];
  }

  validate() {
    if (!this.name) throw new InvalidFarmParamException('Nome');
    if (!this.city) throw new InvalidFarmParamException('Cidade');
    if (!this.state) throw new InvalidFarmParamException('Estado');

    if (this.agriculturalArea < 1)
      throw new InvalidAgriculturalAreaException(this.vegetationArea);

    const totalSubAreas = this.agriculturalArea + this.vegetationArea;

    if (this.totalArea < totalSubAreas) {
      throw new InvalidFarmAreaException({
        totalArea: this.totalArea,
        totalSubArea: totalSubAreas,
      });
    }
  }
}
