
let http=require('http');
let url=require('url');
let util=require('util');

let fs=require('fs');

let server=http.createServer((req,res)=>{

	var pathname=url.parse(req.url).pathname;
	fs.readFile(pathname.slice(1),function(err,data){
		if(err){
			res.writeHead(404,{
				'Content-Type':'text/html'
			});
		}else{
			res.writeHead(200,{
				'Content-Type':'text/html'
			});
			res.write(data.toString());
		}
		
		res.end();
	});
	
	
});
server.listen(3000,'192.168.0.105',()=>{
	console.log('服务器已经运行，请打开浏览http://192.168.0.106:3000/')
})
