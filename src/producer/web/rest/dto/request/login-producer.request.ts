import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginProducerRequest {
  @ApiProperty({ example: '57609253006' })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({ example: 'P@ssword10' })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
