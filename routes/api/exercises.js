const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Exercise = require('../../models/Exercise');
const Workout = require('../../models/Workout')



// @route POST /api/exercises
// @desc Create an exercise
// @access  Private

router.post(
  '/',
  [
    auth,
    [
      check('name', 'Exercise name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const user = await User.findById(req.user.id).select('--password')
        // const workout = await Workout.findById(req.workout.id)




    const newExercise = new Exercise({
        user: req.user.id,
        // workout: req.workout._id,
        name: req.body.name,
        set: req.body.weight,
        rep: req.body.rep,
        weight: req.body.weight


    })

        const exercise = await newExercise.save()
        res.json(exercise)

        
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server Error")
        
    }

  }
);

// @route GET /api/exercises
// @desc Get All exercises
// @access  Private


router.get('/', auth, async (req, res)=> {
    try {
        const exercise = await Exercise.find().sort({date: -1})
        res.json(exercise)
       
        
    } catch (err) {
        console.error(err.message)
        res.status(400).json("Server Error")
        
    }
})

// @route GET /api/exercises/:id
// @desc Get exercises by Id
// @access  Private

router.get('/:id', auth, async (req, res)=> {
    try {
        const exercise = await Exercise.findById(req.params.id)

        if(!exercise){
            return res.status(404).json({msg: "Exercise Not Found"})
        }

        res.json(exercise)
        
    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: "Exercise Not Found"})
        }
        res.status(500).json("Sever Error")

    }
})

// @route DELETE /api/exercises/:id
// @desc Delete an exercise
// @access  Private

router.delete('/:id', auth, async (req, res)=> {
    try {
        const exercise = await Exercise.findById(req.params.id)
        

        if(!exercise){
            return res.status(404).json({msg: "Exercise Not Found"})
        }
        
        if(exercise.user.toString() !== req.user.id){
            res.status(401).json({msg: "User Not Authorized"})
        }

        await exercise.remove()

        res.json({msg: "Exercise has been deleted"})
        
    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: "Exercise Not Found"})
        }

        res.status(500).json("Sever Error")
        
    }
})

// @route PUT /api/exercises/exerice
// @desc Create an exercise
// @access  Private

// router.put('/exercise', [auth], async (req, res)=> {
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({errors: errors.array()})
//     }
//     // const user = await User.findById(req.user.id).select('--password')


//     const {
//         name,
//         sets,
//         weight,
//         date
//     } = req.body

//     const newExercise = {
//         name,
//         sets,
//         weight,
//         date
//     }

//     try {
//         const workout = await Exercise.findOne({user: user.req.id})

//         workout.exercise.unshift(newExercise)

//         await workout.save()

//         res.json(workout)
//     } catch (err) {
//         console.log(err.message)
//         res.status(500).send("Server Error")
        
//     }
// })



module.exports = router;

