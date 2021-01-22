// Login code

    User.findOne({email : req.body.useremail}, function(err,foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser){
                    bcrypt.compare (req.body.password,foundUser.password, function(err, result) {
                        if(result == true){
                            res.render("secrets");
                            console.log("Password match", result);
                            console.log(req.body.password);
                        }else{
                            res.send("Wrong Password");
                        }
                    });
            }
            }
    })




// Registeration code
const userName = req.body.username;
const userEmail = req.body.useremail;
const userPassword = req.body.password;

bcrypt.hash(userPassword, saltRounds, function(err, hash) {
    const newUser = new User({
        name : userName,
        email : userEmail,
        password : hash
    });

    newUser.save(function(err){
        if (!err){
            res.render("secrets");
        }else{
            res.send(err);
        }
    })

}); 