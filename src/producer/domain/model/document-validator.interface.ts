export interface DocumentValidator {
  validate(value: string): boolean;
  format?(value: string): string;
}
