chatApp.controller('ChatCtrl',function($scope,$firebaseArray,$firebaseAuth,$state,$rootScope){
	console.log("hi controller");
	var config = {
    apiKey: "AIzaSyBq5v3tpkXMElVCfBjFdNYG1bGamU5MxIo",
    authDomain: "fchat-app.firebaseapp.com",
    databaseURL: "https://fchat-app.firebaseio.com",
    storageBucket: "fchat-app.appspot.com",
    messagingSenderId: "996011127741"
  };
   firebase.initializeApp(config);
   
   var fbLogin = false;
   var userLoginName,userINfoRef	=firebase.database().ref('/messages');
   
   $scope.messages	=	$firebaseArray(firebase.database().ref().child("messages"));
   $scope.users	=	$firebaseAuth(firebase.auth());
//    if(userINfoRef){
// 		console.log(userINfoRef);
// 		userINfoRef.on('value', function(snapshot) {
	   
// 	   		console.log("entered to listen messages addition");
// 	   		console.log(snapshot.val());
// 			$scope.messages.push(snapshot.val());
//    		})   
//    }
   //Listens Whether Current user SignedIn
   firebase.auth().onAuthStateChanged(function(user) {
	//    console.log(firebase().getAuth());
		if (user) {
			// User is signed in.
			console.log("user logged in");
			console.log(user);
			$scope.loggedUser	=	user.email;
			if(fbLogin){
				$state.go('chat');
				$scope.faceloggedUser=user.displayName;
				$scope.picUrl	=	user.photoURL;
			}
		} else {
			console.log("user not logged in");
			// No user is signed in.
		}
	});
   $scope.signedInUser	=	true;
	//var ref	=	new Firebase("https://fchat-app.firebaseio.com/");
	//$scope.messages	=	$firebaseArray(ref);
	//$scope.users	=	$firebaseAuth(ref);
	$scope.authWithFb	=	function(){
		 var provider = new firebase.auth.FacebookAuthProvider();
		console.log("hi fab");
		fbLogin = true;
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
		firebase.auth().getRedirectResult().then(function(authData){
			
			console.log("face Auth");
			
			
			//$rootScope.faceloggedUser=authData.displayName;
			//$scope.picUrl	=	authData.photoURL;
			//$state.go('chat');
		}).catch(function(error){
			console.log(error);
		});
		
		console.log($scope.signedInUser);
		// $scope.users.$authWithOAuthPopup('facebook').then(function(authData){
		// 	console.log(authData);
		//  	$scope.signedInUser	=	authData;
		//  }).catch(function(error){
		//  	console.log(error);
		//  });
		
	}
	
	// $scope.users.$onAuth(function(authData){
	// 	if(authData){
	// 		$scope.signedInUser	=	authData;
	// 		console.log(authData);
	// 	}else{
	// 		$scope.signedInUser	=	null;
	// 	}
	// });
	
	$scope.registerClick	=	function(){
		$state.go('signup');
	}
	$scope.signUp	=	function(credencials){
		
		fbLogin = false;
		//$scope.signedInUser	=	true;
		// firebase.auth().createUserWithEmailAndPassword(credencials.user, credencials.pass).then(function(userData){
		// 	console.log("entered");
		// 	console.log(userData);
		// 	$scope.signedInUser	=	true;
		// 	$scope.login	=	{};
		// 	console.log($scope.signedInUser);
		// }).catch(function(error) {
		// 	// Handle Errors here.
		// 	var errorCode = error.code;
		// 	var errorMessage = error.message;
		// 	// ...
		// });
		firebase.auth().createUserWithEmailAndPassword(credencials.user, credencials.pass).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("error while signup");
			// ...
		}).then(function(userData){
			
			console.log(userData);
			firebase.database().ref('users/'+userData.uid).push({
			
				username:credencials.user,
				password:credencials.pass,
				name:credencials.name
			}).then(function(commitedData){
				
				console.log('data setted successfully');
				console.log(commitedData);
				$state.go('signin');
			}).catch(function(error){
				
				console.log("Error while storing",error);
			});
			console.log(userData);
			
			//$scope.signedInUser	=	true;
		});

	};
	
	$scope.signIn	=	function(credits){
		
		fblogin	=	false;
		// $scope.users.authWithCustomToken("AUTH_TOKEN",function(error,authData){
		// 	if(error){
		// 		console.log(error);
		// 	}else{
		// 		console.log(authData);
		// 	}
		// });
		firebase.auth().signInWithEmailAndPassword(credits.user,credits.pass).then(function(userData){
			
			console.log("Sign IN successfully");
			console.log(userData);
			userINfoRef = firebase.database().ref('users/' + userData.uid );
			userINfoRef.on('value', function(snapshot) {
				
				console.log("data reterived after login");
				console.log(snapshot.val());
				var userRelInfo	=	snapshot.val();
				userLoginName	=	userRelInfo[Object.keys(userRelInfo)[0]].name;
				
				$scope.loggedUser	=	userData.email;
				// var userMsgsRef		=	firebase.database().ref('/messages' +userLoginName);
				// userMsgsRef.on('value',function(snapshot){
				// 	console.log("messages under",$scope.loggedUser);
				// 	console.log(snapshot.val());
				// })
				console.log($scope.messages);
				$state.go('chat');
			});
			
			//$scope.login	=	{};
			//$scope.signedInUser	=	false;
			//$scope.signedInUser	=	false;
		}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
		});
	}
	
	//LogOUT Functionality
	$scope.logout	=	function(){
		
		firebase.auth().signOut().then(function() {
		
			console.log("signout successfully");
			$state.go('signin');
		}, function(error) {
		// An error happened.
			console.log("signout unsuccessfully");
		});
	};
	
	//TO Store Chat Message
	$scope.chat={};
	$scope.sendMsg	=	function(){
		
		//console.log($scope.chatMsg);
		// userINfoRef.push({
			
		// 	username:$scope.loggedUser,
		// 	message:$scope.chat.chatMsg,
		// 	date: new Date().getTime()
		// });
		$scope.messages.$add({
			
			username:$scope.loggedUser,
		 	message:$scope.chat.chatMsg,
		 	date: new Date().getTime()
		})
		// firebase.database().ref('messages/').push({
			
		// 	username:$scope.loggedUser,
		// 	message:$scope.chat.chatMsg,
		// 	date: new Date().getTime()
			
		// }).then(function(commitedData){
			
		// 	console.log('data setted successfully');
		// 	console.log(commitedData);
		// }).catch(function(error){
			
		// 	console.log("Error while storing",error);
		// });
	}
});