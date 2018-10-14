const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
router.get('/',(req,res,next)=>{
    res.status(200).json({
        message : 'Handling GET requests to /products'
    });
});
router.post('/',(req,res,next)=>{
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    });
    product.save().then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
    res.status(201).json({
        message : 'Handling POSTrequests to /products',
        createdProduct : product
    })
});

router.get('/:productId',(req,res,next)=>{
const id = req.params.productId;
if(id=='special'){
    res.status(200).json({
        message:'you discovered the special ID',
        id: id
    });
}
else{
    res.status(200).json({
        message:'you passed an id'
    });
    }
});

router.patch('/:productId',(req,res,next)=>{
  res.status(200).json({
      message:'Updated product'
  });
});
router.delete('/:productId',(req,res,next)=>{
    res.status(200).json({
        message:'Deleted product'
    });
  });
module.exports = router;