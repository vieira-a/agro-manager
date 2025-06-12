import { UnprocessableEntityException } from '@nestjs/common';

type CropProps = {
  name: string;
};

export class Crop {
  private constructor(private readonly name: string) {}

  static create(props: CropProps): Crop {
    const name = props.name.trim();
    const crop = new Crop(name);

    crop.validate();
    return crop;
  }

  validate() {
    if (!this.name) {
      throw new UnprocessableEntityException('Nome da cultura é obrigatório');
    }
  }
}
