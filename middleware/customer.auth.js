const { Customer } = require("../models/customer.model");

var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "jd897#$%dsjY*%#ldEddwmQ";
const env = require("dotenv").config();

const bcrypt = require("bcrypt");

module.exports = {
  //----------< Authentification>  ------------------

  authorizeAdmin: async (req, res, next) => {
    try {
      const adminId = req.body.adminId;
      console.log(adminId, "adminId");

      // let getresult = connection();
      let user = await User.findOne({
        _id: ObjectId(adminId),
      });
      //  console.log(getresult);

      if (user) {
        if (user.role === "admin") {
          console.log("Admin Authoriazed");
          next();
        } else {
          res
            .status(400)
            .send({ status: "failed", message: "Rout Not Authorized" });
          console.log("Admin Not Authoriazed");
        }
      } else {
        res.status(400).send({
          status: "failed",
          message: "Invalid User OR Authentication failed",
        });
        console.log("Invalid User OR Authentication failed");
      }
    } catch (e) {
      res.status(500).send({ message: "Server Error", Error: e });
      console.log(e);
    }
  },

  // authenticateUser: async (req, res, next) => {
  //   try {
  //     const userId = req.params.userId;

  //     if (userId.length != 24) {
  //       res.status(400).send({
  //         status: "failed",
  //         message: "Invalid Id formate",
  //       });
  //       console.log("Invalid Id formate");
  //     } else {
  //       // const adminId = req.params.adminId;
  //       console.log(userId, "userId");

  //       // let getresult = connection();
  //       let user = await User.findOne({
  //         _id: ObjectId(userId),
  //       });
  //       //  console.log(getresult);

  //       if (user) {
  //         console.log("User Authenticated");
  //         next();
  //       } else {
  //         res.status(400).send({
  //           status: "failed",
  //           message: "Invalid User OR Authentication failed",
  //         });
  //         console.log("Invalid User OR Authentication failed");
  //       }
  //     }
  //   } catch (e) {
  //     res.status(500).send({ message: "Server Error", Error: e });
  //     console.log(e);
  //   }
  // },

  authenticateCustomer: async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];
    console.log("Authoriazation", authorizationHeader);
    // Check if the Authorization header exists and starts with 'Bearer '
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      // Extract the token (remove 'Bearer ' from the beginning)
      try {
        const token = authorizationHeader.slice(7);
        // Check if a token is provided
        console.log("token at middleware", token);
        if (!token) {
          return res
            .status(401)
            .json({ message: "Authentication token is missing." });
        } else {
          const decode = await jwt.verify(token, JWT_SECRET_KEY);

          const customerId = decode.customerId;
          req.customerId = customerId;
          // var customerId = decode.id;
          // Get Customer from Token
          const customer = await Customer.findById(customerId);

          if (customer) {
            console.log("customer authenticated");
            console.log("customer", customer);
            next();
          } else {
            res
              .status(403)
              .json({ error: "Authentication failed. Invalid token." });
          }
        }
      } catch (error) {
        return res.status(401).json({
          status: "fail",
          error: error.message,
        });
      }
    } else {
      res.status(401).json({
        status: "fail",
        message: "Authentication token is missing.",
      });
    }

    // Verify and decode the token
    // console.log("--key----", env.JWT_SECRET_KEY);
    // console.log(jwt.verify(token, "jd897#$%dsjY*%#ldEddwmQ"), "RESULT");
    // jwt.verify(token, JWT_SECRET_KEY, (err, customer) => {
    //   if (err) {
    //     return res
    //       .status(403)
    //       .json({ message: "Authentication failed. Invalid token." });
    //   }

    //   // If the token is valid, store the customer information in the request for future use
    //   req.customer = customer;

    //   // Continue with the next middleware or route handler
    //   console.log("customer authenticated");
    //   next();
    // });
    // let token;

    // console.log("headerToken", req.headers["authorization"]);

    // const { authorization } = req.headers;
    // console.log("Authoriazation", authorization);

    // if (authorization && authorization.startsWith("Bearer"))
    // {
    //   try {

    //     // Get Token from header
    //     token = authorization.split(" ")[1];
    //     console.log("token at middleware check ", token);
    //     res.status(200).send({ status: "success", message: "authnetiacted" });
    // }        // // Verify Token
    // const decode = await jwt.verify(token, process.env.JWT_SEC);

    // const iat = decode.iat;
    // var customerId = decode.id;
    // // Get Customer from Token
    // req.customer = await Customer.findById(decode.id).select('-password');
    // const unix = moment.unix(iat);
    // const iatDate = new Date(unix);
    // const iatTime = iatDate.getTime();

    // const createDate = new Date(req.customer.updatedAt);
    // const createTime = createDate.getTime();
    // if (createTime > iatTime) {
    //   return res.status(403).send({ message: 'sorry, token is expire' });
    // }
    // next();
    //   } catch (error) {
    //     console.log(error);
    //     res
    //       .status(401)
    //       .send({ status: "failed", message: "Unauthorized Customer" });
    //   }
    // }
    // if (!token) {
    //   res
    //     .status(401)
    //     .send({ status: "failed", message: "Unauthorized User, No Token" });
    // }
  },

  //    --------------------  <Authorization>-------------------------

  //     admin id   632b3061c48a747227b4a41a

  // authorizeUser:  async(req,res,next)=>{
  //     try{
  //        const id=req.params.id;

  //        // const role=req.params.role;

  //            //  let getresult=  connection();
  //            const getresult= await User.findOne({

  //              _id: ObjectId(id),
  //                //  role:"admin"

  //           })
  //        //  console.log(getresult);

  //           if (getresult==null) {
  //             res.send("User not Authoriazed")
  //             console.log("User Not Authoriazed");

  //           }
  //           else if (getresult.role==="admin") {
  //            console.log("User Authoriazed");
  //            next()

  //          }

  //           else {

  //             // res.send("User Authenticatted")
  //             res.send("User not Authoriazed")
  //             console.log("User Not Authoriazed");
  //           }
  //     }catch(e){console.log(e);}

  // },
};

//   To check token is expired or not from jwt wbsite?

//   const jwt = require('jsonwebtoken');

// // Your JWT token
// const token = 'your_jwt_token_here';

// // Verify and decode the token
// jwt.verify(token, 'your_secret_key', (err, decoded) => {
//   if (err) {
//     // Token verification failed
//     console.error('Token verification failed:', err);
//   } else {
//     // Token verification successful
//     const expirationTimestamp = decoded.exp;
//     const currentTimestamp = Math.floor(Date.now() / 1000); // Get the current timestamp in seconds

//     if (currentTimestamp > expirationTimestamp) {
//       console.log('Token has expired.');
//     } else {
//       console.log('Token is still valid.');
//     }
//   }
// });
