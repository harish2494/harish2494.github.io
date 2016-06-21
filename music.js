angular.module('musicApp', ['ngResource','ui-listView', 'xeditable'])
  .controller('musicListController', ['$scope', 'TrackListService','UpdateTrackService' ,'UpdateGenreService', 'AddTrackService','AddGenreService', 'GenreListService', 'SearchService' ,function($scope, TrackListService, UpdateTrackService, UpdateGenreService, AddTrackService, AddGenreService, GenreListService, SearchService) {
      
      $scope.musics = [];
      $scope.musicsFiltered = [];
      $scope.genreList = [];
      $scope.selectedGenre = [];
      $scope.updatedGenre = [];
      $scope.selectedValues = [];
      $scope.results = [];
      $scope.ratings = ["1.0","2.0","3.0","4.0","5.0"]
      $scope.currentPage = 0;
      $scope.pageSize = 5;
      $scope.numberOfPages=function(){
          return Math.ceil($scope.musics.length/$scope.pageSize);                
      };
      
      $scope.numberOfGenrePages=function(){
          return Math.ceil($scope.genreList.length/$scope.pageSize);                
      };
      $scope.searchTrack = function(){
          var list = SearchService.get({title:$scope.search});
          $scope.results=[];
          list.$promise.then(function(data){
              data.forEach(function(value){
                  $scope.results.push(value);
              });
          });
          
      };
      $scope.addgenre = function() {
          AddGenreService.save({name: $scope.newGenre}, function(error){
              load_genres(); 
          });
      };
      
      $scope.getNumber = function(num) {
          num = Math.floor(parseFloat(num));
          return new Array(num);   
      };
      $scope.getRemain = function(num) {
          num = Math.floor(parseFloat(num));
          num = 5 - num;
          return new Array(num);   
      };
      
      $scope.addGenre = function() {
          if($scope.musicGenre){
          $scope.selectedGenre.push($scope.musicGenre.id);
          $scope.selectedValues.push($scope.musicGenre.name);
          $scope.musicGenre = null;
          }
          else{
              alert('Select a value to add');
          }
          
      };
      
      $scope.updateGenre = function(genre) {
          console.log(genre);
          
          if(genre != undefined ){
          //console.log($scope.musicGenre);
          $scope.updatedGenre.push(genre.id);
          $scope.selectedValues.push(genre.name);
              $scope.uGenre = null;
          }
          else{
              alert('Select a value to add');
          }
          
      };
            
      $scope.addmusic = function() {
          AddTrackService.save({title:$scope.musicTrack, rating:$scope.musicRating , genres: $scope.selectedGenre}, function(error){
              load_list(); 
          });
          $scope.selectedGenre = [];
          $scope.selectedValues = [];
      };
      
      $scope.update = function(index) {
          console.log(index);
          console.log($scope.musics);          
          UpdateTrackService.save({id: $scope.musics[index].id,title:$scope.musics[index].title, rating:$scope.musics[index].rating , genres: $scope.updatedGenre}, function(error){
              load_list();
              $scope.updatedGenre = [];
              $scope.selectedValues = [];
          });
      };
      
      
      $scope.updateSingleGenre = function(index) {
          console.log(index);
          UpdateGenreService.save({id: $scope.genreList[index].id,name: $scope.genreList[index].name}, function(error){
              load_genres();
          });
      };
      
      function load_list(){
          var list = TrackListService.query();
          $scope.musics =[];
          list.$promise.then(function(data){
              
              for(var s in data){
                  $scope.musics.push(data[s]);
              }
          });          
      }
      
      function load_genres(){
          var list = GenreListService.query();
          $scope.genreList =[];
          list.$promise.then(function(data){
              for(var s in data){
                  $scope.genreList.push(data[s]);
              }
          });          
      }
      
      load_list();
      load_genres();

  }])
    .filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
    })
  .factory('GenreService', function ($resource) {
    return $resource("http://104.197.128.152:8000/v1/genres/:id",{id:"@id"});
  })
  .factory('TrackListService', function ($resource) {
    return $resource("http://104.197.128.152:8000/v1/tracks");
  })
  .factory('GenreListService', function ($resource) {
    return $resource("http://104.197.128.152:8000/v1/genres");
  })
  .factory('AddTrackService', function ($resource) {
    return $resource("http://104.197.128.152:8000/v1/tracks", {title:"@title",rating:"@rating",genres:"@genres"});
})
  .factory('UpdateTrackService', function ($resource) {
    return $resource("http://104.197.128.152:8000/v1/tracks/:id", {id:"@id",title:"@title",rating:"@rating",genres:"@genres"});
}) 
  .factory('AddGenreService', function ($resource) {
    return $resource("http://104.197.128.152:8000/v1/genres", {name:"@name"});
})
    .factory('UpdateGenreService', function ($resource) {
    return $resource("http://104.197.128.152:8000/v1/genres/:id", {id:"@id",name:"@name"});
})
  .factory('SearchService', function ($resource) {
    return $resource("http://104.197.128.152:8000/v1/tracks", {title:"@title"},{
    get: {
        method: 'GET',
        isArray: true
    }});
})  
  .run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});;