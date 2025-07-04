import { CPF } from '../cpf';
import { InvalidDocumentException } from '../../exception';
import { DocumentValidator } from '../document-validator.interface';

describe('CPF', () => {
  const validCPF = '123.456.789-09';
  const normalizedCPF = '12345678909';

  const mockValidator: DocumentValidator = {
    validate: jest.fn(() => true),
    format: jest.fn((value) => `formatted-${value}`),
  };

  describe('Construction and normalization', () => {
    it('should normalize the CPF value on construction', () => {
      const cpf = new CPF(validCPF, mockValidator);
      expect(cpf.toString()).toBe(normalizedCPF);
      expect(mockValidator.validate).toHaveBeenCalledWith(normalizedCPF);
    });

    it('should throw InvalidDocumentException for invalid CPF', () => {
      const invalidValidator: DocumentValidator = {
        validate: jest.fn(() => false),
      };

      expect(() => new CPF(validCPF, invalidValidator)).toThrow(
        InvalidDocumentException,
      );
    });

    it('should handle CPF input with only letters as invalid', () => {
      const invalidInput = 'abcdefghijk';
      const validator: DocumentValidator = {
        validate: jest.fn(() => false),
      };

      expect(() => new CPF(invalidInput, validator)).toThrow(
        InvalidDocumentException,
      );
    });

    it('should handle CPF input with symbols and spaces', () => {
      const messyInput = ' 123.456-789 09 ';
      const validator: DocumentValidator = {
        validate: jest.fn(() => true),
      };

      const cpf = new CPF(messyInput, validator);
      expect(cpf.toString()).toBe(normalizedCPF);
    });

    it('should throw InvalidDocumentException when CPF is null, undefined or empty', () => {
      const invalidInputs = [null, undefined, ''];
      const invalidValidator: DocumentValidator = {
        validate: jest.fn(() => false),
      };

      for (const input of invalidInputs) {
        expect(() => new CPF(input as any, invalidValidator)).toThrow(
          InvalidDocumentException,
        );
      }
    });

    it('should throw InvalidDocumentException for CPF with more than 11 digits', () => {
      const input = '123456789012';
      const validator: DocumentValidator = {
        validate: jest.fn(() => false),
      };

      expect(() => new CPF(input, validator)).toThrow(InvalidDocumentException);
    });
  });

  describe('Format behavior', () => {
    it('should format the CPF if format method is available', () => {
      const cpf = new CPF(validCPF, mockValidator);
      expect(cpf.format()).toBe(`formatted-${normalizedCPF}`);
    });

    it('should return raw value in format if format method is not provided', () => {
      const validatorWithoutFormat: DocumentValidator = {
        validate: jest.fn(() => true),
      };

      const cpf = new CPF(validCPF, validatorWithoutFormat);
      expect(cpf.format()).toBe(normalizedCPF);
    });
  });

  describe('Serialization', () => {
    it('should return raw value when serialized with toJSON', () => {
      const cpf = new CPF(validCPF, mockValidator);
      expect(cpf.toJSON()).toBe(normalizedCPF);
    });
  });
});
