const jwt = require ('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req,res,next) =>{

            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1] ;


            if(!token == null)
            {
                 return res.status(401).json({message : "Access denied. No token provided Authentication token required"});
            }
               

            jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
                if (err) {
                  console.log(err);
                  return res.status(403).json({ message: "Token Invalid, Please signIn again" });
                }
                req.user = user;
                next();
              });
              
}

module.exports = {authenticateToken}