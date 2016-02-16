
//'restangular'
angular.module('book', ['ui.router','restangular','ngCookies','checklist-model','angular-opui'])
  .config(function ($urlRouterProvider, $stateProvider,RestangularProvider) {

	  
	  $urlRouterProvider.otherwise('/index');
		$stateProvider.state('index', {
			url: "/index",
			views: {
				'view': {
					templateUrl: 'views/bookList.html',
					controller: 'bookList'
				}
			}
		});
		$stateProvider.state('addbook', {
			url: "/addbook",
			views: {
				'view': {
					templateUrl: 'views/addBookForm.html',
					controller: 'bookList'
				}
			}
		});
		$stateProvider.state('updatebook', {
			url: "/updatebook",
			views: {
				'view': {
					templateUrl: 'views/updateBook.html',
					controller: 'bookList'
				}
			}
		});
		// 	$stateProvider.state('home', {
		// 	url: "/home",
		// 	views: {
		// 		'view': {
		// 			templateUrl: 'views/home.html',
		// 			 controller: 'queryInitCtrl'
		// 		},
		// 		'top@home':{
		// 			templateUrl: 'views/bookType.html',
		// 			//controller: 'deletebookCtrl'
		// 		},
		// 		'main@home':{
		// 			templateUrl: 'views/bookGrid.html',
		// 			//controller: ''
		// 		}
		// 	}
		// });
  });
