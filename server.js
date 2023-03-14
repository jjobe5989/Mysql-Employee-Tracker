// dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "746453kJ?",
  database: "employees_db"
});

connection.connect(function(err) {
    if (err) throw err;
   
    console.log("Connected as ID " + connection.threadId);
    console.clear();
    console.log ("======================================");
    console.log ("");
    console.log ("   WELCOME TO THE EMPLOYEE DATABASE   ");
    console.log ("");
    console.log ("======================================");
    runEmployeeDB();
});

//  Choices
function runEmployeeDB() {
    inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: [
            "View All Employees", 
            "View All Departments",
            "View All Roles",
            "View All Employees by Department",
            "View All Employees by Role",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Exit"
        ]
    }
    ]).then(function(answers) {
        switch (answers.action) {

            // View Employees
            case "View All Employees":
                viewAllEmployees();
                break;

            // View Departments
            case "View All Departments":
                viewAllDepts();
                break;

            // View Roles
            case "View All Roles":
                viewAllRoles();
                break;
            
            // View Employees by Department
            case "View All Employees by Department":
                viewEmployeesByDept();
                break;

            // View Employees By Role
            case "View All Employees by Role":
                viewEmployeesByRole();
                break;

            // To Add A Department
            case "Add Department":
                addDept();
                break;

            // To Add A Role
            case "Add Role":
                addRole();
                break;

            // To Add An Employee
            case "Add Employee":
                addEmployee();
                break;

            // To Update Employee Role
            case "Update Employee Role":
                updateEmployeeRole();
                break;

            // Exit
            case "Exit":
                console.log ("=============================================");
                console.log ("");
                console.log ("  Thank You For Using The Employee Database  ");
                console.log ("");
                console.log ("=============================================");
                connection.end();
                break;
        }
    });
}

// View Employees
function viewAllEmployees() {
    connection.query("SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, role.title AS Title, role.salary AS Salary, department.name AS Department, CONCAT(e.firstName, ' ' ,e.lastName) AS Manager FROM employees INNER JOIN role on role.id = employees.roleID INNER JOIN department on department.id = role.departmentID LEFT JOIN employees e on employees.managerID = e.id;", 
    function(err, res) {
        if (err) throw err;
        console.log ("");
        console.log("*** EMPLOYEES LIST ***");
        console.log ("");
        console.table(res);
        runEmployeeDB();
    });
}

// View Departments
function viewAllDepts() {
    connection.query("SELECT department.id AS ID, department.name AS Department FROM department",
    function(err, res) {
      if (err) throw err
      console.log("")
      console.log("*** DEPARTMENTS LIST ***")
      console.log("")
      console.table(res)
      runEmployeeDB()
  })
}

// View Roles
function viewAllRoles() {
  connection.query("SELECT role.id AS Dept_ID, role.title AS Title FROM role",
  function(err, res) {
    if (err) throw err
    console.log("")
    console.log("*** ROLES LIST ***")
    console.log("")
    console.table(res)
    runEmployeeDB()
})
}

// View employees by department
function viewEmployeesByDept() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, department.name AS Department FROM employees JOIN role ON employees.roleID = role.id JOIN department ON role.departmentID = department.id ORDER BY department.id;", 
      function(err, res) {
        if (err) {
          reject(err);
        } else {
          console.log("");
          console.log("*** EMPLOYEES LIST BY DEPARTMENT ***");
          console.log("");
          console.table(res);
          resolve();
        }
    });
  });
}

  // View employees by role
  function viewEmployeesByRole() {
    const query = `
      SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, role.title AS Title
      FROM employees
      JOIN role ON employees.roleID = role.id
      ORDER BY role.id;
    `;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.log("");
      console.log("*** EMPLOYEES LIST BY ROLE ***");
      console.log("");
      console.table(res);
      runEmployeeDB();
    });
  }

  // Adding Employee
  function selectRole(callback) {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      let roleArr = res.map(role => role.title);
      callback(roleArr);
    });
  }

// Add Manager
let managersArr = [];

function selectManager() {
  connection.query("SELECT CONCAT(firstName, ' ', lastName) AS managerName FROM employees WHERE roleID IN (SELECT id FROM role WHERE title LIKE 'manager%')", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].managerName);
    }
  })
  return managersArr;
}


// Add Department
function selectDepartment() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) {
        reject(err);
      } else {
        const deptArr = res.map(department => department.name);
        resolve(deptArr);
      }
    });
  });
}



// Adding employee function
async function addEmployee() {
  try {
    const roles = await getRoles();
    const managers = await getManagers();

    const answers = await inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "First Name: ",
      },
      {
        name: "lastName",
        type: "input",
        message: "Last Name: ",
      },
      {
        name: "role",
        type: "list",
        message: "What is the new employee's job title?",
        choices: roles,
      },
      {
        name: "manager",
        type: "list",
        message: "Who is this new employee's manager?",
        choices: managers,
      },
    ]);

    const roleId = await getRoleId(answers.role);
    const managerId = await getManagerId(answers.manager);

    await insertEmployee(answers.firstName, answers.lastName, roleId, managerId);

    console.log(`\nSuccessfully added ${answers.firstName} ${answers.lastName} to the database.\n`);

    runEmployeeDB();
  } catch (error) {
    console.log("Error: ", error);
  }
}

function getRoles() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT title FROM role", function (err, res) {
      if (err) {
        reject(err);
      } else {
        const roles = res.map((role) => role.title);
        resolve(roles);
      }
    });
  });
}

function getRoleId(title) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT id FROM role WHERE title = ?", [title], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res[0].id);
      }
    });
  });
}

function getManagers() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT CONCAT(firstName, ' ', lastName) AS manager FROM employees WHERE managerID IS NULL", function (err, res) {
      if (err) {
        reject(err);
      } else {
        const managers = res.map((employee) => employee.manager);
        resolve(managers);
      }
    });
  });
}

function getManagerId(name) {
  return new Promise((resolve, reject) => {
    const [firstName, lastName] = name.split(" ");
    connection.query(
      "SELECT id FROM employees WHERE firstName = ? AND lastName = ?",
      [firstName, lastName],
      function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res[0].id);
        }
      }
    );
  });
}

function insertEmployee(firstName, lastName, roleId, managerId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES (?, ?, ?, ?)",
      [firstName, lastName, roleId, managerId],
      function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

//  Updating Employee Info
function updateEmployeeRole() {
  connection.query("SELECT employees.lastName, role.title FROM employees JOIN role ON employees.roleID = role.id;", 
  (err, res) => {
      if (err) throw err;

      // Create an array of employee last names
      const lastNameArr = res.map(employee => employee.lastName);

      inquirer.prompt([
          {
              name: "lastName",
              type: "rawlist",
              choices: lastNameArr,
              message: "What is the employee's last name? ",
          },
          {
              name: "role",
              type: "list",
              message: "What is the employee's new title? ",
              choices: selectRole()
          },
      ]).then(function (answers) {
          const roleId = selectRole().indexOf(answers.role) + 1;
          const employeeToUpdate = res.find(employee => employee.lastName === answers.lastName);
          const employeeId = employeeToUpdate.id;

          connection.query("UPDATE employees SET ? WHERE ?",
              [
                  {
                      roleID: roleId
                  },
                  {
                      id: employeeId
                  }
              ],
              function (err) {
                  if (err)
                      throw err;
                  console.table(answers);
                  runEmployeeDB();
              });
      });
  });
}

  // Add Department
  function addDept() {
    inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What department would you like to add?",
      },
      {
        name: "id",
        type: "input",
        message: "What is the new department ID number?",
      },
    ]).then(function (answers) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answers.name,
          id: answers.id,
        },
        function (err) {
          if (err) throw err;
          console.log(`Added ${answers.name} department with ID ${answers.id} to the database`);
          runEmployeeDB();
        }
      );
    });
  }

  // Adding Roles
  function addRole() {
    connection.query("SELECT id, name FROM department", function(err, res) {
      if (err) throw err;
      inquirer.prompt([
        {
          name: "title",
          type: "input",
          message: "What is the name of the new role?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the new role?"
        },
        {
          name: "department_id",
          type: "rawlist",
          message: "Under which department does this new role fall?",
          choices: function() {
            var choicesArr = [];
            for (var i = 0; i < res.length; i++) {
              choicesArr.push({ name: res[i].name, value: res[i].id });
            }
            return choicesArr;
          }
        }
      ]).then(function(answers) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.department_id
          },
          function(err) {
            if (err) throw err;
            console.log("New role added successfully!");
            runEmployeeDB();
          }
        );
      });
    });
  }