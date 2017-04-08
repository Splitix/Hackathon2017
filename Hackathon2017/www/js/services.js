angular.module('starter.services', [])

.factory('Places', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var places = [{
    id: 0,
    name: 'Apartment 1',
    lastText: 'Address',
    face: 'img/ben.png',
    picture: 'img/apartment.png'
  }, {
    id: 1,
    name: 'Apartment 2',
    lastText: 'Address',
    face: 'img/max.png',
    picture: 'img/apartment.png'
  }, {
    id: 2,
    name: 'Apartment 3',
    lastText: 'Address',
    face: 'img/adam.jpg',
    picture: 'img/apartment.png'
  }, {
    id: 3,
    name: 'Home 1',
    lastText: 'Address',
    face: 'img/perry.png',
    picture: 'img/home.png'
  }, {
    id: 4,
    name: 'Apartment 4',
    lastText: 'Address',
    face: 'img/mike.png',
    picture: 'img/apartment.png'
  }];

  return {
    all: function() {
      return places;
    },
    remove: function(chat) {
      places.splice(places.indexOf(place), 1);
    },
    get: function(placeId) {
      for (var i = 0; i < places.length; i++) {
        if (places[i].id === parseInt(placeId)) {
          return places[i];
        }
      }
      return null;
    }
  };
});
