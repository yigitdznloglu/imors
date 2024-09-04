const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    
    username : { type: String, required: false },
    // salt: { type: String, required: true},
    password : { type: Object, default: "Password1@", required: true },
    email : { type: String, required: true },
    songs : {type: [String], default: [""], required: false },
    
});

module.exports = mongoose.model("User", userSchema);