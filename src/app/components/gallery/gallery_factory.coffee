angular.module('starter')

.factory 'galleryFactory', ($resource) ->
    $resource "page-:id"+".json",
        id:'@id'
        'get'
            method:'GET'
            isArray:false 