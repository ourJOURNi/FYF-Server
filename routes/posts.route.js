// User Posts
const express = require("express");
const router = express.Router();

var postController  = require('../controller/posts-controller');

router.get('/', postController.getPosts)
router.post('/post-info', postController.getPostInfo)

router.post('/add-text-post', postController.addTextPost)
router.post('/add-video-post', postController.addVideoPosts)
router.post('/add-photo-post', postController.addPhotoPosts)
// router.delete('/', postController.deletePost)

router.post('/follow', postController.followPost)
router.post('/unfollow', postController.unFollowPost)
router.post('/get-followed-posts', postController.getFollowedPosts)

router.post('/comment', postController.comment)
router.post('/delete-comment', postController.deleteComment)

router.post('/report', postController.reportComment)
router.post('/reply', postController.reportComment)

router.post('/up-vote-post', postController.upVotePost)
router.post('/down-vote-post', postController.downVotePost)
router.post('/up-vote-comment', postController.upVoteComment)
router.post('/down-vote-comment', postController.downVoteComment)




module.exports = router;