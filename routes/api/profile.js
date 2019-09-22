const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator')



const Profile = require('../../models/Profile')
const User= require('../../models/User')


// @route GET /api/profile/me 
// @desc Get current user profiles
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', 
        ['name', 'avatar'])

        if (!profile){
            return res.status(400).json({msg: "No Profile Found"})
        }

        res.json(profile)

    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


// @route POST /api/profile
// @desc Create or Update Profile
// @access  Private

router.post('/', [auth, 
    [check('username', 'Username is required').not().isEmpty()]],
    async (req, res)=> {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {
            username,
            location,
            profession,
            bio,
            status,
            startingweight,
            goalweight,
            twitter,
            facebook,
            youtube,
            instagram
        } = req.body

        const profileFields = {};
        profileFields.user = req.user.id;

        if (username) profileFields.username = username
        if (location) profileFields.location = location
        if (profession) profileFields.profession = profession
        if (bio) profileFields.bio = bio
        if (status) profileFields.status = status
        if (startingweight) profileFields.startingweight = startingweight
        if (goalweight) profileFields.goalweight = goalweight

        profileFields.social = {}
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (youtube) profileFields.social.youtube = youtube;
        if (instagram) profileFields.social.instagram = instagram;


        try{
            let profile = await Profile.findOne({user: req.user.id})

            if (profile){
                profile = await Profile.findOneAndUpdate(
                { user: req.user.id}, 
                {$set: profileFields},
                { new: true}
                )
                return res.json(profile)

            }
            // Create

            profile = new Profile(profileFields)
            await profile.save()
            res.json(profile)


        }catch(err){
            console.error(err.message);
            res.status(500).send("Service Error")
        }


})


// @route GET /api/profile
// @desc Get all profiles
// @access  Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
        
    }
})


// @route GET /api/profile/user/:user_id
// @desc Get profile by userID
// @access  Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne(
            { user: req.params.user_id})
            .populate('user', ['name', 'avatar'])
        if(!profile) 
            return res.status(400).json({msg: "Profile Not Found"})

        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectID'){
            return res.status(400).json({msg: "Profile Not Found"})


        }
        res.status(500).send("Server Error")
        
    }
})

// @route DELETE /api/profile
// @desc Delete Profile, User, and Posts
// @access  Private

router.delete('/', auth, async (req, res) => {
    try {

        // removes profile
        await Profile.findOneAndRemove({user: req.user.id })
        // removes user
        await User.findOneAndRemove({_id: req.user.id })

        res.json({msg: "User Has Been Deleted"})
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
        
    }
})

module.exports = router