import { Module } from '@nestjs/common';
import { IdentityApplicationService } from './application/service/identity-application.service';
import { JwtStrategy } from './auth-strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ProducerModule } from '../producer/producer.module';
import { AuthenticationController } from './web/rest/controller/authentication.controller';

@Module({
  imports: [ProducerModule],
  providers: [IdentityApplicationService, JwtStrategy, JwtService],
  controllers: [AuthenticationController],
})
export class IdentityModule {}
