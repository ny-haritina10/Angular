export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  department?: {
    departmentId: number;
    departmentName: string;
  };
  createdAt?: string;
  updatedAt?: string;
}