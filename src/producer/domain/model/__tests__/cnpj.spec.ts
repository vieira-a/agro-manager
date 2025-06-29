import { CNPJ } from '../cnpj';
import { InvalidDocumentException } from '../../exception';
import { DocumentValidator } from '../document-validator.interface';

describe('CNPJ', () => {
  const validCNPJ = '12.345.678/0001-95';
  const normalizedCNPJ = '12345678000195';

  const mockValidator: DocumentValidator = {
    validate: jest.fn(() => true),
    format: jest.fn((value) => `formatted-${value}`),
  };

  describe('Construction and normalization', () => {
    it('should normalize the CNPJ value on construction', () => {
      const cnpj = new CNPJ(validCNPJ, mockValidator);
      expect(cnpj.toString()).toBe(normalizedCNPJ);
      expect(mockValidator.validate).toHaveBeenCalledWith(normalizedCNPJ);
    });

    it('should throw InvalidDocumentException for invalid CNPJ', () => {
      const invalidValidator: DocumentValidator = {
        validate: jest.fn(() => false),
      };

      expect(() => new CNPJ(validCNPJ, invalidValidator)).toThrow(
        InvalidDocumentException,
      );
    });

    it('should handle CNPJ input with symbols and spaces', () => {
      const messyInput = ' 12.345.678/0001-95 ';
      const validator: DocumentValidator = {
        validate: jest.fn(() => true),
      };

      const cnpj = new CNPJ(messyInput, validator);
      expect(cnpj.toString()).toBe(normalizedCNPJ);
    });

    it('should throw when CNPJ has only letters', () => {
      const validator: DocumentValidator = {
        validate: jest.fn(() => false),
      };

      expect(() => new CNPJ('abcdefghijklm', validator)).toThrow(
        InvalidDocumentException,
      );
    });

    it('should throw when CNPJ is empty, null or undefined', () => {
      const invalidInputs = [undefined, null, '', '   '];

      for (const input of invalidInputs) {
        const validator: DocumentValidator = {
          validate: jest.fn(() => false),
        };

        expect(() => new CNPJ(input as any, validator)).toThrow(
          InvalidDocumentException,
        );
      }
    });

    it('should throw when CNPJ has more than 14 digits', () => {
      const validator: DocumentValidator = {
        validate: jest.fn(() => false),
      };

      const longCNPJ = '123456789012345';

      expect(() => new CNPJ(longCNPJ, validator)).toThrow(
        InvalidDocumentException,
      );
    });
  });

  describe('Format behavior', () => {
    it('should format the CNPJ if format method is available', () => {
      const cnpj = new CNPJ(validCNPJ, mockValidator);
      expect(cnpj.format()).toBe(`formatted-${normalizedCNPJ}`);
    });

    it('should return raw value in format if format method is not provided', () => {
      const validatorWithoutFormat: DocumentValidator = {
        validate: jest.fn(() => true),
      };

      const cnpj = new CNPJ(validCNPJ, validatorWithoutFormat);
      expect(cnpj.format()).toBe(normalizedCNPJ);
    });
  });

  describe('Serialization', () => {
    it('should return raw value when serialized with toJSON', () => {
      const cnpj = new CNPJ(validCNPJ, mockValidator);
      expect(cnpj.toJSON()).toBe(normalizedCNPJ);
    });
  });
});
