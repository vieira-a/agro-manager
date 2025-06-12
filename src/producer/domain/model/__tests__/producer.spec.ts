import { DocumentValidatorFactory } from '../document-validator.factory';
import { Farm } from '../farm';
import { Producer } from '../producer';

describe('Producer', () => {
  const validCPF = DocumentValidatorFactory.create('66452197096');

  const validFarm = Farm.create({
    name: 'Fazenda Teste',
    city: 'Cidade Teste',
    state: 'Estado Teste',
    totalArea: 100,
    agriculturalArea: 50,
    vegetationArea: 30,
    harvest: [],
  });

  it('should create a valid Producer with valid CPF and Farm', () => {
    const producer = Producer.create({
      document: validCPF,
      name: 'John Doe',
      farm: validFarm,
    });

    expect(producer).toBeInstanceOf(Producer);
  });
});
