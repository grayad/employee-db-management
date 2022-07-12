INSERT INTO departments (dept)
VALUES
    ('IT'),
    ('EPMO');

INSERT INTO roles (job_title, salary, dept_id)
VALUES
    ('IT Manager', 100000, 1),
    ('Business Analyst', 70000, 1),
    ('PMO Manager', 110000, 2),
    ('Project Manager', 82000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Alexandra', 'Summers', 1, NULL),
  ('Jay', 'Winston', 2, 1),
  ('Arya', 'Cruz', 2, 1),
  ('Kamal', 'Price', 3,  NULL),
  ('Derrick', 'Campbell', 4, 4);





