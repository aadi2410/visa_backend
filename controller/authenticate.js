const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const dbConnect = require("../db/dbConnect");
const User = require("../models/userModel");
const auth = require("../utils/auth");
const upload = require("../utils/multer");
const Admin = require("../models/adminModel");
const Document=require('../models/documentUploadModel')
// execute database connection
dbConnect();
//register User
router.post("/register", (request, response) => {
  // hash the password

  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      let data ={};
      console.log(request.body)
      if(request.body.type==="user"){
        data=new User({
          full_name: request.body.full_name,
          email: request.body.email,
          password: hashedPassword,
          mobile_no: request.body.mobile_no,
        });
      }else{
        data=new Admin({
          full_name: request.body.full_name,
          email: request.body.email,
          password: hashedPassword,
          mobile_no: request.body.mobile_no,
        });
      }
      data
      .save()
      // return success if the new user is added to the database successfully
      .then((result) => {
        response.status(201).send({
          message: "User Created Successfully",
          result,
        });
      })
      // catch erroe if the new user wasn't added successfully to the database
      .catch((error) => {
        response.status(500).send({
          message: "Error creating user",
          error,
        });
      });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// login endpoint
router.post("/login", (request, response) => {
  let data;
  console.log(request.body.type,"request.body.typerequest.body.type")
  if(request.body.type==="user"){
    data=User;
  }else{
    data=Admin
  }
  // check if email exists
  data.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
            userId: user._id,
          type:request.body.type
          });
        })
        // catch error if password do not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

// free endpoint
router.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
router.get("/auth-endpoint", auth, (request, response) => {
  response.send({ message: "You are authorized to access me" });
});

//get profile data
router.get("/getProfile/:user_id", auth, async (req, response) => {
  const user = await User.findOne({
    _id: req.params.user_id,
  });
  if (user) {
    response.status(200).send({
      user
    });
  }
});
router.put("/getProfile/:user_id", auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const url = req.protocol + '://' + req.get('host');
    let updatedUserData = { firstName: req.body.firstName, 
      lastName:req.body.lastName,
      email:req.body.email,
      mobile_no:req.body.mobile_no,
      passport:req.body.passport,
      country:req.body.country,
      pinCode:req.body.pinCode,
      temporaryAddress:req.body.temporaryAddress,
      presentAddress:req.body.presentAddress,
      
    };
if(req.file?.filename){
  updatedUserData.profilePicture= url + '/public/' + req.file?.filename,
  updatedUserData.profileFileName=req?.file?.originalname
}
    const updatedUser = await User.findOneAndUpdate({ _id: req.params.user_id }, updatedUserData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const { password, ...rest } = updatedUser.toObject();
    res.status(200).json({ message: 'User updated successfully', user: {...rest,fileName:req.file?.originalname} });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Admin Document
router.get("/getUsers/:user_id", auth, async (req, response) => {
  var user = await User.find({});

console.log(user);

  if (user) {
    response.status(200).send({
      user
    });
  }
});
router.post("/singleVisaUpload/:user_id", auth,upload.fields([{ name: 'singleVisaApplyAdharFront' }, { name: 'singleVisaApplyAdharBack' },{name:"singleVisaApplyDocument"}]), async (req, res) => {
  try {
    const url = req.protocol + '://' + req.get('host');
    var file = req.files;

    let updatedUserData = {
      
    };
    // file.forEach((i,idx)=>{
    //   updatedUserData[arr[idx]]=url + '/public/' + i?.filename;

    // })
    console.log(file);
    if(file?.singleVisaApplyAdharFront){

      updatedUserData['singleVisaApplyAdharFront']=url + '/public/' + file?.singleVisaApplyAdharFront[0]?.filename;
    }
    if(file?.singleVisaApplyDocument){

      updatedUserData['singleVisaApplyDocument']=url + '/public/' + file?.singleVisaApplyDocument[0]?.filename;
    }
    if(file?.singleVisaApplyAdharBack){

      updatedUserData['singleVisaApplyAdharBack']=url + '/public/' + file?.singleVisaApplyAdharBack[0]?.filename;
    }

     const document = new Document({
      user_id: req.params.user_id,
       ...updatedUserData
      });
      document
      .save()
      // return success if the new user is added to the database successfully
      .then((result) => {
        res.status(201).send({
          message: "Document Updated Successfully",
          result,
        });
      })
      // catch erroe if the new user wasn't added successfully to the database
      .catch((error) => {
        res.status(500).send({
          message: "Error creating user",
          error,
        });
      });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get("/singleVisaUpload/:user_id", auth,  async (req, res) => {
  try {
    const user = await Document.findOne({
      user_id: req.query.user_id,
    });
  console.log({user},req.query.user_id)
    if (user) {
     
      res.status(200).send({document:user})
    }else{

      res.status(404).send({
        message:"Document Not Found"
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//for user
router.get("/singleVisaUploadUser/:user_id", auth,  async (req, res) => {
  try {
    const user = await Document.findOne({
      user_id: req.params.user_id
    });

  console.log({user })
    if (user) {
     
      res.status(200).send({document:user})
    }else{

      res.status(404).send({
        message:"Document Not Found"
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
