package mg.bici.back.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import mg.bici.back.models.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Page<Employee> findAll(Pageable pageable);
}
