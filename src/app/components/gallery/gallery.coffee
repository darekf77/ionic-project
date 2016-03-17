angular.module('starter')

.config ($stateProvider,$urlRouterProvider) ->
   $stateProvider.state 'app.gallery',
        url: '/gallery'
        views:
            'menuContent':
                templateUrl: 'app/components/gallery/gallery.html'
                controller: 'GalleryController'
        
.controller 'GalleryController', 
    ($scope,$q,galleryFactory,$ionicFilterBar) ->        
    
        # $ionicFilterBar.show()
    
    
        $scope.totalItems = 0        
        counterJSONid =1         
        getElements = (counter) =>
            defer = $q.defer();
            galleryFactory.get id:counter , (item) =>            
                item.$promise.then (data) =>
                    $scope.totalItems = data._meta.all
                    $scope.model = data
                    defer.resolve();
                , () =>
                    defer.reject()
            , () =>
                defer.reject()
            defer.promise
            
        getElements(counterJSONid++)
    
        $scope.eventHandler = 
            getMoreData: () =>
                getElements(counterJSONid++)
                
                