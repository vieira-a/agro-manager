import { Farm } from '../farm';

describe('Farm', () => {
  const validProps = {
    name: 'Fazenda Teste',
    city: 'Cidade Exemplo',
    state: 'Estado Exemplo',
    totalArea: 100,
    agriculturalArea: 60,
    vegetationArea: 30,
    harvest: [],
  };

  it('should create a farm successfully with valid data', () => {
    const farm = Farm.create(validProps);
    expect(farm).toBeInstanceOf(Farm);
  });
});
