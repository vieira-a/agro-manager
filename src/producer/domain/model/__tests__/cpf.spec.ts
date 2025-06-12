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

  it('should normalize the CPF value on construction', () => {
    const cpf = new CPF(validCPF, mockValidator);
    expect(cpf.toString()).toBe(normalizedCPF);
    expect(mockValidator.validate).toHaveBeenCalledWith(normalizedCPF);
  });

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

  it('should throw InvalidDocumentException for invalid CPF', () => {
    const invalidValidator: DocumentValidator = {
      validate: jest.fn(() => false),
    };

    expect(() => new CPF(validCPF, invalidValidator)).toThrow(
      InvalidDocumentException,
    );
  });
});
