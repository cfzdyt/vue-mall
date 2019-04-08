var express = require('express');
var router = express.Router();
var mongoose =require('mongoose');
var Goods = require('../models/goods');
//链接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/demo',{ useNewUrlParser: true });

//监听失败跟成功
mongoose.connection.on("connected",function(){
	console.log('success')
});
mongoose.connection.on("error",function(){
	console.log('fail')
});
mongoose.connection.on("disconnected",function(){
	console.log('disconnected')
});

router.get("/list",function(req,res,next){
	let params={};
	let page=parseInt(req.param("page"));
	//多少页
	let sort=req.param("sort");
	let pageSize=parseInt(req.param("pageSize"));
	//pageSize一页多少数据
	let skip=(page-1)*pageSize;
	//跳过多少条
	
	//接收前端传过来的数据过滤
	let priceLevel=req.param('priceCheck');
	//转换数据
	if(priceLevel!='all'){
		switch(priceLevel){
		case '0':priceGt=0;priceLte=100;break;
		case '1':priceGt=100;priceLte=500;break;
		case '2':priceGt=500;priceLte=1000;break;
		case '3':priceGt=1000;priceLte=2000;break;
	}
		
		params ={
			salePrice:{
				$gt:priceGt,
				$lte:priceLte,
			}
		}
//		条件查询
		
	}
	
	let goodsModel=Goods.find(params).skip(skip).limit(pageSize);
	//skip跳过的limit拿的
	goodsModel.sort({'salePrice':sort});
	
	
	goodsModel.exec(function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:{
					count:doc.length,
					list:doc
				}
			})
		}
	})
});

//加入到购物车
router.post("/addCart",function(req,res,next){
	var userId='100000077';
	var productId=req.body.productId;
	//与get拿参数方式不同
	//获取模型
	var User=require('../models/user');
	User.findOne({userId:userId},function(err,userDoc){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
			})
		}else{
			console.log(userDoc);
			//用商品id去商品里查
			if(userDoc){
				Goods.findOne({productId:productId},function(err1,doc){
					if(err1){
						res.json({
									status:'1',
									msg:err.message,
								})
							}else{
								if(doc){
									doc.productNum=1;
									doc.checked=1;
									//把这个商品加上数量跟选中
									//还需要在module的good模型里加入这两个，不然不会存入数据库
									userDoc.cartList.push(doc);
									//加到用户里去
									userDoc.save(function(err2,doc2){
										if(err2){
												res.json({
															status:'1',
															msg:err2.message,
														})
												}else{
													res.json({
																status:'0',
																msg:'ok',
																result:'succ'
															})
													}
									})
								}
							}
				})
			}
			
		}
	})
	
})






















module.exports=router;