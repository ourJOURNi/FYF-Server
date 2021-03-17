const express           = require("express");
const router = express.Router();
var userController  = require('../controller/user-controller');

router.get('/', (req, res) => {
  console.log('Getting from API!')
  res.status(200).json({msg: 'I did it!'});
}
)
router.post('/', userController.loginUser);
// router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
//   return res.json({ msg: `Hey ${req.user.email}! I open at the close.` });
// });


module.exports = router;