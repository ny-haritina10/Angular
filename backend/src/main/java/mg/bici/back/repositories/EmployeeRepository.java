package mg.bici.back.repositories;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mg.bici.back.models.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // Solution 2: Native query with explicit casting (if you prefer native SQL)
    @Query(value = "SELECT * FROM employees e WHERE " +
           "(:minHireDate IS NULL OR e.hire_date >= CAST(:minHireDate AS DATE)) AND " +
           "(:maxHireDate IS NULL OR e.hire_date <= CAST(:maxHireDate AS DATE)) AND " +
           "(:name IS NULL OR LOWER(e.first_name) LIKE LOWER('%' || :name || '%') OR LOWER(e.last_name) LIKE LOWER('%' || :name || '%')) AND " +
           "(:departmentId IS NULL OR e.department_id = :departmentId)",
           countQuery = "SELECT COUNT(*) FROM employees e WHERE " +
           "(:minHireDate IS NULL OR e.hire_date >= CAST(:minHireDate AS DATE)) AND " +
           "(:maxHireDate IS NULL OR e.hire_date <= CAST(:maxHireDate AS DATE)) AND " +
           "(:name IS NULL OR LOWER(e.first_name) LIKE LOWER('%' || :name || '%') OR LOWER(e.last_name) LIKE LOWER('%' || :name || '%')) AND " +
           "(:departmentId IS NULL OR e.department_id = :departmentId)",
           nativeQuery = true)
    Page<Employee> findByFilters(
        @Param("minHireDate") LocalDate minHireDate,
        @Param("maxHireDate") LocalDate maxHireDate,
        @Param("name") String name,
        @Param("departmentId") Long departmentId,
        Pageable pageable);
}