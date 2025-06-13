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
    harvests: [validHarvest],
  };

  it('should create a farm successfully with valid data', () => {
    const farm = Farm.create(validProps);
    expect(farm).toBeInstanceOf(Farm);
  });

  it('should not duplicate the same harvest', () => {
    const farm = Farm.create(validProps);

    farm.addHarvest(validHarvest);
    expect(farm.getHarvests()).toHaveLength(1);
    expect(farm.getHarvests()).toContain(validHarvest);
  });

  it('should add different harvests correctly', () => {
    const farm = Farm.create(validProps);

    const anotherHarvest = Harvest.create({
      description: 'Safra 2025',
      year: 2025,
      crop: validCrop,
    });

    farm.addHarvest(anotherHarvest);

    expect(farm.getHarvests()).toHaveLength(2);
    expect(farm.getHarvests()).toEqual(
      expect.arrayContaining([validHarvest, anotherHarvest]),
    );
  });

  it('should create a farm successfully without harvest', () => {
    const farm = Farm.create({ ...validProps, harvests: [] });
    expect(farm).toBeInstanceOf(Farm);
  });

  it('should throw if trying to add an invalid harvest', () => {
    const farm = Farm.create(validProps);
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
