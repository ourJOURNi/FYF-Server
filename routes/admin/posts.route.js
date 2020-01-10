const express = require("express");
const router = express.Router();

var postController  = require('../../controller/admin/posts-controller');

router.get('/', postController.getPosts)
router.get('/verify', postController.getPostsToBeVerified)

router.post('/verify-yes', postController.verifyYes)
router.post('/verify-no', postController.verifyNo)

router.post('/followers', postController.getFollowers)
router.get('/comments', postController.getComments)
router.get('/reported-comments', postController.getReportedComments)


// router.delete('/delete-post', postController.deletePost)
// router.delete('/delete-comment', postController.deleteComment)


module.exports = router;
