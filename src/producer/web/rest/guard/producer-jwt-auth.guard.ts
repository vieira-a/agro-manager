import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ProducerJwtAuthGuard extends AuthGuard('jwt') {}
