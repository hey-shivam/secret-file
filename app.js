//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/secretDB",{useNewUrlParser : true, useUnifiedTopology : true});

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Add User Name"]
    },
    email : {
        type : String,
        required : [true, "Add Email Address"]
    },

    password : {
        type : String,
        required : [true, "Enter Password"]
    }

});


userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields : ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login")
});

app.get("/register", function(req, res){
    res.render("register")
});

app.post("/register", function(req, res){
    const Uname = req.body.username
    const Uemail = req.body.useremail;
    const Upassword = req.body.password;

    const newUser = new User({
        name : Uname,
        email : Uemail,
        password : Upassword
    });

    newUser.save(function(err){
        if (!err){
            res.render("secrets");
        }else{
            res.send(err);
        }
    })
});

app.post("/login", function(req, res){
    User.findOne({email : req.body.useremail}, function(err,foundUser){
        if(err){
            res.send(err)
        }else{
            if(foundUser){
                if(foundUser.password === req.body.password){
                    res.render("secrets");
                }else{
                    res.send("User NOT Found or Wrong Password");
                }
            }
        }
    })
});

app.listen(port, function(){
    console.log("Server start at port : "+port);
});

