angular.module('book').directive('page', function(){
		return {
			restrict:'E',
			scope:{
				totalCount: '=',
				pageCount: '=',
				currentPage: '=',
				goPage: '&',
				showMaxPage: '@',
				firstText: '@',
				lastText: '@',
				previousText: '@',
				nextText: '@',
				GO:"@"
			},
			templateUrl:'views/page.html',
			controller:function($scope, $attrs, $parse){

				var self = this;

				//获得每页展示多少条记录，并求得页数
				this.init = function(defaultItemsPerPage) {
				    if ($attrs.pageCount) {
				      $scope.$parent.$watch($parse($attrs.pageCount), function(value) {
				        self.pageCount = parseInt(value, 10);
				        $scope.totalPage = self.calculateTotalPages();
				      });
				    } else {
				      this.pageCount = defaultItemsPerPage;
				    }
				};

				//计算页数
				this.calculateTotalPages = function(){
					return Math.ceil( $scope.totalCount / this.pageCount);
				};

				//监控总记录条数是否发生变化，如改变，需要重新计算页数
				$scope.$watch('totalCount',function(){
					$scope.totalPage = self.calculateTotalPages();
				});

				//监控总页数，调整展示页码
				$scope.$watch('totalPage',function(){
                    //alert($scope.currentPage+ "=当前第几页=");
					$scope.pages = self.getPages($scope.totalPage, $scope.currentPage);
				});
				
				//监控跳转的页数只能为数字
				$scope.$watch('GO',function(){
					var re = /[^\d]/g;
					if($scope.GO!='' && !re.test($scope.GO) && $scope.GO > 0 ){
						$scope.pages = self.getPages($scope.totalPage, $scope.currentPage);
					}else{
						$scope.GO='';
					}
				});
				//跳转到某一页
				$scope.setCurrentPage = function(pageno){
					if(pageno == '...' || pageno==0 || pageno > $scope.totalPage){
						return ;
					}
					$scope.goPage({currentPage : pageno, pageCount: this.pageCount});
					$scope.GO='';
				};
				
				//监控当前页，然后调整展示页码
				$scope.$watch('currentPage',function(){
					$scope.pages = self.getPages($scope.totalPage, $scope.currentPage);
				});
			},
			replace:true,
			link:function(scope, element, attrs, ctrl){

				ctrl.init(50);

				//根据总页数，当前页，以及页面展示最大数目，来取得展示情况
				// 1、总页数为0：展示第一页
				// 2、总页数<展示最大数目：展示全部
				// 3、当前页到末页<展示最大数据： 展示后6页
				// 4、首页与第二页: 展示前三页+"..."+后两页
				// 5、保持当前页在第二个页码列中。
				ctrl.getPages = function(totalPage, currentPage){
					var pages = [];
					if(totalPage == 0){
						pages.push(1);
					}
					else if(totalPage <= attrs.showMaxPage){
						for(var i = 1;i <= totalPage ; i++){
							pages.push(i);
						}
					}else if(totalPage - currentPage < attrs.showMaxPage){
						for(var i = totalPage - 5; i <= totalPage; i++){
							pages.push(i);
						}

					}else if(totalPage > attrs.showMaxPage && (currentPage - 2) < 1){
						for(var i = 1 ; i <= 3 ; i++){
							pages.push(i);
						}
						pages.push('...');
						for(var i = totalPage-1 ; i <= totalPage ; i++){
							pages.push(i);
						}
					}else if(totalPage > attrs.showMaxPage && (currentPage - 2) > 0 ){
						for(var i = currentPage - 1 ; i <= currentPage + 1 ; i++){
							pages.push(i);
							if(pages.length==3){
								break;
							}
						}
						pages.push('...');
						for(var i = totalPage-1 ; i <= totalPage ; i++){
							pages.push(i);
						}
					}
					return pages; 
				};
			}
		};
	});