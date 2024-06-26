const db = require('../DB/connection');
const List = db.list;

module.exports.add = (req, res) => {
    res.render("listings/create.ejs");
}

module.exports.create = (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename
    let list = new List(req.body.list);
    
    list.ownerId = req.user.id;
    list.image = {url, filename};
    // console.log(list);
    list.save();
    req.flash("success", "List Creat Successful");
    res.redirect("/");
} 

module.exports.show = async(req, res) => {
    let { id } = req.params;
    let list = await List.findByPk(id, { 
        include: [
            {
                model: db.review,
                include:
                {
                    model: db.user,
                    as: 'author',
                    attributes: ['id', 'email', 'name'],
                },
            },
            {
                model: db.user, as: 'owner',
                // model: db.user, as: 'author',
                // model: db.user,
                attributes: ['id', 'email', 'name']
            },
        ],

    });
        // attributes: ['image', 'description', 'title', 'location'],
    if(!list){
        req.flash("error", "List You Requested Is Not Exist!");
        res.redirect("/");
    }
    res.render("listings/show.ejs",{ list });
    // console.log(list.Reviews.author);
    // console.log(list.Reviews[0].author.name);
    // res.json(list);
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let list = await List.findByPk(id);
    if(!list){
        req.flash("error", "List You Requested Is Not Exist!");
        res.redirect("/");
    }
    res.render("listings/edit.ejs",{ list });
}

module.exports.update = async (req, res) => {
    let { id } = req.params;

    if(req.body.list.image == "" || req.body.list.image == null){
        delete req.body.list.image;
    }

    await List.update(req.body.list, {where: {id}, returning: true});

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename
        let newImage = {url, filename};
        await List.update({image: newImage}, {where: {id}, returning: true});
    }
    
    req.flash("success", "List Upadet Successful");
    res.redirect("/list/"+id);
}

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    let list = await List.findByPk(id);
    // if(list.ownerId != res.locals.user.id){
    //     req.flash("error", "You don't have permission to Delete list");
    //     return res.redirect("/list/"+id);    
    // }
    await List.destroy({where :{id}});
    req.flash("success", "List Delete Successful");
    res.redirect("/");

}