-- Creating the departments table to store department information
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating the employees table to store employee information
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    department_id INTEGER REFERENCES departments(department_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating the salaries table to store employee salary information
CREATE TABLE salaries (
    salary_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id),
    base_salary DECIMAL(10,2) NOT NULL CHECK (base_salary >= 0),
    effective_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating the payment_history table to track salary payments
CREATE TABLE payment_history (
    payment_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id),
    amount_paid DECIMAL(10,2) NOT NULL CHECK (amount_paid >= 0),
    payment_date DATE NOT NULL,
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('SALARY', 'BONUS', 'OVERTIME', 'DEDUCTION')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating indexes for better query performance
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_salary_employee_id ON salaries(employee_id);
CREATE INDEX idx_payment_employee_id ON payment_history(employee_id);
CREATE INDEX idx_payment_date ON payment_history(payment_date);

-- Creating a trigger function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Creating triggers for updating timestamps
CREATE TRIGGER update_departments_timestamp
    BEFORE UPDATE ON departments
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_employees_timestamp
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_salaries_timestamp
    BEFORE UPDATE ON salaries
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();