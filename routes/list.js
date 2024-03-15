const express = require('express');
const router = express.Router();
const { isLoggedin, isOwner, validateList } = require('../middleware.js');
const listController = require('../controllers/listController.js');
const multer  = require('multer');
const { storage }  = require('../cloudConfing.js');

const upload = multer({ storage });

router.route("/add")
    .get(isLoggedin, listController.add)
    
    .post(isLoggedin, upload.single("list[image]"), validateList, listController.create);

router.route("/:id")
    .get(listController.show)
    
    .delete(isLoggedin, isOwner, listController.destroy);

router.route("/:id/edit")
    .get(isLoggedin, isOwner, listController.edit)
    
    .put(isLoggedin, isOwner, listController.update);

module.exports = router;