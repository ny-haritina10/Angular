import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiResponse, Department, Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  standalone: true,
  selector: 'app-employee-list',
  template: `
    <!-- Filter Form -->
    <form [formGroup]="filterForm" class="filter-form">
      <div class="filter-group">
        <label for="name">Name</label>
        <input id="name" formControlName="name" type="text" placeholder="Search by name" aria-label="Filter by name" />
      </div>
      <div class="filter-group">
        <label for="minHireDate">Min Hire Date</label>
        <input id="minHireDate" formControlName="minHireDate" type="date" aria-label="Filter by minimum hire date" />
      </div>
      <div class="filter-group">
        <label for="maxHireDate">Max Hire Date</label>
        <input id="maxHireDate" formControlName="maxHireDate" type="date" aria-label="Filter by maximum hire date" />
      </div>
      <div class="filter-group">
        <label for="department">Department</label>
        <select id="department" formControlName="departmentId" aria-label="Filter by department">
          <option value="">All Departments</option>
          @for (dept of departments; track dept.departmentId) {
            <option [value]="dept.departmentId">{{ dept.departmentName }}</option>
          }
        </select>
      </div>
    </form>

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
              <td>{{ employee.hireDate | date: 'mediumDate' }}</td>
              <td>{{ employee.department.departmentName }}</td>
            </tr>
          }
        </tbody>
      </table>

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
    .filter-form {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
    }
    .filter-group label {
      margin-bottom: 0.25rem;
    }
    .filter-group input, .filter-group select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
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
  imports: [DatePipe, ReactiveFormsModule],
})
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly fb = inject(FormBuilder);

  // Signals for state management
  employees = signal<Employee[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(1);
  pageSizeOptions = [5, 10, 20];

  // Static departments (replace with API call if available)
  departments: Department[] = [
    { departmentId: 1, departmentName: 'Engineering', createdAt: '', updatedAt: '' },
    { departmentId: 2, departmentName: 'Human Resources', createdAt: '', updatedAt: '' },
    { departmentId: 3, departmentName: 'Finance', createdAt: '', updatedAt: '' },
    { departmentId: 4, departmentName: 'Marketing', createdAt: '', updatedAt: '' },
    { departmentId: 5, departmentName: 'Sales', createdAt: '', updatedAt: '' },
  ];

  // Filter form
  filterForm = this.fb.group({
    name: [''],
    minHireDate: [''],
    maxHireDate: [''],
    departmentId: [''],
  });

  // Computed signal for disabling buttons
  isFirstPage = computed(() => this.currentPage() === 0);
  isLastPage = computed(() => this.currentPage() === this.totalPages() - 1);

  constructor() {
    this.fetchEmployees();
    // Subscribe to form changes with debounce
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage.set(0); // Reset to first page on filter change
      this.fetchEmployees();
    });
  }

  private fetchEmployees(): void {
    this.isLoading.set(true);
    const filters = {
      minHireDate: this.filterForm.get('minHireDate')?.value || undefined,
      maxHireDate: this.filterForm.get('maxHireDate')?.value || undefined,
      name: this.filterForm.get('name')?.value || undefined,
      departmentId: this.filterForm.get('departmentId')?.value ? Number(this.filterForm.get('departmentId')?.value) : undefined,
    };

    this.employeeService
      .getEmployees(this.currentPage(), this.pageSize(), filters)
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
    this.currentPage.set(0); // Reset to first page on size change
    this.fetchEmployees();
  }
}