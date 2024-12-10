export function createResponse(status: string, message: string, data: any) {
    return {
      status,
      message,
      data,
    };
  }