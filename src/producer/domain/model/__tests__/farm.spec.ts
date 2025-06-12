import { Farm } from '../farm';
import {
  InvalidFarmParamException,
  InvalidFarmAreaException,
} from '../../exception';
import { Harvest } from '../harvest';
import { Crop } from '../crop';

describe('Farm', () => {
  const validCrop = Crop.create({ name: 'Milho' });

  const validHarvest = Harvest.create({
    description: 'Safra 2024',
    year: 2024,
    crop: validCrop,
  });

  const validProps = {
    name: 'Fazenda Teste',
    city: 'Cidade Exemplo',
    state: 'Estado Exemplo',
    totalArea: 100,
    agriculturalArea: 60,
    vegetationArea: 30,
    harvest: validHarvest,
  };

  it('should create a farm successfully with valid data', () => {
    const farm = Farm.create(validProps);
    expect(farm).toBeInstanceOf(Farm);
  });

  it('should allow adding a harvest to an existing farm', () => {
    const farm = Farm.create(validProps);

    farm.addHarvest(validHarvest);
    expect(farm.getHarvest()).toBe(validHarvest);
  });

  it('should create a farm successfully without harvest', () => {
    const farm = Farm.create({ ...validProps, harvest: undefined });
    expect(farm).toBeInstanceOf(Farm);
  });

  it('should throw if trying to create a farm with an invalid harvest', () => {
    const invalidHarvest = null as any;
    const farm = Farm.create({ ...validProps, harvest: invalidHarvest });

    expect(() => farm.addHarvest(null as any)).toThrow(
      InvalidFarmParamException,
    );
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
