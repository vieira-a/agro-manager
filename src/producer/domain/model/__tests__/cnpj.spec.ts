import { CNPJ } from '../cnpj';
import { DocumentValidator } from '../document-validator.interface';

describe('CNPJ', () => {
  const validCNPJ = '12.345.678/0001-95';
  const normalizedCNPJ = '12345678000195';

  const mockValidator: DocumentValidator = {
    validate: jest.fn(() => true),
    format: jest.fn((value) => `formatted-${value}`),
  };

  it('should normalize the CNPJ value on construction', () => {
    const cnpj = new CNPJ(validCNPJ, mockValidator);
    expect(cnpj.toString()).toBe(normalizedCNPJ);
    expect(mockValidator.validate).toHaveBeenCalledWith(normalizedCNPJ);
  });

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
