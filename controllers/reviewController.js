const db = require('../DB/connection');
const List = db.list;
const Review = db.review;

module.exports.create = async(req, res) => {
    
    // const [affectedRows, [updatedList]] = await List.update(updatedFields, {
    //     where: { id },
    //     returning: true,
    //   });
    
    let review = req.body.review;
    review.authorId = res.locals.user.id;
    review.listId = req.params.id
    console.log(review);
    let data = await Review.create(review);

    req.flash("success", "Review Store Successful");
    res.redirect(`/list/${req.params.id}`);
}

module.exports.destroy = async (req, res) => {
    let { id, reviewId} = req.params;
    
    await Review.destroy({where :{id : reviewId}});

    req.flash("success", "Review Delete Successful");
    res.redirect(`/list/${req.params.id}`);
}