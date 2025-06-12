import { DocumentValidatorFactory } from '../document-validator.factory';
import { CPF } from '../cpf';
import { CNPJ } from '../cnpj';
import { InvalidDocumentException } from '../../exception';

describe('DocumentValidatorFactory', () => {
  it('should create a valid CPF instance for 11-digit document', () => {
    const cpfString = '66452197096';
    const document = DocumentValidatorFactory.create(cpfString);

    expect(document).toBeInstanceOf(CPF);
  });

  it('should create a valid CNPJ instance for 14-digit document', () => {
    const cnpjString = '11444777000161';
    const document = DocumentValidatorFactory.create(cnpjString);

    expect(document).toBeInstanceOf(CNPJ);
  });

  it('should throw for invalid document', () => {
    const invalidDoc = '123456789';

    expect(() => DocumentValidatorFactory.create(invalidDoc)).toThrow(
      InvalidDocumentException,
    );
  });
});
