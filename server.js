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
