angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, HousingService) {
  $scope.places = $rootScope.results;
  $scope.doRefresh = function() {
    HousingService.SearchHousing("","","","","")
    .done(function(data) {
      console.log("Successfully retrieved " + data.length + " houses.");
      console.log(data);
      $rootScope.results = data;
      $scope.places = $rootScope.results;
      $scope.$broadcast('scroll.refreshComplete');
    })
    .fail(function (err) {
      console.log("Failed to retrieve posts.");
      console.log(err);
       $scope.$broadcast('scroll.refreshComplete');
    })
  }
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
})

.controller('FiltersCtrl', function($scope, $rootScope, $ionicHistory, HousingService) {
  // Set default state
  $scope.filters = true;
  $scope.qualify = true;
  $scope.status = "You don't qualify at this time";
  $scope.more_info_link = "Learn More";
  $scope.more_info = true;

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
  $scope.filter_form = {};

  $scope.showMoreInfo = function() {
    $scope.more_info = !$scope.more_info;
    $scope.more_info_link = $scope.more_info ? "Learn More" : "Close";
  }

  $scope.resetQualify = function() {
    localStorage.setItem('qualified', null);
    localStorage.setItem('income', null);
    localStorage.setItem('household', null);
  }

  $scope.qualifyIncome = function(income, household) {
    // Toggle filters/qualify view
    $scope.filters = false;
    $scope.qualify = false;

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
      $scope.not_qualified = true;
    }

    localStorage.setItem('qualified', qualifiedStatus);
    localStorage.setItem('income', income);
    localStorage.setItem('household', household);
  }

  $scope.applyFilters = function() {
    if($scope.filter_form == undefined)
    {
      return;
    }

    HousingService.SearchHousing($scope.filter_form.address, $scope.filter_form.zip, $scope.filter_form.bus, $scope.filter_form.dev, $scope.filter_form.type)
    .done(function(data) {
      console.log("Successfully retrieved " + data.length + " houses.");
      console.log(data);
      $rootScope.results = data;
    })
    .fail(function (err) {
      console.log("Failed to retrieve posts.");
      console.log(err);
    })
    .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  }

})

.controller('ResourcesCtrl', function($scope) {
  
})
.controller('SettingsCtrl', function($scope) {
  
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
    setTimeout(function() {
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

        google.maps.event.addDomListener(window, 'resize', function() {
          var center = $scope.map.getCenter();
          $scope.map.setCenter(center);
      // And aditionally you can need use "trigger" for real responsive
      google.maps.event.trigger($scope.map, "resize");
    });
    }, 500);

});
