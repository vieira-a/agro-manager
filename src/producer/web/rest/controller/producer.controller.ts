import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ProducerApplicationService } from 'src/producer/application/service/producer-application.service';
import { CreateProducerRequest } from '../dto/request/create-producer.request';
import { ApiResponse } from '../dto/response/api.response';
import { ApiBody, ApiCreatedResponse, ApiParam } from '@nestjs/swagger';
import { CreateProducerResponse } from '../dto/response/create-producer.response';
import { ProducerMapper } from '../../../../producer/infrastructure/persistence/mapper/producer.mapper';
import { ApiResponseCreateProducerResponse } from '../dto/response/api-create-producer.response';

@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerApplicationService) {}

  @Post()
  @ApiBody({ type: CreateProducerRequest })
  @ApiCreatedResponse({
    description: 'Produtor criado com sucesso',
    type: ApiResponseCreateProducerResponse,
  })
  async createProducer(
    @Body() request: CreateProducerRequest,
  ): Promise<ApiResponse<CreateProducerResponse>> {
    const producer = await this.producerService.create(request);
    const response = ProducerMapper.toResponse(producer);

    return new ApiResponse<CreateProducerResponse>(
      HttpStatus.CREATED,
      response,
      'Produtor criado com sucesso',
    );
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'ID do produtor' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProducer(@Param('id') id: string): Promise<void> {
    await this.producerService.delete(id);
  }
}
