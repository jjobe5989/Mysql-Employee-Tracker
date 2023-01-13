// dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "7464533672907kJ?",
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
    message: "What would you like to do today?",
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
            console.log ("   Thank You For Using The Employee Database   ");
            console.log ("");
            console.log ("=============================================");
            connection.end();
        break;
        }
})
};

// View Employees
function viewAllEmployees() {
    
    connection.query("SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, role.title AS Title, role.salary AS Salary, department.name AS Department, CONCAT(e.firstName, ' ' ,e.lastName) AS Manager FROM employees INNER JOIN role on role.id = employees.roleID INNER JOIN department on department.id = role.departmentID LEFT JOIN employees e on employees.managerID = e.id;", 
    function(err, res) {
      if (err) throw err
      console.log ("");
      console.log("*** EMPLOYEES LIST ***");
      console.log ("");
      console.table(res)
      runEmployeeDB()
  })
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
    connection.query("SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, department.name AS Department FROM employees JOIN role ON employees.roleID = role.id JOIN department ON role.departmentID = department.id ORDER BY department.id;", 
    function(err, res) {
      if (err) throw err
      console.log ("");
      console.log("*** EMPLOYEES LIST BY DEPARTMENT ***")
      console.log ("");
      console.table(res)
      runEmployeeDB()
    })
  }

  // View employees by role
function viewEmployeesByRole() {
    connection.query("SELECT employees.firstName AS First_Name, employees.lastName AS Last_Name, role.title AS Title FROM employees JOIN role ON employees.roleID = role.id ORDER BY role.id", 
    function(err, res) {
    if (err) throw err
    console.log ("");
    console.log("*** EMPLOYEES LIST BY ROLE ***")
    console.log ("");
    console.table(res)
    runEmployeeDB()
    })
  }

  // Adding Employee
let roleArr = [];                                            
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  })
  return roleArr;
}

// Add Manager
let managersArr = [];
function selectManager() {
  connection.query("SELECT firstName, lastName FROM employees", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].firstName);
    }
  })
  return managersArr;
}

// Add Department
var deptArr = [];
function selectDepartment() {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      deptArr.push(res[i].name);
    }
})
return deptArr;
}
