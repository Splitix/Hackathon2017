angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope) {
  
})
.controller('DashCtrl', function($scope, $rootScope, $ionicLoading, HousingService) {
  $scope.show = function() {
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    };

  $scope.show($ionicLoading);
  $rootScope.resultsFound = 0;  
  $scope.places = $rootScope.results;
  $rootScope.filter_form = {};
  $rootScope.filter_form.address = "", $rootScope.filter_form.zip = "", 
  $rootScope.filter_form.bus = "", $rootScope.filter_form.dev = "", 
  $rootScope.filter_form.type = "";
  $scope.doRefresh = function() {
    HousingService.SearchHousing($rootScope.filter_form.address, $rootScope.filter_form.zip, $rootScope.filter_form.bus, $rootScope.filter_form.dev, $rootScope.filter_form.type)
    .then(function(res) {
      $rootScope.resultsFound = res.data.length;
     var images = ['apartment.png', 'apartment1.png', 'apartment2.png', 'apartment3.png',
      'home1.png', 'home2.png', 'home4.png'];
      

      for(var i = 0; i < res.data.length; i++) {
        res.data[i].img = 'img/' + images[Math.floor(Math.random() * images.length)];
      }
      $rootScope.results = res.data;

      $scope.places = $rootScope.results;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.hide();
    })
  }
  // initial refresh
   $scope.doRefresh();
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

.controller('FiltersCtrl', function($scope, $rootScope, $ionicHistory, HousingService, $state) {
  // Set default state
  $scope.filters = true;
  $scope.qualify = true;
  $scope.status = "You don't qualify at this time";
  $scope.more_info_link = "Learn More";
  $scope.more_info = true;

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
  

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
    if($rootScope.filter_form == undefined)
    {
      return;
    }

    HousingService.SearchHousing($rootScope.filter_form.address, $rootScope.filter_form.zip, $rootScope.filter_form.bus, $rootScope.filter_form.dev, $rootScope.filter_form.type)
    .then(function(res) {
      $rootScope.resultsFound = res.data.length;
      $rootScope.results = res.data;
      $state.go('tab.dash');
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
        template: '<p class="spinner">Loading...</p><ion-spinner></ion-spinner>'
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
