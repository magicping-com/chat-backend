// var validator = require('validator');
const { Router } = require("express");
const router = Router();
const { channels_list, new_channel, channel_detail } = require('../controllers/channels')

// const User = require("../models/User");


// Get all users
router.get('/', async (req, res) => {
    res.render('index.html')
    // const users = await User.find({}).select({ "user_id": 1, "_id": 0 });
    // res.json(users);
});

router.get('/channels/', channels_list)
router.all('/channels/new/', new_channel)
router.all('/channel/:id/', channel_detail)
// router.get('/channels/delete/', delete_channel)

// Create new user
// router.post('/', async (req, res) => {
//     console.log(req.body);

//     const user = new User({
//         user_id: req.body.user_id
//     });

//     try {
//         const savedUser = await user.save();
//         res.json(savedUser);
//     } catch (error) {
//         res.status(409);
//         res.json({ message: error });
//     }
// });

module.exports = router;