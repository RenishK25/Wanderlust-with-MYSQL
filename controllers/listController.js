const List = require('../models/listing');

module.exports.add = (req, res) => {
    res.render("listings/create.ejs");
}

module.exports.create = (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename
    let list = new List(req.body.list);
    list.owner = req.user._id;
    list.image = {url, filename};
    // console.log(list);
    list.save();
    req.flash("success", "List Creat Successful");
    res.redirect("/");
} 

module.exports.show = async(req, res) => {
    let { id } = req.params;
    let list = await List.findById(id).populate({ path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!list){
        req.flash("error", "List You Requested Is Not Exist!");
        res.redirect("/");
    }   
    res.render("listings/show.ejs",{ list });
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let list = await List.findById(id);
    if(!list){
        req.flash("error", "List You Requested Is Not Exist!");
        res.redirect("/");
    }
    res.render("listings/edit.ejs",{ list });
}

module.exports.update = async (req, res) => {
    let { id } = req.params;
    let list = await List.findByIdAndUpdate(id, req.body.list, {new : true});
    
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename
        list.image = {url, filename};
        await list.save();
    }
    req.flash("success", "List Upadet Successful");
    res.redirect("/list/"+id);
}

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    let list = await List.findById(id);
    if(!list.owner.equals(res.locals.user._id)){
        req.flash("error", "You don't have permission to Upadet list");
        return res.redirect("/list/"+id);    
    }
    await List.findByIdAndDelete(id);
    req.flash("success", "List Delete Successful");
    res.redirect("/");

}