const cTable = require('console.table')
const inquirer = require('inquirer')
const mysql = require('mysql2')
const path = require('path')
const fs = require('fs')
const db = require('./db')


const employeeFullView = `
SELECT employee.id, employee.first_name, employee.last_name,
  role.title, role.salary, department.name AS department,
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN role
ON employee.role_id = role.id
LEFT JOIN department
ON role.department_id = department.id
LEFT JOIN employee manager
ON manager.id = employee.manager_id
`

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
                name: 'mainMenu',
                message: 'Please select and action for Employees, Departments, and Roles',
                choices: ['View', 'Add', 'Remove', 'Update', 'Exit']
            }
        ])
        .then(answer => {
            switch (answer.mainMenu) {
                case 'View':
                    viewMenu()
                    break
                case 'Add':
                    addMenu()
                    break
                case 'Remove':
                    removeMenu()
                    break
                case 'Update':
                    updateMenu()
                    break
                case 'Exit':
                    console.log('Exiting app. Have a wonderful day!')
                    break
            }
        })
        .catch(err => { console.log(err) })
}

const viewMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'viewMenu',
                message: 'View Menu',
                choices: ['View all employees', 'View employees by manager', 'View departments', 'View roles', 'Return to main menu']
            }
        ])
        .then(answer => {
            switch (answer.viewMenu) {
                case 'View all employees':
                    console.log('Viewing all employees')
                    db.query(employeeFullView, (err, employees) => {
                        if (err) { console.log(err) }
                        console.table(employees)
                        viewMenu()
                    })
                    break
                case 'View employees by manager':
                    console.log('Viewing employees under manager')
                    db.query('SELECT * FROM employee', (err, employees) => {
                        employees = employees.map(employee => ({
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id
                        }))
                        inquirer
                            .prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: 'Viewing employees by manager',
                                    choices: employees
                                }
                            ])
                            .then(answer => {
                                if (answer.manager === null) {
                                    db.query(`${employeeFullView} WHERE employee.manager_id = ?`, answer.manager, (err, byManager) => {
                                        if (err) {console.log(err)}
                                        console.table(byManager)
                                        viewMenu()
                                    })
                                }
                                else {
                                    console.log('This manager has no employees under them')
                                    viewMenu()
                                }
                            })
                            .catch(err => { console.log(err) })
                    })
                    break
                case 'View departments':
                    console.log('Viewing departments')
                    viewMenu()
                    break
                case 'View roles':
                    console.log('Viewing roles')
                    viewMenu()
                    break
                case 'Return to main menu':
                    console.log('Returning to main menu')
                    mainMenu()
                    break
            }
        })
        .catch(err => { console.log(err) })
}



const addMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'addMenu',
                message: 'Add Menu',
                choices: ['Employee', 'Department', 'Role', 'Return to Main Menu']
            }
        ])
        .then(answer => {
            switch (answer.addMenu) {
                case 'Employee':
                    addEmployee()
                    break
                case 'Department':
                    addDepartment()
                    break
                case 'Role':
                    addRole()
                    break
                case 'Return to Main Menu':
                    mainMenu()
                    break
            }
        })
        .catch(err => { console.log(err) })
}

const removeMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'removeMenu',
                message: 'Remove Menu',
                choices: ['Employee', 'Department', 'Role', 'Return to Main Menu']
            }
        ])
        .then(answer => {
            switch (answer.removeMenu) {
                case 'Employee':
                    removeEmployee()
                    break
                case 'Department':
                    removeDepartment()
                    break
                case 'Role':
                    removeRole()
                    break
                case 'Return to Main Menu':
                    mainMenu()
                    break
            }
        })
        .catch(err => { console.log(err) })
}

const updateMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'updateMenu',
                message: 'Update Menu',
                choices: ['Employee', 'Department', 'Role', 'Return to Main Menu']
            }
        ])
        .then(answer => {
            switch (answer.updateMenu) {
                case 'Employee':
                    updateEmployee()
                    break
                case 'Department':
                    updateDepartment()
                    break
                case 'Role':
                    updateRole()
                    break
                case 'Return to Main Menu':
                    mainMenu()
                    break
            }
        })
        .catch(err => { console.log(err) })
}


mainMenu()