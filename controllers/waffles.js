import { render } from 'ejs'
import { Waffle } from "../models/waffle.js"
import { Profile } from "../models/profile.js"
import { Topping } from "../models/topping.js"

function newWaffle(req, res) {
  res.render('waffles/new')
}

function create(req, res){
  // add an owner to our waffle
  console.log(req.user.profile)
  req.body.owner = req.user.profile
  Waffle.create(req.body)
  .then (waffle => {
    res.redirect('/')
  })
}

function index(req, res) {
  Waffle.find({})
  .populate('owner')
  .then(waffles => {
    res.render('waffles/index', {
      waffles
    })
  })
}

function show(req, res){
  Waffle.findById(req.params.id)
  .populate('owner')
  .then(waffle => {
    Topping.find({_id: {$nin: waffle.toppings}})
    .then(toppingsNotOnWaffle => {
      res.render('waffles/show', {
        waffle,
        toppingsNotOnWaffle,
      })
    })
  })
}

function addTopping(req, res){
  // find the waffle
  Waffle.findById(req.params.id)
  .then(waffle => {
    // push the id of the topping into the topping array of object Ids
    waffle.toppings.push(req.body.toppingId)
    waffle.save()
    .then(savedWaffle => {
      savedWaffle.populate('owner')
      .then(savedPopulatedWaffle => {
        res.redirect(`/waffles/${req.params.id}`)
      })
    })
  })
    // redirect back to show view for waffle
}




function deleteWaffle(req, res){
  Waffle.findByIdAndDelete(req.params.id)
  .then (waffle => {
    res.redirect('/waffles')
  })
}


export {
  addTopping,
  show,
  index,
  create,
  newWaffle as new,
  deleteWaffle as delete,
}