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

  it('should throw if name contains only spaces', () => {
    expect(() => Crop.create({ name: '    ' })).toThrow(
      InvalidCropParamException,
    );
  });

  it('should allow names with special characters', () => {
    const crop = Crop.create({ name: 'Soja @2024!' });
    expect(crop.getName()).toBe('Soja @2024!');
  });
});
