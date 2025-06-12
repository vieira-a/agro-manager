import { Crop } from '../crop';
import { Harvest } from '../harvest';

describe('Harvest', () => {
  const validCrops = [Crop.create({ name: 'Soja' })];

  const validProps = {
    id: 'e3989eb5-7001-451f-a3fe-3fb03d7f39fb',
    description: 'Safra de Verão',
    year: 2023,
    crops: validCrops,
  };

  it('should create a harvest successfully with valid data', () => {
    const harvest = Harvest.create(validProps);
    expect(harvest).toBeInstanceOf(Harvest);
  });
});
