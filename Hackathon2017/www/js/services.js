angular.module('starter.services', [])

.service("HousingService", function() {
  this.GetPoints = function() {
    return jQuery.get({
          method: 'GET',
          url: 'http://52.35.144.231:4001/getpoints',
      });
  }
  this.SearchHousing = function(address, zip, bus, dev, type) {
    var address = (address == undefined || address == "") ? "" : "address="+address; 
    var zip = (zip == undefined || zip == "") ? "" : "zip="+zip; 
    var bus = (bus == undefined || bus == "") ? "" : "bus="+bus; 
    var dev = (dev == undefined || dev == "") ? "" : "dev="+dev; 
    var type = (type == undefined || type == "") ? "" : "type="+type;

    var first = true;
    var list = ['http://52.35.144.231:4001/search', address, zip, bus, dev, type];
    for(var i = 1; i < list.length; i++)
    {
      if(first && list[i] != "")  {
        list[0] = list[0] + "?" + list[i];
        first = false;
      }
      else if(list[i] != "") {
        list[0] = list[0] +"&" + list[i];
      }
    }

    return jQuery.get({
          method: 'GET',
          url: list[0]
      });
  }
})
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
