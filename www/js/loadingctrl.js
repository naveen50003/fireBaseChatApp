chatApp.controller('LoadingCtrl', function($scope, $ionicLoading) {
    $ionicLoading.show({
      template: 'Loading...'
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
});
