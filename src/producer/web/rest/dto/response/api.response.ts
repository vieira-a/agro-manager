export class ApiResponse<T> {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: T;

  constructor(statusCode: number, data?: T, message?: string) {
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.message = message;
  }
}
