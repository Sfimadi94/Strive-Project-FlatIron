const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  workout: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      exercise: {
        type: String,
        required: true
      },
      set: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
          },
          rep: {
            type: String,
            required: true
          },
          weight: {
            type: String,
            required: true
          }
        }
      ]
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Workout = mongoose.model('workout', WorkoutSchema);
