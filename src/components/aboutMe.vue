<template>
<div class="aboutme_main">
	<div class="aboutme_top">
		<el-row>
			<el-col :span="12" class="my_handsome_photo">
				<img src="../assets/img/head_icon.jpg" alt="">
			</el-col>
			<el-col :span="12" style="font-size: 16px;">
				<strong><p style="font-size: 22px;">About me</p></strong>
				<p>码字员，现就职于深圳某公司</p>
				<p>网站全站开发，前端vue，后端主要用python</p>
				<p>业余喜欢研究量化、程序化交易</p>
				<p>18年开始写博客，19年创建个人网站</p>
				<p>爱好运动，特长长跑，也喜欢撸铁、户外</p>
			</el-col>
		</el-row>
	</div>
	<hr style="background-color:#DCDFE6;height:1px;border:none;">
	<div style="font-size: 16px;">
		<strong><p style="font-size: 22px;">联系我：</p></strong>
		<ul>
			<li>欢迎网站留言</li>
			<li>Email：caizhanjin@qq.com</li>
			<li>Gihub：
				<a href="https://github.com/caizhanjin" target="_blank" class="aboutme_a">
				https://github.com/caizhanjin</a>
			</li>
		</ul>
	</div>
</div>
</template>

<script>
export default {
name: 'aboutMe',
data(){
	return{
		test:'',
	}
},
mounted(){

},
methods:{
},
}
</script>
<style>
.aboutme_main{
	padding: 20px 20%;
}

.aboutme_top{
	margin-bottom: 15px;
}

.my_handsome_photo{
	text-align:center; 
	vertical-align:middle;
}

.my_handsome_photo img{
	width: 240px;
	height: 240px;
	-moz-border-radius: 50px;
	-webkit-border-radius: 50px;
	border-radius:50px;
}

.aboutme_a{
	text-decoration:none;
	color: #303133;
}

.aboutme_a:hover{
	color: #409EFF;
}

</style>
