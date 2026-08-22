export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata?: Record<string, any>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}