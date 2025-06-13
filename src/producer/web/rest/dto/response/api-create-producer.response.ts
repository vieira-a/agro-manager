import { ApiProperty } from '@nestjs/swagger';
import { CreateProducerResponse } from './create-producer.response';

export class ApiResponseCreateProducerResponse {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: new Date().toISOString() })
  timestamp: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: CreateProducerResponse })
  data: CreateProducerResponse;
}
