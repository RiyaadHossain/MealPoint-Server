export interface IGenericErrorMessage {
  path: string;
  message: string;
}

export interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
}
