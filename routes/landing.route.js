const express           = require("express");
const router = express.Router();
var userController  = require('../controller/user-controller');

router.get('/', (req, res) => { res.send('Tracy. Your pussy tastes really, really, REALLY good')});

router.post('/', userController.loginUser);
// router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
//   return res.json({ msg: `Hey ${req.user.email}! I open at the close.` });
// });


module.exports = router;