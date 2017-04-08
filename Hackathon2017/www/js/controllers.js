angular.module('starter.controllers', [])


.controller('DashCtrl', function($scope, Places) {
  $scope.places = Places.all();
  $scope.remove = function(place) {
    Places.remove(place);
  };
})

.controller('PlaceDetailCtrl', function($scope, $stateParams, Places, $ionicHistory) {
  $scope.place = Places.get($stateParams.placeId);

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
})

.controller('AccountCtrl', function($scope, HousingService) {
  $scope.settings = {
    enableFriends: true
  }
  HousingService.GetPoints()
  .done(function(data) {
    console.log("Successfully retrieved posts.");
    console.log(data);
    $scope.points = data;
  })
  .fail(function (err) {
    console.log("Failed to retrieve posts.");
    console.log(err);
  });
})

.controller('QualifyCtrl', function($scope) {
  // Set modal/main default state
  $scope.modal = true;
  $scope.main = true;
  $scope.status = 'You may not qualify now but...';
  $scope.more_info_link = "Learn More";
  $scope.more_info = true;

  $scope.showMoreInfo = function() {
    $scope.more_info = !$scope.more_info;
    $scope.more_info_link = $scope.more_info ? "Learn More" : "See less"
  }

  $scope.qualifyIncome = function(income, household) {
    // Toggle modal/main view
    $scope.modal = false;
    $scope.main = false;

    qualifiedStatus = false;
    let median;

    switch(household) {
      case 0:
      case 1: median = 43600;
      case 2: median = 49800;
      case 3: median = 56050;
      case 4: median = 62250;
      case 5: median = 67250;
      case 6: median = 72250;
      case 7: median = 77200;
      default: median = 82200;
    }

    if (income < median) {
      // http://www.austintexas.gov/sites/default/files/files/2016_HOME_HUD_MFI_Limits_Eff_6-6-16__NHCD_FINAL.pdf
      qualifiedStatus = true;
      $scope.status = 'Congrats! You qualify!'
    }

    localStorage.setItem('qualified', qualifiedStatus);
    localStorage.setItem('income', income);
    localStorage.setItem('household', household);
  }
})

.controller('ResourcesCtrl', function($scope) {
  
})

.controller('MapCtrl', function($scope, $ionicLoading) {
    $scope.show = function() {
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.show($ionicLoading);
    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(30.2672, -97.7431);

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
        $scope.hide($ionicLoading);
    });

});
