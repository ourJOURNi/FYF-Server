const User = require('../models/user.model');

exports.getNotifications = (req, res) => {
  console.log('Getting notifications...');
  console.log(req.body)
  email = req.body.email;

  // This call needs the Instigating User
  if (!email) {
    return res.status(400).json({msg: 'No User email in request.'})
  }

  User.find(
    {email: email},
    (err, user) => {
      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})
      return res.status(200).json(user[0]['notifications'])
    }
  )
}

exports.clearNotifications = (req, res) => {
  console.log('Clearing Notifications');
  email = req.body.email;

  if (!email) return res.status(400).json({msg: 'there is no email in the request'});

  User.findOneAndUpdate(
    {email: email},
    {$set: {notifications: [] }},
    {new: true},
    (err, user) => {
      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})
      return res.status(200).json(user.notifications)
    }
  )
}

exports.commentedOnPostNotification = (req, res) => {
  console.log('User has commented on Post Notification');

  let instigatingUser = req.body.instigatingUser;
  let recievingUser = req.body.recievingUser;
  let postID = req.body.postID;
  let commentID = req.body.commentID;

  if (!instigatingUser || !recievingUser || !postID || !commentID) {
    return res.status(400).json({msg: 'No instigatingUser, recievingUser, postID, or commentID in request.'})
  }

  let date = Date.now();
  let instigatingUserFullname;
  let instigatingUserProfilePicture;

  User.findOne(
    {email: instigatingUser},
    (err, user) => {
      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})

      instigatingUserProfilePicture = user['profilePicture'];
      instigatingUserFullname = user['fullName']

      let notification =  {
        instigatingUserProfilePicture,
        instigatingUserFullname,
        postID,
        commentID,
        date,
        message: `${instigatingUserFullname} has commented on your post.`
      }

      User.findOneAndUpdate(
        {email: recievingUser},
        {$push: {notifications: notification} },
        {new: true},
        (err, user) => {
          if(err) return res.status(400).json({msg: err})
          if(!user) return res.status(400).json({msg: 'there was no user with that email'})
          return res.status(200).json(user.notifications)
        }
      )
    }
  )
}

exports.replyToCommentNotification = (req, res) => {
  console.log('User has replied to Comment Notification');

  let instigatingUser = req.body.instigatingUser;
  let recievingUser = req.body.recievingUser;
  let postID = req.body.postID;
  let commentID = req.body.commentID;
  let replyID = req.body.replyID;

  if (!instigatingUser || !recievingUser || !postID || !commentID || !replyID) {
    return res.status(400).json({msg: 'No instigatingUser, recievingUser, postID, or commentID, replyID in request.'})
  }

  let date = Date.now();
  let instigatingUserFullname;
  let instigatingUserProfilePicture;

  User.findOne(
    {email: instigatingUser},
    (err, user) => {

      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})

      instigatingUserProfilePicture = user['profilePicture'];
      instigatingUserFullname = user['fullName']

      let notification =  {
        instigatingUserProfilePicture,
        instigatingUserFullname,
        postID,
        commentID,
        replyID,
        date,
        message: `${instigatingUserFullname} has replied on your comment.`
      }

      User.findOneAndUpdate(
        {email: recievingUser},
        {$push: {notifications: notification} },
        {new: true},
        (err, user) => {
          if(err) return res.status(400).json({msg: err})
          if(!user) return res.status(400).json({msg: 'there was no user with that email'})
          return res.status(200).json(user.notifications)
        }
      )
    }
  )
}

exports.reportedCommentNotification = (req, res) => {
  console.log('User has reported to Comment Notification');

  let instigatingUser = req.body.instigatingUser;
  let recievingUser = req.body.recievingUser;
  let postID = req.body.postID;
  let reportedCommentID = req.body.reportedCommentID;

  if (!instigatingUser || !recievingUser || !postID || !reportedCommentID) {
    return res.status(400).json({msg: 'No instigatingUser, recievingUser, postID, or reportedCommentID in request.'})
  }

  let date = Date.now();
  let instigatingUserFullname;
  let instigatingUserProfilePicture;

  User.findOne(
    {email: instigatingUser},
    (err, user) => {

      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})

      instigatingUserProfilePicture = user['profilePicture'];
      instigatingUserFullname = user['fullName']

      // TODO: Add comment contents

      let notification =  {
        instigatingUserProfilePicture,
        instigatingUserFullname,
        postID,
        reportedCommentID,
        date,
        message: `${instigatingUserFullname} has reported on your comment`
      }

      User.findOneAndUpdate(
        {email: recievingUser},
        {$push: {notifications: notification} },
        {new: true},
        (err, user) => {
          if(err) return res.status(400).json({msg: err})
          if(!user) return res.status(400).json({msg: 'there was no user with that email'})
          return res.status(200).json(user.notifications)
        }
      )
      })
}

exports.followedPostNotification = (req, res) => {
  console.log('User has followed to Post Notification');

  let instigatingUser = req.body.instigatingUser;
  let recievingUser = req.body.recievingUser;
  let postID = req.body.postID;

  if (!instigatingUser || !recievingUser || !postID) {
    return res.status(400).json({msg: 'No instigatingUser, recievingUser or postID in request.'})
  }

  let date = Date.now();
  let instigatingUserFullname;
  let instigatingUserProfilePicture;

  User.findOne(
    {email: instigatingUser},
    (err, user) => {

      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})

      instigatingUserProfilePicture = user['profilePicture'];
      instigatingUserFullname = user['fullName']

      // TODO: Add comment contents

      let notification =  {
        instigatingUserProfilePicture,
        instigatingUserFullname,
        postID,
        date,
        message: `${instigatingUserFullname} has followed your post.`
      }

      User.findOneAndUpdate(
        {email: recievingUser},
        {$push: {notifications: notification} },
        {new: true},
        (err, user) => {
          if(err) return res.status(400).json({msg: err})
          if(!user) return res.status(400).json({msg: 'there was no user with that email'})
          return res.status(200).json(user.notifications)
        }
      )
      })


}

