chatApp.controller('signInController',
    [
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
                    $scope.$parent.errorMsg	=	{};
                    $scope.login ={};
                  //  $sessionStorage	=	{};
                    var userINfoRef;
                    $scope.registerClick	=	function(){

                      $scope.login  = {};
                  		$state.go('signup');
                  	}

                    $scope.authWithFb	=	function(){

                        var provider = new firebase.auth.FacebookAuthProvider();
                      //console.log("hi fab");
                      //  $sessionStorage.fBuser = true;
                      /* Authenication with seperate popup()

                      firebase.auth().signInWithPopup(provider).then(function(authData){
                        $scope.signedInUser	=	authData;
                      }).catch(function(error){
                        console.log(error);
                      });*/

                      /* Authenication IN same window without capturing token

                      firebase.auth().signInWithRedirect(provider)*/

                      //Authenication IN same window with capturing token
                      //provider.addScope('user_birthday');
                        firebase.auth().signInWithRedirect(provider);
                        firebase.auth().getRedirectResult()
                          .then(function(authData){

                              console.log("face Auth");
                              $state.go('loading');
                            }).catch(function(error){

                              $scope.errorMsg.value = error.message;
                                console.log(error);
                              });
                      }
                      $scope.signIn	=	function(credits){

  		                		firebase.auth().signInWithEmailAndPassword(credits.user,credits.pass)
                            .then(function(userData){

                          			console.log("Sign IN successfully");
                                $scope.login={};
                          			//console.log(userData);
                          			userINfoRef = firebase.database().ref('registeredUsers/'+userData.uid);
                                //console.log(userINfoRef);
                          			userINfoRef.on('value', function(snapshot) {

                          				console.log("data reterived after login");
                          				console.log(snapshot.val());
                                  //$scope.loginUserName  = snapshot.val().name;
                                  loginStatusService.loggingUserStatus(snapshot.val().name,userData.uid,snapshot.val().username,snapshot.val().picUrl);
                                  loginStatusService.setUserDetails(snapshot.val());
                          				// $state.go('chat.groupchat');
                          			});

                      			//$scope.login	=	{};
                      			//$scope.signedInUser	=	false;
                      			//$scope.signedInUser	=	false;
                    		    }).catch(function(error) {
                              		// Handle Errors here.
                                  var errorCode = error.code;
                                  var errorMessage = error.message;
                                  console.log("error while signup");
                                  var alertPopup = $ionicPopup.alert({
                                    title: 'Error Information',
                                    template: '<p>'+error.message+'</p>'
                                  });

                                  alertPopup.then(function(res) {
                                    console.log('Thank You');
                                  });
                  			         $scope.errorMsg.value = error.message;

                          			console.log($scope.errorMsg);
                        		// ...
                        		});
            	         }

  }])
