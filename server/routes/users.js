var express = require('express');
var router = express.Router();

var User=require('./../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(User);
  
  
});

//登陆的接口
router.post('/login', function(req, res, next) {
  var param={
  	userName:req.body.userName,
		userPwd:req.body.userPwd,
  }
		//那前端传过来的值
	User.findOne(param,function(err,doc){
			//用param里的信息查
			if(err){
				res.json({
					status:'1',
					msg:err.message,
				});
			}else{
						if(doc){
							//因为app.js里引入了cookie插件
							res.cookie('userId',doc.userId,{
								path:'/',
								maxAge:1000*60*60
							});
								res.cookie('userName',doc.userName,{
								path:'/',
								maxAge:1000*60*60
							});
//							req.session.user=doc;
							//也存一份session
							res.json({
											status:'0',
											msg:'',
											result:{
												userName:doc.userName
												//再把名字返回去
											}
											});
				
					}
				
			}
			
			
			
		});
		
});



//登出接口
router.post('/logout',function(req,res,next){
	res.cookie('userId','',{
		path:'/',
		maxAge:-1
		
	});
	res.json({
			status:'0',
			msg:'',
			result:''

	
})
})

router.get('/checkLogin',function(req,res,next){
	if(req.cookies.userId){
		res.json({
			status:'0',
			msg:'',
			result:req.cookies.userName

	
})
		}else{
	res.json({
			status:'1',
			msg:'',
			result:''

	
})
	
}
		
		
	})
	
//查询当前用户的购物车数据
router.get('/cartList',function(req,res,next){
	var userId=req.cookies.userId;
	User.findOne({userId:userId},function(err,doc){
		if(err){
				res.json({
									status:'1',
									msg:'err.message',
									result:''
								})
		}else{
			if(doc){
					res.json({
									status:'0',
									msg:'',
									result:doc.cartList
								})
							}
			
		}
	})
	
	
})

//购物车删除
router.post('/cartDel',function(req,res,next){
	let userId=req.cookies.userId;
	let productId=req.body.productId;
//	mongoose方法更新
	User.update({
		userId:userId
	},{
		$pull:{
			'cartList':{
				'productId':productId
			}
		}
	},function(err,doc){
				if(err){
				res.json({
									status:'1',
									msg:'err.message',
									result:''
								})
				}else{
							if(doc){
											res.json({
																status:'0',
																msg:'',
																result:'succ'
																})
										}
			
		}
		
		
	})
	
	
})
//购物车单品加减
router.post('/editCart',function(req,res,next){
	let userId=req.cookies.userId;
	let productId=req.body.productId;
	let productNum=req.body.productNum;
	let checked=req.body.checked;
//	mongoose方法更新
	User.update({
		'userId':userId,'cartList.productId':productId
	},{
		'cartList.$.productNum':productNum,
		'cartList.$.checked':checked
	},function(err,doc){
				if(err){
				res.json({
									status:'1',
									msg:'err.message',
									result:''
								})
				}else{
									res.json({
														status:'0',
														msg:'',
														result:'succ'
														})
		}
		
		
	})
	
	
})





//全选接口
router.post('/editCheckAll',function(req,res,next){
	let userId=req.cookies.userId;
	let checkAll=req.body.checkAll?'1':'0';
//	mongoose方法更新
	User.findOne({userId:userId},function(err,user){
		if(err){
				res.json({
									status:'1',
									msg:'err.message',
									result:''
								})
		}else{
			if(user){
					user.cartList.forEach((item)=>{
						item.checked=checkAll;
					})
					user.save(function(err1,doc){
									if(err1){
														res.json({
														status:'1',
														msg:'err1.message',
														result:''
																		})
													}else{
																res.json({
																					status:'0',
																					msg:'',
																					result:'succ'
																					})
																}
						
						
						
					})
							}
			
		}
	})
	
	
})


module.exports = router;
