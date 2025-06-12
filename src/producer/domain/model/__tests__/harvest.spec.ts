import { UnprocessableEntityException } from '@nestjs/common';
import { Crop } from '../crop';
import { Harvest } from '../harvest';

describe('Harvest', () => {
  const validCrop = Crop.create({
    id: '220377ba-5aa0-41c7-8f37-033b5c0ff1ae',
    name: 'Soja',
  });

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
      UnprocessableEntityException,
    );
  });

  it('should throw if year is not provided', () => {
    expect(() =>
      Harvest.create({ ...validProps, year: undefined as any }),
    ).toThrow(UnprocessableEntityException);
  });

  it('should throw if crops array is empty', () => {
    expect(() =>
      Harvest.create({ ...validProps, crop: undefined as any }),
    ).toThrow(UnprocessableEntityException);
  });
});
