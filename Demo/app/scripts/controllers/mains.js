
angular.module('book').controller('bookList', ['$scope', 'addBookService','$cookieStore','$state', function($scope, addBookService,$cookieStore,$state){
	 //分页信息
        $scope.curPage="1";//当前页       
        $scope.perPageNum="5";//每页显示数量
        $scope.paramsfy={}//分页
 	    $scope.dataMsg =[];//保存结果集
 	 //分页查询
   	 $scope.beondutyGoPage = function(currentPage) {
                    $scope.paramsfy.curPage = currentPage;
                    $scope.paramsfy.perPageNum = $scope.perPageNum;
                    $scope.curPage = currentPage;  //设置当前页为页面传过来的页数
                    $scope.queryInit();  //调用函数查询所有任务分类
             };

	  $scope.queryInit = function() {
       // $scope.dateMsg = {};
        var params2 = {};

        params2.curPage = $scope.curPage;         //显示当前页
        params2.perPageNum = $scope.perPageNum; //每页显示的数目
        addBookService.query(params2, function(result) {

            if (result.result == 'success') {
               $scope.dataMsg = result.message;
               $scope.beondutySize =result.page.totalNum;//总条数
               $scope.paramsfy.curPage = $scope.curPage;            //显示当前页
               $scope.paramsfy.perPageNum = $scope.perPageNum; //每页显示的数目
               
            } else {
                

            }
        });

    };
    
      $scope.updateBook = function(dataMsgInfo) {
        //把当前company对象保存到cookies中
        $cookieStore.put("dataMsgInfo", dataMsgInfo);
        $state.go("updatebook");
    };
 	
         //选择的结果集
        $scope.user={
            datas:[]
        }
         
        //全选
        $scope.checkAll = function(){
            console.log( $scope.dataMsg.length)
            if ($scope.user.datas.length == $scope.dataMsg.length) {
                $scope.user.datas = [];
            } else {
                $scope.user.datas = $scope.dataMsg.map(function(item) {
                    return item.bookId;
                });
            }
           // console.log($scope.user.datas)
            };



    $scope.open = function(dataMsgInfo) {
        $('#deleteMessage').foundation('reveal', 'open');

        //利用$cookieStore获取到参数
        $cookieStore.put("dataMsgInfo", dataMsgInfo);
   
    };

    $scope.close = function() {
        $('#deleteMessage').foundation('reveal', 'close');
    };


  //勾选删除
  $scope.del =function(){
  
  	if($scope.user.datas.length===0){
 		ZENG.msgbox.show("请勾选！！！", 2, 2000);
 		return;
  	}
     var params = {};
     params.delParams = $scope.user.datas;
    addBookService.deleteBook(params, function(result) {
                if (result.result === 'success') {
                    $('#deleteMessage').foundation('reveal', 'close');
                   ZENG.msgbox.show("删除成功！", 4, 2000);
                    //$scope.dateMsg.splice(index, 1);
                    //$scope.queryInit();
                }
            });

  	};
  
  
   $scope.delete = function() {
	//console.log($scope.dataMsg.length)
     var dataMsgInfo = $cookieStore.get("dataMsgInfo");
        console.log($cookieStore.get("dataMsgInfo"))
            var params3 = {};
            
            params3.id = dataMsgInfo.bookId;
            addBookService.deleteBook(params3, function(result) {
                if (result.result === 'success') {
                    $('#deleteMessage').foundation('reveal', 'close');
                   ZENG.msgbox.show("删除成功！", 4, 2000);
                    //$scope.dateMsg.splice(index, 1);
                    //$scope.queryInit();
                }
            });


};

    $scope.userInfo = {
        bookTitle: '',
        bookType: '0',
        pubTime: '',
        author: '',
        isBook: ''
    }
//添加方法
   $scope.save = function() {


 
        console.log("----")
        var params = {};
        params.bookTitle = $scope.userInfo.bookTitle;
        params.bookType = $scope.userInfo.bookType;
        params.pubTime = $scope.userInfo.pubTime;
        params.author = $scope.userInfo.author;
        params.isBook = $scope.userInfo.isBook;
        console.log($scope.userInfo.bookTitle);
        addBookService.addBook(params, function(result) {
            if (result.result === 'success') {
                $state.go("index");
                //$scope.queryInit(num);
            } else {

            }

        });
    };


/*
 *修改
 */

      $scope.updateBook = function(dataMsgInfo) {
      	$('#updateMessage').foundation('reveal', 'open');
        //把当前company对象保存到cookies中
        //$cookieStore.put("dataMsgInfo", dataMsgInfo);
        console.log( dataMsgInfo)
        $scope.dataMsgInfo = dataMsgInfo
      
        //$state.go("updatebook");
    };
    /*从cookie中取对象*/
    // $scope.getdateMsgInfo = function(){
    // 	$scope.dataMsgInfo = $cookieStore.get("dataMsgInfo");
    //     /*从cookie中取对象*/
    //     console.log($scope.dataMsgInfo )
    // }
    //保存
    $scope.updateBook1 = function() {
  
        var params = {};
        params.name = $scope.dataMsgInfo.name;
        params.author = $scope.dataMsgInfo.author;
        params.pubTime = $scope.dataMsgInfo.pubTime;
        params.price = $scope.dataMsgInfo.price;
        addBookService.updateBook(params, function(result) {
            if (result.result == 'success') {
                ZENG.msgbox.show("修改成功！", 4, 2000);
                $state.go("index");
                $scope.queryInit();
            }
        });
    }



}])