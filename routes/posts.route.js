// User Posts
const express = require("express");
const router = express.Router();

var postController  = require('../controller/posts-controller');

router.get('/', postController.getPosts)

router.post('/add-text-post', postController.addTextPost)
router.post('/add-video-post', postController.addVideoPosts)
router.post('/add-photo-post', postController.addPhotoPosts)

router.post('/follow', postController.followPost)
router.post('/unfollow', postController.unFollowPost)

router.get('/get-comments', postController.getComments)
router.post('/comment', postController.comment)
router.post('/delete-comment', postController.deleteComment)

router.post('/report', postController.reportPost)

router.post('/like-comment', postController.likeComment)
router.post('/unlike-comment', postController.unLikeComment)




module.exports = router;