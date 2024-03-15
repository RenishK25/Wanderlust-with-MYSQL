const List = require('../models/listing');
const Review = require("../models/review");

module.exports.show = async(req, res) => {
    let list = await List.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.user._id
    list.reviews.push(newReview);

    await newReview.save();
    await list.save();
    res.redirect("/list/"+req.params.id);
}

module.exports.destroy = async (req, res) => {
    let { id, reviewId} = req.params;
    
    await List.findByIdAndUpdate(id, {$pull : { reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Delete Successful");
    res.redirect(`/list/${req.params.id}`);
}