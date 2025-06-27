import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProducerApplicationService } from './producer-application.service';
import { PasswordFactory } from '../../../producer/domain/model/password.factory';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProducerAuthService {
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

  async login(document: string, plainPassword: string) {
    const producer =
      await this.producerApplicationService.findByDocument(document);

    if (!producer) throw new NotFoundException();

    const isPasswordValid = await this.passwordFactory.matches(
      plainPassword,
      producer.getPassword(),
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciais inválidas');

    const accessTokenPayload = {
      sub: producer.getId(),
      document: producer.getDocument(),
      type: 'access',
    };

    const refreshTokenPayload = {
      sub: producer.getId(),
      document: producer.getDocument(),
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
        throw new ForbiddenException('Token inválido para refresh');
      }

      const newAccessTokenPayload = {
        sub: payload.sub,
        document: payload.document,
        type: 'access',
      };

      const newRefreshTokenPayload = {
        sub: payload.sub,
        document: payload.document,
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
      throw new ForbiddenException('Credenciais inválidas');
    }
  }
}
