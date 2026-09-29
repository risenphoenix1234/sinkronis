export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string | null;
  validationErrors?: unknown;
  metadata?: Record<string, unknown>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
