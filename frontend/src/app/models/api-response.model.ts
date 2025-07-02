export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: Page<T>;
  timestamp: string;
}