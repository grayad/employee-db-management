DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

CREATE TABLE employees (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  job_title VARCHAR(30) NOT NULL,
  dept VARCHAR(30) NOT NULL,
  salary INTEGER NOT NULL,
  manager VARCHAR(30) NULL
);

CREATE TABLE roles(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(30) NOT NULL,
    dept VARCHAR(30) NOT NULL,
    salary VARCHAR(30) NOT NULL
);

CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    dept VARCHAR(30) NOT NULL
);