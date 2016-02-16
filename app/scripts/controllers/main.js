'uese strict';
var app = angular.module('book');
app.controller('logonCtrl', flogonCtrl)
    .controller('queryInitCtrl', queryInitCtrl)
    .controller('saveCtrl', saveCtrl)
    .controller('updateBookCtrl', updateBookCtrl);

function flogonCtrl($scope, addBookService, $state) {
    $scope.user = {
            name: '',
            password: '',
            authCode:''
        };

        $scope.user.authCode1 = Math.round(900000*Math.random()+100000);
        
        //登录请求
    $scope.logon = function() {
            if ($scope.user.password === '' || $scope.user.name === '') {
                alert('验证码错误')
                return;
            }
            $scope.aa = true;
            var params = {};
            params.name = $scope.user.name;
            params.password = $scope.user.password;
            addBookService.logon(params, function(result) {
                if (result.result === 'success') {
                    $state.go("home");
                } else {

                }

            });
        };
        //只让点击一下登录按钮，点击了就把按钮设置成disabled的，不可点击
    $scope.change = function() {
        $scope.aa = false;
    };

}

/**初始化查询*/
function queryInitCtrl($scope, addBookService,$cookieStore,$state) {
        $scope.dateMsg=[]
        //分页信息
        $scope.curPage="1";//当前页       
        $scope.perPageNum="5";//每页显示数量
        $scope.paramsfy={}//分页
    /**初始化查询*/
    $scope.queryInit = function(num) {
       // $scope.dateMsg = {};
        var params2 = {};
        params2.num = num;
        params2.curPage = $scope.curPage;         //显示当前页
        params2.perPageNum = $scope.perPageNum; //每页显示的数目
        addBookService.query(params2, function(result) {

            if (result.result == 'success') {
               $scope.dataMsg = result.message;
               $scope.beondutySize =result.page.totalNum;//总条数
               $scope.paramsfy.curPage = $scope.curPage;            //显示当前页
               $scope.paramsfy.perPageNum = $scope.perPageNum; //每页显示的数目
               $scope.num = num;
            } else {
                

            }
        });
    };

     $scope.queryInit();
         //选择的结果集
        $scope.user={
            datas:[]
        }
         
        //全选反选
        $scope.checkAll = function(){
           
            if ($scope.user.datas.length == $scope.dateMsg.length) {
                $scope.user.datas = [];
            } else {
                $scope.user.datas = $scope.dateMsg.map(function(item) {
                    return item.bookId;
                });
            }  
            };

     
        

      $scope.updateBook = function(dateMsgInfo) {
        //把当前company对象保存到cookies中
        $cookieStore.put("dateMsgInfo", dateMsgInfo);
        $state.go("updatebook");
    };



    $scope.open = function(dateMsgInfo) {
        $('#deleteMessage').foundation('reveal', 'open');

        //利用$cookieStore获取到参数
        $cookieStore.put("dateMsgInfo", dateMsgInfo);
   
    };

    $scope.close = function() {
        $('#deleteMessage').foundation('reveal', 'close');
    };
  
   $scope.delete = function() {
     var dateMsgInfo = $cookieStore.get("dateMsgInfo");
        console.log($cookieStore.get("dateMsgInfo"))
            var params3 = {};
            
            params3.id = dateMsgInfo.bookId;
            addBookService.deleteBook(params3, function(result) {
                if (result.result === 'success') {
                    $('#deleteMessage').foundation('reveal', 'close');
                   ZENG.msgbox.show("删除成功！", 4, 5000);
                    //$scope.dateMsg.splice(index, 1);
                    //$scope.queryInit();
                }
            });


};
 
   $scope.beondutyGoPage = function(currentPage) {
                    $scope.paramsfy.curPage = currentPage;
                    $scope.paramsfy.perPageNum = $scope.perPageNum;
                    $scope.curPage = currentPage;  //设置当前页为页面传过来的页数
                    $scope.queryInit($scope.num);  //调用函数查询所有任务分类
             };

    }

//添加方法
function saveCtrl($scope, addBookService, $state) {
    $scope.userInfo = {
        bookTitle: '',
        bookType: '0',
        pubTime: '',
        author: '',
        isBook: ''
    };

    $scope.save = function() {
        console.log("----")
        var params1 = {};
        params1.bookTitle = $scope.userInfo.bookTitle;
        params1.bookType = $scope.userInfo.bookType;
        params1.pubTime = $scope.userInfo.pubTime;
        params1.author = $scope.userInfo.author;
        params1.isBook = $scope.userInfo.isBook;
        console.log($scope.userInfo.bookTitle);
        addBookService.addBook(params1, function(result) {
            if (result.result === 'success') {
                $state.go("home");
                //$scope.queryInit(num);
            } else {

            }

        });
    };


};


//删除
/**function deletebookCtrl($scope, addBookService, $state, $cookieStore) {



    $scope.open = function(dateMsgInfo) {
        $('#deleteMessage').foundation('reveal', 'open');
        //利用$cookieStore获取到参数
        //$cookieStore.put("dateMsgInfo", dateMsgInfo);
        //然后广播给子controller，子controller接收参数进行处理
        $scope.$broadcast('broadcast', dateMsgInfo);
        //$broadcast只能向child controller传递event和data
    }

    $scope.close = function() {
        $('#deleteMessage').foundation('reveal', 'close');
    }
    $scope.updateBook = function(dateMsgInfo) {
        //把当前company对象保存到cookies中
        $cookieStore.put("dateMsgInfo", dateMsgInfo);
        $state.go("updatebook");
    }
};*/


/*
 *修改
 */
function updateBookCtrl($scope, addBookService, $cookieStore, $state) {
    $scope.dateMsgInfo = $cookieStore.get("dateMsgInfo");
    $scope.updateBook1 = function() {
        /*从cookie中取对象*/
        var params4 = {};
        params4.name = $scope.dateMsgInfo.name;
        params4.author = $scope.dateMsgInfo.author;
        params4.pubTime = $scope.dateMsgInfo.pubTime;
        params4.price = $scope.dateMsgInfo.price;
        addBookService.updateBook(params4, function(result) {
            if (result.result == 'success') {
                $state.go("home");
                //$scope.queryInit();
            }
        });
    }
};

/*弹出框里面的方法不能接收参数，所有广播给子Controller，子Controller接收参数进行处理。
 *$scope.$on({});接收参数进行处理
 **/
// function fdivCtrl($scope, addBookService, $cookieStore) {
//     $scope.$on('broadcast', function(event, dateMsgInfo) {
//       //$cookieStore.get("dateMsgInfo", dateMsgInfo);
//         console.log("子级:~~", dateMsgInfo);
//         $scope.delete = function() {
//             var params3 = {};
//             params3.id = dateMsgInfo.index;
//             addBookService.deleteBook(params3, function(result) {
//                 if (result.result == 'success') {
//                     $('#deleteMessage').foundation('reveal', 'close');
//                     //$scope.dateMsg.splice(index, 1);
//                     //$scope.queryInit();
//                 }
//             });

//         };
//     });

// }
