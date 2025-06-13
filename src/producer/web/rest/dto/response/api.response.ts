import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: new Date().toISOString() })
  timestamp: string;

  @ApiPropertyOptional({ example: 'Operação realizada com sucesso' })
  message?: string;

  @ApiPropertyOptional()
  data?: T | T[];

  constructor(statusCode: number, data?: T, message?: string) {
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.message = message;
  }
}
