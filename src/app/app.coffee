
angular.module('starter', 
[ 
    'ionic'
    'ngResource'
    'ui.bootstrap'
    'ui.bootstrap.tpls'
])
.run ($ionicPlatform) ->
  $ionicPlatform.ready ->
    if window.cordova and window.cordova.plugins.Keyboard
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
      cordova.plugins.Keyboard.disableScroll true
    if window.StatusBar
      StatusBar.styleDefault()

