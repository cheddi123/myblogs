const express = require('express');
const mysql = require('mysql2');
const routes = express.Router();
const path = require('path')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.SQL_SECRET_KEY,
  database: 'employees',

}); 

connection.connect((err) => {
  if (err) throw err;
  console.log('connected to SQL database')
});

 


routes.get('/', function (req, res) {
  res.send('Hello World')
})

routes.get('/hello/:id', (req, res) => {
  const { hostname, baseUrl, params } = req
  console.log(hostname, baseUrl, params.id)
  console.log(path.dirname(__dirname))
  console.log(path.basename(__dirname))
 // res.send('<h2>Hello World from ID:</h2>' + '<h5>' + params.id + '</h5>')
  res.sendFile('./views/hello.html',{root:'../my_express_webapp'})
});

routes.get('/salary/:query', (req, res) => {
const query = req.params.query;

  connection.query(`SELECT ${query}(salary) as ${query} from salaries`, (error, results, fields) => {
    if (error) throw error;
    console.log('The average salary  is: ', results[0]
    );
    res.send('The Average  salary is ' + results[0].avg)

  });

});

routes.get('/salary/sum/sum', (req, res) => {
  connection.query('select sum(salary) as sum from salaries', (err, result) => {
    if (err) throw err;
    console.log('The sum of salaries is', result[0].sum);
    res.send('The sum of salaries is ' + result[0].sum);
  });

});

routes.get('/department/salary', async (req, res) => {
  query = 'select dept_name ,sum(salary) as total from departments as  dep join dept_emp as d on dep.dept_no = d.dept_no  join salaries as s on s.emp_no = d.emp_no group by dept_name';
  let result=await new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) throw err;
      resolve(result)
      
     

    });

  })
  console.log('The sum of salaries by each department  is', result.length);
  const resultLength = result.length
  console.log('I am here waiting on you');
  let arr = ['I am here','What is in your mind?'];
  
 
   res.send('The sum of salaries is '+ result[0].total + ' department '+ result[0].dept_name);
  // res.send(`<h4> ${arr} </h4>`);

 
});

module.exports = routes