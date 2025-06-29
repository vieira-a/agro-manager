import { Producer } from '../../../../producer/domain/model';
import {
  InvalidCropParamException,
  InvalidDocumentException,
  InvalidFarmAreaException,
  InvalidFarmParamException,
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
      name: 'João da Silva',
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
    const harvest = farm.getHarvests();
    expect(harvest).toBeDefined();

    expect(mockFarmRepository.findUnique).toHaveBeenCalled();
    expect(mockFarmRepository.save).toHaveBeenCalled();

    expect(mockHarvestRepository.findUnique).toHaveBeenCalled();
    expect(mockHarvestRepository.save).toHaveBeenCalled();

    expect(mockCropRepository.findUnique).toHaveBeenCalled();
    expect(mockCropRepository.save).toHaveBeenCalled();
  });

  it('should throw InvalidProducerParamException when name is empty', async () => {
    const input: CreateProducerDto = {
      document: '09779679057',
      name: '',
      password: 'P@ssword10',
      passwordConfirmation: 'P@ssword10',
    };

    await expect(service.create(input)).rejects.toThrow(
      InvalidProducerParamException,
    );
  });

  it('should throw PasswordNotMatchException if password and passwordConfirmation not match', async () => {
    const input: CreateProducerDto = {
      document: '09779679057',
      name: 'João da Silva',
      password: 'P@ssword10',
      passwordConfirmation: 'P@ssword11',
    };

    await expect(service.create(input)).rejects.toThrow(
      PasswordNotMatchException,
    );
  });

  it('should throw InvalidCropParamException when crop name is empty', async () => {
    const input: CreateProducerDto = {
      name: 'João da Silva',
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
          description: 'Safra de Milho 2025',
          year: 2025,
          crop: {
            name: '',
          },
        },
      },
    };

    await expect(service.create(input)).rejects.toThrow(
      InvalidCropParamException,
    );

    expect(mockFarmRepository.save).toHaveBeenCalled();
    expect(mockCropRepository.save).not.toHaveBeenCalled();
    expect(mockProducerRepository.save).not.toHaveBeenCalled();
  });

  it('should throw InvalidProducerParamException when name is only whitespace', async () => {
    const input: CreateProducerDto = {
      name: '   ',
      document: '09779679057',
      password: 'P@ssword10',
      passwordConfirmation: 'P@ssword10',
    };

    await expect(service.create(input)).rejects.toThrow(
      InvalidProducerParamException,
    );
  });

  it('should throw InvalidDocumentException when document is empty or invalid format', async () => {
    const invalidDocuments = ['', '123ABC456', null, undefined];

    for (const doc of invalidDocuments) {
      const input: CreateProducerDto = {
        name: 'João da Silva',
        document: doc as any,
        password: 'P@ssword10',
        passwordConfirmation: 'P@ssword10',
      };

      await expect(service.create(input)).rejects.toThrow(
        InvalidDocumentException,
      );
    }
  });

  it('should throw InvalidPasswordException when password length is less than 8 characters', async () => {
    const input: CreateProducerDto = {
      name: 'João da Silva',
      document: '09779679057',
      password: 'P@ss1',
      passwordConfirmation: 'P@ss1',
    };

    await expect(service.create(input)).rejects.toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw InvalidFarmParamException when farm city is empty', async () => {
    mockFarmRepository.findUnique = jest.fn().mockResolvedValue(null);

    const input: CreateProducerDto = {
      ...validProducer,
      farm: {
        name: 'Fazenda Monte Alto',
        city: '',
        state: 'BA',
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
      },
    };

    await expect(service.create(input)).rejects.toThrow(
      InvalidFarmParamException,
    );
  });

  it('should throw InvalidFarmParamException when farm totalArea is less than or equal to zero', async () => {
    mockFarmRepository.findUnique = jest.fn().mockResolvedValue(null);

    const invalidAreas = [0, -10];

    for (const area of invalidAreas) {
      const input: CreateProducerDto = {
        ...validProducer,
        farm: {
          name: 'Fazenda Monte Alto',
          city: 'Cruz das Almas',
          state: 'BA',
          totalArea: area,
          agriculturalArea: 50,
          vegetationArea: 40,
        },
      };

      await expect(service.create(input)).rejects.toThrow(
        InvalidFarmAreaException,
      );
    }
  });
});
