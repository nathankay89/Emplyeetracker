const connection = require('./connection');

function getDepartmentData() {
    return connection.promise().query('SELECT * FROM department');
  }
  
  function getRoleData() {
    return connection.promise().query('SELECT * FROM role');
  }
  
  function getEmployeeData() {
    return connection.promise().query('SELECT * FROM employee');
  }
  
// Other query functions

module.exports = {
  getDepartmentData,
  getRoleData,
  getEmployeeData,
  // Export other query functions
};

const addDepartment = async (departmentName) => {
  try {
    const query = 'INSERT INTO department (name) VALUES (?)';
    await connection.promise().execute(query, [departmentName]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  // ... other functions ...
  addDepartment
};
