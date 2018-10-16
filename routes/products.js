const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products')
//allows you to storing the files in uploads 
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename : function(req,file ,cb){
        cb(null,new Date().toISOString()+ file.originalname);

    }
});

const file = (req,res,cb) =>{

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
     //accept the file
             cb(null,true);
    }
    else{
        //reject a file 
    cb(null,false);
    }
    
  
};
//multer parses the files coming from the body and stores in the uploads folder 
//multer configuration
const upload = multer({storage : storage,limits : {
    fileSize : 1024 * 1024 *5,
    },
    file :file
});
router.get('/',checkAuth,ProductsController.products_get_all);
router.post('/',checkAuth,upload.single('productImage'),ProductsController.products_create_product);

router.get('/:productId',checkAuth,ProductsController.products_get_product);

router.patch("/:productId",checkAuth,ProductsController.products_update_product);
router.delete('/:productId',checkAuth,ProductsController.products_delete_product);
module.exports = router;