import { CNPJValidator } from '../cnpj.validator';

describe('CNPJValidator', () => {
  let validator: CNPJValidator;

  beforeEach(() => {
    validator = new CNPJValidator();
  });

  it('should validate a valid CNPJ', () => {
    const validCNPJ = '11444777000161';
    expect(validator.validate(validCNPJ)).toBe(true);
  });

  it('should invalidate an invalid CNPJ', () => {
    const invalidCNPJ = '11111111111111';
    expect(validator.validate(invalidCNPJ)).toBe(false);
  });

  it('should format the CNPJ correctly', () => {
    const rawCNPJ = '11444777000161';
    const formattedCNPJ = '11.444.777/0001-61';
    expect(validator.format(rawCNPJ)).toBe(formattedCNPJ);
  });
});
