$.get('/api/hotels', function(hotels) {
  hotels.forEach(function(item) {
    $('#hotel-choices').append('<option value="' + item.id + '">' + item.name + '</option>');
  });
});

$.get('/api/restaurants', function(restaurants) {
  restaurants.forEach(function(item) {
    $('#restaurant-choices').append('<option value="' + item.id + '">' + item.name + '</option>');
  });
});

$.get('/api/activities', function(activities) {
  activities.forEach(function(item) {
    $('#activity-choices').append('<option value="' + item.id + '">' + item.name + '</option>');
  });
});


