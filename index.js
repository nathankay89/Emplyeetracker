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

// shows all department
function viewAllDepartments() {
  connection.query('SELECT * FROM departments', (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}
// shows all roles
function viewAllRoles() {
  connection.query(
    'SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.id',
    (err, results) => {
      if (err) throw err;
      console.table(results);
      startApp();
    }
  );
}
// shows all employees
function viewAllEmployees() {
  connection.query(
    'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, " ", managers.last_name) AS manager FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id LEFT JOIN employees managers ON employees.manager_id = managers.id',
    (err, results) => {
      if (err) throw err;
      console.table(results);
      startApp();
    }
  );
}
// adds department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
      }
    ])
    .then(answers => {
      connection.query(
        'INSERT INTO departments (name) VALUES (?)',
        [answers.name],
        err => {
          if (err) throw err;
          console.log('Department added successfully!');
          startApp();
        }
      );
    });
}
// adds a role
function addRole() {
  connection.query('SELECT * FROM departments', (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the role:'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:'
        },
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select the department for the role:',
          choices: departments.map(department => ({
            name: department.name,
            value: department.id
          }))
        }
      ])
      .then(answers => {
        connection.query(
          'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
          [answers.title, answers.salary, answers.departmentId],
          err => {
            if (err) throw err;
            console.log('Role added successfully!');
            startApp();
          }
        );
      });
  });
}
// adds an employee
function addEmployee() {
  connection.query('SELECT * FROM roles', (err, roles) => {
    if (err) throw err;

    connection.query(
      'SELECT * FROM employees WHERE manager_id IS NULL',
      (err, managers) => {
        if (err) throw err;

        inquirer
          .prompt([
            {
              type: 'input',
              name: 'firstName',
              message: 'Enter the first name of the employee:'
            },
            {
              type: 'input',
              name: 'lastName',
              message: 'Enter the last name of the employee:'
            },
            {
              type: 'list',
              name: 'roleId',
              message: 'Select the role for the employee:',
              choices: roles.map(role => ({ name: role.title, value: role.id }))
            },
            {
              type: 'list',
              name: 'managerId',
              message: "Select the employee's manager:",
              choices: managers.map(manager => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id
              }))
            }
          ])
          .then(answers => {
            connection.query(
              'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
              [
                answers.firstName,
                answers.lastName,
                answers.roleId,
                answers.managerId
              ],
              err => {
                if (err) throw err;
                console.log('Employee added successfully!');
                startApp();
              }
            );
          });
      }
    );
  });
}
// updates employee role
function updateEmployeeRole() {
  connection.query('SELECT * FROM employees', (err, employees) => {
    if (err) throw err;

    connection.query('SELECT * FROM roles', (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select an employee to update:',
            choices: employees.map(employee => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id
            }))
          },
          {
            type: 'list',
            name: 'roleId',
            message: 'Select the new role for the employee:',
            choices: roles.map(role => ({ name: role.title, value: role.id }))
          }
        ])
        .then(answers => {
          connection.query(
            'UPDATE employees SET role_id = ? WHERE id = ?',
            [answers.roleId, answers.employeeId],
            err => {
              if (err) throw err;
              console.log('Employee role updated successfully!');
              startApp();
            }
          );
        });
    });
  });
}


//Start the app
startApp();
