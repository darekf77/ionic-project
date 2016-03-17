
angular.module('starter', 
[ 
    'ionic'
    'ngResource'
    'ui.bootstrap'
    'ui.bootstrap.tpls'
    'jett.ionic.filter.bar'
    'angularGrid'
])


.run ($ionicPlatform) ->
  $ionicPlatform.ready ->
    if window.cordova and window.cordova.plugins.Keyboard
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
      cordova.plugins.Keyboard.disableScroll true
    if window.StatusBar
      StatusBar.styleDefault()

