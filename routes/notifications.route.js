const express = require("express");
const router = express.Router();

var notificationController  = require('../controller/notifications-controller');

router.post('/', notificationController.getNotifications );
router.post('/clear-notifications', notificationController.clearNotifications);
router.post('/delete-notification', notificationController.deleteNotifications);
router.post('/comment-on-post-notification', notificationController.commentedOnPostNotification );
router.post('/reply-on-comment-notification', notificationController.replyToCommentNotification );
router.post('/followed-post-notification', notificationController.followedPostNotification );

module.exports = router;
