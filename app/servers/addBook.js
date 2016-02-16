
angular.module('book').factory('addBookService',['$rootScope','Restangular',function($rootScope,Restangular){
	return{
		/**处理意见初始化查询*/   
		query:function(params,callback){
			return  Restangular.one('monitor/bookList/query').get(params).then(callback);
		},
		
		logon:function(params,callback){
			return  Restangular.all('monitor/bookList/logon').post(params).then(callback);
		},
		addBook:function(params,callback){
			return  Restangular.all('monitor/bookList/addBook').post(params).then(callback);
		},
		updateBook:function(params,callback){
			return  Restangular.all('monitor/bookList/updateBook').post(params).then(callback);
		},
		deleteBook:function(params,callback){
			return  Restangular.all('monitor/bookList/deleteBook').post(params).then(callback);
		}
	} 	
}]);  
