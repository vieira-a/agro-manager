import { Producer } from '../../../../producer/domain/model';
import {
  InvalidDocumentException,
  InvalidProducerParamException,
} from '../../../../producer/domain/exception';
import { CreateProducerDto } from '../../dto/create-producer.dto';
import {
  ICropRepository,
  IFarmRepository,
  IHarvestRepository,
  IProducerRepository,
} from '../../repository';
import { ProducerApplicationService } from '../producer-application.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordFactory } from '../../../../producer/domain/model/password.factory';
import { Password } from '../../../../producer/domain/model/password';
import { PasswordNotMatchException } from '../../exception/password-not-match.exception';
import { InvalidPasswordException } from '../../../../producer/domain/exception/invalid-password.exception';
import { ProducerRole } from '../../../../producer/domain/enum/producer-role.enum';

describe('ProducerApplicationService', () => {
  let service: ProducerApplicationService;

  const mockProducerRepository: Partial<IProducerRepository> = {
    save: jest.fn(async (producer: Producer) => producer),
  };

  const mockFarmRepository: Partial<IFarmRepository> = {
    save: jest.fn().mockResolvedValue(null),
    findUnique: jest.fn(),
  };

  const mockHarvestRepository: Partial<IHarvestRepository> = {
    save: jest.fn().mockResolvedValue(null),
    findUnique: jest.fn(),
  };

  const mockCropRepository: Partial<ICropRepository> = {
    save: jest.fn().mockResolvedValue(null),
    findUnique: jest.fn(),
  };

  const mockPasswordFactory: Partial<PasswordFactory> = {
    create: jest.fn(async (password: string) => {
      if (!password || password.length < 8) {
        throw new InvalidPasswordException('Senha inválida');
      }
      return new Password('hashed-password');
    }),
  };

  const validProducer: CreateProducerDto = {
    name: 'João da Silva',
    role: ProducerRole.PRODUCER_USER,
    document: '09779679057',
    password: 'P@ssword10',
    passwordConfirmation: 'P@ssword10',
    farm: {
      name: 'Fazenda Monte Alto',
      city: 'Cruz das Almas',
      state: 'BA',
      totalArea: 100,
      agriculturalArea: 60,
      vegetationArea: 40,
      harvest: {
        description: 'Safra Inverno',
        year: 2024,
        crop: {
          name: 'Arroz',
        },
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerApplicationService,
        { provide: 'IProducerRepository', useValue: mockProducerRepository },
        { provide: 'IFarmRepository', useValue: mockFarmRepository },
        { provide: 'IHarvestRepository', useValue: mockHarvestRepository },
        { provide: 'ICropRepository', useValue: mockCropRepository },
        { provide: PasswordFactory, useValue: mockPasswordFactory },
      ],
    }).compile();

    service = module.get(ProducerApplicationService);
  });

  it('should create a producer with only name and document', async () => {
    const input: CreateProducerDto = {
      name: 'João da Silva',
      role: ProducerRole.PRODUCER_USER,
      document: '09779679057',
      password: 'P@ssword10',
      passwordConfirmation: 'P@ssword10',
    };

    const producer = await service.create(input);

    expect(producer).toBeDefined();
    expect(producer.getFarms().length).toBe(0);
  });

  it('should create a producer with a farm', async () => {
    mockFarmRepository.findUnique = jest.fn().mockResolvedValue(null);

    const input: CreateProducerDto = {
      ...validProducer,
      farm: {
        name: 'Fazenda Monte Alto',
        city: 'Cruz das Almas',
        state: 'BA',
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        harvest: undefined,
      },
    };

    const producer = await service.create(input);

    expect(producer.getFarms().length).toBe(1);
    expect(mockFarmRepository.findUnique).toHaveBeenCalled();
    expect(mockFarmRepository.save).toHaveBeenCalled();
  });

  it('should create a producer with farm and harvest', async () => {
    mockFarmRepository.findUnique = jest.fn().mockResolvedValue(null);
    mockHarvestRepository.findUnique = jest.fn().mockResolvedValue(null);
    mockCropRepository.findUnique = jest.fn().mockResolvedValue(null);

    const producer = await service.create(validProducer);

    const farm = producer.getFarms()[0];
    expect(farm.getHarvests().length).toBe(1);

    expect(mockFarmRepository.save).toHaveBeenCalled();
    expect(mockHarvestRepository.save).toHaveBeenCalled();
    expect(mockCropRepository.save).toHaveBeenCalled();
  });

  it('should throw PasswordNotMatchException if password and confirmation mismatch', async () => {
    const input = {
      ...validProducer,
      passwordConfirmation: 'wrong',
    };

    await expect(service.create(input)).rejects.toThrow(
      PasswordNotMatchException,
    );
  });

  it('should throw InvalidPasswordException when password is too short', async () => {
    const input = {
      ...validProducer,
      password: '123',
      passwordConfirmation: '123',
    };

    await expect(service.create(input)).rejects.toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw InvalidProducerParamException when name is empty or whitespace', async () => {
    for (const name of ['', '   ']) {
      const input = { ...validProducer, name };
      await expect(service.create(input)).rejects.toThrow(
        InvalidProducerParamException,
      );
    }
  });

  it('should throw InvalidDocumentException when document is invalid', async () => {
    const invalidDocs = ['', 'abc123', null, undefined];

    for (const doc of invalidDocs) {
      const input = {
        ...validProducer,
        document: doc as any,
      };

      await expect(service.create(input)).rejects.toThrow(
        InvalidDocumentException,
      );
    }
  });
});
