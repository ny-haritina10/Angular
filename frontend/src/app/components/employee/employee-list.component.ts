import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ApiResponse, Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  standalone: true,
  selector: 'app-employee-list',
  template: `
    @if (isLoading()) {
      <p>Loading employees...</p>
    } @else if (error()) {
      <p class="error" role="alert">{{ error() }}</p>
    } @else {
      <table role="grid">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Hire Date</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          @for (employee of employees(); track employee.employeeId) {
            <tr>
              <td>{{ employee.firstName }} {{ employee.lastName }}</td>
              <td>{{ employee.email }}</td>
              <td>{{ employee.hireDate }}</td>
              <td>{{ employee.department.departmentName }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: `
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .error {
      color: red;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})

export class EmployeeListComponent {
  
  private readonly employeeService = inject(EmployeeService);

  // Signals for state management
  employees = signal<Employee[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.fetchEmployees();
  }

  private fetchEmployees(): void {
    this.employeeService
      .getEmployees()
      .pipe(
        catchError((err) => {
          this.error.set('Failed to load employees. Please try again later.');
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe((response: ApiResponse | null) => {  
        this.isLoading.set(false);
        if (response?.success) {
          this.employees.set(response.data.content);
        }
      });
  }
}