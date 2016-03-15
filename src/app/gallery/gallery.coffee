angular.module('starter')

.config ($stateProvider,$urlRouterProvider) ->
   $stateProvider.state 'gallery',
        url: '/gallery'
        templateUrl: 'app/gallery/gallery.html'
    $urlRouterProvider.otherwise '/gallery'
        
