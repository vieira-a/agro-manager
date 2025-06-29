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
  @Type(() => Number)
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
  @Type(() => Number)
  totalArea: number;

  @ApiProperty({ example: 60 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  agriculturalArea: number;

  @ApiProperty({ example: 40.5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
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
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    },
    {
      message:
        'A senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas e caracteres especiais',
    },
  )
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'P@ssword10' })
  @IsStrongPassword()
  @IsNotEmpty()
  passwordConfirmation: string;

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
