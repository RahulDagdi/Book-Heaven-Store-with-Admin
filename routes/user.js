const express = require ('express');
const router = express.Router();
const User = require ('../models/user')
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
require ('dotenv').config();
const {authenticateToken} = require ('./userauth');


////// sign Up
router.post ('/sign-up', async (req,res)=>{
    try {
        const {username , email ,password , address} = req.body ;

        //check username Length is more than 3 
        if (username.length <= 3 ) {
            return res.status(400).json({message: "username must be more than 3 characters"});
            
        }

        // check username already exists ?
        const existingUserName = await User.findOne ({username : username}) ;
       if (existingUserName) {
        
        return res.status(500).json(({message : "Username already exists"}));

       }

       // check email already exist ?

       const existingEmail = await User.findOne ({email : email});
       if (existingEmail) {
        return res.status(500).json({message : "Email already exists"});
        
       }

       // check password's length more than 6
     if(password.length <= 6)
     {
        return res.status(400).json({message: "Password must be more than 6 characters "});

     }
     
     const hashPass = await bcrypt.hash (password , 10)



     
     const newUser = new User ({
        username : username ,
         email :email ,
          password : hashPass,
           address :address
        }) ;

     const savedUser = await newUser.save();
     res.status(201).json({message :"Sign up successfully" });
     console.log("Sign up successfully")

    
        
    } catch (error) {
        res.status (500).json ({message : "Internal Server Error"});
        console.log(error);


        
    }
})

////// sign in 
router.post('/sign-in', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
  
      if (!process.env.SECRET_KEY) {
        console.error("SECRET_KEY is missing or undefined!");
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
      const token = jwt.sign(
        { username: existingUser.username, role: existingUser.role },
        process.env.SECRET_KEY,
        { expiresIn: "30d" }
      );
  
      res.status(200).json({
        message: "Login successful",
        id: existingUser._id,
        role: existingUser.role,
        token: token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  


/////// get-user-information 
router.get('/get-user-information', authenticateToken , async (req,res)=>{
    try {
         
         const {id} = req.headers ;
         const data = await User.findById(id).select("-password");
        // NOTE:-  .select('-password') ka use password ko display pr show na kre isliye (exclude kr diya)
         return res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({message : "Internal server error"});
        
    }
})



////// update address 
router.put("/update-address" , authenticateToken , async (req,res)=>{
    try {
        const {id} = req.headers ;
        const {Address} = req.body;
        const updatedUser = await User.findByIdAndUpdate(id ,

            {address : Address} , {new : true} 


        );
        console.log("User Up",updatedUser);
        console.log('aa',Address);


        if
        (!updatedUser) {
            return res.status(404).json({ message: "User Not Found" });
            }
            console.log("Address Updated Successfully")
            return res.status(200).json({
                message: "Address Updated Successfully",
                updatedUser
              });
    } catch (error) {
        res.status(500).json({message : "Internal server error"});
        
    }
})


module.exports = router;