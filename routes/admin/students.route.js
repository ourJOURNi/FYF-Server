const express = require("express");
const router = express.Router();

var studentsController  = require('../../controller/admin/students-controller');

router.get('/', studentsController.getUsers);
router.post('/', studentsController.findUser);
router.delete('/delete/:id', studentsController.deleteUser);
router.post('/edit', studentsController.editUser);

module.exports = router;