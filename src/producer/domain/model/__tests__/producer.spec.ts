import { UnprocessableEntityException } from '@nestjs/common';
import { DocumentValidatorFactory } from '../document-validator.factory';
import { Farm } from '../farm';
import { Producer } from '../producer';
import { Crop } from '../crop';
import { Harvest } from '../harvest';

describe('Producer', () => {
  const validCPF = DocumentValidatorFactory.create('66452197096');
  const validCNPJ = DocumentValidatorFactory.create('11444777000161');

  const crops = [Crop.create({ name: 'Milho' }), Crop.create({ name: 'Soja' })];

  const harvests = [
    Harvest.create({
      id: '34b47b6a-27f7-4480-996d-1254194caa91',
      description: 'Safra 2024',
      year: 2024,
      crops: crops,
    }),
  ];

  const validFarm = Farm.create({
    name: 'Fazenda Teste',
    city: 'Cidade Teste',
    state: 'Estado Teste',
    totalArea: 100,
    agriculturalArea: 50,
    vegetationArea: 30,
    harvest: harvests,
  });

  it('should create a valid Producer with valid CPF and all nested entities', () => {
    const producer = Producer.create({
      document: validCPF,
      name: 'John Doe',
      farm: validFarm,
    });

    expect(producer).toBeInstanceOf(Producer);
  });

  it('should create a Producer with valid CNPJ document and Farm', () => {
    const producer = Producer.create({
      document: validCNPJ,
      name: 'Empresa Agro',
      farm: validFarm,
    });

    expect(producer).toBeInstanceOf(Producer);
  });

  it('should throw if name is empty', () => {
    expect(() =>
      Producer.create({
        document: validCPF,
        name: '',
        farm: validFarm,
      }),
    ).toThrow(UnprocessableEntityException);
  });

  it('should throw if farm is not provided', () => {
    expect(() =>
      Producer.create({
        document: validCPF,
        name: 'João da Silva',
        farm: null as any,
      }),
    ).toThrow(UnprocessableEntityException);
  });

  it('should throw if document is null', () => {
    expect(() =>
      Producer.create({
        document: null as any,
        name: 'João da Silva',
        farm: validFarm,
      }),
    ).toThrow(UnprocessableEntityException);
  });

  it('should throw if document is undefined', () => {
    expect(() =>
      Producer.create({
        document: undefined as any,
        name: 'João da Silva',
        farm: validFarm,
      }),
    ).toThrow(UnprocessableEntityException);
  });
});
