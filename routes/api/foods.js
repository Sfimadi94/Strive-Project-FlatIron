const express = require('express')
const router = express.Router()

const Food = require('../../models/Food')

router.get('/', (req, res) => {
    Food.find()
    .then(foods => {
        res.json(foods);
      }).catch(err => { console.log(err)})
})

router.get('/:id', (req, res)=> {
    Food.findById(req.params.id)
    .then(food => res.json(food))
    .catch(err => res.status(404).json("Error: " + err))
})

router.post('/add', (req, res) => {
    const newFood = new Food({
        name: req.body.name,
        calories: Number(req.body.calories)
    })

    newFood.save()
    .then((item)=> res.json(item))
    .catch(err => res.status(400).json('Error: ', err))
})

router.delete('/:id', (req, res) => {
    Food.findById(req.params.id)
    .then(food => food.remove().then(() => res.json({success: true})))
    .catch(err => res.status(404).json({success: false}))

})


module.exports = router