require('dotenv').config();

const express = require('express');

const port = process.env.PORT || 3000;

const app = express();
const morgan = require('morgan');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
console.log(process.env.DBUSER, process.env.DBPASSWORD);
console.log( process.env.JWTKEY);

mongoose.connect('mongodb://'+ process.env.DBUSER +':'+ process.env.DBPASSWORD +'@ds131903.mlab.com:31903/restful-api',{ useNewUrlParser: true });
//removing deprecation warnings 
mongoose.Promise = global.Promise;
//gives logs for nodejs like requests
app.use(morgan('dev'));
//allows static files to be accessed publicly available
app.use('/uploads',express.static('uploads'));
//body parser parses the url encoded and json data in proper format

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
//giving CORS(Cross Origin Resource Sharing) permissions to anyone who requests to these end points
app.use((req,res,next)=>{
    //* will give access to any origin
 res.header('Access-Control-Allow-Origin','*');
 res.header('Access-Control-Allow-Origin','Origin,X-Requested-With,Content-Type,Accept,Accept');
//  if(req.method === 'OPTIONS'){
//      res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
//      return res.status(200).json({});
//  }
 next();
})

app.use('/products',productRoutes);

app.use('/orders',orderRoutes);

app.use('/user',userRoutes);

app.use((req,res,next)=>{
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
}); 
app.use((error,req,res,next)=>{
 res.status(error.status || 500);
 res.json({
     error:{
         message : error.message
     }
 });
});
app.listen(port,()=>{
    console.log(`listening to server on ${port} port`);
    
})
module.exports = app;