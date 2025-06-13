import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ProducerApplicationService } from 'src/producer/application/service/producer-application.service';
import { CreateProducerRequest } from '../dto/request/create-producer.request';
import { ApiResponse } from '../dto/response/api.response';

@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerApplicationService) {}

  @Post()
  async createProducer(@Body() request: CreateProducerRequest) {
    const producer = await this.producerService.create(request);

    return new ApiResponse(
      HttpStatus.CREATED,
      producer,
      'Produtor criado com sucesso',
    );
  }
}
