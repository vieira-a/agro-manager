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

  it('should invalidate an invalid CPF', () => {
    const invalidCPF = '11111111111';
    expect(validator.validate(invalidCPF)).toBe(false);
  });

  it('should format the CPF correctly', () => {
    const rawCPF = '52998224725';
    const formattedCPF = '529.982.247-25';
    expect(validator.format(rawCPF)).toBe(formattedCPF);
  });
});
