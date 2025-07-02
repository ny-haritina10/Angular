import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  page = 0;
  size = 5;
  totalPages = 0;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees(this.page, this.size).subscribe({
      next: (response) => {
        this.employees = response.data.content;
        this.totalPages = response.data.totalPages;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadEmployees();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadEmployees();
    }
  }
}