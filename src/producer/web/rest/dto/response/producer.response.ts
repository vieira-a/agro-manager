import { ApiProperty } from '@nestjs/swagger';

export class CropResponse {
  @ApiProperty({ example: 'Milho' })
  name: string;
}

export class HarvestResponse {
  @ApiProperty({ example: 'Safra Verão' })
  description: string;

  @ApiProperty({ example: 2023 })
  year: number;

  @ApiProperty({ type: CropResponse })
  crop: CropResponse;
}

export class FarmResponse {
  @ApiProperty({ example: 'Fazenda São João' })
  name: string;

  @ApiProperty({ example: 'Bahia' })
  city: string;

  @ApiProperty({ example: 'BA' })
  state: string;

  @ApiProperty({ example: 100.5 })
  totalArea: number;

  @ApiProperty({ example: 60 })
  agriculturalArea: number;

  @ApiProperty({ example: 40.5 })
  vegetationArea: number;

  @ApiProperty({ type: HarvestResponse, required: false })
  harvests?: HarvestResponse[];
}

export class ProducerResponse {
  @ApiProperty({ example: '4a50d41f-d02e-4de6-976c-d15f944f8a26' })
  id: string;

  @ApiProperty({ example: '57609253006' })
  document: string;

  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: 'producer_admin | producer_role' })
  role: string;

  @ApiProperty({ type: [FarmResponse] })
  farms: FarmResponse[];
}
