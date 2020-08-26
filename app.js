const cTable = require('console.table')
const inquirer = require('inquirer')
const mysql = require('mysql2')
const path = require('path')
const fs = require('fs')
const db = require('./db')

// employee data joined with role and departments
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
                                    message: 'Viewing employees under manager',
                                    choices: employees
                                }
                            ])
                            .then(answer => {
                                if (answer.manager === null) {
                                    db.query(`${employeeFullView} WHERE employee.manager_id = ?`, answer.manager, (err, byManager) => {
                                        if (err) { console.log(err) }
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
                    db.query('SELECT * FROM department', (err, department) => {
                        if (err) { console.log(err) }
                        console.table(department)
                        viewMenu()
                    })
                    break
                case 'View roles':
                    console.log('Viewing roles')
                    db.query('SELECT role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id', (err, role) => {
                        if (err) { console.log(err) }
                        console.table(role)
                        viewMenu()
                    })
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
    // Makes roles and employees as listable choices
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) { console.log(err) }
        roles = roles.map(role => ({
            name: role.title,
            value: role.id
        }))
    db.query('SELECT * FROM employee', (err, employees) => {
        employees = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }))
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) { console.log(err) }
        departments = departments.map(department => ({
            name: department.name,
            value: department.id
        }))
    // Prepend None to employee list when selecting employee's manager
    employees.unshift({ name: 'None', value: null })
    // Add Menu question prompt
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
                // Add Employee
                case 'Employee':
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'first_name',
                                message: `What is the employee's first name?`
                            },
                            {
                                type: 'input',
                                name: 'last_name',
                                message: `What is the employee's last name?`
                            },
                            {
                                type: 'list',
                                name: 'role_id',
                                message: `Please select the employee's role.`,
                                choices: roles
                            },
                            {
                                type: 'list',
                                name: 'manager_id',
                                message: 'Who is the manager of this employee?',
                                choices: employees
                            }
                        ])
                        .then(answer => {
                            db.query('INSERT INTO employee SET ?', answer, (err) => {
                                if (err) {
                                    console.log(err)
                                    console.log('An error has occured. Returning to menu')
                                    addMenu()
                                } else {
                                    console.log(`Employee ${answer.first_name} ${answer.last_name} has been added to the employee table`)
                                    mainMenu()
                                }
                            })
                        })
                        .catch(err => { console.log(err) })
                    break
                // Add Department
                case 'Department':
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'name',
                                message: 'Please input a name for the department'
                            }
                        ])
                        .then(answer => {
                            db.query('INSERT INTO department SET ?', answer, (err) => {
                                if (err) {
                                    console.log(err)
                                    console.log('An error has occured. Returning to menu')
                                    addMenu()
                                } else {
                                    console.log(`Department ${answer.name} has been added to the department table`)
                                    mainMenu()
                                }
                            })
                        })
                        .catch(err => { console.log(err) })
                    break
                case 'Role':
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'title',
                                message: 'Please enter a title for the role'
                            },
                            {
                                type: 'input',
                                name: 'salary',
                                message: 'Please enter a salary for this role'
                            },
                            {
                                type: 'list',
                                name: 'department_id',
                                message: 'Please select which department this role is under',
                                choices: departments
                            }
                        ])
                        .then(answer => {
                            db.query('INSERT INTO role SET ?', answer, (err) => {
                                if (err) {
                                    console.log(err)
                                    console.log('An error has occured. Returning to menu')
                                    addMenu()
                                } else {
                                    console.log(`Role ${answer.title} has been added to the roles table`)
                                    mainMenu()
                                }
                            })
                        })
                        .catch(err => { console.log(err) })
                    break
                case 'Return to Main Menu':
                    mainMenu()
                    break
            }
        })
        .catch(err => { console.log(err) })
    })
    })
    })
}

const removeMenu = () => {
    // Makes roles, employees, and departments as listable choices
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) { console.log(err) }
        roles = roles.map(role => ({
            name: role.title,
            value: role.id
        }))
    db.query('SELECT * FROM employee', (err, employees) => {
        employees = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }))
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) { console.log(err) }
        departments = departments.map(department => ({
            name: department.name,
            value: department.id
        }))
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
                    employees.unshift({ name: 'Return to menu', value: null })
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employee_id',
                                message: 'Please select an employee to remove',
                                choices: employees
                            }
                        ])
                        .then(answer => {
                            if (answer.employee_id === null) {
                                console.log('Returning to menu')
                                removeMenu()
                            } else {
                                db.query('DELETE FROM employee WHERE id = ?', answer.employee_id, (err) => {
                                    if (err) {
                                        console.log(err)
                                        console.log('An error has occured. Returning to menu')
                                        removeMenu()
                                    } else {
                                        console.log(`Employee has been removed from the employee table`)
                                        mainMenu()
                                    }
                                })
                            }
                        })
                        .catch(err => { console.log(err) })
                    break
                case 'Department':
                    departments.unshift({ name: 'Return to menu', value: null })
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'department_id',
                                message: 'Please select a department to remove',
                                choices: departments
                            }
                        ])
                        .then(answer => {
                            if (answer.department_id === null) {
                                console.log('Returning to menu')
                                removeMenu()
                            } else {
                                db.query('DELETE FROM department WHERE id = ?', answer.department_id, (err) => {
                                    if (err) {
                                        console.log(err)
                                        console.log('An error has occured. Returning to menu')
                                        removeMenu()
                                    } else {
                                        console.log(`Department has been removed from the department table`)
                                        mainMenu()
                                    }
                                })
                            }
                        })
                    break
                case 'Role':
                    roles.unshift({ name: 'Return to menu', value: null })
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'role_id',
                                message: 'Please select a role to remove',
                                choices: roles
                            }
                        ])
                        .then(answer => {
                            if (answer.role_id === null) {
                                console.log('Returning to menu')
                                removeMenu()
                            } else {
                                db.query('DELETE FROM role WHERE id = ?', answer.role_id, (err) => {
                                    if (err) {
                                        console.log(err)
                                        console.log('An error has occured. Returning to menu')
                                        removeMenu()
                                    } else {
                                        console.log(`Role has been removed from the role table`)
                                        mainMenu()
                                    }
                                })
                            }
                        })
                    break
                case 'Return to Main Menu':
                    mainMenu()
                    break
            }
        })
        .catch(err => { console.log(err) })
    })
    })
    })
}

const updateMenu = () => {
    // Makes roles, employees, and departments as listable choices
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) { console.log(err) }
        roles = roles.map(role => ({
            name: role.title,
            value: role.id
        }))
    db.query('SELECT * FROM employee', (err, employees) => {
        employees = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }))
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) { console.log(err) }
        departments = departments.map(department => ({
            name: department.name,
            value: department.id
        }))
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
                    employees.unshift({ name: 'Return to menu', value: null })
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employee_id',
                                message: 'Please select an employee to update',
                                choices: employees
                            },
                            {
                                type: 'list',
                                name: 'role_id',
                                message: 'Please choose a new role for the employee',
                                choices: roles
                            }
                        ])
                        .then(answer => {
                            console.log(answer.role_id)
                            console.log(answer.employee_id)
                            if (answer.employee_id === null) {
                                console.log('Returning to menu')
                                updateMenu()
                            } else {
                                db.query('UPDATE employee SET role_id = ? WHERE employee.id = ?', [answer.role_id, answer.employee_id], (err) => {
                                    if (err) {
                                        console.log(err)
                                        console.log('An error has occured. Returning to menu')
                                        removeMenu()
                                    } else {
                                        console.log(`Employee updated with new role`)
                                        mainMenu()
                                    }
                                })
                            }
                        })
                        .catch(err => { console.log(err) })
                    break
                case 'Department':
                    
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
    })
    })
    })
}


mainMenu()