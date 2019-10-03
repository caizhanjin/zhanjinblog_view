<template>
<div class="login_content">
    <div class="login_just">
        <el-card shadow="never">本站账号登录</el-card>
    </div>
    <div class="login_information">
		<div class="login_error_hint">
			<el-alert v-if="error_hint" :title="error_hint" 
				type="error" show-icon 
				:closable="false"
				class="login_error_hint"
			></el-alert>
		</div>
		<el-form label-width="80px" :model="user_data" ref="user_data">
			<el-form-item label="账号："
				prop="username"
				:rules="{ required:true, message:'账号不能为空', trigger: 'blur' }"
			>
				<el-input v-model="user_data.username" placeholder="请输入用户名"></el-input>
			</el-form-item>
			<el-form-item label="密码："
				prop="password"
				:rules="[{ required:true, message:'密码不能为空', trigger: 'blur' }]"
			>
				<el-input v-model="user_data.password" placeholder="请输入密码" show-password></el-input>
			</el-form-item>
			<el-form-item style="margin-bottom:0;">
				<el-checkbox v-model="is_keep_login">保持登录</el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="goLogin('user_data')">登录</el-button>
			</el-form-item>
		</el-form>
		<div class="login_hint"><span>本网站暂不对外开放注册.</span></div>
	</div>
</div>

</template>

<script>
export default {
	name: 'login',
	data(){
		return{
			test:'',
			user_data:{
				username:'',
				password:'',
			},
			is_keep_login:false,
			error_hint:"",
		}
	},
	mounted(){
	},
	methods:{
		goLogin(form_name){
			this.$refs[form_name].validate((valid)=>{ // 校验数据是否符合要求
				if(valid){
					this.$post('/users/login/', this.user_data)
					.then((response) => {
						this.error_hint = ""
						if(this.is_keep_login){
							localStorage.token = response.token
							localStorage.id = response.id
							localStorage.username = response.username
						}else{
							sessionStorage.token = response.token
							sessionStorage.id = response.id
							sessionStorage.username = response.username
						}
						this.$message({message: '登录成功', type: 'success', showClose: true});
						this.$emit('loginSucceed')
						this.$router.push("/article_list")
					}).catch(error =>{   
						if(error.status==400){
							this.error_hint = "账号或者密码不正确"
						}else{
							this.error_hint = "未知错误，请联系管理员"
						}
					})
				}
			})
		},
	},
}
</script>

<style>
.login_content{
    padding: 20px 20%;
}

.login_just{
    text-align: center;
    font-size: 18px;
}

.login_just .el-card{
    background-color:rgb(225, 243, 216); 
    border-radius:15px;
}

.login_information{
	margin-top: 20px;
	padding: 0 30%;
}

.login_hint{
	text-align: center;
	font-style:italic;
	color: #909399;
}

.login_error_hint{
	margin-bottom: 10px;
	height: 40px;
}

</style>
