const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const Admin = require("../models/adminModel");

module.exports = async (request, response, next) => {
  try {
    // Get the token from the authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: "Authorization header missing!" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return response.status(401).json({ error: "Token missing from authorization header!" });
    }

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, "RANDOM-TOKEN");

    // Retrieve the user ID from the request parameters
    const requestUserId = request.params.user_id;
    let type=request.query.type;
    if(request.query.type=="admin"){
      type=Admin
    }else{
      type=User
    }
    console.log(type,"========================typ",request.query.type,request.query.type==="admin")
    if (!requestUserId) {
      return response.status(400).json({ error: "User ID missing in request parameters!" });
    }

    // Compare the user ID from the token with the user ID from the request parameters
    if (decodedToken.userId !== requestUserId) {
      return response.status(401).json({ error: "Token does not match the provided user ID!" });
    }

    // Retrieve the user details from the database (optional, if needed)
     const user = await type.findById(requestUserId);
    
    if (!user) {
      return response.status(401).json({ error: "User not found!" });
    }

    // Pass the user down to the request object
    request.user = user;

    // Pass down functionality to the endpoint
    next();

  } catch (error) {
    console.error("Token verification failed:", error);
    response.status(401).json({ error: "Invalid or expired token!" });
  }
};
