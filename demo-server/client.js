let http=require('http');

http.get('https://www.imooc.com/u/card%20?jsonpcallback=jQuery19103189332968214449_1553922426424&_=1553922426425',function(res){
	let data='';
	res.on('data',function(chunk){
		data+=chunk;
	});
	
	res.on('end',function(){
		let result=JSON.parse(data);
		console.log(result.msg);
	})
	
	
	
})
