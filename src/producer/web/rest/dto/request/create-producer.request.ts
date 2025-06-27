import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsInt,
  Min,
  IsStrongPassword,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCropRequest {
  @ApiProperty({ example: 'Milho' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateHarvestRequest {
  @ApiProperty({ example: 'Safra Verão' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 2023 })
  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  year: number;

  @ApiProperty({ type: CreateCropRequest })
  @ValidateNested()
  @Type(() => CreateCropRequest)
  crop: CreateCropRequest;
}

export class CreateFarmRequest {
  @ApiProperty({ example: 'Fazenda São João' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Bahia' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'BA' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: 100.5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalArea: number;

  @ApiProperty({ example: 60 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  agriculturalArea: number;

  @ApiProperty({ example: 40.5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @ApiProperty({ type: CreateHarvestRequest })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateHarvestRequest)
  harvest?: CreateHarvestRequest;
}

export class CreateProducerRequest {
  @ApiProperty({ example: '57609253006' })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({ example: 'P@ssword10' })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'João Silva' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: CreateFarmRequest })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFarmRequest)
  farm?: CreateFarmRequest;
}
