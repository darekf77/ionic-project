angular.module('starter', ['ionic']).run(function($ionicPlatform) {
  return $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      return StatusBar.styleDefault();
    }
  });
});

angular.module('starter').config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('gallery', {
    url: '/gallery',
    templateUrl: 'app/gallery/gallery.html'
  });
  return $urlRouterProvider.otherwise('/gallery');
});


