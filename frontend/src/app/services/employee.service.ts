import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/employees';

  getEmployees(page: number = 0, size: number = 10): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }
}