import { randomUUID } from 'crypto';
import { InvalidCropParamException } from '../exception';

type CropProps = {
  name: string;
};

export class Crop {
  private constructor(
    private readonly id: string,
    private readonly name: string,
  ) {}

  static create(props: CropProps): Crop {
    const name = props.name.trim();
    const crop = new Crop(randomUUID(), name);

    crop.validate();
    return crop;
  }

  validate() {
    if (!this.name) {
      throw new InvalidCropParamException('Nome');
    }
  }
}
