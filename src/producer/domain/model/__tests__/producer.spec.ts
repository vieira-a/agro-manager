import { DocumentValidatorFactory } from '../document-validator.factory';
import { Farm } from '../farm';
import { Producer } from '../producer';
import { Crop } from '../crop';
import { Harvest } from '../harvest';
import { InvalidProducerParamException } from '../../exception';

describe('Producer', () => {
  const validCPF = DocumentValidatorFactory.create('66452197096');
  const validCNPJ = DocumentValidatorFactory.create('11444777000161');

  const crop = Crop.create({
    name: 'Milho',
  });

  const harvests = Harvest.create({
    description: 'Safra 2024',
    year: 2024,
    crop: crop,
  });

  const validFarm = Farm.create({
    name: 'Fazenda Teste',
    city: 'Cidade Teste',
    state: 'Estado Teste',
    totalArea: 100,
    agriculturalArea: 50,
    vegetationArea: 30,
    harvests: [harvests],
  });

  it('should create a valid Producer with valid CPF and all nested entities', () => {
    const producer = Producer.create({
      document: validCPF,
      name: 'John Doe',
      password: 'P@ssword10',
      farms: [validFarm],
    });

    expect(producer).toBeInstanceOf(Producer);
  });

  it('should allow adding a farm to an existing producer', () => {
    const producer = Producer.create({
      document: validCPF,
      name: 'João da Silva',
      password: 'P@ssword10',
    });

    producer.addFarm(validFarm);

    expect(producer.getFarms()).toHaveLength(1);
    expect(producer.getFarms()[0]).toBe(validFarm);
  });

  it('should create a Producer with valid CNPJ document and Farm', () => {
    const producer = Producer.create({
      document: validCNPJ,
      name: 'Empresa Agro',
      password: 'P@ssword10',
      farms: [validFarm],
    });

    expect(producer).toBeInstanceOf(Producer);
  });

  it('should throw if trying to add an invalid farm', () => {
    const producer = Producer.create({
      document: validCPF,
      name: 'João da Silva',
      password: 'P@ssword10',
    });

    expect(() => producer.addFarm(null as any)).toThrow(
      InvalidProducerParamException,
    );
  });

  it('should throw if name is empty', () => {
    expect(() =>
      Producer.create({
        document: validCPF,
        name: '',
        password: 'P@ssword10',
        farms: [validFarm],
      }),
    ).toThrow(InvalidProducerParamException);
  });

  it('should throw if document is null', () => {
    expect(() =>
      Producer.create({
        document: null as any,
        name: 'João da Silva',
        password: 'P@ssword10',
        farms: [validFarm],
      }),
    ).toThrow(InvalidProducerParamException);
  });

  it('should throw if document is undefined', () => {
    expect(() =>
      Producer.create({
        document: undefined as any,
        name: 'João da Silva',
        password: 'P@ssword10',
        farms: [validFarm],
      }),
    ).toThrow(InvalidProducerParamException);
  });
});
