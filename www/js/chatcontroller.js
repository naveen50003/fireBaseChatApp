
chatApp.controller('ChatCtrl',
	[
		'$scope',
		'$ionicLoading',
		'$firebaseArray',
		'$firebaseAuth',
		'$firebaseObject',
		'$state',
		'$rootScope',
		'$ionicModal',
		'$cookieStore',
		'$ionicPopup',
		'loginStatusService',
		'config',
		'$timeout',
		function(	$scope,
							$ionicLoading,
							$firebaseArray,
							$firebaseAuth,
							$firebaseObject,
							$state,
							$rootScope,
							$ionicModal,
							$cookieStore,
							$ionicPopup,
							loginStatusService,
							config,
							$timeout){

				console.log("hi controller");

				firebase.initializeApp(config);
				$scope.FBUser=	false;
		   	var userLoginName;
				var myConnectionsRef,lastOnlineRef,connectedRef,con,sessionRef,userINfoRef;
		   	$scope.errorMsg	=	{};
		   	$scope.messages	=	$firebaseArray(firebase.database().ref().child("messages"));
		  	$scope.status	=	$firebaseArray(firebase.database().ref().child("status"));
		   	$scope.users	=	$firebaseArray(firebase.database().ref().child("registeredUsers"));
				$scope.notify	=	$firebaseArray(firebase.database().ref().child("unreadMessages"));
			//    if(userINfoRef){
		// 		console.log(userINfoRef);
		// 		userINfoRef.on('value', function(snapshot) {

		// 	   		console.log("entered to listen messages addition");
		// 	   		console.log(snapshot.val());
		// 			$scope.messages.push(snapshot.val());
		//    		})
		//    }

				$ionicLoading.show({
					template: 'Loading...'
				}).then(function(){
					 console.log("The loading indicator is now displayed");
				});
				$timeout(function() {
					$ionicLoading.hide().then(function(){
						 //console.log("The loading indicator is now hidden");
					});
		    }, 3000);

		   //Listens Whether Current user SignedIn
		   firebase.auth().onAuthStateChanged(function(user) {

					if (user && loginStatusService.isSignUpCmpltFalg().isSignUpCompleted) {
						// User is signed in.
						console.log("user logged in");
						console.log(user);
						//$scope.loggedUser	=	user.email;

						//console.log(user);
						$scope.uid	=	user.uid;
						if(user.displayName){

								$scope.FBUser	=	true;
								if($cookieStore.loginUser){

										$scope.loginUserName	=	$scope.loggedUser	=	$cookieStore.get('loginUser');
										$scope.picUrl	=	$cookieStore.get('loginPic');
										$ionicLoading.hide().then(function(){
											console.log("The loading indicator is now hidden");
										});
									}else{

										$cookieStore.put('loginUser',user.displayName);
										$cookieStore.put('loginPic',user.photoURL);
										$scope.loggedUser	=	$scope.loginUserName	=	user.displayName;
										$scope.picUrl	=	user.photoURL;
										loginStatusService.loggingUserStatus($scope.loggedUser,$scope.uid,"",$scope.picUrl);
										//myConnectionsRef = firebase.database().ref('loginstatus/'+$scope.faceloggedUser+'/connections');
										//loggingUserStatus($scope.faceloggedUser);
										$ionicLoading.hide().then(function(){

											console.log("The loading indicator is now hidden");
										});
										$state.go('chat.groupchat');
									}
							}else{

									$scope.FBUser	=	false;
									if($cookieStore.loginUser){

										$scope.loggedUser	=	$cookieStore.get('loginUser');
										$scope.picUrl	=	$cookieStore.get('picUrl');
										$scope.uid	=	$cookieStore.get('UID');
										$state.go('chat.groupchat');
									}else{

										if($cookieStore.loginUserName){

												$scope.loginUserName	=	$cookieStore.get('loginUserName');
										}else{

											userINfoRef	=	firebase.database().ref().child("registeredUsers/" + user.uid);
											userINfoRef.on('value',function(snapshot){

													$cookieStore.put('loginUserName',snapshot.val().name);
													$cookieStore.put('picUrl',snapshot.val().picUrl);
													$cookieStore.put('UID',snapshot.val().UID);
													$scope.loginUserName	=	snapshot.val().name;
													$scope.picUrl	=	snapshot.val().picUrl;
													$scope.uid	=	snapshot.val().UID
											})
										}
										// $cookieStore.loginUser	= $scope.loggedUser	=	user.email;
											$cookieStore.put('loginUser',user.email);
										 	$scope.loggedUser	=	user.email;
											$state.go('chat.groupchat');
									//	$cookieStore.picUrl	=	$scope.picUrl	=	loginStatusService.getUserDetails().picUrl;
										//$cookieStore.loginUserName	=	$scope.loginUserName	=	user.name;
									}
							}
						//	console.log($scope.status);
							//console.log($scope.messages);
						}else{
								// No user is signed in.
								console.log("user not logged in");
						}

				//myConnectionsRef = firebase.database().ref('loginstatus/'+$scope.loggedUser+'/connections');
			});
			//var ref	=	new Firebase("https://fchat-app.firebaseio.com/");
			//$scope.messages	=	$firebaseArray(ref);
			//$scope.users	=	$firebaseAuth(ref);

			// $scope.users.$onAuth(function(authData){
			// 	if(authData){
			// 		$scope.signedInUser	=	authData;
			// 		console.log(authData);
			// 	}else{
			// 		$scope.signedInUser	=	null;
			// 	}
			// });

			//LogOUT Functionality
			$scope.hide = function(){
		    $ionicLoading.hide().then(function(){
		       console.log("The loading indicator is now hidden");
		    });
		  };
			$scope.logout	=	function(){

				firebase.auth().signOut().then(function(value) {

					console.log("signout successfully");
					console.log(value);
					$scope.errorMsg={};
				  var myConnectionRef	=	firebase.database().ref('status/'+$scope.uid+'/connections');
					myConnectionRef.child('ended').set(firebase.database.ServerValue.TIMESTAMP);
					$scope.login ={};
					$cookieStore.remove('loginUser');
					$cookieStore.remove('loginUserName');
					$state.go('signin');
				}, function(error) {
				// An error happened.
					console.log("signout unsuccessfully");
					$scope.errorMsg.value = error.message;
				});
			};

			//TO Store Chat Message
			$scope.chat={};

			//Create and Load the Modal
			$scope.message={}
			$ionicModal.fromTemplateUrl('./new-msg.html',function(modal){
				$scope.messageModal	=	modal;
			},{
				scope:$scope,
				animation:'slide-in-up'
			});

			$scope.showModal	=	function(){
				$scope.messageModal.show();
			}

			$scope.closeModal	=	function(){
				$scope.messageModal.hide();
			}

			$scope.addMessage	=	function(message){

					message.time	=	new Date().getTime();
					console.log($scope.message);
					// if($scope.faceloggedUser){
					// 	$scope.loggedUser=$scope.faceloggedUser
					// }
					var ref= firebase.database().ref('messages');
					ref.push({

							loginUserName:$scope.loginUserName,
							message:message.text,
							date: new Date().getTime(),
							UID:	$scope.uid
					})
					//$scope.messages1.push(message);
					$scope.message={};
					$scope.messageModal.hide();
					console.log($scope.messages);

			}
			console.log($scope.notify);
}]);
