import { DocumentValidatorFactory } from '../document-validator.factory';
import { CPF } from '../cpf';

describe('DocumentValidatorFactory', () => {
  it('should create a valid CPF instance for 11-digit document', () => {
    const cpfString = '66452197096';
    const document = DocumentValidatorFactory.create(cpfString);

    expect(document).toBeInstanceOf(CPF);
  });
});
