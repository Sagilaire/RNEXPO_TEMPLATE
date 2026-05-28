/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/** Pagination parameters for list queries */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Utility: T | null | undefined */
export type Maybe<T> = T | null | undefined;
