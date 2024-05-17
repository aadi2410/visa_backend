const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const DIR = './public/';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR);
      },
      filename: function(req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
      }
    
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });
module.exports=upload