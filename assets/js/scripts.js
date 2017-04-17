var app = angular.module('MusicTrack', ['ngRoute', 'ngResource']);



app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('!');

    $routeProvider

        .when('/', {
        templateUrl: 'views/home.html'
    })


    .otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
}]);



app.controller('MainCtrl', function($scope, $location, GetAllTracksService, GetOneTrackService, GetAllGenresService, GetTrackFromTitleService, GetOneGenreService) {
    $scope.setRoute = function(route) {
        $location.path(route);
    }
    $scope.tracks = GetAllTracksService.get();
    $scope.errorFlag = false;
    $scope.showBtn = false;


    $scope.pageNext = function() {


        if ($scope.tracks.next != null) {
            var path = $scope.tracks.next.split('page=');
            $scope.tracks = GetAllTracksService.get({ page: path[1] });
        }
    };

    $scope.pagePrev = function() {


        if ($scope.tracks.previous != null) {
            var path = $scope.tracks.previous.split('page=');
            $scope.tracks = GetAllTracksService.get({ page: path[1] });
        }
    };

    $scope.getTrack = function($id) {

        $scope.showBtn = false;
        jQuery('#myCarouselSingle .item').removeClass("active");
        jQuery('#myCarouselSingle .item:first').addClass("active");
        jQuery('#single-track-popup').modal('show');
        $scope.music = GetOneTrackService.get({ tracks: $id });
    }


    $scope.editTrack = function($id) {
        jQuery('#single-track-popup').modal('hide');
        jQuery('#add-New-Track-popup').modal('show');
        $scope.addNewTrackMenu($id);
    }

    $scope.addNewTrackMenu = function($id) {
        jQuery('#myCarousel .item').removeClass("active");
        jQuery('#myCarousel .item:first').addClass("active");
        $scope.errorFlag = false;
        $scope.genres = GetAllGenresService.get();
        if ($id) {
            $scope.musicAddEdit = GetOneTrackService.get({ tracks: $id });
            $scope.editTrackId = $id;
        }
    }


    $scope.continue = function() {

        if (jQuery('#track-name').val() && jQuery('#track-rating input[name="ratings"]:checked').val()) {
            $scope.errorFlag = false;
            jQuery('#myCarousel').carousel('next');
        } else {
            $scope.errorFlag = true;

        }
    }

    $scope.editGenrePopup = function() {
        jQuery('#edit-genre-popup').modal('show');
        $scope.genres = GetAllGenresService.get();
        jQuery("#genre-id").val("");
        jQuery("#genre-name").val("");

    }
    $scope.editGenre = function($id, $name) {
        if ($scope.genreId != $id) {
            $scope.genreId = $id;
            $scope.addGenre = $name;
            $scope.showAddGBtn();
            jQuery(".genre-label").removeClass('genre-label-active');
            jQuery("#genre-label-" + $id).addClass('genre-label-active');
        } else {
            $scope.genreId = '';
            $scope.addGenre = '';
            jQuery(".genre-label").removeClass('genre-label-active');
        }
    }
    $scope.showAddGBtn = function() {
        $scope.showBtn = true;
    }

    $scope.addNewGenre = function() {
        jQuery('#myCarouselSingle').carousel('next');

    }

    $scope.saveGenre = function(addGenre, id) {
        addGenre = jQuery("#genre-name").val(); //$scope.addGenre;
        id = jQuery("#genre-id").val(); //$scope.genreId;
        if (id) {
            returnValue = GetOneGenreService.save({ id: id, name: addGenre });
        } else {
            returnValue = GetAllGenresService.save({ name: addGenre });
        }
        if (returnValue) {
            jQuery("#edit-genre-popup").modal('hide');

        }

    }



    var selectedGenres = [];

    $scope.pageGNext = function() {


        jQuery("#myCarousel input[name='generes']:checked").each(function() {

            var i = selectedGenres.length;

            selectedGenres[i] = this.value;

        });


        if ($scope.genres.next != null) {
            var path = $scope.genres.next.split('page=');
            $scope.genres = GetAllGenresService.get({ page: path[1] });
        }
    };



    $scope.AddNewTrack = function() {

        var titleTrack = jQuery('#track-name').val();
        var ratings = jQuery('#track-rating input[name="ratings"]:checked').val();
        jQuery("#myCarousel input[name='generes']:checked").each(function() {

            var i = selectedGenres.length;

            selectedGenres[i] = this.value;

        });
        if ($scope.editTrackId) {
            var returnValue = GetOneTrackService.save({ id: $scope.editTrackId, title: titleTrack, rating: ratings, genres: selectedGenres });
            $scope.editTrackId = null;
        } else {
            var returnValue = GetAllTracksService.save({ title: titleTrack, rating: ratings, genres: selectedGenres });
        }
        if (returnValue) {
            jQuery("#add-New-Track-popup").modal('hide');
        }

    }

    $scope.searchTrack = function(searchTitle) {
        $scope.tracks = GetTrackFromTitleService.get({ title: searchTitle });
    }

});


app.factory('GetAllTracksService', function($resource) {
    return $resource('http://104.197.128.152:8000/v1/tracks:pgnum', { page: "@pgnum" });

});



app.factory('GetOneTrackService', function($resource) {
    return $resource('http://104.197.128.152:8000/v1/tracks/:tracks', { tracks: "@id" });

});


app.factory('GetAllGenresService', function($resource) {
    return $resource('http://104.197.128.152:8000/v1/genres:pgnum', { page: "@pgnum" });
});


app.factory('GetOneGenreService', function($resource) {
    return $resource('http://104.197.128.152:8000/v1/genres/:genres', { genres: "@id" });
});


app.factory('GetTrackFromTitleService', function($resource) {
    return $resource('http://104.197.128.152:8000/v1/tracks', { title: "@name" });

});
