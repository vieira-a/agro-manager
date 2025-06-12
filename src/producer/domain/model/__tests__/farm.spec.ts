import { UnprocessableEntityException } from '@nestjs/common';
import { Farm } from '../farm';
import { InvalidFarmParamException } from '../../exception/invalid-farm-param.exception';
import { InvalidFarmAreaException } from '../../exception/invalid-farm-area.exception';

describe('Farm', () => {
  const validProps = {
    name: 'Fazenda Teste',
    city: 'Cidade Exemplo',
    state: 'Estado Exemplo',
    totalArea: 100,
    agriculturalArea: 60,
    vegetationArea: 30,
    harvest: [],
  };

  it('should create a farm successfully with valid data', () => {
    const farm = Farm.create(validProps);
    expect(farm).toBeInstanceOf(Farm);
  });

  it('should throw if name is empty', () => {
    expect(() => Farm.create({ ...validProps, name: '' })).toThrow(
      InvalidFarmParamException,
    );
  });

  it('should throw if city is empty', () => {
    expect(() => Farm.create({ ...validProps, city: '' })).toThrow(
      InvalidFarmParamException,
    );
  });

  it('should throw if state is empty', () => {
    expect(() => Farm.create({ ...validProps, state: '' })).toThrow(
      InvalidFarmParamException,
    );
  });

  it('should throw if totalArea is less than sum of agriculturalArea and vegetationArea', () => {
    expect(() => Farm.create({ ...validProps, totalArea: 80 })).toThrow(
      InvalidFarmAreaException,
    );
  });
});
