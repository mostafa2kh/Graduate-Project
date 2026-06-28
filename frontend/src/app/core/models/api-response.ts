export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errorCode: string;
  details: ErrorDetail[];
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
  };
  timestamp: string;
  path: string;
}
