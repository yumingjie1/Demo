var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var fixtures = require('./fixtures');

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.set('port', process.env.PORT || 19000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//监听端口是否启动
http.listen(app.get('port'), function () {
  console.log('server listening on port' + app.get('port'));
});

io.sockets.on('connection', function (socketIO){
//	//客户端接收数据
//	socketIO.on('fromWebClient',function(){
//		
//	});
//	// 客户端断开连接
//	socketIO.on('disconnect',function(){
//		console.log('DISCONNECTED FROM CLIENT');
//	});
	// 向客户端发送数据
	setInterval(function(){
		socketIO.emit('pushToWebClient',{"userName":"张三"});
	},1000);
});


//页面初始化加载500条最新信息。
app.get("/api/log_message/findInitMessages", function(req, res) {
  res.send(fixtures.logMessages);
});

//转工单结果
app.get('/api/log_message/disposeMessage', function(req, res) {
  var jsonData = fixtures.removeLog;
  res.send(jsonData);
});
//批量删除规则
app.post('/monitor/rules/delete', function(req, res) {
  var jsonData = fixtures.deleteRule2;
  res.send(jsonData);
});
//查询规则top3
app.get('/monitor/rules/topThree/query', function(req, res) {
  var jsonData = {result:"success",message:"请解决(3);请电话(2);请邮件(1)"};
  res.send(jsonData);
});
//修改标签规则操作意见
app.post('/monitor/processingOpinion/rules/update', function(req, res) {
  //var jsonData = {result:'success',message:{processingMethod:'改改了又改，蛋痛啊',processingMethodID:'00'}};
  var jsonData = {result:'success',message:''};
  res.send(jsonData);
});
////logInfo子系统链接查询
app.get('/api/log_message/findSystemMessages', function(req, res) {
  var jsonData = fixtures.LogInfo;
  res.send(jsonData);
});

app.get('/api/log_message/findPageMessages', function(req, res) {
  var jsonData = fixtures.LogInfo;
  res.send(jsonData);
});

app.get('/api/log_message/findMessagesByMsgLevel', function(req, res) {
  var jsonData = fixtures.LogInfo;
  res.send(jsonData);
});

//激活撤销规则
app.post('/monitor/rules/active', function(req, res) {

  var rules = req.param('rules');
  var result = {};
  result.result = 'success';
  result.message = '成功！';
  res.send(result);
});

//修改规则请求
app.post('/monitor/rules/update', function(req, res) {
  var result = {};
  result.result = 'success';
  result.message = '修改成功！';
  res.send(result);
});



//一键处理 余明杰
app.post('/monitor/alarm/batch', function(req, res) {
    var result = {};
    if (req.param('isSure') == 0) {
      result.result = 'success';
      result.message = '50000';
    
        // result.result = 'fail';
        // result.message = '操作失败！！！';
      
        
    }else if (req.param('isSure') == 1) {
      result.result = 'success';
      result.message = '操作成功！';
      // result.result = 'fail';
      // result.message = '操作失败！！！';
    };
    res.send(result);
});




//规则查询
app.get("/monitor/rules/query", function(req, res) {
  if (req.param('ruleType') == 1){
      res.send(fixtures.ruleFilter);
  } else if (req.param('ruleType') == 2){
      res.send(fixtures.ruleMerge);
  }else {
      res.send(fixtures.ruleManageAll);
  }
});


//规则初始化查询
app.get("/monitor/rules/manage", function(req, res) {
  res.send(fixtures.ruleMerge);
});

//页面初始化请求
app.post('/monitor/alarm/manage', function(req, res) {
  //把50条数据变为200条
  var result = {};
  for(var i in fixtures.initMsg){
    result[i] = fixtures.initMsg[i];
  }

  for(var i = 0; i < 3; i++){
    result.message = result.message.concat(fixtures.initMsg.message);
  }
  res.send(result);
});

//首页条件请求
app.post('/monitor/alarm/query', function(req, res) {
 //把50条数据变为200条
  var result = {};
  for(var i in fixtures.initMsg){
    result[i] = fixtures.initMsg[i];
  }

  for(var i = 0; i < 3; i++){
    result.message = result.message.concat(fixtures.initMsg.message);
  }
  res.send(result);
});

//已处理告警首页条件请求
app.post('/monitor/historyAlarm/query', function(req, res) {
  var result = fixtures.initMsg;
  res.send(result);
});

//告警确认
app.post('/monitor/alarm/confirm', function(req, res) {
    var result = {};
    result.result = 'success';
    result.message = '操作成功';
    result.updateMessage = fixtures.log;
    res.send(result);
});
//告警前转
app.post('/monitor/alarm/dispose', function(req, res) {
    var result = {};
    result.result = 'success';
    result.message = '操作成功';
    result.updateMessage = fixtures.log;
    res.send(result);
});
//告警一键前转
app.post('/monitor/alarm/autoDispose', function(req, res) {
    var result = {};
    result.result = 'success';
    result.message = '操作成功';
    result.updateMessage = fixtures.log;
    res.send(result);
});

//科室查询
app.get('/monitor/alarm/department/query', function(req, res) {
    var result = {};
    res.send(fixtures.department);
});
//根据科室查询处理人
app.post('/monitor/alarm/dealingPeople/query', function(req, res) {
    var result = {};
    res.send(fixtures.dealingPeople);
});
//告警解决
app.post('/monitor/alarm/resolve', function(req, res) {
    var result = {};
    result.result = 'success';
    result.message = '解决成功！！！';
    result.updateMessage = fixtures.log;
    res.send(result);
});

var skin = 'default';
var bgcolor="#AED8BA";
var preview = {'module':true,'hostName':true,'msgLevel':true,'msgStatus':true,'msgContent':true,'count':true,'recTime':true,'confirmTime':true,'appId':true,'province':false,'dealBy':false,'workOrderId':false,'remark':false,'convertTime':false,'dealOpinion':false,"keyword":true,"transactionCode":false,"transactionNumber":false,"business":false,"projectURL":false,"rules":true};
//界面属性配置查询
app.get('/monitor/alarm/showStyle/query', function(req, res) {
    var result = {};
    fixtures.user.user.preview = preview;
    fixtures.user.user.columnWidth = {
		appId: "100",
	confirmTime: "110",
	convertTime: "100",
	count: "50",
	dealBy: "100",
	dealOpinion: "100",
	hostName: "105",
	keyword: "80",
	module: "205",
	msgContent: "600",
	msgLevel: "60",
	msgStatus: "60",
	business: "100",
	transactionCode: "100",
	transactionNumber: "100",
	province: "100",
	recTime: "110",
	remark: "100",
	workOrderId: "100",
	projectURL: "100",
	rules: "100"
};
    fixtures.user.user.skin = 'default';
    fixtures.user.user.bgcolor = "#AED8BA";
    res.send(fixtures.user);
});


//界面属性配置修改
app.post('/monitor/alarm/showStyle/update', function(req, res) {
    preview = req.param('preview');

    var result = {};
    result.result = 'success';
    result.message = '修改成功！';
    res.send(result);
});

//
app.post("/monitor/users/query", function(req, res) {
  res.send(fixtures.userListTest);
});

app.post("/monitor/users/add", function(req, res){
  res.send({"result":"success", "message":"添加成功"});
});

app.post("/monitor/users/delete", function(req, res){
  res.send({"result":"success", "message":"删除用户成功！"});
});

app.post("/monitor/users/update", function(req, res){
  res.send({"result":"success", "message":"修改用户成功！"});
});

app.get("/monitor/users/manage", function(req, res){
  res.send(fixtures.loadResources);
});

app.get("/monitor/users/isExist", function(req, res){
  res.send({"isExist": false});
});
//工号是否重名false不重名
app.get("/monitor/users/empNoIsExist", function(req, res){
  res.send({"isExist": false});
});

app.post("/monitor/rules/isExist", function(req, res){
  res.send({"isExist": false});
});

/* login */
app.post("/monitor/users/login", function(req, res){
   //res.send({"result":false, "message":"密码错误"});
   res.send({"result":"success","message":"登陆成功","user":{"preview":'1,1,1,1,1,1,1,1,0,0,0,0,0',"id":1, "account":"april1", "passWord":"123456", "userName":'赫赫1', "sex":"男", "empNo":"13000590", "mobile":"13511199777", "email":"65@qq.com" ,"position":{"id":"001", "postName":"普通职员"}, "cornet":"1234", "department":{"id":"006", "deptName":"综合室"}, "role":{"id":"001", "roleName":"普通用户", "permissions":"Admin"}}});
});

app.get("/monitor/users/logout", function(req, res) {
   res.send({result:"success"});
});

//点击+显示没有显示的消息
app.get('/monitor/alarm/querySub', function(req, res) {
    //console.log('应用名称appId = '+req.param('appId'));
	 var result = fixtures.subMsg;
	 res.send(result);
});
//自动生成值班单
app.get("/monitor/work/export", function(req, res){
    res.send({"result":"success","message":"值班单导出成功！"});
});
app.get("/monitor/work/export1", function(req, res){
    res.send({"result":"success","message":"值班单日志导出成功！"});
});
//获取系统时间
app.post("/monitor/systemTime/query", function(req, res){
	console.log('系统时间 = '+new Date().Format('yyyy/MM/dd hh:mm:ss'));
    res.send({"systemTime":new Date().Format('yyyy/MM/dd hh:mm:ss')});
});

//新增修改请求规则树结构

app.get("/monitor/rules/scope/query", function(req, res){
	var result = fixtures.ruleScope;
    res.send({"result":"success", "message":result});
});


//新增规则
app.post("/monitor/rules/add", function(req, res){
  res.send({"result":"success", "message":"添加规则成功"});
});

//双击查询
app.post("/monitor/alarm/details/manage", function(req, res){
	var result = fixtures.details;
	res.send(result);
});

//双击后--分页查询
app.post("/monitor/alarm/details/query", function(req, res){
	var result = fixtures.detaMsg;
	 res.send(result);
});

//过滤告警条件查询
app.post('/monitor/alarm/filter/query', function(req, res) {
  var result = fixtures.filterMsg;
  res.send(result);
});
//过滤告警条件查询--分页
app.post('/monitor/alarm/filter/query/page', function(req, res) {
  var result = fixtures.filterMsg;
  res.send(result);
});
app.post('/monitor/alarm/query/page', function(req, res) {
  var result = fixtures.initMsg;
  res.send(result);
});
//已处理告警分页
app.post('/monitor/historyAlarm/query/page', function(req, res) {
  var result = fixtures.initMsg;
  res.send(result);
});


app.post('/monitor/alarm/query/byId', function(req, res) {
  var result = fixtures.MsgbyId;
  res.send(result);
});


app.post('/monitor/alarm/filter/export', function(req, res) {
	var vl = req.param('msgContent');
	//console.log('内容--'+vl);
	//console.log('级别--'+req.param('msgLevel'));
	var result = fixtures.MsgbyId;
	res.send(result);
});

//=======================================book===============================


app.get("/monitor/bookList/query", function(req, res) {
  if (req.param('num') == 1){
      res.send(fixtures.bookListMessagesxs);
  } else if (req.param('num') == 2){
      res.send(fixtures.bookListMessagesjr);
  }else {
      res.send(fixtures.bookListMessages);
  }
});
//登录
app.post("/monitor/bookList/logon", function(req, res) {
  var result = {};
  result.result = 'success';
  res.send(result);
});

//添加书籍
app.post("/monitor/bookList/addBook", function(req, res) {
  var result = {};
  result.result = 'success';
  res.send(result);
});


//删除书籍
app.post("/monitor/bookList/deleteBook", function(req, res) {
  var result = {};
  result.result = 'success';
  res.send(result);
});


//修改书籍
app.post("/monitor/bookList/updateBook", function(req, res) {
  var result = {};
  result.result = 'success';
  res.send(result);
});






/*********************************签到管理**********************************************/
//签到管理条件查询
app.get('/monitor/examine/signIn/query', function(req, res) {
  var result = fixtures.signInMsg;
  res.send(result);
});
//签到管理导出excel 
app.post('/examine/signIn/export', function(req, res) {
	var vl = req.param('msgContent');
	//console.log('内容--'+vl);
	//console.log('级别--'+req.param('msgLevel'));
	var result = fixtures.MsgbyId;
	res.send(result);
	});

  app.get('/monitor/examine/signIn/query/skip', function(req, res) {
  var result = fixtures.exceptionData;
    res.send(result);
  });
/*********************************签到规则设定**********************************************/
//签到规则设定
app.post("/monitor/examine/signIn/set", function(req, res){
	  res.send({"result":"success", "message":"下次值班设定生效！"});
	});
//获取签到设定值
app.get('/monitor/examine/signIn/get', function(req, res) {
	var result = fixtures.signSetMsg;
	  res.send(result);
	});

/*********************************签到统计**********************************************/
app.get('/monitor/examine/attendance/query', function(req, res) {
  var result = fixtures.attendance;
    res.send(result);
  });


/*********************************签到统计（end）***************************************/

/*********************************考核管理**********************************************/
app.get('/monitor/attence/rightRate/query',function(req,res){
	//console.log('appId--'+req.param('appId'));
	//console.log('currentPage--'+req.param('currentPage'));
	//console.log('goPage--'+req.param('goPage'));
	//console.log('pageSize--'+req.param('pageSize'));
	//console.log('appId--'+req.param('appId'));
	res.send(fixtures.rightRateList);
})

app.post('/monitor/attence/rightRate/export',function(req,res){
	//console.log('startTime--'+req.param('startTime'));
	//console.log('endTime--'+req.param('endTime'));
	res.send(fixtures.rightRateList);
})

app.post('/monitor/attence/timelyRate/export',function(req,res){
	//console.log('startTime--'+req.param('startTime'));
	//console.log('endTime--'+req.param('endTime'));
	res.send(fixtures.rightRateList);
})


app.get('/monitor/attence/timelyRate/query',function(req,res){
	//console.log('appId--'+req.param('appId'));
	//console.log('currentPage--'+req.param('currentPage'));
	//console.log('goPage--'+req.param('goPage'));
	//console.log('pageSize--'+req.param('pageSize'));
	//console.log('appId--'+req.param('appId'));
	res.send(fixtures.timelyRateList);
})


//签到统计Export
app.post('monitor/examine/attendance/query/export',function(req,res){
	res.send(fixtures.message);
})
/*********************************考核管理end*******************************************/




/***********************************外出管理 外出登记（邹景）**************************************/
//获取外出信息列表
app.get("/monitor/examine/out/query", function(req, res){
    res.send(fixtures.outList);
});
//外出登记
app.post("/monitor/examine/out/insert", function(req, res){
    res.send({"result":"success", "message":"外出成功","id":"22"});
});
//结束外出
app.post("/monitor/examine/out/end", function(req, res){
    res.send({"result":"success", "message":"结束外出"});
});
//检查能否外出。
app.post("/monitor/examine/out/check",function(req, res){
	 res.send({"result":"success", "message":"不能重复外出。"});
});
/***********************************外出管理 外出登记end**************************************/



/***********************************统计分析（告警耗时分析）**************************************/
app.post("/monitor/alarm/timeConsuming", function(req, res){
    res.send(fixtures.consumeMsg); 
}); 
/***********************************统计分析（告警耗时分析）end**************************************/

/***********************************统计分析（告警数量统计）**************************************/
app.get("/monitor/alarm/statistics", function(req, res){
  
    if(req.param('statisticsType') == 1){  
       res.send(fixtures.messageOne);
    }else if(req.param('statisticsType') == 2){
        res.send(fixtures.messageTwo);  
    }else if(req.param('statisticsType') == 3){
      res.send(fixtures.messageThree);    
    }else if(req.param('statisticsType') == 4){ 
      res.send(fixtures.messageFour);     
    }else{  
      res.send(fixtures.messageFive);   
    }
     
});  
app.get("/monitor/alarm/tendency", function(req, res){
  
     //告警产生趋势监控
       res.send(fixtures.tendencyMsg); 
   
     
}); 


/***********************************统计分析（告警数量统计）end**************************************/


/******************************************处理意见 begin***********************************************/
//处理意见初始化查询
app.get("/monitor/processingOpinion/query", function(req, res) {
  res.send(fixtures.processingOpinion);
});

//新增处理意见
app.post("/monitor/processingOpinion/add", function(req, res) {
  var result = {};
  result.result = 'fail';
  result.message = '新增失败！';
  res.send(result);
});

//修改处理意见
app.post('/monitor/processingOpinion/update', function(req, res) {
  var result = {};
  result.result = 'success';
  result.message = '修改成功！';
  res.send(result);

});
//批量删除处理意见
app.post('/monitor/processingOpinion/delete', function(req,res){
  var result = {};
  result.result = 'success';
  result.message = '删除成功！';
  res.send(result);
});

/********************************签到验证码，提交签到，签到提醒*******************************************************/
app.get('/monitor/examine/signIn/getCode',function(req,res){
	
	res.send(fixtures.validCode);
});

app.get('/monitor/examine/signIn/insert',function(req,res){
	
	res.send(fixtures.insertSignin);
});

app.get('/monitor/examine/signIn/remind',function(req,res){
	fixtures.signinRemind.systemTime = new Date().getTime();
	fixtures.signinRemind.startTime = new Date(new Date().getFullYear()+"-"+parseInt(new Date().getMonth()+1)+"-"+new Date().getDate()+" "+"9:00:00").getTime();
	fixtures.signinRemind.endTime = new Date(new Date().getFullYear()+"-"+parseInt(new Date().getMonth()+1)+"-"+new Date().getDate()+" "+"17:30:00").getTime();
	res.send(fixtures.signinRemind);
});

app.get('/monitor/examine/signIn/currentMsg',function(req,res){
	
	res.send(fixtures.currentMsg);
});
//排班查询
app.get('/monitor/examine/classes/query',function(req,res){
	res.send(fixtures.examineMessage);
});
//排班删除
app.get('/monitor/examine/classes/delete',function(req,res){
	var result = {};
    result.result = 'success';
    result.message = '删除成功！';
    res.send(result);
	//res.send(fixtures.currentMsg);
});
//排班新增
app.post('/monitor/examine/classes/insertPerson',function(req,res){
	var result = {};
    result.result = 'success';
    result.message = '新增成功！';
    res.send(result);
	//res.send(fixtures.currentMsg);
});
//排班修改
app.post('/monitor/examine/classes/update',function(req,res){
	var result = {};
    result.result = 'success';
    result.message = '修改成功！';
    res.send(result);
	//res.send(fixtures.currentMsg);
});


//属性宽度保存
app.post('/monitor/alarm/columnWidth/update',function(req,res){
	fixtures.columnConfig = req.param('columnWidth')
	skin = req.param('skin');
	bgcolor = req.param('bgcolor');
	var result = {};
    result.result = 'success';
    result.message = '属性列保存成功！';
    res.send(result);
	//res.send(fixtures.currentMsg);
});


//查询告警合并信息
app.get('/monitor/alarm/merge/query',function(req,res){
    res.send(fixtures.selectAlarmLogData);
});

//查询告警合并信息
app.post('/monitor/alarm/copyPaste',function(req,res){
	var result = {};
    result.result = 'success';
    result.message = '复制成功！';
    res.send(result);
});

//查询告警标记
app.post('/monitor/alarm/mark',function(req,res){
	var result = {};
    result.result = 'success';
    result.message = 1;
    res.send(result);
});

/******************************************test***************************************************/
app.get('/monitor/test/json',function(req,res){
	res.send({name:'啦啦啦啦'});
});

/******************************************test end***********************************************/

/******************************************所有告警查询***************************************************/
app.post('/monitor/allAlarm/query',function(req,res){
  fixtures.initMsg.pageTimeFlag = 123;
  fixtures.initMsg.recTimeStamp = 456;
  fixtures.initMsg.lastAlarmTimeID = 789;
  var result = fixtures.initMsg;
  res.send(result);
});

app.post('/monitor/allAlarm/query/page',function(req,res){
  var result = {};
  result.result = 'success';
  result.message = '1000';
  res.send(result);
});

/******************************************所有告警查询end***********************************************/



Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

