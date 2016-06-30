var express = require('express');
var router = express.Router();

var Promise = require('bluebird');

var Day = require('../../models/day');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Place = require('../../models/place');

router.get('/', function(req, res, next) {
  Day.findAll()
  .then(function(days) {
    res.json(days);
  })
  .catch(next);
});

router.post('/add', function(req, res, next) {
  Day.findAll({})
    .then(function(days) {
      return days.length+1;
    })
    .then(function(num) {
      return Day.create({
        number: num
      })
    })
    .then(function(newDay) {
      res.json(newDay);
    })
    .catch(next);
});

router.get('/:id', function(req, res, next) {
  Day.findOne({
    where: {id: req.params.id}
  })
  .then(function(day) {
    res.json(day);
  })
  .catch(next);
});

router.post('/:id/delete', function(req, res, next) {
  Day.findOne({
    where: {number: req.params.id}
  })
  .then(function(day) {
    return day.destroy();
  })
  .then(function() {
    res.end()
  })
  .catch(next);
});

router.post('/:id/hotels/add', function(req, res, next) {
  console.log(req.body.name);
  var day = req.params.id;
  var dayPromise = Day.findOne({
    where: { number: day }
  });
  var hotelPromise = Hotel.findOne({
    where: {name: req.body.name } //need to do jQuery Post
  });
  Promise.all([dayPromise, hotelPromise])
  .then(function(results){
    return results[0].setHotel(results[1]);
  })
  .then(function(){
    res.json(req.body.name);
  });

});

router.post('/:id/restaurants/add', function(req, res, next) {
  var day = req.params.id;
  var dayPromise = Day.findOne({
    where: { number: day }
  });
  var restaurantPromise = Restaurant.findOne({
    where: {name: req.body.name } //need to do jQuery Post
  });
  Promise.all([dayPromise, restaurantPromise])
  .then(function(results){
    return results[0].addRestaurant(results[1]);
  })
  .then(function(){
    res.json(req.body.name);
  });

});

router.post('/:id/activitys/add', function(req, res, next) {
  var day = req.params.id;
  var dayPromise = Day.findOne({
    where: { number: day }
  });
  var activityPromise = Activity.findOne({
    where: {name: req.body.name } //need to do jQuery Post
  });
  Promise.all([dayPromise, activityPromise])
  .then(function(results){
    return results[0].addActivity(results[1]);
  })
  .then(function(){
    res.json(req.body.name);
  });
});

router.post('/:id/hotels/delete', function(req, res, next) {
  var day = req.params.id;
  var dayPromise = Day.findOne({
    where: {
      number: day
    }
  });
  var hotelPromise = Hotel.findOne({
    where: {
      name: req.body.name
    }
  });
  Promise.all([dayPromise, hotelPromise])
    .then(function(results) {
      results[0].removeHotel(results[1]);
    })
    .then(function() {
      res.end();
    });
});

router.post('/:id/restaurants/delete', function(req, res, next) {
  var day = req.params.id;
  var dayPromise = Day.findOne({
    where: {
      number: day
    }
  });
  var restaurantPromise = Restaurant.findOne({
    where: {
      name: req.body.name
    }
  });
  Promise.all([dayPromise, restaurantPromise])
    .then(function(results) {
      results[0].removeRestaurant(results[1]);
    })
    .then(function() {
      res.end();
    });
});

router.post('/:id/activitys/delete', function(req, res, next) {
  var day = req.params.id;
  var dayPromise = Day.findOne({
    where: {
      number: day
    }
  });
  var activityPromise = Activity.findOne({
    where: {
      name: req.body.name
    }
  });
  Promise.all([dayPromise, activityPromise])
    .then(function(results) {
      results[0].removeActivity(results[1]);
    })
    .then(function() {
      res.end();
    });
});

module.exports = router;
