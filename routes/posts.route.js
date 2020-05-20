// User Posts
const express = require("express");
const router = express.Router();

var postController  = require('../controller/posts-controller');

router.get('/', postController.getPosts)
router.post('/post-info', postController.getPostInfo)
// router.post('/edit-post', postController.editPost);
// router.delete('/delete-post', postController.deletePost)

router.post('/add-text-post', postController.addTextPost)
router.post('/add-video-post', postController.addVideoPosts)
router.post('/add-photo-post', postController.addPhotoPosts)

router.post('/follow', postController.followPost)
router.post('/unfollow', postController.unFollowPost)
router.post('/get-followed-posts', postController.getFollowedPosts)

router.post('/comment', postController.comment)
// router.post('/delete-comment', postController.deleteComment)
router.post('/edit-comment', postController.editCommment)

router.post('/report', postController.reportComment)
router.post('/reply-comment', postController.replyComment)
// router.post('/reply-reply', postController.replyReply)

router.post('/up-vote-post', postController.upVotePost)
router.post('/down-vote-post', postController.downVotePost)
router.post('/up-vote-comment', postController.upVoteComment)
router.post('/down-vote-comment', postController.downVoteComment)




module.exports = router;