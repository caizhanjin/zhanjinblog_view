<template>
<div>
    <el-card shadow="hover">
        <i class="el-icon-message-solid" style="color:lightskyblue;padding-right:5px;"></i>博主动态
        <p v-if="!is_edit" @click="goEdit()">{{ recent_info }}</p>
        <p v-else>
            <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="new_recent_info"
                maxlength="140"
                show-word-limit
                @blur="openMessageBox()"
                id="recent_input"
                >
            </el-input>
        </p>
        <p class="collection_state_date">{{ create_time | date('YYYY-MM-DD') }}</p>
    </el-card>
</div>

</template>

<script>
export default {
	name: 'recent',
	data(){
		return{
            is_login:false,
            is_edit:false,

            recent_info:'',
            new_recent_info:'',
            create_time:'',
		}
	},
	mounted(){
		if(localStorage.token || sessionStorage.token){
			this.is_login = true
        }
        this.getRecentData()
	},
	methods:{
        getRecentData(){
 			this.$get('/articles/RecentModelViewSet/get_recent_data/')
			.then((res) => {
				if(res.code==200){
                    this.recent_info = res.data.recent_info
                    this.create_time = res.data.create_time
				}else{
					this.$message({message: res.msg, type: 'error', showClose: true})
				}

			})
        },
        openMessageBox(){
            if(!this.is_edit){ return }
            this.$confirm('是否发布最新动态', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                if(this.new_recent_info==''){
                    this.$message({message: '内容不能为空', type: 'error', showClose: true})
                    document.getElementById('recent_input').focus()
                    return
                }
                this.goNewRecent()
            }).catch(() => {
                this.is_edit = false    
            });
        },
        goEdit(){
            if(!this.is_login){ return }
            this.is_edit = true
            this.new_recent_info = ''
            setTimeout(function(){
                document.getElementById('recent_input').focus()
            }, 100)
        },
        goNewRecent(){
            this.$post('/articles/RecentModelViewSet/', 
                {'recent_info':this.new_recent_info}
            ).then((res) => {
                if(res.code==200){
                    this.$message({message: '新增成功', type: 'success', showClose: true})
                    this.recent_info = res.data.recent_info
                    this.create_time = res.data.create_time
                    this.is_edit = false
                }else{
                    this.$message({message: res.msg, type: 'error', showClose: true})
                }
            })
        },
	},
}
</script>
<style>
.collection_state_date{
    text-align:right;
}
</style>