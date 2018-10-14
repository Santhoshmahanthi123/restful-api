const express = require('express');

const port = process.env.PORT || 3000;

const app = express();
const morgan = require('morgan');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const bodyParser = require('body-parser');
//gives logs for nodejs like requests
app.use(morgan('dev'));
app.use('/products',productRoutes);
//body parser parses the url encoded and json data in proper format
app.use(bodyParser.urlencoded({extended : true}));
app.unsubscribe(bodyParser.json());

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