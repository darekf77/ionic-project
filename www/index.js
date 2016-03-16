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

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('starter').directive('galleryList', function($timeout) {
  return {
    templateUrl: 'app/shared/list/list.html',
    restrict: 'E',
    scope: {
      ngModel: "=",
      eventHandler: "=",
      totalItems: "="
    },
    link: function($scope, elem, attr, model) {
      var allFiles, bottomIndex, defaultMaxSize, downloadMoreData, elemenstOnPage, fitDataAfterFiltering, prepareArray, prepareDispalyFiles, topIndex;
      elemenstOnPage = 10;
      $scope.currentPage = 1;
      defaultMaxSize = 3;
      $scope.maxSize = defaultMaxSize;
      bottomIndex = 0;
      topIndex = bottomIndex + elemenstOnPage;
      fitDataAfterFiltering = (function(_this) {
        return function(arrFiltr) {
          var counter, filtrArrDiff;
          filtrArrDiff = elemenstOnPage - arrFiltr.length;
          console.log('filtrArrDiff', filtrArrDiff);
          counter = 0;
          angular.forEach(allFiles, function(v, k) {
            var condition;
            condition = indexOf.call(arrFiltr, v) < 0 && filtrArrDiff > 0 && ++counter > bottomIndex && v.type === $scope.filter.item.type;
            if (condition) {
              return (function() {
                arrFiltr.push(v);
                return --filtrArrDiff;
              })();
            }
          });
          if (filtrArrDiff > 0 && topIndex < allFiles.length) {
            return downloadMoreData();
          }
        };
      })(this);
      $scope.filter = {
        startIndex: 0,
        item: {
          type: 2,
          typeItems: '2',
          thread: 0,
          sizeChanged: (function(_this) {
            return function(filteredArray) {
              return fitDataAfterFiltering(filteredArray);
            };
          })(this)
        }
      };
      console.info($scope.filter);
      $scope.files = [];
      allFiles = [];
      $scope.setPage = function(pageNo) {
        console.info(pageNo);
        return $scope.currentPage = pageNo;
      };
      prepareArray = (function(_this) {
        return function(destArray) {
          var counter;
          counter = 0;
          return angular.forEach(allFiles, function(v, k) {
            if (counter >= bottomIndex && counter < topIndex) {
              destArray.push(v);
            }
            return ++counter;
          });
        };
      })(this);
      downloadMoreData = (function(_this) {
        return function() {
          var promise;
          promise = $scope.eventHandler.getMoreData();
          return promise.then(function() {
            return console.info('New json is ok');
          }, function() {
            console.info('New json is bad');
            return prepareArray($scope.files);
          });
        };
      })(this);
      prepareDispalyFiles = (function(_this) {
        return function() {
          var counter, startAfterFiltering, tmp;
          $scope.files.length = 0;
          bottomIndex = $scope.filter.startIndex;
          counter = 0;
          startAfterFiltering = 0;
          if ($scope.filter.item.type !== 2 && $scope.currentPage > 1) {
            (function() {
              angular.forEach(allFiles, function(v, k) {
                if (counter === ($scope.currentPage - 1) * elemenstOnPage) {
                  return;
                }
                if (v.type === $scope.filter.item.type) {
                  ++counter;
                }
                return ++startAfterFiltering;
              });
              return bottomIndex = startAfterFiltering;
            })();
          }
          topIndex = bottomIndex + elemenstOnPage;
          tmp = [];
          prepareArray(tmp);
          if ($scope.filter.item.type !== 2 && $scope.currentPage > 1 && tmp.length < elemenstOnPage) {
            return (function() {
              console.log("tmp.length ", tmp.length);
              fitDataAfterFiltering(tmp);
              console.log("ALE PIZDA", tmp);
              return $timeout(function() {
                console.log("ALE PIZDA", tmp);
                return $scope.files = tmp;
              }, 0);
            })();
          } else {
            return (function() {
              if (topIndex >= allFiles.length) {
                downloadMoreData();
                return;
              }
              return prepareArray($scope.files);
            })();
          }
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
        $scope.filter.item.type = parseInt($scope.filter.item.typeItems);
        if ($scope.filter.item.type === 2) {
          $scope.maxSize = defaultMaxSize;
        } else {
          $scope.maxSize = 0;
        }
        return console.log($scope.filter.item.type);
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
      if (filter.type !== 2) {
        filter.sizeChanged(output);
      }
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
