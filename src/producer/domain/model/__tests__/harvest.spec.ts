import { Crop } from '../crop';
import { Harvest } from '../harvest';
import { InvalidHarvestParamException } from '../../exception';

describe('Harvest', () => {
  const validCrop = Crop.create({ name: 'Soja' });

  const validProps = {
    id: 'e3989eb5-7001-451f-a3fe-3fb03d7f39fb',
    description: 'Safra de Verão',
    year: 2023,
    crop: validCrop,
  };

  it('should create a harvest successfully with valid data', () => {
    const harvest = Harvest.create(validProps);
    expect(harvest).toBeInstanceOf(Harvest);
  });

  it('should throw if description is empty', () => {
    expect(() => Harvest.create({ ...validProps, description: '' })).toThrow(
      InvalidHarvestParamException,
    );
  });

  it('should throw if year is not provided', () => {
    expect(() =>
      Harvest.create({ ...validProps, year: undefined as any }),
    ).toThrow(InvalidHarvestParamException);
  });

  it('should throw if crops array is empty', () => {
    expect(() =>
      Harvest.create({ ...validProps, crop: undefined as any }),
    ).toThrow(InvalidHarvestParamException);
  });
});
