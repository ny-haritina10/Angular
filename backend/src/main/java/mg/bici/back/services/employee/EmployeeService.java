package mg.bici.back.services.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mg.bici.back.models.Employee;

public interface EmployeeService {
    Page<Employee> getAllEmployees(Pageable pageable);
}
