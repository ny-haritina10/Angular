export interface Department {
  departmentId: number;
  departmentName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  department: Department;
  createdAt: string;
  updatedAt: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    content: Employee[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
  timestamp: string;
}