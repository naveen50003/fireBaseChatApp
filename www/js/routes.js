
chatApp.config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider,$stateProvider){

	$urlRouterProvider.otherwise('/');

	$stateProvider
	.state('signin',{
		url:'/',
		templateUrl:'templates/signIn.html',
		controller:'signInController'

	})
	.state('signup',{
		url:'/signup',
		templateUrl:'templates/signUp.html',
		controller:'signUpController'

	})
	.state('chat',{
		url:'/chat',
		templateUrl:'templates/menu.html'

	})
	.state('chat.users', {
      url: '/users',
      views: {
        'tab-register': {
          templateUrl: 'templates/regUsers.html',
					controller:'regUsersCtrl'
        }
      }
    })
		.state('chat.userProfile', {
      url: '/users/userProile/:userId',
      views: {
        'tab-register': {
          templateUrl: 'templates/userProfileInfo.html',
					controller:'userDetailsCtrl'
        }
      }
    })
		.state('chat.userProfileMSg', {
      url: '/users/userProfileMSg/:userId',
      views: {
        'tab-register': {
          templateUrl: 'templates/user-chat-room.html',
          controller: 'userDetailsCtrl'
        }
      }
    })
		.state('chat.user', {
      url: '/users/:userId',
      views: {
        'tab-online': {
          templateUrl: 'templates/user-chat-room.html',
          controller: 'userDetailsCtrl'
        }
      }
    })
		.state('chat.online', {
	      url: '/online',
	      views: {
	        'tab-online': {
	          templateUrl: 'templates/onlineUsers.html'
	        }
	      }
	    })
		.state('chat.groupchat', {
      url: '/groupchat',
      views: {
        'tab-dash': {
          templateUrl: 'templates/chatView.html'
        }
      }
    })
		.state('chat.updateProfile', {
			url: '/:userId',
			views: {
				'tab-profile': {
					templateUrl: 'templates/loginProfileInfo.html',
					controller:'userDetailsCtrl'
				}
			}
		})
		.state('loading', {
	      url: '/loading',
				templateUrl: 'templates/loading.html'

	    });
	//$locationProvider.html5Mode(true);
}]);
