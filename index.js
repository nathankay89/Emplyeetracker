// loads required modules
const inquirer = require('inquirer');
const mysql = require('mysql2');

// creates new databse connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Memphisnov04',
  database: 'employee_management'
});
// connection status
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

function startApp() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Please select an option:',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit'
        ]
      }
    ])
    .then(answers => {
      switch (answers.choice) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
       
        case 'Exit':
          connection.end();
          console.log('Goodbye!');
          process.exit();
          break;
      }
    });
}

// Finally, start the application
startApp();

