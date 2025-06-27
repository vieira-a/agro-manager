import { CreateFarmDto } from './create-farm.dto';

export class CreateProducerDto {
  readonly document: string;
  readonly name: string;
  readonly password: string;
  readonly passwordConfirmation: string;
  readonly farm?: CreateFarmDto;
}
