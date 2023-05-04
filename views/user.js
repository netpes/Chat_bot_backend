const express = require('express')
const router = express.Router();

const { createUser,getAllUser, login } = require('../controllers/userController');

router.post('/signup', createUser)
router.get('/adminChat', getAllUser)
router.post('/login', login)

module.exports = router;