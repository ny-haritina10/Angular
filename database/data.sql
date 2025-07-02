-- Inserting sample data into departments table
INSERT INTO departments (department_name) VALUES
('Engineering'),
('Human Resources'),
('Finance'),
('Marketing'),
('Sales');

-- Inserting sample data into employees table
INSERT INTO employees (first_name, last_name, email, hire_date, department_id) VALUES
('John', 'Doe', 'john.doe@example.com', '2023-01-15', 1),
('Jane', 'Smith', 'jane.smith@example.com', '2022-06-20', 2),
('Michael', 'Brown', 'michael.brown@example.com', '2021-09-10', 3),
('Emily', 'Davis', 'emily.davis@example.com', '2023-03-05', 4),
('William', 'Wilson', 'william.wilson@example.com', '2022-11-01', 5),
('Sarah', 'Johnson', 'sarah.johnson@example.com', '2023-02-14', 1),
('David', 'Lee', 'david.lee@example.com', '2021-12-01', 2),
('Lisa', 'Anderson', 'lisa.anderson@example.com', '2022-08-15', 3),
('James', 'Taylor', 'james.taylor@example.com', '2023-04-20', 4),
('Emma', 'Martinez', 'emma.martinez@example.com', '2022-07-10', 5);

-- Inserting sample data into salaries table
INSERT INTO salaries (employee_id, base_salary, effective_date, end_date) VALUES
(1, 75000.00, '2023-01-15', NULL),
(2, 65000.00, '2022-06-20', NULL),
(3, 80000.00, '2021-09-10', NULL),
(4, 60000.00, '2023-03-05', NULL),
(5, 70000.00, '2022-11-01', NULL),
(6, 72000.00, '2023-02-14', NULL),
(7, 68000.00, '2021-12-01', NULL),
(8, 82000.00, '2022-08-15', NULL),
(9, 63000.00, '2023-04-20', NULL),
(10, 71000.00, '2022-07-10', NULL);

-- Inserting sample data into payment_history table
INSERT INTO payment_history (employee_id, amount_paid, payment_date, payment_type, description) VALUES
(1, 6250.00, '2025-01-31', 'SALARY', 'January 2025 salary payment'),
(1, 1000.00, '2025-01-15', 'BONUS', 'Performance bonus Q4 2024'),
(2, 5416.67, '2025-01-31', 'SALARY', 'January 2025 salary payment'),
(3, 6666.67, '2025-01-31', 'SALARY', 'January 2025 salary payment'),
(3, 500.00, '2025-01-20', 'OVERTIME', 'Overtime payment for project deadline'),
(4, 5000.00, '2025-01-31', 'SALARY', 'January 2025 salary payment'),
(5, 5833.33, '2025-01-31', 'SALARY', 'January 2025 salary payment'),
(5, 200.00, '2025-01-25', 'DEDUCTION', 'Health insurance deduction'),
(6, 6000.00, '2025-01-31', 'SALARY', 'January 2025 salary payment'),
(6, 1500.00, '2025-01-15', 'BONUS', 'Team performance bonus'),
(7, 5666.67, '2025-01-31', 'SALARY', 'January 2025 salary payment'),
(8, 6833.33, '2025-01-31', 'SALARY', 'January 2025 salary payment'),
(9, 5250.00, '2025-01-31', 'SALARY', 'January 2025 salary payment'),
(10, 5916.67, '2025-01-31', 'SALARY', 'January 2025 salary payment'),
(10, 750.00, '2025-01-15', 'BONUS', 'Sales target achievement bonus');