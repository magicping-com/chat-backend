// var validator = require('validator');
const { Router } = require("express");
const router = Router();
const { new_user, new_channel, authenticate_socket } = require('../controllers/api')


router.post('/authenticate/', authenticate_socket)
router.post('/users/new/', new_user)
router.post('/channels/new/', new_channel)
// router.all('/channel/:id/', channel_detail)

module.exports = router;