// Bring in stuff
const inquirer = require('inquirer')
const cTable = require('console.table')
const mysql = require('mysql2')
const path = require('path')
const fs = require('fs')


// department
// id - INT PRIMARY KEY
// name - VARCHAR(30) to hold department name

// role
// id - INT PRIMARY KEY
// title -  VARCHAR(30) to hold role title
// salary -  DECIMAL to hold role salary
// department_id -  INT to hold reference to department role belongs to

// employee
// id - INT PRIMARY KEY
// first_name - VARCHAR(30) to hold employee first name
// last_name - VARCHAR(30) to hold employee last name
// role_id - INT to hold reference to role employee has
// manager_id - INT to hold reference to another employee that manager of the current employee.
// manager_id field may be null if the employee has no manager




// inquirer
//     .prompt([
//         {
//             type: 'list',
//             name: '',
//             message: '',
//             choices: []
//         }
//     ])
//     .then(answer => {

//     })
//     .catch(err => {console.log(err)})


const mainMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'category',
                message: 'Please select a category to view or update.',
                choices: ['Employee', 'Department', 'Role', 'Exit']
            }
        ])
        .then(answer => {
            switch (answer.category) {
                case 'Employee':
                    employeeMenu()
                    break
                case 'Department':
                    departmentMenu()
                    break
                case 'Role':
                    roleMenu()
                    break
                case 'Exit':
                    console.log('Exiting app. Have a nice day!')
                    break
            }
        })
        .catch(err => { console.log(err) })
}

const employeeMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'employeeMenu',
                message: 'Employee Menu',
                choices: ['View all employees', 'View employees by manager', 'Add employee', 'Update employee', 'Remove employee', 'Return to Main menu']
            }
        ])
        .then(answer => {
            switch (answer.employeeMenu) {
                case 'View all employees':
                    console.log('view all employees')
                    employeeMenu()
                    break
                case 'View employees by manager':
                    console.log('view all employees by manager')
                    employeeMenu()
                    break
                case 'Add employee':
                    console.log('Adding employee')
                    // addEmployee() put employeeMenu in it
                    employeeMenu()
                    break
                case 'Update employee':
                    console.log('Updating employee')
                    // updateEmployee()
                    employeeMenu()
                    break
                case 'Remove employee':
                    console.log('Removing employee')
                    // removeEmployee()
                    employeeMenu()
                    break
                case 'Return to Main menu':
                    mainMenu()
                    break
            }
        })
        .catch(err => { console.log(err) })
}

const departmentMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'departmentMenu',
                message: 'Department Menu',
                choices: ['View departments', 'Add department', 'Remove department', 'View budget per department', 'Return to Main menu']
            }
        ])
        .then(answer => {
            switch (answer.departmentMenu) {
                case 'View departments':
                    console.log('view all departments')
                    departmentMenu()
                    break
                case 'Add department':
                    console.log('Department added')
                    departmentMenu()
                    break
                case 'Remove department':
                    console.log('Department removed')
                    departmentMenu()
                    break
                case 'View budget per department':
                    console.log('big money per department')
                    departmentMenu()
                    break
                case 'Return to Main menu':
                    mainMenu()
                    break
            }
        })
        .catch(err => { console.log(err) })
}

const roleMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'roleMenu',
                message: 'Role Menu',
                choices: ['View roles', 'Add role', 'Remove role', 'Update role', 'Return to Main menu']
            }
        ])
        .then(answer => {
            switch (answer.roleMenu) {
                case 'View roles':
                    console.log('view all roles')
                    roleMenu()
                    break
                case 'Add role':
                    console.log('Role added')
                    roleMenu()
                    break
                case 'Remove role':
                    console.log('Role removed')
                    roleMenu()
                    break
                case 'Update role':
                    console.log('role updated')
                    roleMenu()
                    break
                case 'Return to Main menu':
                    mainMenu()
                    break
            }
        })
        .catch(err => { console.log(err) })
}





// Start of the app
mainMenu()