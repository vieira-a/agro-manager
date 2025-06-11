import { UnprocessableEntityException } from '@nestjs/common';
import { Crop } from './crop';
import { randomUUID } from 'crypto';

type HarvestProps = {
  id: string;
  description: string;
  year: number;
  crops: Crop[];
};

export class Harvest {
  private constructor(
    private readonly id: string,
    private readonly description: string,
    private readonly year: number,
    private readonly crops: Crop[],
  ) {}

  static create(props: HarvestProps): Harvest {
    const description = props.description.trim();

    const harvest = new Harvest(
      randomUUID(),
      description,
      props.year,
      props.crops,
    );

    harvest.validate();
    return harvest;
  }

  validate() {
    if (!this.description) {
      throw new UnprocessableEntityException(
        'A descrição da Safra é obrigatória',
      );
    }

    if (!this.year) {
      throw new UnprocessableEntityException('O ano da Safra é obrigatório');
    }

    if (!this.crops || this.crops.length === 0) {
      throw new UnprocessableEntityException(
        'É necessário informar ao menos uma cultura para a safra',
      );
    }
  }
}
