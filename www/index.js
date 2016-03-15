angular.module('starter', ['ionic', 'ngResource', 'ui.bootstrap', 'ui.bootstrap.tpls']).run(function($ionicPlatform) {
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
    templateUrl: 'app/components/gallery/gallery.html',
    controller: 'GalleryController'
  });
  return $urlRouterProvider.otherwise('/gallery');
}).controller('GalleryController', function($scope, $q, galleryFactory) {
  var counterJSONid, getElements, prepareElement, tmpItem;
  prepareElement = function(item) {
    return angular.forEach(item.data, function(v, k) {
      var randomKittyId;
      randomKittyId = Math.floor(Math.random() * 10) + 1;
      return v.url = v.url + "?image=" + randomKittyId;
    });
  };
  $scope.totalItems = 0;
  tmpItem = [];
  counterJSONid = 1;
  getElements = (function(_this) {
    return function(counter) {
      var defer;
      defer = $q.defer();
      galleryFactory.get({
        id: counter
      }, function(item) {
        return item.$promise.then(function(data) {
          $scope.totalItems = data._meta.all;
          if (tmpItem.length <= $scope.totalItems) {
            $scope.model = data;
          }
          return defer.resolve();
        });
      }, function() {
        return defer.reject();
      });
      return defer.promise;
    };
  })(this);
  getElements(counterJSONid++);
  return $scope.eventHandler = {
    pageChanged: function(data) {},
    getMoreData: (function(_this) {
      return function() {
        return getElements(counterJSONid++);
      };
    })(this)
  };
});

angular.module('starter').factory('galleryFactory', function($resource) {
  return $resource("page-:id" + ".json", {
    id: '@id'
  }, 'get', {
    method: 'GET',
    isArray: false
  });
});

angular.module('starter').directive('galleryList', function() {
  return {
    templateUrl: 'app/shared/list/list.html',
    restrict: 'E',
    scope: {
      ngModel: "=",
      eventHandler: "=",
      totalItems: "="
    },
    link: function($scope, elem, attr, model) {
      var allFiles, elemenstOnPage, prepareArray, prepareDispalyFiles;
      elemenstOnPage = 10;
      $scope.currentPage = 1;
      $scope.maxSize = 2;
      $scope.filter = {
        startIndex: 0,
        item: {
          type: 2,
          thread: 0
        }
      };
      $scope.files = [];
      allFiles = [];
      $scope.setPage = function(pageNo) {
        console.info(pageNo);
        return $scope.currentPage = pageNo;
      };
      prepareArray = (function(_this) {
        return function() {
          return angular.forEach(allFiles, function(v, k) {
            if (_this.counter >= _this.bottomIndex && _this.counter < _this.topIndex) {
              $scope.files.push(v);
            }
            return ++counter;
          });
        };
      })(this);
      prepareDispalyFiles = (function(_this) {
        return function() {
          var promise;
          $scope.files.length = 0;
          _this.counter = 0;
          _this.bottomIndex = $scope.filter.startIndex;
          _this.topIndex = $scope.filter.startIndex + elemenstOnPage;
          if (topIndex >= allFiles.length) {
            promise = $scope.eventHandler.getMoreData();
            promise.then(function() {
              return console.info('New json is ok');
            }, function() {
              console.info('New json is bad');
              return prepareArray();
            });
            return;
          }
          return prepareArray();
        };
      })(this);
      $scope.pageChanged = function() {
        $scope.eventHandler.pageChanged({
          pageNum: $scope.currentPage,
          totalItems: $scope.totalItems
        });
        $scope.filter.startIndex = ($scope.currentPage - 1) * elemenstOnPage;
        return prepareDispalyFiles();
      };
      $scope.$watchCollection('ngModel.data', function(newValue, oldValue) {
        if (!newValue) {
          return;
        }
        angular.forEach(newValue, function(v, k) {
          return allFiles.push(v);
        });
        return prepareDispalyFiles();
      });
      return $scope.filterChanged = function() {
        return console.info($scope.filter);
      };
    }
  };
});

angular.module('starter');

angular.module('starter').directive('galleryListItem', function() {
  return {
    templateUrl: 'app/shared/list/item/list_item.html',
    restrict: 'E',
    scope: {
      url: '@itemUrl',
      filter: "="
    },
    replace: true,
    link: function($scope) {
      return $scope.hover = function() {
        return console.log('hower', $scope.filter);
      };
    }
  };
});
