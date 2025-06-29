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

  it('should throw when document is null, undefined or empty', () => {
    const invalidInputs = [undefined, null, '', '   '];

    for (const input of invalidInputs) {
      expect(() => DocumentValidatorFactory.create(input as any)).toThrow(
        InvalidDocumentException,
      );
    }
  });

  it('should create CPF for formatted string with special characters', () => {
    const document = '664.521.970-96';
    const result = DocumentValidatorFactory.create(document);
    expect(result).toBeInstanceOf(CPF);
  });

  it('should create CNPJ for formatted string with special characters', () => {
    const document = '11.444.777/0001-61';
    const result = DocumentValidatorFactory.create(document);
    expect(result).toBeInstanceOf(CNPJ);
  });

  it('should throw when document has more than 14 digits', () => {
    const longDoc = '123456789012345';
    expect(() => DocumentValidatorFactory.create(longDoc)).toThrow(
      InvalidDocumentException,
    );
  });

  it('should throw when document has only letters', () => {
    expect(() => DocumentValidatorFactory.create('abcdefghi')).toThrow(
      InvalidDocumentException,
    );
  });
});
