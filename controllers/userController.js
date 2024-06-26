// const User = require("../models/user_m.js");
const { Op, QueryTypes } = require("sequelize");
const db = require("../DB/connection");
// const user = require("../DB/user");
const User = db.user;
const Sequelize = db.Sequelize;
// const Op = db.Sequelize.Op;

module.exports.loginForm = (req, res) => {
    res.render("./users/login.ejs");
}; 

module.exports.login = (req, res) => {
    req.flash("success", "Welcome to Wanderlust");
    if(res.locals.redirectUrl != undefined){
        let redirectUrl = res.locals.redirectUrl.split('/').slice(0, 3).join('/') || "/";
        res.redirect(redirectUrl);
    }
    res.redirect("/");
    
};

module.exports.signupForm = (req, res) => {    
    res.render("./users/signup.ejs");
}

module.exports.signup = async(req, res) => {    
    try{
        let newUser = await User.create(req.body);

        console.log(newUser);
        req.login(newUser, (err) => {
            if(err){
                next(err);
            }
            req.user = newUser;
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