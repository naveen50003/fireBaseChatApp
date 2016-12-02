chatApp.controller('signUpController',[
  '$scope',
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
  function( $scope,
            $ionicLoading,
            $firebaseArray,
            $firebaseAuth,
            $firebaseObject,
            $state,
            $rootScope,
            $ionicModal,
            $sessionStorage,
            $ionicPopup,
            loginStatusService){

      $scope.messages	=	$firebaseArray(firebase.database().ref().child("messages"));
      $scope.status	=	$firebaseArray(firebase.database().ref().child("status"));
      $scope.users	=	$firebaseArray(firebase.database().ref().child("registeredUsers"));
      $scope.register = {};
    //  $scope.isUpload = true;
      $scope.noImg  = false;
      var file = {};
      $scope.signUp	=	function(){

        $scope.login ={};
        firebase.auth().createUserWithEmailAndPassword($scope.register.user, $scope.register.pass)
          .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("error while signup");
                var alertPopup = $ionicPopup.alert({
                  title: 'Error Information',
                  template: error.message
                });

                alertPopup.then(function(res) {
                  console.log('Thank You');
                });
          // ...
          }).then(function(userData){

              console.log(userData);
              $scope.errorMsg={};
              if(userData){
                // $scope.users.$add({
                //   [userData.uid] :{
                //       username:credencials.user,
                //       password:credencials.pass,
                //       name:credencials.name,
                //       UID:	userData.uid
                //   	}
                // })
                var ref= firebase.database().ref('registeredUsers');
                //var profile_pic = 'gs://fchat-app.appspot.com/profile_pics/'+file.name;
                //Loading Image from firebase storage
                $ionicLoading.show({
                  template: 'Loading...'
                }).then(function(){
                   console.log("The loading indicator is now displayed");
                });
                if(!$scope.noImg){

                    file.name = 'jjj.jpg';
                }
                loginStatusService.setImgUrl(file.name).then(function(imgUrl){

                    ref.child(userData.uid).set({

                        username:$scope.register.user,
                        password:$scope.register.pass,
                        name:$scope.register.displayName,
                        UID:	userData.uid,
                        picUrl  : imgUrl.url
                    })
                    	$scope.hide();
                      var alertPopup = $ionicPopup.alert({

                        title: 'SignUp Confirm',
                        template: 'Registration SuccessFully Completed'
                      });

                      alertPopup.then(function(res) {
                        console.log('Thank You');
                      });
                      $scope.register ={};
                  })
              }
            });
        };
        $scope.signInBack	=	function(){

      		$state.go('signin');
      	}
        $scope.hide = function(){
  		    $ionicLoading.hide().then(function(){
  		       console.log("The loading indicator is now hidden");
  		    });
  		  };
        var uploader  = document.getElementById("uploader");
        var file;
        $scope.fileNameChanged  = function(e){

          $scope.noImg  = true;
          file  = e.files[0];
          var storageRef  = firebase.storage().ref('profile_pics/' + file.name);
          var task  = storageRef.put(file);
          loginStatusService.setUploadImgFile(file);
          //update progress bar

          task.on('state_changed',
            function progress(snapshot){

                var percentage  = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
                uploader.value  = percentage;
                // $scope.isUpload  = true;
                // if(percentage === 100){
                //     $scope.isUpload = true;
                // }
                console.log("upload false");
            },
            function error(err){

            },
            function complete(){

            }
          );
        }
}])
