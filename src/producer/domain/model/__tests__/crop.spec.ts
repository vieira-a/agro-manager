import { UnprocessableEntityException } from '@nestjs/common';
import { Crop } from '../crop';

describe('Crop', () => {
  const validName = 'Milho';

  it('should create a crop successfully with a valid name', () => {
    const crop = Crop.create({ name: validName });
    expect(crop).toBeInstanceOf(Crop);
  });

  it('should throw if name is empty', () => {
    expect(() => Crop.create({ name: '' })).toThrow(
      UnprocessableEntityException,
    );
  });
});
