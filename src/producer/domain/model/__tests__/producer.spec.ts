import { DocumentValidatorFactory } from '../document-validator.factory';
import { Farm } from '../farm';
import { Producer } from '../producer';
import { Crop } from '../crop';
import { Harvest } from '../harvest';
import { InvalidProducerParamException } from '../../exception';
import { Password } from '../password';
import { PasswordFactory } from '../password.factory';
import { EncryptPassword } from '../encrypt-password';

describe('Producer', () => {
  const validCPF = DocumentValidatorFactory.create('66452197096');
  const validCNPJ = DocumentValidatorFactory.create('11444777000161');

  let validPassword: Password;
  let crop: Crop;
  let harvest: Harvest;
  let farm: Farm;

  beforeAll(async () => {
    const passwordFactory = new PasswordFactory(new EncryptPassword());
    validPassword = await passwordFactory.create('P@ssword10');

    crop = Crop.create({ name: 'Milho' });

    harvest = Harvest.create({
      description: 'Safra 2024',
      year: 2024,
      crop,
    });

    farm = Farm.create({
      name: 'Fazenda Teste',
      city: 'Cidade Teste',
      state: 'Estado Teste',
      totalArea: 100,
      agriculturalArea: 50,
      vegetationArea: 30,
      harvests: [harvest],
    });
  });

  describe('Creation and validation', () => {
    it('should create a valid Producer with valid CPF and all nested entities', () => {
      const producer = Producer.create({
        document: validCPF,
        name: 'John Doe',
        password: validPassword,
        farms: [farm],
      });
      expect(producer).toBeInstanceOf(Producer);
    });

    it('should create a Producer with valid CNPJ document and Farm', () => {
      const producer = Producer.create({
        document: validCNPJ,
        name: 'Empresa Agro',
        password: validPassword,
        farms: [farm],
      });
      expect(producer).toBeInstanceOf(Producer);
    });

    it('should throw if name is empty', () => {
      expect(() =>
        Producer.create({
          document: validCPF,
          name: '',
          password: validPassword,
          farms: [farm],
        }),
      ).toThrow(InvalidProducerParamException);
    });

    it('should throw if document is null', () => {
      expect(() =>
        Producer.create({
          document: null as any,
          name: 'João da Silva',
          password: validPassword,
          farms: [farm],
        }),
      ).toThrow(InvalidProducerParamException);
    });

    it('should throw if document is undefined', () => {
      expect(() =>
        Producer.create({
          document: undefined as any,
          name: 'João da Silva',
          password: validPassword,
          farms: [farm],
        }),
      ).toThrow(InvalidProducerParamException);
    });
  });

  describe('Farm management', () => {
    it('should allow adding a farm to an existing producer', () => {
      const producer = Producer.create({
        document: validCPF,
        name: 'João da Silva',
        password: validPassword,
      });

      producer.addFarm(farm);

      expect(producer.getFarms()).toHaveLength(1);
      expect(producer.getFarms()[0]).toBe(farm);
    });

    it('should throw if trying to add an invalid farm', () => {
      const producer = Producer.create({
        document: validCPF,
        name: 'João da Silva',
        password: validPassword,
      });

      expect(() => producer.addFarm(null as any)).toThrow(
        InvalidProducerParamException,
      );
    });

    it('should throw when adding a farm that fails validation', () => {
      const producer = Producer.create({
        document: validCPF,
        name: 'João da Silva',
        password: validPassword,
      });

      const invalidFarm = {
        validate: jest.fn(() => {
          throw new InvalidProducerParamException('Farm inválida');
        }),
      } as unknown as Farm;

      expect(() => producer.addFarm(invalidFarm)).toThrow(
        InvalidProducerParamException,
      );
    });
  });

  describe('Update name', () => {
    it('should update name when valid', () => {
      const producer = Producer.create({
        document: validCPF,
        name: 'Old Name',
        password: validPassword,
      });

      producer.updateName('New Name');
      expect(producer.getName()).toBe('New Name');
    });

    it('should throw when updating name with empty or whitespace only', () => {
      const producer = Producer.create({
        document: validCPF,
        name: 'Old Name',
        password: validPassword,
      });

      expect(() => producer.updateName('')).toThrow(
        InvalidProducerParamException,
      );
      expect(() => producer.updateName('    ')).toThrow(
        InvalidProducerParamException,
      );
    });
  });

  describe('Restore producer', () => {
    it('should restore a producer with farms', () => {
      const producer = Producer.restore({
        id: 'some-id',
        document: validCPF,
        name: 'Restored Producer',
        password: validPassword,
        farms: [farm],
      });

      expect(producer.getFarms()).toHaveLength(1);
    });

    it('should restore a producer without farms', () => {
      const producer = Producer.restore({
        id: 'some-id',
        document: validCPF,
        name: 'Restored Producer',
        password: validPassword,
      });

      expect(producer.getFarms()).toHaveLength(0);
    });
  });
});
