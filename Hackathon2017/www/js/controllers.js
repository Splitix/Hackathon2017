angular.module('starter.controllers', [])


.controller('DashCtrl', function($scope, Places) {
  $scope.places = Places.all();
  $scope.remove = function(place) {
    Places.remove(place);
  };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


})

.controller('PlaceDetailCtrl', function($scope, $stateParams, Places, $ionicHistory) {
  $scope.place = Places.get($stateParams.placeId);

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  }
})

.controller('QualifyCtrl', function($scope) {
  $scope.more_info_link = "Learn More";
  $scope.more_info = true;
  $scope.showMoreInfo = function() {
    $scope.more_info = !$scope.more_info;
    $scope.more_info_link = $scope.more_info ? "Learn More" : "See less"
  };

  $scope.qualifyIncome = function(income) {
    qualifiedStatus = false;
    // http://www.austintexas.gov/sites/default/files/files/2016_HOME_HUD_MFI_Limits_Eff_6-6-16__NHCD_FINAL.pdf
    if (income < 77800) {
      qualifiedStatus = true;
    }

    localStorage.setItem('qualified', qualifiedStatus);
  }
})

.controller('MapCtrl', function($scope, $ionicLoading) {

    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });

        $scope.map = map;
    });

});
