import { Request, Response } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginProducerRequest } from '../dto/request/login-producer.request';
import { IdentityApplicationService } from '../../../application/service/identity-application.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly identityService: IdentityApplicationService) {}

  @Post('login/producer')
  @HttpCode(200)
  async loginProducer(
    @Body() request: LoginProducerRequest,
    @Res() res: Response,
  ) {
    const { document, password } = request;

    const tokens = await this.identityService.loginProducer(document, password);

    res
      .cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      })
      .cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: 'Login efetuado com sucesso.',
      });
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não informado.');
    }

    const tokens = await this.identityService.refreshToken(refreshToken);

    res
      .cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      })
      .cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: 'Token renovado com sucesso.',
      });
  }
}
