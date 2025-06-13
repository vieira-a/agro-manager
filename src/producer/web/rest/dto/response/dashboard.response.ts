import { ApiProperty } from '@nestjs/swagger';

class LandUsage {
  @ApiProperty()
  agricultural: number;

  @ApiProperty()
  vegetation: number;
}

export class DashBoardResponse {
  @ApiProperty()
  totalFarms: number;

  @ApiProperty()
  totalHectares: number;

  @ApiProperty()
  totalState: Record<string, number>;

  @ApiProperty()
  totalCrop: Record<string, number>;

  @ApiProperty({ type: LandUsage })
  landUsage: LandUsage;
}
