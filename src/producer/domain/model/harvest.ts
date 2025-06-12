import { Crop } from './crop';
import { randomUUID } from 'crypto';
import { InvalidHarvestParamException } from '../exception';

type HarvestProps = {
  description: string;
  year: number;
  crop: Crop;
};

export class Harvest {
  private constructor(
    private readonly id: string,
    private readonly description: string,
    private readonly year: number,
    private readonly crop: Crop,
  ) {}

  static create(props: HarvestProps): Harvest {
    const description = props.description.trim();

    const harvest = new Harvest(
      randomUUID(),
      description,
      props.year,
      props.crop,
    );

    harvest.validate();
    return harvest;
  }

  validate() {
    if (!this.description) {
      throw new InvalidHarvestParamException('Descrição');
    }

    if (!this.year) {
      throw new InvalidHarvestParamException('Ano');
    }

    if (!this.crop) {
      throw new InvalidHarvestParamException('Cultura');
    }
  }
}
