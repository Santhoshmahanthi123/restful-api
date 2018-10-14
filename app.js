const express = require('express');

const port = process.env.PORT || 3000;

const app = express();
const morgan = require('morgan');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const bodyParser = require('body-parser');
//gives logs for nodejs like requests
app.use(morgan('dev'));
//body parser parses the url encoded and json data in proper format
app.use(bodyParser.urlencoded({extended : true}));
app.unsubscribe(bodyParser.json());
//giving CORS(Cross Origin Resource Sharing) permissions to anyone who requests to these end points
app.use((req,res,next)=>{
    //* will give access to any origin
 res.header('Access-Control-Allow-Origin','*');
 res.header('Access-Control-Allow-Origin','Origin,X-Requested-With,Content-Type,Accept,Authorization');
 if(req.method === 'OPTIONS'){
     res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
     return res.status(200).json({});
 }
 next();
})

app.use('/products',productRoutes);

app.use('/orders',orderRoutes);

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