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
});
