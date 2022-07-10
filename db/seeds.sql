INSERT INTO employees (first_name, last_name, job_title, dept, salary, manager)
VALUES
  ('Alexandra', 'Summers', 'IT Manager', 'IT', 100000, NULL),
  ('Jay', 'Winston', 'Business Analyst', 'IT', 70000, "Alexandra Summers"),
  ('Arya', 'Cruz', 'Business Analyst', 'IT', 70000, "Alexandra Summers"),
  ('Kamal', 'Price', 'PMO Manager', 'EPMO', 110000, NULL),
  ('Derrick', 'Campbell', 'Project Manager', 'EPMO', 82000, "Kamal Price");


INSERT INTO roles (job_title, dept, salary)
VALUES
    ('IT Manager', 'IT', 100000),
    ('Business Analyst', 'IT', 70000),
    ('PMO Manager', 'EPMO', 110000),
    ('Project Manager', 'EPMO', 82000);


INSERT INTO departments (dept)
VALUES
    ('IT'),
    ('EPMO');