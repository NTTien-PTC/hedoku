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
mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true })

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

//Khoi tao sever
// app.listen(4000, () =>
// {
//     console.log('App listening on a port 4000')
// })

    app.listen(process.env.PORT, function(){
        
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

