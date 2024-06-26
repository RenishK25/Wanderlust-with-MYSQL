const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedin, isAuthor, validateReview } = require('../middleware.js');
const reviewController = require('../controllers/reviewController.js');

// router.post('/', isLoggedin, validateReview, reviewController.show);
router.post('/', isLoggedin, reviewController.create);

router.delete('/:reviewId', isLoggedin, isAuthor, reviewController.destroy);

module.exports = router;