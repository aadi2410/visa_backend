const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const dbConnect = require("../db/dbConnect");
const User = require("../models/userModel");
const auth = require("../utils/auth");
const upload = require("../utils/multer");

// execute database connection
dbConnect();
// const destination = (req, file, cb) => {
//   switch (file.mimetype) {
//        case 'image/jpeg':
//             cb(null, './images/');
//             break;
//        case 'image/png':
//             cb(null, './images/');
//             break;
//        case 'application/pdf':
//             cb(null, './whitePaper/');
//             break;
//        default:
//             cb('invalid file');
//             break;
//   }
// }

// const storage = multer.diskStorage({
//   destination: destination,
//   filename: (req, file, cb) => {
//        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
//        cb(null, true)
//   } else {
//        cb(null, false)
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//        fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: fileFilter
// });

// register endpoint
router.post("/register", (request, response) => {
  // hash the password

  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        full_name: request.body.full_name,
        email: request.body.email,
        password: hashedPassword,
        mobile_no: request.body.mobile_no,
      });
      // save the new user
      user
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
      console.log(e)
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// login endpoint
router.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

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
            userId: user._id
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
    let updatedUserData = { firstName: req.body.firstName, profilePicture: req.file?.path };
  
    const updatedUser = await User.findOneAndUpdate({ _id: req.params.user_id }, updatedUserData, { new: true });
  console.log(updatedUser)
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const { password, ...rest } = updatedUser.toObject();
    console.log(rest)
    res.status(200).json({ message: 'User updated successfully', user: rest });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
