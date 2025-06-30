export interface Encrypter {
  encrypt(plainText: string): Promise<string>;
  matches(plainText: string, hashed: string): Promise<boolean>;
}
