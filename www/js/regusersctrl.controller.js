
chatApp.controller('regUsersCtrl',
	[
		'$scope',
		'$timeout',
    '$ionicLoading',
    function(
      $scope,
      $timeout,
      $ionicLoading
    ){
          $ionicLoading.show({
            template: 'Loading Users'
          }).then(function(){
             console.log("The loading indicator is now displayed");
          });
          $timeout(function() {
            $ionicLoading.hide().then(function(){
               //console.log("The loading indicator is now hidden");
            });
          }, 6000);

    }])
