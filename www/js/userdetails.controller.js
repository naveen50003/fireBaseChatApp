chatApp.controller('userDetailsCtrl',[
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
'$cookieStore',
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
        $cookieStore,
        $ionicPopup,
        loginStatusService,
        config
        ){
            console.log("entered user Details Controller");
            // $scope.friend={};
            // $scope.friend.name  = "Gowtham";
            //  $scope.perUsrMsg = $firebaseArray(firebase.database().ref('userMessages/'+$scope.loginUserName+":"+$scope.friend.name));
          // $scope.perUsrMsg = $firebaseArray(firebase.database().ref('userMessages/'+$scope.loginUserName+":"+$scope.friend.name));
            var isPicChange = false;
            if($stateParams.userId){

                  $cookieStore.put('stateParam',$stateParams.userId);
            }else{

                $stateParams.userId = $cookieStore.get('stateParam');
            }
            userInfoRef = firebase.database().ref('registeredUsers/'+$stateParams.userId);
            userInfoRef.on('value',function(snapshot){

               $scope.friend = snapshot.val();
               $scope.perUsrMsg = $firebaseArray(firebase.database().ref('userMessages/'+$scope.loginUserName+":"+$scope.friend.name));
               console.log($scope.perUsrMsg);
               var ref	=	firebase.database().ref('unreadMessages');
               ref.child($scope.friend.name).remove();
              // TO Get Related Chat INfo

              //  var checkRef1  = firebase.database().ref('userMessages/'+$scope.loginUserName+":"+$scope.friend.name);
              //  checkRef1.on('child_added',function(){
              //    console.log("childAdded for "+checkRef1);
              //    $scope.perUsrMsg = $firebaseArray(firebase.database().ref('userMessages/'+$scope.loginUserName+":"+$scope.friend.name));
              //    console.log($scope.perUsrMsg);
              //  });
               //
              //  var checkRef2  = firebase.database().ref('userMessages/'+$scope.friend.name+":"+$scope.loginUserName);
              //  checkRef2.on('child_added',function(){
              //     console.log("childAdded for "+checkRef2);
              //     $scope.perUsrMsg = $firebaseArray(firebase.database().ref('userMessages/'+$scope.friend.name+":"+$scope.loginUserName));
              //     console.log($scope.perUsrMsg);
              //  });

            })
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

              console.log("hi"+ $scope.friend.name+" "+$scope.loginUserName);
            	message.time	=	new Date().getTime();
            	var ref= firebase.database().ref('userMessages');
              ref.once('value',function(DataSnapshot){

                    ref = firebase.database().ref('userMessages/'+$scope.loginUserName+":"+$scope.friend.name);
                     ref.push({

                         to:$scope.friend.name,
                         from:$scope.loginUserName,
                         message:message.text,
                         date: message.time
                       });
                       ref = firebase.database().ref('userMessages/'+$scope.friend.name+":"+$scope.loginUserName);
                       ref.push({

                           to:$scope.friend.name,
                           from:$scope.loginUserName,
                           message:message.text,
                           date: message.time
                       })


                  // if(DataSnapshot.hasChild('/'+$scope.loginUserName+":"+$scope.friend.name)){
                  //
                  //       ref = firebase.database().ref('userMessages/'+$scope.loginUserName+":"+$scope.friend.name);
                  //       ref.push({
                  //
                  //           to:$scope.friend.name,
                  //           from:$scope.loginUserName,
                  //           message:message.text,
                  //           date: message.time
                  //         })
                  //
                  // }else{
                  //     if(DataSnapshot.hasChild('/'+$scope.friend.name+":"+$scope.loginUserName)){
                  //
                  //       ref = firebase.database().ref('userMessages/'+$scope.friend.name+":"+$scope.loginUserName);
                  //       ref.push({
                  //
                  //           to:$scope.friend.name,
                  //           from:$scope.loginUserName,
                  //           message:message.text,
                  //           date: message.time
                  //         })
                  //     }else{
                  //
                  //       ref = firebase.database().ref('userMessages/'+$scope.loginUserName+":"+$scope.friend.name);
                  //       ref.push({
                  //
                  //           to:$scope.friend.name,
                  //           from:$scope.loginUserName,
                  //           message:message.text,
                  //           date: message.time
                  //         })
                  //     }
                  //   }
              })

              //unRead Messages

              ref.once('value',function(DataSnapshot){

                  if(DataSnapshot.hasChild('/'+$scope.friend.name)){

                      ref = firebase.database().ref('unreadMessages/'+$scope.friend.name);
                      ref.once('value',function(childDataSnap){

                          var push={};
                          var updateCount = parseInt(childDataSnap.val().count)+1;
                          var postData  = {

                              loginUserName : $scope.loginUserName,
                              count : updateCount
                          }
                          push['/unreadMessages/' + $scope.loginUserName] = postData;
                          firebase.database().ref().update(push);
                      })
                  }else{

                      var push  = {};
                      var postData  = {

                          loginUserName:$scope.loginUserName,
                          count:	'1'
                      };
                      push['/unreadMessages/' + $scope.loginUserName] = postData;
                      firebase.database().ref().update(push);
                  }

              })
              $scope.$parent.message={};
              $scope.messageModal.hide();
          }

          //Change Profile View
          $ionicModal.fromTemplateUrl('./changeProfile.html',function(modal){
            $scope.profileModal	=	modal;
          },{
            scope:$scope,
            animation:'slide-in-up'
          });

          $scope.showProfileModal	=	function(){
            $scope.profileModal.show();
          }

          $scope.closeProfileModal	=	function(){
            $scope.profileModal.hide();
          }
          $scope.modifyUserDetails  = function(register){

            userInfoRef = firebase.database().ref('registeredUsers/'+$stateParams.userId);
            $ionicLoading.show({
              template: 'Loading...'
            }).then(function(){
               console.log("The loading indicator is now displayed");
            });
            if(isPicChange){

              var file  = loginStatusService.getUploadeImgFile();
              loginStatusService.setImgUrl(file.name).then(function(imgUrl){
                  picUrl  = imgUrl.url;
                  insertUpdateData(register);
              })
            }else
              insertUpdateData(register);
          }
          $scope.fileNameChanged  = function(e){

            isPicChange = true;
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

          var insertUpdateData  = function(register){
            userInfoRef.on('value',function(snapshot){

                if(register){
                  if(register.displayName){
                      firebase.database().ref('registeredUsers/'+$stateParams.userId).update({"name" : register.displayName})
                      //firebase.database().ref('registeredUsers/'+$stateParams.userId+'/name').setValue(register.displayName);
                  }
                  if(register.pass){

                      firebase.database().ref('registeredUsers/'+$stateParams.userId).update({"password" : register.pass})
                      // firebase.database().ref('registeredUsers/'+$stateParams.userId+'/password').setValue(register.pass);
                  }
                  if(register.user){

                      firebase.database().ref('registeredUsers/'+$stateParams.userId).update({"username" : register.user})
                      //firebase.database().ref('registeredUsers/'+$stateParams.userId+'/username').setValue(register.pass);
                  }
                }
                if(isPicChange){

                    firebase.database().ref('registeredUsers/'+$stateParams.userId).update({"picUrl" : picUrl});
                    //firebase.database().ref('registeredUsers/'+$stateParams.userId+'/picUrl').setValue(picUrl);
                }
                $scope.$parent.hide();
                var alertPopup = $ionicPopup.alert({

                  title: 'Update Confirm',
                  template: 'Updated SuccessFully Completed'
                });

                alertPopup.then(function(res) {
                  console.log('Thank You');
                });
                isPicChange = false;
                $scope.profileModal.hide();
            });
          }
}])
