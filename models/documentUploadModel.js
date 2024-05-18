const mongoose = require("mongoose");

// DocumentSchema schema
const DocumentSchema = new mongoose.Schema({
  // user field
  user_id: {
    type: String,
    required: [true, "Please provide a user id!"]
  },
  
  singleVisaApplyDocument:{
    type: String,
    default: ""
  },
  singleVisaApplyAdharFront:{
    type: String,
    default: ""
  },
  singleVisaApplyAdharBack:{
    type: String,
    default: ""
  },
  isVerified:{
    type: Boolean,
    default: false
  },
  reason:{
    type: String,
    default: ""
  },
});

// Export the Document model
module.exports = mongoose.model("DocumentUpload", DocumentSchema);
