export interface IResponseHandler {
  success: boolean;
  data: any | null;
  message: string | string[];
}

export class ResponseHandler {
  public static success<T>(data?: T, message: string = "Success") {
    return {
      success: true,
      data: data ?? null,
      message,
    };
  }

  public static error<T>(message: string | string[] | any, data?: T) {
    const messageFormatted = Array.isArray(message) ? message : [message]
    return {
      success: false,
      data: data ?? null,
      message: messageFormatted,
    };
  }
}
