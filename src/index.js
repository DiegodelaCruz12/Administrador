const express= require('express');
const morgan=require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

//initializations
const app=express();
 //settings
 app.set('port', process.env.PORT||4080);
 app.set('views',path.join(__dirname, 'views' ));
 app.engine('.hbs', exphbs({
     defaultLayout:'main',
     layoutsDir:path.join(app.get('views'),'layouts'),
     partialDir:path.join(app.get('views'),'partials'),
     extname:'.hbs',
 }));
 
app.set('view engine','.hbs');

 //Middlewares
 
 app.use(morgan('dev'));
 app.use(bodyParser.urlencoded({extended: false}));
 app.use(bodyParser.json());

//Global Variables
const user="hola";


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/links'));


//Public
app.use(express.static(path.join(__dirname,'public')));

//Starting the server
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
})