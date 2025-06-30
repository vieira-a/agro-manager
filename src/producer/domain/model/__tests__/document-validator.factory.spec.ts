import { DocumentValidatorFactory } from '../document-validator.factory';
import { CPF } from '../cpf';
import { CNPJ } from '../cnpj';
import { InvalidDocumentException } from '../../exception';

describe('DocumentValidatorFactory', () => {
  describe('Valid inputs', () => {
    it('should create a CPF instance for 11-digit unformatted document', () => {
      const cpf = DocumentValidatorFactory.create('66452197096');
      expect(cpf).toBeInstanceOf(CPF);
    });

    it('should create a CNPJ instance for 14-digit unformatted document', () => {
      const cnpj = DocumentValidatorFactory.create('11444777000161');
      expect(cnpj).toBeInstanceOf(CNPJ);
    });

    it('should create a CPF instance for formatted document', () => {
      const cpf = DocumentValidatorFactory.create('664.521.970-96');
      expect(cpf).toBeInstanceOf(CPF);
    });

    it('should create a CNPJ instance for formatted document', () => {
      const cnpj = DocumentValidatorFactory.create('11.444.777/0001-61');
      expect(cnpj).toBeInstanceOf(CNPJ);
    });
  });

  describe('Invalid inputs', () => {
    it('should throw for document with less than 11 or between 12-13 digits', () => {
      const invalidDocs = ['123456789', '123456789012', '1234567890123'];
      for (const doc of invalidDocs) {
        expect(() => DocumentValidatorFactory.create(doc)).toThrow(
          InvalidDocumentException,
        );
      }
    });

    it('should throw for document with more than 14 digits', () => {
      expect(() => DocumentValidatorFactory.create('123456789012345')).toThrow(
        InvalidDocumentException,
      );
    });

    it('should throw for document with only letters', () => {
      expect(() => DocumentValidatorFactory.create('abcdefghi')).toThrow(
        InvalidDocumentException,
      );
    });

    it('should throw when document is null, undefined or empty/whitespace', () => {
      const invalidInputs = [null, undefined, '', '   '];
      for (const input of invalidInputs) {
        expect(() => DocumentValidatorFactory.create(input as any)).toThrow(
          InvalidDocumentException,
        );
      }
    });
  });
});
