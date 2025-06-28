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
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ProducerApplicationService } from 'src/producer/application/service/producer-application.service';
import { CreateProducerRequest } from '../dto/request';
import { ApiResponse } from '../dto/response/api.response';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProducerResponse } from '../dto/response/producer.response';
import { ProducerMapper } from '../../../../producer/infrastructure/persistence/mapper/producer.mapper';
import { ApiProducerResponse } from '../dto/response/api-producer.response';
import { DashBoardResponse } from '../dto/response/dashboard.response';
import { Logger } from 'nestjs-pino';
import { Request, Response } from 'express';
import { ProducerJwtAuthGuard } from '../guard/producer-jwt-auth.guard';
@Controller('producers')
export class ProducerController {
  constructor(
    private readonly producerService: ProducerApplicationService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiBody({ type: CreateProducerRequest })
  @ApiCreatedResponse({
    description: 'Produtor criado com sucesso',
    type: ApiProducerResponse,
  })
  async createProducer(
    @Body() request: CreateProducerRequest,
  ): Promise<ApiResponse<ProducerResponse>> {
    this.logger.log('Criando produtor', { payload: request });

    const producer = await this.producerService.create(request);

    this.logger.log(`Produtor criado com ID: ${producer.getId()}`);

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
    this.logger.log('Deletando produtor', { payload: id });

    await this.producerService.delete(id);

    this.logger.log(`Produtor com ID: ${id} deletado com sucesso`);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Lista de todos os produtores',
    type: ApiProducerResponse,
    isArray: true,
  })
  async getAllProducers(): Promise<ApiResponse<ProducerResponse[]>> {
    this.logger.log('Solicitando lista de produtores');

    const producers = await this.producerService.findAll();
    const response = producers.map(ProducerMapper.toResponse);

    this.logger.log(
      `Lista de produtores carregada com ${producers.length} produtores`,
    );

    return new ApiResponse<ProducerResponse[]>(
      HttpStatus.OK,
      response,
      'Dados carregados com sucesso',
    );
  }

  @UseGuards(ProducerJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('dashboard')
  @ApiOkResponse({
    description: 'Dados carregados com sucesso',
    type: DashBoardResponse,
  })
  async getProducerSummary(): Promise<ApiResponse<DashBoardResponse>> {
    this.logger.log('Solicitando resumo de produtores para o dashboard');

    const summary = await this.producerService.getSummary();

    this.logger.log('Dados de resumo dos produtores carregados com sucesso');

    return new ApiResponse<DashBoardResponse>(
      HttpStatus.OK,
      summary,
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
    this.logger.log('Solicitando dados do produtor', { payload: id });

    const producer = await this.producerService.findById(id);

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }

    this.logger.log(
      `Dados do produtor com id ${producer?.getId} carregados com sucesso`,
    );

    const response = ProducerMapper.toResponse(producer);
    return new ApiResponse<ProducerResponse>(
      HttpStatus.OK,
      response,
      'Dados carregados com sucesso',
    );
  }

  @UseGuards(ProducerJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiParam({ name: 'id', type: String, description: 'ID do produtor' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Dados atualizados com sucesso',
  })
  async updateProducerName(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    this.logger.log('Atualizando produtor', { payload: { id, name } });

    await this.producerService.updateName(id, name);

    this.logger.log(`Produtor com id ${id} atualizado com sucesso`);

    return new ApiResponse<null>(
      HttpStatus.OK,
      null,
      'Dados atualizados com sucesso',
    );
  }
}
