<template>
<div class="article_create">
	<div class="create_content">
		<el-form label-position="top" label-width="80px" :model="articleDetail" ref="articleDetail">
			<el-form-item label="文章" 
				prop="body"
				:rules="{ required:true, message:'文章正文不能为空', trigger: 'blur' }">
				<mavon-editor 
					v-model="articleDetail.body" 
					style="height:700px;" 
					id="create_editor"
					@fullScreen="fullScreen"
					:toolbars="toolbars"
				/>
			</el-form-item>
			<el-form-item label="标签" 
				prop="labels_all"
				:rules="{ required:true, message:'标签不能为空', trigger: 'blur' }">
				<el-select 
					v-model="articleDetail.labels_all" 
					clearable
					filterable
					multiple
					placeholder="请选择标签"
					:popper-class="'control_option_width'">
					<el-option v-for="(item, key) in label_data" 
						:label="item.label_name" 
						:value="item.id" 
						:key="key"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="文集">
				<el-select 
					v-model="articleDetail.collection_info" 
					filterable
					clearable
					placeholder="请选择文集"
					:popper-class="'control_option_width'">
					<el-option v-for="(item, key) in collection_data" 
						:label="item.collect_name" 
						:value="item.id" 
						:key="key"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="标题" 
				prop="title"
				:rules="{ required:true, message:'标题不能为空', trigger: 'blur' }">
				<el-input v-model="articleDetail.title" clearable placeholder="请填写标题"></el-input>
			</el-form-item>
			<el-form-item label="原文作者" 
				prop="author">
				<el-input v-model="articleDetail.author" clearable placeholder="请填写原文作者(默认当前登录用户)"></el-input>
			</el-form-item>
			<el-form-item label="原始链接">
				<el-input v-model="articleDetail.original_link" clearable placeholder="请填写原始链接(默认网站文章详情当前链接)"></el-input>
			</el-form-item>
			<el-form-item label="可见权限"
				prop="visible_name"
				:rules="{ required:true, message:'可见权限不能为空', trigger: 'blur' }">
				<el-radio-group v-model="articleDetail.visible_name">
					<el-radio label="所有人"></el-radio>
					<el-radio label="普通用户"></el-radio>
					<el-radio label="管理员"></el-radio>
					<el-radio label="超级管理员"></el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
	</div>
	<div>
		<el-button type="primary" @click="saveArticle()">发布文章</el-button>
		<el-button type="primary" @click="goBack()">取消</el-button>
	</div>
</div>

</template>

<script>
export default {
	name: 'articleCreate',
	data(){
		return{
            collection_data:[],
            label_data:[],
			articleDetail:{
				title:'',
				author:'',
				body:'',
				collection_info:'',
				labels_all:'',
				original_link:'',
				visible_name:'所有人',
				visible_permission:'',
			},
			permission_array:["-", "超级管理员","管理员","普通用户","所有人"],
            permission_dict:{
                "超级管理员":1,
                "管理员":2,
                "普通用户":3,
                "所有人":4,
			},
			is_edit:false,
			toolbars:{
				bold: true, // 粗体
				italic: true, // 斜体
				header: true, // 标题
				underline: true, // 下划线
				strikethrough: true, // 中划线
				mark: true, // 标记
				quote: true, // 引用
				ol: true, // 有序列表
				ul: true, // 无序列表
				link: true, // 链接
				imagelink: true, // 图片链接
				code: true, // code
				table: true, // 表格
				fullscreen: true, // 全屏编辑
				help: true, // 帮助
			},
		}
	},
	mounted(){
		this.getCollectionData()
		this.getLabelData()
		if(this.$route.query.id){
			this.getArticleDetail()
			this.is_edit = true
		}
	},
	methods:{
		$imgAdd(pos, $file){
			var formdata = new FormData()
			formdata.append('image', $file)

			const instance = this.$axios.create()
			instance({
				url: this.$axios.defaults.baseURL+'/files/images/',
				method: 'post',
				data: formdata,
				headers: { 'Content-Type': 'multipart/form-data' },
			}).then((res) => {
				var new_url = ''
				if(res.data.code==200){
					new_url = res.data.data
				}else{
					this.$message({message: res.data.msg, type: 'error', showClose: true})
				}
				this.$refs.md.$img2Url(pos, new_url);
			})
		},
		goBack(){
			this.$router.go(-1)
		},
		fullScreen(status, value){
			if(status==true){
				document.getElementById("create_editor").style.height = "100%"
			}else{
				document.getElementById("create_editor").style.height = "700px"
			}
		},
		getArticleDetail(){
			this.$get('/articles/ArticlesModelViewSet/'+this.$route.query.id+'/')
			.then((res) => {
				res.data.visible_name = this.permission_array[res.data.visible_permission]
				this.articleDetail = res.data
			})
		},
		saveArticle(){
			this.$refs.articleDetail.validate((valid)=>{
				if(valid){
					this.articleDetail.visible_permission = this.permission_dict[this.articleDetail.visible_name]
					if(this.is_edit){
						this.$put('/articles/ArticlesModelViewSet/'+this.$route.query.id+'/', 
							this.articleDetail
						).then((res) => {
							if(res.code==200){
								this.$message({message: '编辑成功', type: 'success', showClose: true})
								this.$router.push({path:'/article_detail', query:{'id':res.data.id}})
							}else{
								this.$message({message: res.msg, type: 'error', showClose: true})
							}
						})
					}else{
						this.$post('/articles/ArticlesModelViewSet/', 
							this.articleDetail
						).then((res) => {
							if(res.code==200){
								this.$message({message: '新增成功', type: 'success', showClose: true})
								this.$router.push({path:'/article_detail', query:{'id':res.data.id}})
							}else{
								this.$message({message: res.msg, type: 'error', showClose: true})
							}
						})
					}
				}
			})
		},
        getCollectionData(){
            this.$get('/articles/CollectionsModelViewSet/')
            .then((res) => {
                if(res.code==200){
                    this.collection_data = res.data
                }
            })
        },
        getLabelData(){
            this.$get('/articles/LabelsModelViewSet/')
            .then((res) => {
                if(res.code==200){
					this.label_data = res.data
                }
            })
        }
	},
}
</script>

<style>
.article_create{
	padding:0 12%;
    font-size: 1rem;
	line-height: 2rem;
	padding-bottom:20px;
}

.create_content{
	padding:20px 0;
}

.create_content .el-input{
	width: 50%;
}

.create_content .el-select{
	width: 100%;
}

.control_option_width{
	width: 38%;
	min-width: 38% !important;
}

</style>
