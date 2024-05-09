const mongoose = require("mongoose");

// User schema
const UserSchema = new mongoose.Schema({
  // Full name field
  full_name: {
    type: String,
    required: [true, "Please provide a name!"]
  },
  // Email field
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email already exists"]
  },
  // Mobile number field
  mobile_no: {
    type: String,
    required: [true, "Please provide a mobile number!"],
    unique: [true, "Mobile number already exists"]
  },
  // Password field
  password: {
    type: String,
    required: [true, "Please provide a password!"]
  },
  // Profile picture field
  profilePicture: {
    type: String,
    default: ""
  },
  // First name field
  firstName: {
    type: String,
    default: ""
  },
  // Last name field
  lastName: {
    type: String,
    default: ""
  },
  // Passport field
  passport: {
    type: String,
    default: ""
  },
  // Country field
  country: {
    type: String,
    default: ""
  },
  // Pin code field
  pinCode: {
    type: String,
    default: ""
  },
  // Temporary address field
  temporaryAddress: {
    type: String,
    default: ""
  },
  // Present address field
  presentAddress: {
    type: String,
    default: ""
  },
  // Created at field
  created_at: {
    type: Date,
    default: Date.now
  },
  profileFileName:{
    type: String,
    default: ""
  }

});

// Export the User model
module.exports = mongoose.model("User", UserSchema);
