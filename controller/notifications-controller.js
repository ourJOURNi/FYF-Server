const User = require('../models/user.model');

exports.getNotifications = (req, res) => {
  console.log('Getting notifications...');
  console.log(req.body)
  email = req.body.email;

  // This call needs the Instigating User
  if (!email) {
    return res.status(400).json({msg: 'No User email in request.'})
  }

  User.findOne(
    {email: email},
    (err, user) => {
      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})
      return res.status(200).json(user['notifications'])
    }
  )
}
exports.clearNotifications = (req, res) => {
  console.log('Clearing Notifications');
  email = req.body.email;
  console.log(req.body);
  

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
exports.deleteNotifications = (req, res) => {
  console.log('Deleting Notification ...');
  let notiID = req.body.notiID;
  let email = req.body.email;
  console.log(req.body);

  if (!email || !notiID) return res.status(400).json({msg: 'there is no email or  in the request'});

  User.findOneAndUpdate(
    {email: email},
    {$pull: {'notifications': { 'notiID': notiID } }},
    {new: true},
    (err, user) => {
      console.log(user.notifications)
      if(err) {
        console.log(err);
        return res.status(400).json({msg: err})
      }
      
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})
      console.log(`Deleted notification ${notiID}`)
      return res.status(200).json(user.notifications)
    }
  )
}
exports.commentedOnPostNotification = (req, res) => {
  console.log('User has commented on Post Notification');
  let instigatingUserFullname = req.body.instigatingUserFullname;
  let instigatingUserEmail = req.body.instigatingUserEmail;
  let instigatingUserProfilePicture;
  let recievingUserEmail = req.body.recievingUserEmail;
  let postID = req.body.postID;
  let commentID = req.body.commentID;
  let date = Date.now();

  console.log(instigatingUserEmail);
  console.log(recievingUserEmail);

  if (instigatingUserEmail === recievingUserEmail) {
    console.log('User commented on their own post, so they will not be notified');
    return res.status(403).json({msg: 'User commented on their own post, so they will not be notified'})
  }

  if (!instigatingUserEmail || !recievingUserEmail || !postID || !commentID) {
    return res.status(400).json({msg: 'No instigatingUser, recievingUser, postID, or commentID in request.'})
  }

  User.findOne(
    {email: instigatingUserEmail},
    (err, user) => {
      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})

      instigatingUserProfilePicture = user['profilePicture'];

      let notification =  {
        notiID: create_UUID(),
        instigatingUserFullname,
        instigatingUserEmail,
        instigatingUserProfilePicture,
        postID,
        commentID,
        date,
        message: `${instigatingUserFullname} has commented on your post.`
      }

      User.findOneAndUpdate(
        {email: recievingUserEmail},
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
  let instigatingUserProfilePicture;
  let recievingUser = req.body.recievingUser;
  let postID = req.body.postID;
  let commentID = req.body.commentID;
  let replyID = req.body.replyID;
  let date = Date.now();

  if (instigatingUser === recievingUser) {
    console.log('User commented on their own post, so they will not be notified');
    return res.status(403).json({msg: 'User commented on their own post, so they will not be notified'})
  }

  if (!instigatingUser || !recievingUser || !postID || !commentID || !replyID) {
    return res.status(400).json({msg: 'No instigatingUser, recievingUser, postID, or commentID, replyID in request.'})
  }

  User.findOne(
    {email: instigatingUser},
    (err, user) => {

      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})

      let notification =  {
        instigatingUserProfilePicture,
        instigatingUser,
        postID,
        commentID,
        replyID,
        date,
        message: `${instigatingUser} has replied on your comment.`
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
  let instigatingUserProfilePicture;
  let recievingUser = req.body.recievingUser;
  let postID = req.body.postID;
  let reportedCommentID = req.body.reportedCommentID;
  let date = Date.now();

  if (!instigatingUser || !recievingUser || !postID || !reportedCommentID) {
    return res.status(400).json({msg: 'No instigatingUser, recievingUser, postID, or reportedCommentID in request.'})
  }

  User.findOne(
    {email: instigatingUser},
    (err, user) => {

      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})

      // TODO: Add comment contents
      let notification =  {
        instigatingUserProfilePicture,
        instigatingUser,
        postID,
        reportedCommentID,
        date,
        message: `${instigatingUser} has reported on your comment`
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
  let instigatingUserProfilePicture;
  let recievingUser = req.body.recievingUser;
  let postID = req.body.postID;
  let date = Date.now();

  if (!instigatingUser || !recievingUser || !postID) {
    return res.status(400).json({msg: 'No instigatingUser, recievingUser or postID in request.'})
  }


  User.findOne(
    {email: instigatingUser},
    (err, user) => {

      if(err) return res.status(400).json({msg: err})
      if(!user) return res.status(400).json({msg: 'there was no user with that email'})

      instigatingUserProfilePicture = user['profilePicture'];
      instigatingUser = user['fullName']

      // TODO: Add comment contents

      let notification =  {
        instigatingUserProfilePicture,
        instigatingUser,
        postID,
        date,
        message: `${instigatingUser} has followed your post.`
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
function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxx-xxxx-4xxx-yxxx-xxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  console.log(uuid)
  return uuid;
}

