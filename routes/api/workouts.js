const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Workout = require('../../models/Workout');
const Exercise = require('../../models/Exercise');

// @route POST /api/workouts
// @desc Create a workout
// @access  Private

router.post(
  '/',
  [
    auth,
    [
      check('name', 'Workout name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // const {userId} = req.params
      const user = await User.findById(req.user.id).select('--password');
      // const exercise = await Exercise.findById(req.exercise.id);

      const newWorkout = new Workout({
        name: req.body.name,

        description: req.body.description,
        user: req.user.id
      });

      const workout = await newWorkout.save();
      res.json(workout);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
);

// @route GET /api/workouts
// @desc GET all workout
// @access  Private

router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

// @route PUT /api/workout
// @desc Add an exercise to the workout
// @access Private

router.put(
  '/workout',
  [
    auth,
    [
      check('exercise', 'Name Of Exercise is Required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { exercise } = req.body;

    const newExercise = {
      user: req.user.id,
      exercise
    };
    try {
      const workouts = await Workout.findOne({user: req.user.id})

      workouts.workout.unshift(newExercise)
      await workouts.save()

      res.json(workouts)

    } catch (err) {
      console.error(err.message)
      res.status("Server Error")
    }
  }
);

// @route PUT /api/workout/set
// @desc Add an exercise to the workout
// @access Private

router.put('/workout/set', auth, async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {rep, weight} = req.body

  const newSet = {
    user: req.user.id,
    rep,
    weight
  }


  try {
   
  // const workouts = await Workout.findOne({user: req.user.id})
    const workouts = await Workout.findOne({user: req.user.id})

    workouts.workout[0].set.unshift(newSet)
    // workouts.workout.unshift(newSet);
    await workouts.save();
    res.json(workouts);
    
  } catch (err) {
    console.error(err.message)
    res.status("Server Error")
    
  }
})



// @route GET /api/workouts/:id
// @desc Get workouts by Id
// @access  Private

router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: 'Workout Not Found' });
    }

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Workout Not Found' });
    }
    res.status(500).json('Sever Error');
  }
});

// @route DELETE /api/workouts/:id
// @desc Delete workouts by Id
// @access  Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const workouts = await Workout.findById(req.params.id);

    if (!workouts) {
      return res.status(404).json({ msg: 'Workout Not Found' });
    }

    // Check User
    if (workouts.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Not Authorized' });
    }

    await workouts.remove();

    res.json({ msg: 'Workout Removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Workout Not Found' });
    }
    res.status(500).json('Server Error');
  }
});

// @route POST /api/workouts/workout/:id
// @desc Create an exercise onto a workout
// @access  Private

router.post(
  '/workout/:id',
  [
    auth,
    [
      check('exercise', 'Exercise name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // const {userId} = req.params
      const user = await User.findById(req.user.id).select('--password');
      const workouts = await Workout.findById(req.params.id);

      const newExercise = {
        exercise: req.body.exercise,
        user: req.user.id
      };

      workouts.workout.unshift(newExercise);

      await workouts.save();
      res.json(workouts.workout);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
);

// @route DELETE /api/workouts/workout/:id/:workout_id
// @desc Delete a sub workout
// @access  Private

router.delete('/workout/:id/:workout_id', auth, async (req, res) => {
  try {
    const workouts = await Workout.findById(req.params.id);

    const workout = workouts.workout.find(
      workout => workout.id === req.params.workout_id
    );

    if (!workout) {
      return res.status(404).json({ msg: 'Workout does not exist' });
    }

    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Not Authorized' });
    }

    const removeIndex = workouts.workout
      .map(workout => workout.user.toString())
      .indexOf(req.user.id);

    workouts.workout.splice(removeIndex, 1);

    await workouts.save();

    res.json(workouts.workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});


// @route POST /api/workouts/workout/:id/
// @desc Add set to a workout
// @access  Private

router.post('/workout/:id/:workout_id', [
  auth,
  [
    check('rep', 'Rep amount is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      // const user = await User.findById(req.user.id).select('--password');

      // const workouts = await Workout.findById(req.params.id);
      const workouts = await Workout.findById(req.params.id);

      const workout = workouts.workout.find(
        workout => workout.id === req.params.workout_id
      );

      const newSet = {
        user: req.user.id,
        rep: req.body.rep,
        weight: req.body.weight
      };

      workout.set.unshift(newSet);
      await workouts.save();
      res.json(workout);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
]);

// @route DELETE /api/workouts/workout/:id/:workout_id/:set_id
// @desc Delete a set from a workout
// @access  Private

router.delete(
  '/workout/set/:id/:workout_id/:set_id',
  auth,
  async (req, res) => {
    try {
      const workouts = await Workout.findById(req.params.id);

      const workout = workouts.workout.find(
        workout => workout.id === req.params.workout_id
      );

      const set = workout.set.find(set => set.id === req.params.set_id);

      if (!set) {
        return res.status(404).json({ msg: 'Set does not exist' });
      }

      if (set.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User Not Authorized' });
      }

      const removeIndex = workout.set
        .map(set => set.user.toString())
        .indexOf(req.user.id);

      workout.set.splice(removeIndex, 1);

      await workouts.save();

      res.json(workouts);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
);

module.exports = router;
