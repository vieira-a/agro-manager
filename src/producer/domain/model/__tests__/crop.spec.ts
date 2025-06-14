import { Crop } from '../crop';
import { InvalidCropParamException } from '../../exception';

describe('Crop', () => {
  const validProps = Crop.create({ name: 'Soja' });

  it('should create a crop successfully with a valid name', () => {
    expect(validProps).toBeInstanceOf(Crop);
  });

  it('should throw if name is empty', () => {
    expect(() => Crop.create({ name: '' })).toThrow(InvalidCropParamException);
  });
});
