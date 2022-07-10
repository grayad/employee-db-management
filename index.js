// modules
const inquirer = require('inquirer');
const cTable = require('console.table');
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


var deptArray = ["testDept", "test2", "test3"];
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
            "Update an Employee Role"
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

const roleQ = [
    {
        type: "input",
        name: "role",
        message: "What is the job title?"
    },
    {
        type: "list",
        name: "roleDept",
        message: "What department does this role belong to?",
        choices: deptArray
    },
    {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?"
    }
];

const empQ = [
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
];

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
    inquirer.prompt(initialQ).then(answer => {
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
                inquirer.prompt(deptQ)
            break;

            // Add a role
            case "Add a Role":
                inquirer.prompt(roleQ)
            break;

            // Add an Employee
            case "Add an Employee":
                inquirer.prompt(empQ)
            break;

            // Update an Employee
            case "Update an Employee Role":
                inquirer.prompt(empUpdateQ)
            break;
        }
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
    })
};

function viewAllDepts() {
    const sql = `SELECT dept FROM departments`;

    db.query(sql, (err, rows) => {
        if(err) {
            console.log('DATABASE ERROR');
            return;
        }
        console.table(rows);
    })
};

function viewAllRoles() {
    const sql = `SELECT job_title, dept, salary FROM roles`;

    db.query(sql, (err, rows) => {
        if(err) {
            console.log('DATABASE ERROR');
            return;
        }
        console.table(rows);
    })
};