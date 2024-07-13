
//In an Express.js application, a router is a middleware 
//that helps in organizing your routes in a more modular
// and maintainable way. It allows you to define routes for 
//different parts of your  application and then use them as separate modules.
const  router = require("express").Router();
//router is used for sharding
const Pin = require("../models/Pin");

//create a pin
router.post("/",async(req , res)=>{
    const newPin = new Pin(req.body)
    try{
const savePin = await newPin.save();
res.status(200).json(savePin); 
    }catch(err){
res.status(500).json(err);

    } 
});

//get all pins
router.get("/" , async(req , res) =>{
    try{
        const pins = await Pin.find();
        res.status(200).json(pins);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router