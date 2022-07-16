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

const empQ = (roleChoices) => {
    [
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
            type: "input",
            name: "empRole",
            message: "What is the employee's role?"
        },
        {
            type: "input",
            name: "empManager",
            message: "Who is the employee's manager?"
        }
    ]
};

const empUpdateQ = [
    {
        type: "input",
        name: "empUpdate",
        message: "Which employee would you like to update?"
    },
    {
        type: "input",
        name: "empNewRole",
        message: "What is their new role?"
    }
]

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
                    inquirer.prompt(empUpdateQ)
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
    const sql = `SELECT * FROM employees`;

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
                console.log(depts);
                depts.forEach(element => {
                    if(answers.roleDept === element.dept) {
                        const dept_id = element.value;
                        console.log(dept_id);

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



// function addEmp() {
//     db.query(`SELECT job_title FROM roles`, (err, rows) => {
//         const roleChoices = rows.map(({ job_title }) => job_title);
//         console.log(roleChoices);

//         const newQ = empQ(roleChoices);

//         inquirer.prompt(newQ)
//         // .then(({first_name, last_name, role_id, manager_id}) => {
//         //     const sql = `INSERT INTO roles (first_name, last_name, role_id, manager_id)
//         //     VALUES (?,?,?,?)`;
//         //     const params = [first_name, last_name, role_id, manager_id]

//         //     db.query(sql, params, (err, rows) => {
//         //         if(err) {
//         //             console.log('DATABASE ERROR');
//         //             return;
//         //         }
//         //         console.log('Added ' + first_name + ' ' +last_name + ' to the database.');
//         //     });
//         // });
//     });
// };