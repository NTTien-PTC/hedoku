//khai bao express
//khai bao app trong express

const express = require('express')
const app = new express()
//khai bao ejs
const ejs = require('ejs')
app.set('view engine', 'ejs')

//khai bao body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.raw())

//Khai bao bang mo hinh MVC
const postnew =  require('./controllers/newpost')  
const contactnew = require('./controllers/newcontact')    
const aboutnew = require('./controllers/newabout')
const homenew = require('./controllers/home')
const getpost = require('./controllers/getpost')
const storepost = require('./controllers/storepost')
const usernew = require('./controllers/usernew')
const storeuser = require('./controllers/storeUser')
const loginnew = require('./controllers/login')
const loginuser = require('./controllers/loginuser')
const logout = require('./controllers/logout')

//khaibao fileupload
const fileUpload = require('express-fileupload')
app.use(fileUpload())


//ket noi mongodb tu node.js
const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:admin@123@cluster0.hl5f0.mongodb.net/<dbname>?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true })
// mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true })
// const MongoClient = require('mongodb').MongoClient;

// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

//khai bao  luu phien dang nhap
const expressSession =require('express-session')

//nhap middleware
const authMiddlerware = require('./midllerware/authMiddlerware')
const redirectmiddlerware = require('./midllerware/redirectIfAuthenticatedMiddleware')
//Dang ky thu muc public 
app.use(express.static('public'))
const customMiddleWare = (req, res, next) => {
    console.log('Custom middle ware called')
    next()
}
app.use(customMiddleWare)

//khaibao cac middlerware
const validateMiddleWare = require('./midllerware/validatemiddlerware');

app.use('/post/store', validateMiddleWare)

//khoi tao sever
const port = process.env.PORT || 4000
    app.listen(port, () => {
        console.log("server is running on port: " +port)
    })


app.use(expressSession({
    secret: 'keyboard cat'
}))

global.loggedIn = null;
app.use("*",(req, res, next) => {
    loggedIn = req.session.userId;
    next()
})


//Dang ky router Bang mohinh MVC

app.get('/post/new', authMiddlerware,postnew) 
app.get('/contact',contactnew)
app.get('/about',aboutnew)
app.get('/',homenew)

app.get('/post/:id', getpost)
app.post('/post/store',authMiddlerware, storepost)

app.get('/auth/register',redirectmiddlerware, usernew)
app.post('/users/register',redirectmiddlerware, storeuser)

app.get('/auth/login',redirectmiddlerware, loginnew)
app.post('/users/login',redirectmiddlerware,loginuser)

app.get('/auth/logout',logout)
app.use((req,res) => 
        res.render('404')   
)

