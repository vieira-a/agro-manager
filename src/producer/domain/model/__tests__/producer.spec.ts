import { DocumentValidatorFactory } from '../document-validator.factory';
import { Farm } from '../farm';
import { Producer } from '../producer';
import { Crop } from '../crop';
import { Harvest } from '../harvest';
import { InvalidProducerParamException } from '../../exception';
import { Password } from '../password';
import { PasswordFactory } from '../password.factory';
import { EncryptPassword } from '../encrypt-password';
import { ProducerRole } from '../../enum/producer-role.enum';

describe('Producer', () => {
  const validCPF = DocumentValidatorFactory.create('66452197096');
  const validCNPJ = DocumentValidatorFactory.create('11444777000161');

  let validDefaultPFProducerProps;
  let validDefaultPJProducerProps;
  let validPassword: Password;
  let validCrop: Crop;
  let validHarvest: Harvest;
  let validFarm: Farm;

  beforeAll(async () => {
    const passwordFactory = new PasswordFactory(new EncryptPassword());
    validPassword = await passwordFactory.create('P@ssword10');

    validCrop = Crop.create({ name: 'Milho' });

    validHarvest = Harvest.create({
      description: 'Safra 2024',
      year: 2024,
      crop: validCrop,
    });

    validFarm = Farm.create({
      name: 'Fazenda Teste',
      city: 'Cidade Teste',
      state: 'Estado Teste',
      totalArea: 100,
      agriculturalArea: 50,
      vegetationArea: 30,
      harvests: [validHarvest],
    });

    validDefaultPFProducerProps = {
      document: validCPF,
      name: 'John Doe',
      role: ProducerRole.PRODUCER_USER,
      password: validPassword,
      farms: [validFarm],
    };

    validDefaultPJProducerProps = {
      document: validCNPJ,
      name: 'John Doe',
      role: ProducerRole.PRODUCER_USER,
      password: validPassword,
      farms: [validFarm],
    };
  });

  describe('Creation and validation', () => {
    it('should create a valid Producer with valid CPF and all nested entities', () => {
      const producer = Producer.create(validDefaultPFProducerProps);
      expect(producer).toBeInstanceOf(Producer);
    });

    it('should create a Producer with valid CNPJ document and Farm', () => {
      const producer = Producer.create(validDefaultPJProducerProps);
      expect(producer).toBeInstanceOf(Producer);
    });

    it('should throw if name is empty', () => {
      expect(() =>
        Producer.create({ ...validDefaultPFProducerProps, name: '' }),
      ).toThrow(InvalidProducerParamException);
    });

    it('should throw InvalidProducerParamException if name is only whitespace or invisible characters', () => {
      const invalidNames = ['   ', '\t', '\n', ' \t\n '];

      invalidNames.forEach((invalidName) => {
        expect(() =>
          Producer.create({
            ...validDefaultPFProducerProps,
            name: invalidName,
          }),
        ).toThrow(InvalidProducerParamException);
      });
    });

    it('should throw if document is null', () => {
      expect(() =>
        Producer.create({ ...validDefaultPFProducerProps, document: null }),
      ).toThrow(InvalidProducerParamException);
    });

    it('should throw if document is undefined', () => {
      expect(() =>
        Producer.create({
          ...validDefaultPFProducerProps,
          document: undefined as any,
        }),
      ).toThrow(InvalidProducerParamException);
    });

    it('should throw InvalidProducerParamException if password is null or undefined', () => {
      const invalidPasswords = [null, undefined];

      for (const pwd of invalidPasswords) {
        expect(() =>
          Producer.create({
            ...validDefaultPFProducerProps,
            password: pwd as any,
          }),
        ).toThrow(InvalidProducerParamException);
      }
    });

    it('should throw InvalidProducerParamException when creating producer with invalid farms', () => {
      const invalidFarm = null;
      expect(() =>
        Producer.create({
          ...validDefaultPFProducerProps,
          farms: [invalidFarm as any],
        }),
      ).toThrow(InvalidProducerParamException);
    });
  });

  describe('Farm management', () => {
    it('should allow adding a farm to an existing producer', () => {
      const producer = Producer.create({
        ...validDefaultPFProducerProps,
        farms: null,
      });

      producer.addFarm(validFarm);

      expect(producer.getFarms()).toHaveLength(1);
      expect(producer.getFarms()[0]).toBe(validFarm);
    });

    it('should throw if trying to add an invalid farm', () => {
      const producer = Producer.create({ ...validDefaultPFProducerProps });

      expect(() => producer.addFarm(null as any)).toThrow(
        InvalidProducerParamException,
      );
    });

    it('should throw when adding a farm that fails validation', () => {
      const producer = Producer.create({ ...validDefaultPFProducerProps });

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
        ...validDefaultPFProducerProps,
        name: 'Old Name',
      });

      producer.updateName('New Name');
      expect(producer.getName()).toBe('New Name');
    });

    it('should throw when updating name with empty or whitespace only', () => {
      const producer = Producer.create({
        ...validDefaultPFProducerProps,
        name: 'Old Name',
      });

      expect(() => producer.updateName('')).toThrow(
        InvalidProducerParamException,
      );
      expect(() => producer.updateName('    ')).toThrow(
        InvalidProducerParamException,
      );
    });

    it('should throw when updating name with null or undefined', () => {
      const producer = Producer.create({
        ...validDefaultPFProducerProps,
        name: 'Old Name',
      });

      const invalidNames = [null, undefined];

      invalidNames.forEach((name) => {
        expect(() => producer.updateName(name as any)).toThrow(
          InvalidProducerParamException,
        );
      });
    });
  });

  describe('Restore producer', () => {
    it('should restore a producer with farms', () => {
      const producer = Producer.restore({
        id: 'some-id',
        document: validCPF,
        name: 'Restored Producer',
        password: validPassword,
        role: ProducerRole.PRODUCER_USER,
        farms: [validFarm],
      });

      expect(producer.getFarms()).toHaveLength(1);
    });

    it('should restore a producer without farms', () => {
      const producer = Producer.restore({
        id: 'some-id',
        document: validCPF,
        name: 'Restored Producer',
        role: ProducerRole.PRODUCER_USER,
        password: validPassword,
      });

      expect(producer.getFarms()).toHaveLength(0);
    });
  });
});
