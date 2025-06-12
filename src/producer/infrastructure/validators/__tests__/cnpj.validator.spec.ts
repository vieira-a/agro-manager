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
});
