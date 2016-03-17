angular.module('starter')

.config ($stateProvider,$urlRouterProvider) ->
   $stateProvider.state 'app',
        url: '/app'
        abstract: true
        templateUrl: 'app/shared/sidemenu/sidemenu.html'
        controller: 'AppCtrl'
    $urlRouterProvider.otherwise '/app/gallery'


.controller 'AppCtrl', 
    ($scope,$q,galleryFactory,$ionicPlatform) ->
        console.log $ionicPlatform.is('Web')
        # debugger
        # if $ionicPlatform.isWebView() then alert "HEJ"   