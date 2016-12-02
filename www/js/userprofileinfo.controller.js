chatApp.controller('userProfileInfoCtrl',[
'$scope',
'$stateParams',
'$ionicLoading',
'$firebaseArray',
'$firebaseAuth',
'$firebaseObject',
'$state',
'$rootScope',
'$ionicModal',
'$sessionStorage',
'$ionicPopup',
'loginStatusService',
'config',
function($scope,
        $stateParams,
        $ionicLoading,
        $firebaseArray,
        $firebaseAuth,
        $firebaseObject,
        $state,
        $rootScope,
        $ionicModal,
        $sessionStorage,
        $ionicPopup,
        loginStatusService,
        config
      ){

        userInfoRef = firebase.database().ref('registeredUsers/'+$stateParams.userId);
        userInfoRef.on('value',function(snapshot){

            $scope.friend = snapshot.val();
            $scope.perUsrMsg = $firebaseArray(firebase.database().ref('userMessages/'+$scope.loginUserName+":"+$scope.friend.name));
            console.log($scope.perUsrMsg);
        })
      }])
