import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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

      <br>

      <!-- Pagination Controls -->
      <div class="pagination" role="navigation" aria-label="Pagination">
        <button
          [disabled]="currentPage() === 0"
          [class.disabled]="currentPage() === 0"
          (click)="changePage(currentPage() - 1)"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span>Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
        <button
          [disabled]="currentPage() === totalPages() - 1"
          [class.disabled]="currentPage() === totalPages() - 1"
          (click)="changePage(currentPage() + 1)"
          aria-label="Next page"
        >
          Next
        </button>
        <label for="pageSize">Items per page:</label>
        <select
          id="pageSize"
          [value]="pageSize()"
          (change)="changePageSize($event)"
          aria-label="Select items per page"
        >
          @for (size of pageSizeOptions; track size) {
            <option [value]="size">{{ size }}</option>
          }
        </select>
      </div>
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
    .pagination {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    button.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    select {
      padding: 0.5rem;
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

  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(1);
  pageSizeOptions = [5, 10, 20];


  // Computed signal for disabling buttons
  isFirstPage = computed(() => this.currentPage() === 0);
  isLastPage = computed(() => this.currentPage() === this.totalPages() - 1);

  constructor() {
    this.fetchEmployees();
  }

  private fetchEmployees(): void {
    this.employeeService
      .getEmployees(this.currentPage(), this.pageSize())
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
          this.totalPages.set(response.data.totalPages);
        }
      });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.fetchEmployees();
    }
  }

  changePageSize(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const size = selectElement.value;
    
    this.pageSize.set(Number(size));
    this.currentPage.set(0);
    this.fetchEmployees();
  }
}