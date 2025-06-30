import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProducerApplicationService } from '../../../producer/application/service';
import { PasswordFactory } from '../../../producer/domain/model/password.factory';
import { ConfigService } from '@nestjs/config';
import {
  InvalidCredentialsException,
  InvalidTokenException,
} from '../exception';
import { ProducerRole } from '../../../producer/domain/enum/producer-role.enum';

type TokenPayload = {
  sub: string;
  document: string;
  role: string | ProducerRole;
  type: 'access' | 'refresh';
};

@Injectable()
export class IdentityApplicationService {
  private accessTokenSecret: string | undefined;
  private refreshTokenSecret: string | undefined;

  constructor(
    private readonly producerApplicationService: ProducerApplicationService,
    private readonly jwtService: JwtService,
    private readonly passwordFactory: PasswordFactory,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret = this.configService.get<string>('JWT_TOKEN_SECRET');
    this.refreshTokenSecret = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_SECRET',
    );
  }

  async loginProducer(document: string, plainPassword: string) {
    const producer =
      await this.producerApplicationService.findByDocument(document);

    if (!producer)
      throw new InvalidCredentialsException('Produtor não existe.');

    const isPasswordValid = await this.passwordFactory.matches(
      plainPassword,
      producer.getPassword(),
    );
    if (!isPasswordValid)
      throw new InvalidCredentialsException('Senha incorreta.');

    const accessTokenPayload: TokenPayload = {
      sub: producer.getId(),
      document: producer.getDocument(),
      role: producer.getRole(),
      type: 'access',
    };

    const refreshTokenPayload: TokenPayload = {
      sub: producer.getId(),
      document: producer.getDocument(),
      role: producer.getRole(),
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.accessTokenSecret,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.refreshTokenSecret,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.refreshTokenSecret,
      });

      if (payload.type !== 'refresh') {
        throw new InvalidTokenException('Token inválido para refresh');
      }

      const newAccessTokenPayload: TokenPayload = {
        sub: payload.sub,
        document: payload.document,
        role: payload.role,
        type: 'access',
      };

      const newRefreshTokenPayload: TokenPayload = {
        sub: payload.sub,
        document: payload.document,
        role: payload.role,
        type: 'refresh',
      };

      const newAccessToken = this.jwtService.sign(newAccessTokenPayload, {
        secret: this.accessTokenSecret,
        expiresIn: '15m',
      });

      const newRefreshToken = this.jwtService.sign(newRefreshTokenPayload, {
        secret: this.refreshTokenSecret,
        expiresIn: '7d',
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (
        error.name === 'TokenExpiredError' ||
        error.name === 'JsonWebTokenError' ||
        error.name === 'NotBeforeError'
      ) {
        throw new InvalidTokenException('Token inválido ou expirado.');
      }
      throw error;
    }
  }
}
