package mg.bici.back.controllers;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mg.bici.back.api.ApiResponse;
import mg.bici.back.models.Employee;
import mg.bici.back.services.employee.EmployeeService;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Employee>>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") String size,
            @RequestParam(required = false) LocalDate minHireDate,
            @RequestParam(required = false) LocalDate maxHireDate,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long departmentId) {
   
        try {
            int pageSize = Integer.parseInt(size.trim());
            
            if (pageSize <= 0) {
                pageSize = 10;
            }

            Pageable pageable = PageRequest.of(page, pageSize);
            Page<Employee> employees;
            
            if (minHireDate != null || maxHireDate != null || name != null || departmentId != null) {
                employees = employeeService.getFilteredEmployees(minHireDate, maxHireDate, name, departmentId, pageable);
            } else {
                employees = employeeService.getAllEmployees(pageable);
            }
            
            return ResponseEntity.ok(ApiResponse.success(employees, "Employees retrieved successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid parameters"));
        }
    }
}