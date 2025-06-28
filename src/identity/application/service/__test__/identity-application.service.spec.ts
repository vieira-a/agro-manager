import { Test, TestingModule } from '@nestjs/testing';
import { IdentityApplicationService } from '../identity-application.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProducerApplicationService } from '../../../../producer/application/service';
import { PasswordFactory } from '../../../../producer/domain/model/password.factory';
import { InvalidCredentialsException } from '../../exception/invalid-credentials.exception';

describe('IdentityApplicationService', () => {
  let service: IdentityApplicationService;

  const mockProducer = {
    getId: () => 'producer-id',
    getDocument: () => '09779679057',
    getPassword: () => 'hashed-password',
  };

  const producerApplicationService = {
    findByDocument: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const passwordFactory = {
    matches: jest.fn(),
  };

  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_TOKEN_SECRET') return 'access-secret';
      if (key === 'JWT_REFRESH_TOKEN_SECRET') return 'refresh-secret';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentityApplicationService,
        {
          provide: ProducerApplicationService,
          useValue: producerApplicationService,
        },
        { provide: JwtService, useValue: jwtService },
        { provide: PasswordFactory, useValue: passwordFactory },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<IdentityApplicationService>(
      IdentityApplicationService,
    );

    jest.clearAllMocks();
  });

  describe('Producer login', () => {
    it('should throwe if document is not provided', async () => {
      producerApplicationService.findByDocument.mockResolvedValue(null);
      await expect(service.loginProducer('', 'P@ssword10')).rejects.toThrow(
        InvalidCredentialsException,
      );
    });

    it('should throw if password is incorrect', async () => {
      producerApplicationService.findByDocument.mockResolvedValue(mockProducer);
      passwordFactory.matches.mockResolvedValue(false);

      await expect(
        service.loginProducer('09779679057', 'incorrectPassword'),
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should throw if producer not found', async () => {
      producerApplicationService.findByDocument.mockResolvedValue(null);

      await expect(
        service.loginProducer('00000000000', 'any-password'),
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should login producer with valid credentials', async () => {
      producerApplicationService.findByDocument.mockResolvedValue(mockProducer);
      passwordFactory.matches.mockResolvedValue(true);
      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.loginProducer('09779679057', 'P@ssword10');

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(producerApplicationService.findByDocument).toHaveBeenCalledWith(
        '09779679057',
      );
      expect(passwordFactory.matches).toHaveBeenCalledWith(
        'P@ssword10',
        'hashed-password',
      );
    });
  });
});
