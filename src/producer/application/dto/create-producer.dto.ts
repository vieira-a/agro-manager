import { ProducerRole } from '../../../producer/domain/enum/producer-role.enum';
import { CreateFarmDto } from './create-farm.dto';

export class CreateProducerDto {
  readonly document: string;
  readonly name: string;
  readonly role: ProducerRole;
  readonly password: string;
  readonly passwordConfirmation: string;
  readonly farm?: CreateFarmDto;
}
