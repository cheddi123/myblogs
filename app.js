require("dotenv").config()
const { faker } = require('@faker-js/faker')
const cookieParser = require('cookie-parser')
const express = require('express')

const path = require('path')
const mongoose = require('mongoose')
const app = express()

if(!process.env.JWT_SECRET_KEY){
    console.log("fatal error: secret jwtscertkey")
    process.exit(1);
}
 
const { config } = require("dotenv")

//Routes
//const blogRoutes = require('./routes/blogRoutes')
const commentRoutes = require("./routes/commentsRoutes")
const userRoutes = require("./routes/userRoutes")


 
const connect = async () => { 
    try {
        
        await mongoose.connect('mongodb+srv://cheddi007:cheddi6660@comments.tsvjveh.mongodb.net/')
       
        console.log("Connected to Mongo DB...") 
   
    } catch (error) {
        console.log(error.message) 
    }

}
connect()



const { firstName, lastName, sex } = faker.person;
const { email, password } = faker.internet
const people = {
    firstName: firstName(),
    lastName: lastName(),
    sex: sex(),
    email: email(),
    password: password()


};
// console.log(path.parse(__filename))
//console.log(path.dirname(__filename))
// console.log(people);

// Middleware 
app.get('/home', (req, res) => {
    console.log(__dirname)
    console.log(path.basename(__dirname))
    res.render('home.ejs')
  
})  
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser())
 
// Customed Middleware
app.use('/hello', (req, res, next) => {
    console.log("i am using a middleware")
    next();
});

// Routes Middleware
app.use('/comment', commentRoutes)
// app.use("/", blogRoutes)
app.use("/user", userRoutes)
//app.use("/auth", authRoutes);
app.use((req, res) => {
    res.status(404).send('Page not found ')
})

async function sum(num1, num2) {
    let total = await new Promise((resolve, reject) => { setTimeout(() => { resolve(num1 + num2) }, 2000) });
    console.log('Before');
    console.log(total);
    console.log('After');
};

const multipy = (num1, num2) => {



    const product = num1 * num2;
    console.log(num1)
    return new Promise((resolve, reject) => {
        if (isNaN(num1)) { reject(new Error(`${num1} is not a number`)) }

        else { resolve(product) }
    });
}

multipy(4, 8).then((res, rej) => console.log(res)).catch(err => console.log("Error ", err.message))

//sum(5,6);

const difference = async (num1 = 6, num2 = 4) => {
    console.log("Its the beginning");
    let result = await new Promise((resolve, reject) => {
        resolve(num1 - num2)
    });
    console.log(result)
    console.log("completed");
}

//difference();
const fullName = async () => {
    const person = await faker.person
    const firstName = await person.firstName()
    console.log(firstName)

}

async function init() {
    await fullName();
    console.log('Finished fetching data');
}

//init(); 
//   fetch('https://jsonplaceholder.typicode.com/users')
//   .then(response => response.json())
//   .then(json => console.log(json))

const response = async () => {
    const results = await fetch('https://jsonplaceholder.typicode.com/todos/2');
    const json = await results.json();
    console.log(json);
}

//response()

app.listen(3000);


