import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCropRequest {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateHarvestRequest {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  year: number;

  @ValidateNested()
  @Type(() => CreateCropRequest)
  crop: CreateCropRequest;
}

export class CreateFarmRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalArea: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  agriculturalArea: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateHarvestRequest)
  harvest?: CreateHarvestRequest;
}

export class CreateProducerRequest {
  @IsNotEmpty()
  @IsString()
  document: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFarmRequest)
  farm?: CreateFarmRequest;
}
