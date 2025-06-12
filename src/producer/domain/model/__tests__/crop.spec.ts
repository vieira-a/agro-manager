import { Crop } from '../crop';

describe('Crop', () => {
  const validName = 'Milho';

  it('should create a crop successfully with a valid name', () => {
    const crop = Crop.create({ name: validName });
    expect(crop).toBeInstanceOf(Crop);
  });
});
