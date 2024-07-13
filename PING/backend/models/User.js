const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    username:{
        type:String,
        require:true,
        min:3,
        max: 20,
        unique:true,
    },

    email:{
        type: String,
        require: true,
        max: 50,
        unique: true,
    },

    password: {
        type: String,
        require:true,
        min: 6,
    },

},
{ timestamps : true }  //to add create and update time
);

module.exports = mongoose.model("User" , UserSchema);