import { CPFValidator } from '../cpf.validator';

describe('CPFValidator', () => {
  let validator: CPFValidator;

  beforeEach(() => {
    validator = new CPFValidator();
  });

  it('should validate a valid CPF', () => {
    const validCPF = '66452197096';
    expect(validator.validate(validCPF)).toBe(true);
  });
});
