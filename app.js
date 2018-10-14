const express = require('express');

const port = process.env.PORT || 3000;

const app = express();

const productRoutes = require('./routes/products');
app.use('/products',productRoutes);

app.listen(port,()=>{
    console.log(`listening to server on ${port} port`);
    
})
module.exports = app;