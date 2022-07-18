// modules
const inquirer = require('inquirer');
require('console.table');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'HRsystem'
    },
    console.log('Connected to the election database.')
);

console.log('=================================')
console.log('Welcome to the Employee Database.')
console.log('=================================')

const initialQ = [
    {
        type: "list",
        name: "request",
        message: "What would you like to do? (Use arrow keys)",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee Role",
            "Quit"
        ]
    }
];

const deptQ = [
    {
        type: "input",
        name: "dept",
        message: "What is the department name?"
    }
];

const promptUser = () => {
    return new Promise((resolve, rej) => {

        inquirer.prompt(initialQ).then((answer) => {
            switch (answer.request){
                // View Depts
                case "View All Departments":
                    viewAllDepts();
                    break;

                // View Roles
                case "View All Roles":
                    viewAllRoles();
                    break;

                // View Emps
                case "View All Employees":
                    viewAllEmployees();
                    break;

                // Add Dept
                case "Add a Department":
                    addDept();
                    break;

                // Add a role
                case "Add a Role":
                    addRole();
                    break;

                // Add an Employee
                case "Add an Employee":
                    addEmp();
                    break;

                // Update an Employee
                case "Update an Employee Role":
                    updateEmp();
                    break;

                // Exit the application
                case "Quit":
                    console.log("Goodbye!");
                    process.exit();
            }
        });
    });
};

promptUser();


function viewAllEmployees() {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.job_title, departments.dept AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.dept_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;`;

    db.query(sql, (err, rows) => {
        if(err) {
            console.log('DATABASE ERROR');
            return;
        }
        console.table(rows);
        promptUser();
    });
};

function viewAllDepts() {
    const sql = `SELECT dept FROM departments`;

    db.query(sql, (err, rows) => {
        if(err) {
            console.log('DATABASE ERROR');
            return;
        }
        console.table(rows);
        promptUser();
    });
};

function viewAllRoles() {
    const sql = `SELECT * FROM departments
    INNER JOIN roles ON departments.id=dept_id;`;

    db.query(sql, (err, rows) => {
        if(err) {
            console.log('DATABASE ERROR');
            return;
        }
        console.table(rows);
        promptUser();
    });
}

// Add a New Department to the database
function addDept() {
    inquirer.prompt(deptQ).then((answer) => {
        const sql = `INSERT INTO departments (dept)
        VALUES (?)`;

        db.query(sql, answer.dept, (err, rows) => {
            if(err) {
                console.log('DATABASE ERROR');
                return;
            }
            console.log('Added ' + answer.dept + ' to the database.');
            viewAllDepts();
            promptUser();
        });
    });
};

// Add a New Role to the database
function addRole() {
    const deptArr = [];
    db.query(`SELECT dept FROM departments`, (err, results) => {
        if(err) throw err;
        results.map((dept) => {
            deptArr.push(dept.dept)
        });
    });
    inquirer
        .prompt([
        {
            type: "input",
            name: "role",
            message: "What is the job title?",
        },
        {
            type: "list",
            name: "roleDept",
            message: "What department does this role belong to?",
            choices: deptArr,
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?",
        },
        ])
        .then((answers) => {
            db.query("SELECT id, dept FROM departments", (err, rows) => {
                const depts = rows.map((row) => {
                  return { value: row.id, dept: row.dept };
                });

                // compare user answer to dept data to get dept_id
                depts.forEach(element => {
                    if(answers.roleDept === element.dept) {
                        const dept_id = element.value;


                        const sql = `INSERT INTO roles (job_title, salary, dept_id)
                        VALUES (?,?,?)`;
                        const params = [answers.role, answers.salary, dept_id]

                        db.query(sql, params, (err, rows) => {
                            if(err) {
                                console.log('DATABASE ERROR');
                                return;
                            }
                            console.log('Added ' + answers.role + ' to the database.');
                            viewAllRoles();
                            promptUser();
                        });
                    }
                });
            });
        })
};

// Add an Employee to the database
function addEmp() {
    const roleArr = [];
    db.query(`SELECT job_title FROM roles`, (err, results) => {
        if(err) throw err;
        results.map((role) => {
            roleArr.push(role.job_title)
        });
    });
    const managerArr = [];
    db.query(`SELECT first_name, last_name FROM employees`, (err, results) => {
        if(err) throw err;
        results.map((manager) => {
            managerArr.push(manager.first_name + ' ' +manager.last_name);
        });
    });

    // placeholder global variables to change on user input
    var role_id = 0;
    var manager_id = 0;

    inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "empRole",
                message: "What is the employee's role?",
                choices: roleArr
            },
            {
                type: "list",
                name: "empManager",
                message: "Who is the employee's manager?",
                choices: managerArr
            }
        ]).then((answers) => {
            db.query("SELECT id, job_title FROM roles", (err, rows) => {
                const roles = rows.map((row) => {
                  return { value: row.id, role: row.job_title };
                });
                // compare user answer to role data to get role_id
                roles.forEach(element => {
                    if(answers.empRole === element.role) {
                        role_id = element.value;
                    }
                })
            });
            db.query("SELECT id, first_name, last_name FROM employees", (err, rows) => {
                const managers = rows.map((row) => {
                  return { value: row.id, fn: row.first_name, ln: row.last_name };
                });
                // compare user answer to employee data to get manager_id
                managers.forEach(element => {
                    if(answers.empManager === element.fn + ' ' +element.ln) {
                        manager_id = element.value;
                    }
                })
                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES (?,?,?,?)`;
                const params = [answers.firstName, answers.lastName, role_id, manager_id]

                db.query(sql, params, (err, rows) => {
                    if(err) {
                        console.log('DATABASE ERROR');
                        return;
                    }
                    console.log('Added ' + answers.firstName + ' ' +answers.lastName + ' to the database.');

                    viewAllEmployees();
                    promptUser();
                });
            });
        });
};

// Update an Employee's Role
function updateEmp() {
    const roleArr = [];
    db.query(`SELECT job_title FROM roles`, (err, results) => {
        if(err) throw err;
        results.map((role) => {
            roleArr.push(role.job_title)
        });
    });
    const employeeArr = [];
    db.query(`SELECT first_name, last_name FROM employees`, (err, results) => {
        if(err) throw err;
        results.map((employee) => {
            employeeArr.push(employee.first_name + ' ' +employee.last_name);
        });
    });

    // placeholder global variables to change on user input
    var role_id = 0;
    var employee_id = 0;
    console.log(employeeArr);
    console.log(roleArr);
    inquirer
        .prompt([
            {
                type: "list",
                name: "empUpdate",
                message: "Which employee would you like to update?",
                choices: employeeArr
            },
            {
                type: "list",
                name: "empNewRole",
                message: "What is their new role?",
                choices: roleArr
            }
        ]);
};