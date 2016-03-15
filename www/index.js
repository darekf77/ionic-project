angular.module('starter', ['ionic']).run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    console.log('siema czernuchy');
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
