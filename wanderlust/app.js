if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const dbUrl = process.env.MONGODB_URL;

const express = require('express');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');
const { reviewSchema } = require('./schema.js');
const flash = require('connect-flash');
const cookie = require('cookie-parse');
const session = require('express-session');
const List = require('./models/listing');
const Review = require("./models/review");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user");

const listRoute = require("./routes/list.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const app = express();
app.engine('ejs', ejsMate);
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
  }))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.use(express.static(path.join(__dirname + "public/js")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended : true }));

main().then( () => console.log("DB Connection SuccessFull")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};

app.use((req, res, next) => {

    // req.flash("success", "this is first flash message");
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;

    console.log("--------STARTING HANDLER -------"); 
    next();
});
// <===================== Start Server ===========================>

app.listen(3000, () =>{
    console.log("Server Start");
});

// <===================== Middleware ===========================>

// const apiMiddleware = ( req, res, next) => {
//     let { token } = req.query;
//     if(token == "Access"){
//         console.log("Query",req.query);
//         console.log(token);
//         next();
//     }
//     throw new ExpressError(401, "ExpressError New Error");
// };

// app.get("/api", apiMiddleware, (req, res) => {
//     // console.log("api data");
//     res.send("api data");
// });

app.get("/api",(req, res) => {
    console.log("api data");
    // res.send("api data");
    // abcd = abcd; 
    throw new ExpressError(401, "ExpressError New Error");
});

// <======================= When Using Async Route ======================>
// app.get('/', async (req, res, next) => {
//     let lists = await List.find(); 
//     next(new ExpressError(401, "ExpressError New Error"));
//     // res.render("listings/index.ejs",{ lists });
// });
// <======================================================================>

const validateList = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
        console.log("validate JOI",error);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
        // req.flash("error", errMsg);
        // throw new ExpressError(400, error);
    }else{
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error){
        console.log("validate JOI",error);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };    
}

// <===================== Start Route ===========================>

app.get('/', asyncWrap(async (req, res) => {
    let lists = await List.find();
    res.render("listings/index.ejs",{ lists });
    })
);

app.use("/list", listRoute);

app.use("/list/:id/review", reviewRoute);

app.use("/", userRoute);


// <================== REVIEW ROUTE ===============================>


// <=======================================================================================================>


// const validationErrorHandler = (err) => {
//     console.log(err.name);
//     console.dir(err.message);
//     return err;
// }

// // app.use((err, req, res, next) => {
// //     if(err.name == "ValidationError"){
// //         err = validationErrorHandler(err);
// //     }
// //     next(err);
// // });

app.use((err, req, res, next) => {
    console.log("--------ERROR HANDLER -------"); 
    let {status = 500, message = "Server Error"} = err;
    // res.status(status).send(message);
    res.render("error.ejs", { message } );
});