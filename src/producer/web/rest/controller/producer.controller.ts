import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProducerApplicationService } from 'src/producer/application/service/producer-application.service';
import { CreateProducerRequest } from '../dto/request/create-producer.request';
import { ApiResponse } from '../dto/response/api.response';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProducerResponse } from '../dto/response/producer.response';
import { ProducerMapper } from '../../../../producer/infrastructure/persistence/mapper/producer.mapper';
import { ApiProducerResponse } from '../dto/response/api-producer.response';

@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerApplicationService) {}

  @Post()
  @ApiBody({ type: CreateProducerRequest })
  @ApiCreatedResponse({
    description: 'Produtor criado com sucesso',
    type: ApiProducerResponse,
  })
  async createProducer(
    @Body() request: CreateProducerRequest,
  ): Promise<ApiResponse<ProducerResponse>> {
    const producer = await this.producerService.create(request);
    const response = ProducerMapper.toResponse(producer);

    return new ApiResponse<ProducerResponse>(
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

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Lista de todos os produtores',
    type: ApiProducerResponse,
    isArray: true,
  })
  async getAllProducers(): Promise<ApiResponse<ProducerResponse[]>> {
    const producers = await this.producerService.findAll();
    const response = producers.map(ProducerMapper.toResponse);

    return new ApiResponse<ProducerResponse[]>(
      HttpStatus.OK,
      response,
      'Dados carregados com sucesso',
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'ID do produtor' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Dados de um produtor',
    type: ApiProducerResponse,
  })
  async getProducerById(
    @Param('id') id: string,
  ): Promise<ApiResponse<ProducerResponse>> {
    const producer = await this.producerService.findById(id);

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }

    const response = ProducerMapper.toResponse(producer);
    return new ApiResponse<ProducerResponse>(
      HttpStatus.OK,
      response,
      'Dados carregados com sucesso',
    );
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String, description: 'ID do produtor' })
  @HttpCode(HttpStatus.OK)
  async updateProducerName(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    await this.producerService.updateName(id, name);

    return new ApiResponse<null>(
      HttpStatus.OK,
      null,
      'Dados atualizados com sucesso',
    );
  }
}
