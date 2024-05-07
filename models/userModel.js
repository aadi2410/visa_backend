const mongoose = require("mongoose");

// user schema
const UserSchema = new mongoose.Schema({
  // name field
  full_name: {
    type: String,
    required: [true, "Please provide an name!"],

  },
  // email field
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },
  // phone field
  mobile_no: {
    type: Number,
    required: [true, "Please provide an name!"],
    unique: [true, "Mobile No. Exist"],

  },
  //   password field
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
});

// export UserSchema
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
