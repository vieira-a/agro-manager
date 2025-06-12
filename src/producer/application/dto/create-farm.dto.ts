import { CreateHarvestDto } from './create-harvest.dto';

export class CreateFarmDto {
  readonly name: string;
  readonly city: string;
  readonly state: string;
  readonly totalArea: number;
  readonly agriculturalArea: number;
  readonly vegetationArea: number;
  readonly harvest?: CreateHarvestDto;
}
