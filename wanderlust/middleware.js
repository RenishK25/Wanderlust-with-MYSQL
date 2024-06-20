const List = require('./models/listing');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require("./models/review");


module.exports.isLoggedin = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        // req.session.redirectUrl = req.headers.referer;
        // console.log(req.session.redirectUrl);
        req.flash("error", "Login to Proceed");
        return res.redirect('/login');
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next) =>{
    // console.log("REQUEST========",req.session.redirectUrl);
    if(req.session.redirectUrl){
        // console.log("req.session.redirectUrl",req.session.redirectUrl);
        return res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let list = await List.findById(id);
    if(res.locals.user.id && !list.owner.equals(res.locals.user.id)){
        req.flash("error", "You are't owner of this list");
        return res.redirect("/list/"+id);    
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.user.id)){
        req.flash("error", "You are't author of this review");
        return res.redirect("/list/"+id);    
    }
    next();
}

module.exports.validateList = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
        console.log("validate JOI",error);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error){
        console.log("validate JOI",error);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}