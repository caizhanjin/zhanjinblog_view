<template>
<div id="app" class="page-component__scroll el-scrollbar__wrap">
	<el-container class="app_container">
		<el-header class="app_header">
			<el-row class="app_row">
				<el-col :span="16" class="app_col">
					<span class="header_h1" @click="goList()">zhanjinBlog</span>
					<el-menu :default-active="activeIndex" 
						mode="horizontal" 
						:active-text-color="'#409EFF'"
						@select="handleSelectMain"
						class="header_menu">
						<el-menu-item index="1" :class="[ activeIndex=='1'?'app_menu_active':'app_menu_dont_active']">文章列表</el-menu-item>
						<el-menu-item index="2" :class="[ activeIndex=='2'?'app_menu_active':'app_menu_dont_active']">文集</el-menu-item>
						<el-menu-item index="3" v-if="is_login" :class="[ activeIndex=='3'?'app_menu_active':'app_menu_dont_active']">管理</el-menu-item>
						<el-menu-item index="4" v-if="!is_login" :class="[ activeIndex=='4'?'app_menu_active':'app_menu_dont_active']">关于</el-menu-item>
					</el-menu>
				</el-col>
				<el-col :span="8" class="app_col app_left_new">
					<div class="list_editandlogin">
						<el-button type="primary" 
							icon="el-icon-edit" 
							@click="goCreateArticle()"
							round size="medium">写文章</el-button>
						<el-button type="primary" 
							round plain 
							@click="goLogin()"
							size="medium"
							v-if="!is_login">登录</el-button>
					</div>
					<el-menu :default-active="'1'" 
						mode="horizontal" 
						class="list_user" 
						@select="handleSelectUser"
						v-if="is_login">
						<el-submenu index="1">
							<template slot="title">caizhanjin</template>
							<el-menu-item index="1"><i class="el-icon-user-solid"></i>个人主页</el-menu-item>
							<el-menu-item index="2"><i class="el-icon-user"></i>退出</el-menu-item>
						</el-submenu>
					</el-menu>
				</el-col>
			</el-row>
		</el-header>
		<el-main class="app_main">
			<router-view @loginSucceed="loginSucceed" @changeMenuIndex="changeMenuIndex"/>
		</el-main>
		
		<el-footer class="app_footer">
			<div>
				CopyRight © 2019 ~ 2020 zhanjinBlog
			</div>
			<div class="power_by">
				Powered by 
				<a href="https://www.django-rest-framework.org/" target="_blank">Django REST Framework</a> & 
				<a href="https://cn.vuejs.org" target="_blank">vue.js</a> 
			</div>
		</el-footer>
	</el-container>
	<el-backtop target="#app" :right="60" :bottom="80"></el-backtop>
</div>
</template>

<script>
export default {
name: 'App',
data(){
	return {
		path_dict:{
			'/article_list':1,
			'/article_collection':2,
			'/manage':3,
			'/about_me':4,
		},

		activeIndex:"",
		is_login:false,
	}
},
created(){
	if(localStorage.token || sessionStorage.token){
		this.is_login = true
	}
},
mounted(){
	if(this.path_dict[this.$route.path]){
		this.activeIndex = this.path_dict[this.$route.path].toString()
	}
},
methods:{
	changeMenuIndex(index){
		this.activeIndex = index
	},
	goList(){
		this.$router.push('/article_list')
		this.$router.go(0)
	},
	loginSucceed(){
		this.activeIndex = "1"
		this.is_login = true
	},
	handleSelectUser(key, keyPath){
		if(key==1){
			this.activeIndex = ""
			this.$router.push('/about_me')
		}else{
			this.activeIndex = "1"
			localStorage.removeItem('token')
			localStorage.removeItem('id')
			localStorage.removeItem('username')
			sessionStorage.removeItem('token')
			sessionStorage.removeItem('id')
			sessionStorage.removeItem('username')
			this.is_login = false
			this.$router.push('/article_list')
		}
	},
	handleSelectMain(key, keyPath) {
		this.activeIndex = key
		if(key==1){
			this.$router.push('/article_list')
		}else if(key==2){
			this.$router.push('/article_collection')
		}else if(key==3){
			this.$router.push('/manage')
		}else if(key==4){
			this.$router.push('/about_me')
		}
	},
	goLogin(){
		this.activeIndex = ""
		this.$router.push('/login')
	},
	goCreateArticle(){
		this.activeIndex = ""
		if(this.is_login){
			this.$router.push('/article_create')
		}else{
			this.$message({ message: '请先登录', type: 'warning' });
			this.$router.push('/login')
		}
		
	},
  },

}
</script>

<style>
body {
	margin:0;
}

html,body,#app{
	height: 100%;
}

.app_container{
	min-height: 100%;
}

.app_header{
	height:61px !important;
	padding:0 !important;
	border-bottom: 1px solid #dcdfe6;
}

.app_row{
	height:100%;
}

.app_row .header_menu{
	display: inline-block;
	border-bottom:none;
}

.app_row .header_menu li:hover{
	color: #409EFF !important;
}

.app_row .header_h1{
	margin:0px 40px;
	font-size:24px;
	float:left;
	color: #000000;
}

.app_col{
	height:4rem;
	line-height:4rem;
}

.app_col .el-menu-item{
	font-size: 16px;
}

.app_left_new .el-button{
	float:right;
	font-size: 16px;
	margin-right: 10px;
	height: 37px;
}

.app_left_new{
	padding-right: 40px;
}

.list_editandlogin{
	padding-top: 10px;
	float: right;
}

.list_user{
	float: right;
	margin-right: 10px;
}

.list_user ul:hover{
	background-color: rgb(236, 245, 255);
}

.list_user .is-opened{
	background-color: rgb(236, 245, 255);
}

.list_user .el-submenu__title{
	border: none !important;
}

.list_user .el-submenu__title:hover{
	background-color: rgb(236, 245, 255) !important;
}

.el-menu--popup li:hover{
	background-color: rgb(236, 245, 255) !important;
}

.el-menu--popup{
	padding: 0;
	min-width: 150px;
}

.app_footer{
	color: #FFFFFF !important;
	background-color: #606266;
	text-align: center;
	height:70px !important;
	padding:20px !important;
    font-size: 16px;
    color: #666;
}

.power_by a{
	text-decoration:none;
}

.power_by a:hover{
	text-decoration:underline;
}

.header_h1:hover{
	color: #409EFF;
	transform: rotate(360deg)scale(1.2,1.2);
	transition-duration: 1s;
}

.app_main{
	padding: 0px !important; 
}
  
#app {
	overflow-x: hidden; 
	overflow-y: auto;
}

.app_menu_active{
	color: rgb(64, 158, 255) !important;
	border-bottom: 2px solid #409EFF !important;
}
  
.app_menu_dont_active{
	color: #909399 !important;
	border: none !important;
}
</style>
