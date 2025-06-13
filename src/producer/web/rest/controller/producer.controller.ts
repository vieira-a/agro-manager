import { Body, Controller, Post } from '@nestjs/common';
import { ProducerApplicationService } from 'src/producer/application/service/producer-application.service';
import { CreateProducerRequest } from '../dto/request/create-producer.request';

@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerApplicationService) {}

  @Post()
  async createProducer(@Body() request: CreateProducerRequest) {
    return await this.producerService.create(request);
  }
}
