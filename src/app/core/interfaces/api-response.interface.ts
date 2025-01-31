
export interface ApiResponse<T = any> {
    status: string;
    message: string;
    correlationId: string;
    timestamp: string;
    data: T
  }