
//In an Express.js application, a router is a middleware 
//that helps in organizing your routes in a more modular
// and maintainable way. It allows you to define routes for 
//different parts of your  application and then use them as separate modules.
const  router = require("express").Router();
//router is used for sharding
const User = require("../models/User");


//register
router.post("/register",async (req , res)=>{
    try{


//create new user
const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
});
//save and send response
const user = await newUser.save();
res.status(200).json(user._id)
    }
    catch(err){
res.status(500).json(err);
    }
})

//login
router.post("/login", async (req, res) => {
    try {
      //find user
      const user = await User.findOne({ username: req.body.username });
      !user && res.status(400).json("Wrong username or password");
  
      //validate password
      const validPassword = req.body.password === user.password;
      !validPassword && res.status(400).json("Wrong username or password");
  
      //send response
      res.status(200).json({ _id: user._id, username: user.username });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router