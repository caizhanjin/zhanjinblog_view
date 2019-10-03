<template>
<div>
	<div style="border:1px solid #DCDFE6;border-radius:3px;">
		<el-table :data="article_data" style="width: 100%">
		<el-table-column
			prop="title"
			label="标题"
			align="center">
		</el-table-column>
		<el-table-column
			prop="create_time"
			label="发布日期"
			width="200"
			sortable
			align="center">
			<template slot-scope="scope">
				<span>{{ scope.row.create_time | date('YYYY-MM-DD HH:mm') }}</span>
			</template>
		</el-table-column>
		<el-table-column
			prop="create_time"
			label="可见状态"
			width="100px"
			align="center">
			<template slot-scope="scope">
				<span>{{ permission_array[scope.row.visible_permission] }}</span>
			</template>
		</el-table-column>
		<el-table-column
			prop="address"
			label="操作"
			width="200px"
			align="center">
			<template slot-scope="scope">
				<el-button slot="reference" size="medium" plain type="primary" @click="editArticle(scope.row)">编辑</el-button>
				<el-popover
					placement="top"
					width="160"
					v-model="scope.row.is_delete">
					<p>确定删除吗？</p>
					<div style="text-align: right; margin: 0">
						<el-button size="mini" type="text" @click="scope.row.is_delete = false">取消</el-button>
						<el-button type="primary" size="mini" @click="deleteArticle(scope.row)">确定</el-button>
					</div>
					<el-button slot="reference" size="medium" plain type="danger">删除</el-button>
				</el-popover>
			</template>
		</el-table-column>
		</el-table>
	</div>
	<div class="table_page">
		<el-pagination
			background
			layout="sizes, prev, pager, next"
			:page-sizes="[5, 10, 20]"
			:current-page="parseInt(search_data.current_index)"
			:total="parseInt(search_data.total)"
			:page-size="parseInt(search_data.page_size)"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		>
		</el-pagination>
	</div>
    <!-- 编辑文章 -->
    <el-dialog
        title="编辑文章"
        :visible.sync="dialog_article.is_show"
        width="650px">
        <div>
            <el-form ref="dialog_article" :model="dialog_article" label-width="100px">
                <el-form-item label="文章名称：" 
                    prop="title"
                    :rules="{ required:true, message:'文章名称不能为空', trigger: 'blur' }">
                    <el-input v-model="dialog_article.title" placeholder="请填写文章名称"></el-input>
                </el-form-item>
                <el-form-item label="可见权限："
                    prop="visible_name"
                    :rules="{ required:true, message:'可见权限不能为空', trigger: 'blur' }">
                    <el-radio-group v-model="dialog_article.visible_name">
                        <el-radio label="所有人"></el-radio>
                        <el-radio label="普通用户"></el-radio>
                        <el-radio label="管理员"></el-radio>
                        <el-radio label="超级管理员"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialog_article.is_show = false">取 消</el-button>
            <el-button type="primary" @click="saveArticle()">确 定</el-button>
        </span>
    </el-dialog>
</div>

</template>

<script>
export default {
	name: 'articleCollection',
	data(){
		return{
            visible:false,

            permission_dict:{
                "超级管理员":1,
                "管理员":2,
                "普通用户":3,
                "所有人":4,
            },
            permission_array:["-", "超级管理员","管理员","普通用户","所有人"],
            
			article_data:[],
			search_data:{
				total:10,
				page_size:10,
				current_index:1,
			},

            dialog_article:{
                is_show:false,
				title:"",
				id:'',
				visible_name:"",
			},
		}
	},
	mounted(){
		this.getArticleData()
	},
	methods:{
        deleteArticle(row_data){
            this.$del('/articles/ArticlesModelViewSet/'+row_data.id+'/').then((res) => {
                if(res.code==200){
                    this.getArticleData()
                    this.$message({message: '删除成功', type: 'success', showClose: true})
                }else{
                    this.$message({message: res.msg, type: 'error', showClose: true})
                }
            })
            row_data.is_delete = false
        },
        saveArticle(){
			this.$refs.dialog_article.validate((valid)=>{
				if(valid){
                    var transmit_data = {
                        'title': this.dialog_article.title,
                        'visible_permission': this.permission_dict[this.dialog_article.visible_name],
                    }
					this.$put('/articles/ArticlesModelViewSet/'+this.dialog_article.id+'/', 
					transmit_data).then((res) => {
						if(res.code==200){
							this.getArticleData()
							this.$message({message: '编辑成功', type: 'success', showClose: true})
							this.dialog_article.is_show = false
						}else{
							this.$message({message: res.msg, type: 'error', showClose: true})
						}
					})
				}
            })
        },
        editArticle(row_data){
            this.dialog_article = {
				is_show:true,
                id:row_data.id,
				title:row_data.title,
                visible_name:this.permission_array[row_data.visible_permission],
            }
        },
		handleSizeChange(page_size) {
			this.getArticleData(page_size, '')
		},
		handleCurrentChange(current_index) {
			this.getArticleData('', current_index)
		},
		getArticleData(page_size='', current_index=''){
			this.current_label_id = this.search_data.label_id
			var transmit_data = JSON.parse(JSON.stringify(this.search_data))
			if(page_size!=''){
				transmit_data.page_size = page_size
			}
			if(current_index!=''){
				transmit_data.current_index = current_index
			}

			this.$get('/articles/ArticlesModelViewSet/get_by_label/', 
				transmit_data
			).then((res) => {
				this.article_data = res.data.list_data
				this.search_data.total = res.data.page_info.total
				this.search_data.page_size = res.data.page_info.page_size
				this.search_data.current_index = res.data.page_info.current_index
			})
		},
	},
}
</script>
<style>
.table_page .el-pagination{
  text-align: center;
  margin-top: 8px;
}
</style>