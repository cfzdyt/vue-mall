<template>
	<div>
		
		<nav-header></nav-header>
		<nav-bread></nav-bread>
		

		<div class="accessory-result-page accessory-page">
			<div class="container">
				<div class="filter-nav">
					<span class="sortby">Sort by:</span>
					<a href="javascript:void(0)" class="default cur">Default</a>
					<a 
						href="javascript:void(0)" 
						class="price"
						@click="sortPrice"
						>Price
						 <svg class="icon icon-arrow-short" :class="{'sort-up':sortNumber}"><use xlink:href="#icon-arrow-short"></use></svg>
					</a>
					<a href="javascript:void(0)" class="filterby stopPop"
					
						>Filter by</a>
				</div>
				<div class="accessory-result">
					<!-- filter -->
					<div 
						class="filter stopPop" 
						id="filter"
						
						>
						<dl class="filter-price">
							<dt>Price:</dt>
							<dd>
								<a 
									href="javascript:void(0)"
									:class="{'cur':pcheck=='all'}"
									@click="priceCheck('all')"
									>All</a>
							</dd>
							<dd v-for="(item,index) in priceFilter" :key="index">
								<a href="javascript:void(0)" 
									:class="{'cur':pcheck==index}"
									@click="priceCheck(index)"
									>{{item.start}} - {{item.end}}</a>
							</dd>
							
						</dl>
					</div>

					<!-- search result accessories list -->
					<div class="accessory-list-wrap">
						<div class="accessory-list col-4">
							<ul>
								<li v-for="(item,index) in goodList" :key="index">
									<div class="pic"> 
										<a href="#"><img 
											v-lazy="'../../static/'+item.productImage" alt=""></a>
									</div>
									<div class="main">
										<div class="name">{{item.productName}}</div>
										<div class="price">{{item.salePrice}}</div>
										<div class="btn-area">
											<a 
												href="javascript:;" 
												class="btn btn--m"
												@click="addCart(item.productId)"
												>加入购物车</a>
										</div>
									</div>
								</li>
								
							</ul>
							<div class="load-more"   v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
  <img src="../../static/loading/loading-bars.svg" v-show="loading"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--没登陆时弹窗-->
		<model 
			:mdShow="mdShow"
			@close="closeModel"
			>
			<p slot="message" >请先登录</p>
			<div slot="btnGroup">
				<a 
				class="btn btn--m" 
				@click="closeModel" 
				href="javascript:void(0)" 
				>
					关闭
				</a>
			</div>
		</model>
		<!--登陆时弹窗-->
		<model 
			:mdShow="mdShowCart"
			@close="closeModel"
			>
			<p slot="message" >
				<svg class="icon-status-ok">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                    </svg>
				<span>加入购物车成功</span>
			</p>
			<div slot="btnGroup">
				<a 
				class="btn btn--m" 
				@click="mdShowCart=false" 
				href="javascript:void(0)" 
				>
				继续购物
				</a>
				<router-link 
				class="btn btn--m" 
				href="javascript:void(0)"
				to="/cart"
				>查看购物车</router-link>
			</div>
		</model>
		<nav-footer></nav-footer>
		

	</div>

</template>

<script>
	import './../assets/css/base.css'
	import './../assets/css/product.css'
	import './../assets/css/checkout.css'
	import './../assets/css/login.css'
	import NavHeader from '@/components/Header'
	import NavFooter from '@/components/NavFooter'
	import NavBread from '@/components/NavBread'
	import Model from '@/components/Model'
	import axios from 'axios'
	export default {
		name: 'GoodsList',
		data () {
			return {
				goodList:[],
				priceFilter:[{
					start:'0.00',
					end:'100.00'
				},
				{
					start:'100.00',
					end:'500.00'
				},
				{
					start:'500.00',
					end:'1000.00'
				},
				{
					start:'1000.00',
					end:'5000.00'
				}],
				pcheck:'all',
				filterBy:false,
				sortNumber:true,
				page:1,
				pageSize:8,
				busy:true,
				loading:false,
				mdShow:false,
				mdShowCart:false
				
				
			}
		},
		components:{
			NavHeader,
			NavFooter,
			NavBread,
			Model
		},
		methods:{
			getGoodList(falg){
				var param={
					page:this.page,
					pageSize:this.pageSize,
					sort:this.sortNumber?1:-1,
					
					priceCheck:this.pcheck
					
				}
				this.loading=true;
				axios.get("/goods/list",{
					params:param
				}).then((rs)=>{
					this.loading=false;
					let res=rs.data;
					if(res.status=='0'){
						if(falg){
							this.goodList=this.goodList.concat(res.result.list);
							//判断之后，合并数组
							if(res.result.count==0){
								this.busy=true;
								//没数据的时候禁用插件
							}else{
								this.busy=false;
								//有数据就打开插件
							}
						}else{
							this.goodList=res.result.list;
							//第一次进入不用合并
							this.busy=false;
							//别忘打开插件
						}
					}
				
				});
			},
			sortPrice(){
				this.sortNumber=!this.sortNumber;
				this.page=1;
				this.getGoodList();
				//排序
			},
			loadMore(){
				
				this.busy=true;
				setTimeout(() => {
					this.page++;
					this.getGoodList(true);
					
					//加载更多
      			}, 500);
			},
			priceCheck(index){
				this.pcheck=index;
				this.page=1;
				this.getGoodList();
				//过滤
			},
			addCart(Id){
				axios.post('/goods/addCart',{
					productId:Id
				}).then((res)=>{
					let rs=res.data;
					if(rs.status=='0'){
						this.mdShowCart=true;
						
					}else{
						this.mdShow=true;
					}
				});
				
				
			},
			closeModel(){
				this.mdShow=false;
				this.mdShowCart=false
			}
			
			
		},
		mounted () {
			this.getGoodList()
		}
	}
		
		
		
	
</script>

<style scoped>
 .list-wrap ul::after{
 	clear: both;
 	content: '';
 	height: 0;
 	display: block;
 	overflow: hidden;
 }
 .load-more{
 	height: 100px;
 	line-height: 100px;
 	text-align: center;
 }
 .sort-up{
 	transform:rotate(180deg);
 	transition: all .3s ease-out;
 }
 .icon-arrow-short{
 	transition: all .3s ease-out;
 }
 .btn:hover{
 	background-color: #ffe5e6;
 	transition: all .3s ease-out;
 }
</style>