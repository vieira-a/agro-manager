import { CreateCropDto } from './create-crop.dto';

export class CreateHarvestDto {
  readonly description: string;
  readonly year: number;
  readonly crop: CreateCropDto;
}
