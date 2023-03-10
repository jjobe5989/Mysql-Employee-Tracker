-- Departments
INSERT INTO department (id, name) VALUES (1, 'Engineering');
INSERT INTO department (id, name) VALUES (2, 'Sales');
INSERT INTO department (id, name) VALUES (3, 'Finance');
INSERT INTO department (id, name) VALUES (4, 'Legal');
INSERT INTO department (id, name) VALUES (5, 'Management');
INSERT INTO department (id, name) VALUES (6, 'HR');

-- Roles

INSERT INTO role (title, salary, departmentID) VALUES ("Lead Engineer", 150000, 1);
INSERT INTO role (title, salary, departmentID) VALUES ("Engineer", 113000, 1);

INSERT INTO role (title, salary, departmentID) VALUES ("Online Sales Representative", 90000, 2);
INSERT INTO role (title, salary, departmentID) VALUES ("Print Sales Representative", 95000, 2);

INSERT INTO role (title, salary, departmentID) VALUES ("Financial Advisor", 123000, 3);
INSERT INTO role (title, salary, departmentID) VALUES ("Accountant", 100000, 3);
INSERT INTO role (title, salary, departmentID) VALUES ("Billing Coordinator", 118000, 3);

INSERT INTO role (title, salary, departmentID) VALUES ("Attorney", 109000, 4);

INSERT INTO role (title, salary, departmentID) VALUES ("Operations Manager", 158000, 5);
INSERT INTO role (title, salary, departmentID) VALUES ("Sales Manager.", 128000, 5);

INSERT INTO role (title, salary, departmentID) VALUES ("HR Coordinator", 141000, 6);


--Employees Info
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Ben', 'Trane',9, null );
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Terry', 'Brown', 2, 9);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Charles', 'Bennit', 3, 10);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Will', 'Johnson', 4, 10);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Jim', 'Smith',10, null);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Lenny', 'White', 6, null);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Jack', 'Black', 7, null);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Freddy', 'Kruger', 8, null);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Miles', 'Morales', 9, null);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Tammy', 'Jones', 10, 9);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Bill', 'Remmington', 2, 9);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Jeremy', 'Singer', 11, null);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Mark', 'Wallburg', 7, null);
INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ('Kim', 'Thomson', 2, 9);