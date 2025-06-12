import { Crop } from '../crop';
import { InvalidCropParamException } from '../../exception';

describe('Crop', () => {
  const validProps = Crop.create({
    id: '220377ba-5aa0-41c7-8f37-033b5c0ff1ae',
    name: 'Soja',
  });

  it('should create a crop successfully with a valid name', () => {
    expect(validProps).toBeInstanceOf(Crop);
  });

  it('should throw if name is empty', () => {
    expect(() =>
      Crop.create({ id: '220377ba-5aa0-41c7-8f37-033b5c0ff1ae', name: '' }),
    ).toThrow(InvalidCropParamException);
  });
});
