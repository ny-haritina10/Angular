package mg.bici.back.services.employee;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import mg.bici.back.models.Employee;
import mg.bici.back.repositories.EmployeeRepository;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public Page<Employee> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }

    @Override
    public Page<Employee> getFilteredEmployees(LocalDate minHireDate, LocalDate maxHireDate, String name, Long departmentId, Pageable pageable) {
        return employeeRepository.findByFilters(minHireDate, maxHireDate, name, departmentId, pageable);
    }
}