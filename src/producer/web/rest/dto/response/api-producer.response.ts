import { ApiProperty } from '@nestjs/swagger';
import { ProducerResponse } from './producer.response';

export class ApiProducerResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty({ example: new Date().toISOString() })
  timestamp: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: ProducerResponse })
  data: ProducerResponse;
}
