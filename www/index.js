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
  var counterJSONid, getElements, prepareElement;
  prepareElement = function(item) {
    return angular.forEach(item.data, function(v, k) {
      var randomKittyId;
      randomKittyId = Math.floor(Math.random() * 10) + 1;
      return v.url = v.url + "?image=" + randomKittyId;
    });
  };
  $scope.totalItems = 0;
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
          $scope.model = data;
          return defer.resolve();
        }, function() {
          return defer.reject();
        });
      }, function() {
        return defer.reject();
      });
      return defer.promise;
    };
  })(this);
  getElements(counterJSONid++);
  return $scope.eventHandler = {
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

angular.module('starter').directive('galleryList', function($timeout, $filter) {
  return {
    templateUrl: 'app/shared/list/list.html',
    restrict: 'E',
    scope: {
      ngModel: "=",
      eventHandler: "=",
      totalItems: "="
    },
    link: function($scope, elem, attr, model) {
      var allFiles, bottomIndex, contains, countFilesWithType, defaultMaxSize, downloadMoreData, elemenstOnPage, emptyFn, fitExistingData, isFilteringMode, prepareArray, prepareDispalyFiles, tmpTotalFiltering, tmpTotalItems, topIndex;
      $scope.files = [];
      allFiles = [];
      tmpTotalItems = 0;
      elemenstOnPage = 10;
      $scope.currentPage = 1;
      defaultMaxSize = 3;
      $scope.maxSize = defaultMaxSize;
      bottomIndex = 0;
      topIndex = bottomIndex + elemenstOnPage;
      $scope.filter = {
        startIndex: 0,
        item: {
          type: 2,
          typeItems: '2',
          thread: 0
        }
      };
      isFilteringMode = (function(_this) {
        return function() {
          return $scope.filter.item.type !== 2;
        };
      })(this);
      contains = (function(_this) {
        return function(obj, destArray) {
          var tmp;
          tmp = false;
          angular.forEach(destArray, function(v, k) {
            if (v.id === obj.id) {
              return tmp = true;
            }
          });
          return tmp;
        };
      })(this);
      fitExistingData = (function(_this) {
        return function(arrFiltr) {
          var counter, filtrArrDiff;
          filtrArrDiff = elemenstOnPage - arrFiltr.length;
          counter = 0;
          return angular.forEach(allFiles, function(v, k) {
            var condition;
            condition = !contains(v, arrFiltr) && filtrArrDiff > 0 && ++counter > topIndex && v.type === $scope.filter.item.type;
            if (condition) {
              return (function() {
                arrFiltr.push(v);
                return --filtrArrDiff;
              })();
            }
          });
        };
      })(this);
      $scope.setPage = function(pageNo) {
        return $scope.currentPage = pageNo;
      };
      countFilesWithType = (function(_this) {
        return function(type) {
          var counter;
          counter = 0;
          angular.forEach(allFiles, function(v, k) {
            if (v.type === type) {
              return ++counter;
            }
          });
          return counter;
        };
      })(this);
      tmpTotalFiltering = false;
      prepareArray = (function(_this) {
        return function(destArray) {
          var beforeArr, counter, t;
          beforeArr = angular.copy(destArray);
          destArray.length = 0;
          t = allFiles;
          if (isFilteringMode()) {
            t = $filter('galleryFilter')(allFiles, $scope.filter.item);
          }
          counter = 0;
          angular.forEach(t, function(v, k) {
            if (counter >= bottomIndex && counter < topIndex && !contains(v, destArray)) {
              destArray.push(v);
            }
            return ++counter;
          });
          if (isFilteringMode() && destArray.length === 0) {
            return (function() {
              var newTotalItems;
              angular.forEach(beforeArr, function(v, k) {
                return destArray.push(v);
              });
              newTotalItems = countFilesWithType($scope.filter.item.type);
              return $timeout(function() {
                tmpTotalFiltering = true;
                return $scope.totalItems = newTotalItems;
              }, 0);
            })();
          } else if (destArray.length !== 0) {
            return $timeout(function() {
              if (tmpTotalFiltering) {
                return tmpTotalFiltering = false;
              } else {
                return $scope.totalItems = tmpTotalItems;
              }
            }, 0);
          }
        };
      })(this);
      emptyFn = (function(_this) {
        return function() {};
      })(this);
      downloadMoreData = (function(_this) {
        return function() {
          var promise;
          promise = $scope.eventHandler.getMoreData();
          return promise.then(emptyFn, function() {
            return prepareArray($scope.files);
          });
        };
      })(this);
      prepareDispalyFiles = (function(_this) {
        return function() {
          bottomIndex = $scope.filter.startIndex;
          topIndex = bottomIndex + elemenstOnPage;
          prepareArray($scope.files);
          if ($scope.files !== elemenstOnPage && isFilteringMode() && allFiles.length < $scope.totalItems) {
            fitExistingData($scope.files);
          }
          if (($scope.files !== elemenstOnPage && isFilteringMode() && allFiles.length < $scope.totalItems) || (!isFilteringMode() && topIndex >= allFiles.length)) {
            return downloadMoreData();
          }
        };
      })(this);
      $scope.pageChanged = function() {
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
        tmpTotalItems = $scope.totalItems;
        return prepareDispalyFiles();
      });
      return $scope.filterChanged = function() {
        $scope.filter.item.type = parseInt($scope.filter.item.typeItems);
        if (!isFilteringMode()) {
          $scope.maxSize = defaultMaxSize;
        } else {
          $scope.maxSize = 0;
        }
        return prepareDispalyFiles();
      };
    }
  };
});

angular.module('starter').filter('galleryFilter', (function(_this) {
  return function() {
    return function(input, filter) {
      var output;
      output = [];
      angular.forEach(input, function(v, k) {
        var typeState;
        typeState = true;
        if (filter.type !== 2 && filter.type !== v.type) {
          typeState = false;
        }
        if (typeState) {
          return output.push(v);
        }
      });
      return output;
    };
  };
})(this));

angular.module('starter').directive('galleryListItem', function($timeout) {
  return {
    templateUrl: 'app/shared/list/item/list_item.html',
    restrict: 'E',
    scope: {
      url: '@itemUrl',
      id: '@itemId',
      type: '=itemType',
      thread: '=itemThread',
      filter: "="
    },
    replace: true,
    link: function($scope, elem) {
      $scope.hover = (function(_this) {
        return function() {
          angular.element(elem).parent().find('.' + $scope.thread).addClass('shine');
        };
      })(this);
      return $scope.leave = (function(_this) {
        return function() {
          angular.element(elem).parent().find('.' + $scope.thread).removeClass('shine');
        };
      })(this);
    }
  };
});
