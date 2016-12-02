chatApp.service('loginStatusService',
    ['$sessionStorage','$q',
      function($sessionStorage,$q){

        var isSignUpCompleted = true;
         this.loggingUserStatus	=	function(name,UID,username,picUrl){

          console.log("entered loggingUserStautus");
          var myConnectionRef	 = firebase.database().ref('status/'+UID+'/connections');
          var userDetails = {};
          var picUrl,imgName;
          //$sessionStorage.myConnectionRef	=	myConnectionsRef;
          //lastOnlineRef = firebase.database().ref('users/'+username+'/lastOnline');
          var connectedRef = firebase.database().ref('.info/connected');
          connectedRef.on('value', function(snap) {
            if (snap.val() === true) {
              //
              //sessionRef = $sessionStorage.myConnectionRef;
              //sessionRef.remove();
              //console.log($sessionStorage.myConnectionRef);
              //$scope.status	=	$firebaseArray(firebase.database().ref().child("status"));
              myConnectionRef.child('name').set(name);
              myConnectionRef.child('email').set(username);
              myConnectionRef.child('id').set(UID);
              if(picUrl)
                myConnectionRef.child('picUrl').set(picUrl);
              myConnectionRef.child('begin').set(firebase.database.ServerValue.TIMESTAMP);
              //console.log("firebase app begin");
              // if( myConnectionRef.hasChild('ended'))
              //  {
              //     myConnectionRef.child('ended').remove();
              //  }

            //  console.log("firebase app begin");

              myConnectionRef.child('ended').onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);

            }
          });
        }

        this.setUserDetails  = function(value){
            userDetails = value;
        }

        this.getUserDetails = function(){
            return userDetails;
        }
        this.isSignUpCmpltFalg  = function(){
            return {
              isSignUpCompleted : isSignUpCompleted
            }
        }
        this.setImgUrl  = function(value){

          var deffered  = $q.defer();
          isSignUpCompleted = false;
          var storageRef	=	firebase.storage();
          var starsRef = storageRef.refFromURL('gs://fchat-app.appspot.com/profile_pics/'+ value);
          starsRef.getDownloadURL().then(function(url) {
            // Insert url into an <img> tag to "download"
                picUrl  = url;
                isSignUpCompleted = true;
            deffered.resolve( { url:picUrl});
          }).catch(function(error) {

          });
          return deffered.promise;
        }
        this.setUploadImgFile  =  function(value){
            imgName = value;
        }
        this.getUploadeImgFile  = function(){
            return  imgName;
        }
    }
])
