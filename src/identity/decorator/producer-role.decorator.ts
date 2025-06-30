import { SetMetadata } from '@nestjs/common';
import { ProducerRole } from '../../producer/domain/enum/producer-role.enum';

export const PODUCER_ROLES_KEY = 'roles';
export const ProducerRoles = (...roles: ProducerRole[]) =>
  SetMetadata(PODUCER_ROLES_KEY, roles);
