const inquirer = require("inquirer");
const mysql = require("mysql");
const table = require("console.table");

var connection = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'p4ssw0rd*',
    database: 'workdb'
});

connection.connect(err=>{
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    promptQuestions();
})

function promptQuestions(){
    inquirer.prompt({
        type:'list',
        name:'task',
        message:'What would you like to do?',
        choices:[
            "view all employees",
            "view all departments",
            "add employee",
            "add department",
            "add role",
            "update employee role",
            "QUIT"
        ]
    })
    .then(answers => {
        switch (answers.task) {
            case "view all employees": viewEmpl(); break;
            case "view all departments": viewDept(); break;
            case "add employee": addEmpl(); break;
            case "add department": addDept(); break;
            case "add role": addRole(); break;
            case "update employee role": updateRole(); break;
            default: connection.end(); break;
        }
    })
}

function viewEmpl(){
    const query = 'SELECT* FROM employee';
    connection.query(query,(err,res)=>{
        if(err) throw err;
        console.table(res);
    })
    promptQuestions();
}

function viewDept(){
    const query = 'SELECT * FROM department';
    connection.query(query,(err,res)=>{
        if(err) throw err;
        console.table(res);
    })
    promptQuestions();
}
function addEmpl() {
    inquirer.prompt([{
            name: "fName",
            message: "Please enter the employee's first name: "
        },
        {
            name: "lName",
            message: "Please enter the employee's last name: "
        },
        {
            type: "number",
            name: "roleId",
            message: "Please enter the employee's role id: "
        },
        {
            type: "number",
            name: "managerId",
            message: "Please enter then employee's manager id: "
        }
    ]).then(function(res) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
        [res.fName, res.lName, res.roleId, res.managerId], 
        function(err, data) {
            if (err) throw err;
            console.table("Successfully Added Employee");
            promptQuestions();
        })
    })
}

function addDept() {
    inquirer.prompt([{
        name: "department",
        message: "Please enter then name of the department"
    }, ]).then(function(res) {
        connection.query('INSERT INTO department (name) VALUES (?)',
         [res.department], function(err, data) {
            if (err) throw err;
            console.table("Successfully Added Department");
            promptQuestions();
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            name: "title",
            message: "enter title:"
        }, {
            type: "number",
            name: "salary",
            message: "enter salary:"
        }, {
            type: "number",
            name: "department_id",
            message: "enter department ID:"
        }
    ]).then(function (response) {
        connection.query("INSERT INTO role (title, salary, department_id) values (?, ?, ?)", 
        [response.title, response.salary, response.department_id], 
        function (err, data) {
            if(err) throw err;
            console.table("Successfully Added Role");
        })
        promptQuestions();
    })

}

function updateRole() {
    inquirer.prompt([
        {
            name: "id",
            message: "Please enter the employee's id: "
        }, {
            type: "number",
            name: "role_id",
            message: "enter the new role ID:"
        }
    ]).then(function (response) {
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", 
        [response.role_id, response.id], 
        function (err, data) {
            console.table(data);
        })
        promptQuestions();
    })
}