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


const roleQ = (deptChoices) => {
    console.log(deptChoices);
    [
        {
            type: "input",
            name: "role",
            message: "What is the job title?"
        },
        {
            type: "list",
            name: "roleDept",
            message: "What department does this role belong to?",
            choices: deptChoices
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?"
        }
    ];
};

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
    });
};

function viewAllRoles() {
    const sql = `SELECT * FROM roles`;

    db.query(sql, (err, rows) => {
        if(err) {
            console.log('DATABASE ERROR');
            return;
        }
        console.table(rows);
    });
}

function addDept() {
    inquirer.prompt(deptQ).then(answer => {
        const sql = `INSERT INTO departments (dept)
        VALUES (?)`;

        db.query(sql, answer.dept, (err, rows) => {
            if(err) {
                console.log('DATABASE ERROR');
                return;
            }
            console.log('Added ' + answer.dept + ' to the database.');
        });
    });
};

function addRole() {
    const deptArr = [];
    db.query(`SELECT dept FROM departments`, (err, rows) => {
        rows.map((dept) => deptArr.push(dept.dept));
        console.log(deptArr);
        return deptArr;
    })

    console.log(deptArr);
    inquirer.prompt(roleQ(deptArr))
}
//     (({job_title, salary, dept_id}) => {
//             const sql = `INSERT INTO roles (job_title, salary, dept_id)
//             VALUES (?,?,?)`;
//             const params = [answers.job_title, answers.salary, answers.dept_id]

//             db.query(sql, params, (err, rows) => {
//                 if(err) {
//                     console.log('DATABASE ERROR');
//                     return;
//                 }
//                 console.log('Added ' + answer.job_title + ' to the database.');
//             });
//         });
//     }

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