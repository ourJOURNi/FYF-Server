const express = require("express");
const router = express.Router();

var postController  = require('../../controller/admin/posts-controller');

router.get('/', postController.getPosts)
router.get('/verify', postController.getPostsToBeVerified)
router.get('/denied', postController.getDenied)
router.get('/reported-comments-archive', postController.getReportedArchive)

router.post('/verify', postController.verify)
router.post('/deny', postController.deny)
router.post('/deny', postController.goToReportedArchive)

router.post('/followers', postController.getFollowers)
router.get('/comments', postController.getComments)
router.get('/reported-comments', postController.getReportedComments)

router.delete('/delete-post/:_id', postController.deletePost)
router.delete('/delete-comment/:_id/:commentID' , postController.deleteComment)
router.delete('/delete-reported-comment/:_id/:commentID' , postController.deleteReportedComment)


module.exports = router;
