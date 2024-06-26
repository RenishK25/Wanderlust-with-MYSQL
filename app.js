if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

// const dbUrl = process.env.MONGODB_URL;
const { Sequelize, Op } = require('sequelize');
const db = require('./DB/connection.js');

const User = db.user;
const List = db.list;
// const User = require("./DB/user.js");
// const List = require("./DB/list.js");

// console.log(User.get());
// User.sync();
// List.sync();
// db.review.sync({ alert: true });
// User.sync({ alter: true }); // if want to update table column


const express = require('express');
// const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError.js');
// const { listingSchema } = require('./schema.js');
// const { reviewSchema } = require('./schema.js');
const flash = require('connect-flash');
const cookie = require('cookie-parse');
const session = require('express-session');
// const List = require('./models/listing');
const Review = require("./models/review");
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const User = require("./models/user_m.js");

const listRoute = require("./routes/list.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const list = require("./DB/list.js");
const { name } = require("ejs");

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

// passport.use(new LocalStrategy(db.user.authenticate()));
passport.use(new LocalStrategy(async function verify(name, password, done){
    try{
        const user = await User.findOne({where: {name} });
        if(!user){
            return done(null, false, {message: "incorrect Username or Password"});
        }
        const isPasswordValid = user.checkPassword(password);
        
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
        
        return done(null, user);
    }
    catch(e){
        return done(e)
    }
})
);


// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, done) => {
    done(null, user)
});

passport.deserializeUser((user, done) => {
    User.findByPk(user.id).then((user) => { done(null, user)} );
});
// passport.deserializeUser(User.deserializeUser());


// app.use(express.static(path.join(__dirname + "public/js")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended : true }));

// main().then( () => console.log("DB Connection SuccessFull")).catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(dbUrl);
// };

app.use((req, res, next) => {

    // req.flash("success", "this is first flash message");
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    // console.log(req.user);

    console.log("--------STARTING HANDLER -------"); 
    next();
});
// <===================== Start Server ===========================>

app.listen(3000, () =>{
    console.log("Server Start on Port http://localhost:3000/ " );
});

// <===================== Middleware ===========================>

app.get("/api",(req, res) => {
    console.log("api data");
    // res.send("api data");
    // abcd = abcd; 
    throw new ExpressError(401, "ExpressError New Error");
});


// <===================== Start Route ===========================>

app.get('/', wrapAsync(async (req, res) => {
    // console.log(req.user);
    const lists = await db.list.findAll({
        attributes: {
        //   include: [
        //     [Sequelize.fn('COUNT', Sequelize.col('id')), 'totle_list'],
        //   ],
        },
        
        // attributes: ['id',['email','email_id'],
        //     [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_user']],
      });
    // console.log(lists);
    res.render("listings/index.ejs",{ lists });
})
);

// app.get('/test-query', wrapAsync(async (req, res) => {
//     const users = await db.user.findAll({
//         where: {
//             // [Op.or]: [{ name: "Renish Kalariya" }, { id : 5 }],
//             // [Op.and]: [{ name: "Renish Kalariya" }, { id : 5 }],
            
//             // id: {[Op.in]: [1,2]},
            
//             // id: {[Op.not]: 1},
//             [Op.not]: [{id: 1},
//             {
//                 name: {[Op.eq]: 'Renish Kalariya',}
//             }
//             ],
//             // id: {[Op.eq]: 1},
//           },
//       });
//     console.log(users);
//     res.json(users);
//     // res.render("listings/index.ejs",{ users });
// })
// );

app.use("/list", listRoute);

app.use("/list/:id/review", reviewRoute);

app.use("/", userRoute);

app.use("*", (req, res) =>{
    res.render("404.ejs");
    // res.status(404).json("Page Not Found");
});



// <=======================================================================================================>


app.use((err, req, res, next) => {
    console.log("--------ERROR HANDLER -------"); 
    console.log(err);
    let {status = 500, message = "Server Error"} = err;
    res.render("error.ejs", { message } );
});