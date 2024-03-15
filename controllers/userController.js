const User = require("../models/user.js");

module.exports.loginForm = (req, res) => {
    res.render("./users/login.ejs");
}; 

module.exports.login = (req, res) => {
    // console.log("req.user-",req.user);
    req.flash("success", "Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
};

module.exports.signupForm = (req, res) => {    
    res.render("./users/signup.ejs");
}

module.exports.signup = async(req, res) => {    
    try{
        let {email, username, password} = req.body;
        const newUser = new User({email, username});

        let userNew = await User.register(newUser, password);
        console.log(userNew);
        req.login(userNew, (err) => {
            if(err){
                next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/");
        });

    }catch(error){
        req.flash("error", error.message);
        res.redirect("/signup");
    }   
}

module.exports.logout = (req, res) => {
    req.logOut((err) =>{
        if(err){
            next(err);
        }
        req.flash("success", "Logout Successfull");
       return res.redirect("/");
    });
};