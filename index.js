const inquirer = require('inquirer');
const queries = require('./queries');

async function mainMenu() {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Select an option:',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department', // Add this option
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit'
      ]
    }
  ]);

  switch (choice) {
    case 'Add a Department':
      await addDepartment(); // Call the function to add department
      break;
    // ... other cases ...
    case 'Exit':
      console.log('Exiting...');
      connection.end();
      break;
  }
}

async function addDepartment() {
  const departmentName = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:'
    }
  ]);

  try {
    await queries.addDepartment(departmentName.name);
    console.log('Department added successfully.');
  } catch (error) {
    console.error('Error adding department:', error);
  }

  mainMenu(); // Go back to the main menu
}

mainMenu(); // Start the application
