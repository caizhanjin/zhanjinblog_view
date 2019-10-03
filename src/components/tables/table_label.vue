<template>
<div>
    <div style="text-align:right;">
        <el-button type="primary" size="medium" 
            @click="addLabel()"
            style="margin-bottom:10px;">新增标签
        </el-button>
    </div>

    <div style="border:1px solid #DCDFE6;border-radius:3px;">
        <el-table :data="label_data" style="width: 100%">
        <el-table-column
            prop="label_name"
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
                <el-button slot="reference" size="medium" plain type="primary" @click="editLabel(scope.row)">编辑</el-button>
                <el-popover
                    placement="top"
                    width="160"
                    v-model="scope.row.is_delete">
                    <p>确定删除吗？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope.row.is_delete = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="deleteLabel(scope.row)">确定</el-button>
                    </div>
                    <el-button slot="reference" size="medium" plain type="danger">删除</el-button>
                </el-popover>
            </template>
        </el-table-column>
        </el-table>
    </div>
    <!-- 新增标签 -->
    <el-dialog
        :title="dialog_label.is_new?'新增标签':'编辑标签'"
        :visible.sync="dialog_label.is_show"
        width="650px">
        <div>
            <el-form ref="dialog_label" :model="dialog_label" label-width="100px">
                <el-form-item label="标签名称：" 
                    prop="label_name"
                    :rules="{ required:true, message:'标签名称不能为空', trigger: 'blur' }">
                    <el-input v-model="dialog_label.label_name" placeholder="请填写标签名称"></el-input>
                </el-form-item>
                <el-form-item label="可见权限："
                    prop="visible_name"
                    :rules="{ required:true, message:'可见权限不能为空', trigger: 'blur' }">
                    <el-radio-group v-model="dialog_label.visible_name">
                        <el-radio label="所有人"></el-radio>
                        <el-radio label="普通用户"></el-radio>
                        <el-radio label="管理员"></el-radio>
                        <el-radio label="超级管理员"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialog_label.is_show = false">取 消</el-button>
            <el-button type="primary" @click="saveLabel()">确 定</el-button>
        </span>
    </el-dialog>
</div>

</template>

<script>
export default {
	name: 'tabel_label',
	data(){
		return{
            permission_dict:{
                "超级管理员":1,
                "管理员":2,
                "普通用户":3,
                "所有人":4,
            },
            permission_array:["-", "超级管理员","管理员","普通用户","所有人"],

            dialog_label:{
                is_show:false,
                is_new:false,
                label_name:"",
                visible_name:"",
            },
            label_data:[],
		}
	},
	mounted(){
        this.getLabelData()
	},
	methods:{
        deleteLabel(row_data){
            this.$del('/articles/LabelsModelViewSet/'+row_data.id+'/').then((res) => {
                if(res.code==200){
                    this.getLabelData()
                    this.$message({message: '删除成功', type: 'success', showClose: true})
                }else{
                    this.$message({message: res.msg, type: 'error', showClose: true})
                }
            })
            row_data.is_delete = false
        },
        editLabel(row_data){
            this.dialog_label = {
                id:row_data.id,
                is_show:true,
                is_new:false,
                label_name:row_data.label_name,
                visible_name:this.permission_array[row_data.visible_permission],
            }
        },
        saveLabel(){
			this.$refs.dialog_label.validate((valid)=>{
				if(valid){
                    var transmit_data = {
                        'label_name': this.dialog_label.label_name,
                        'visible_permission': this.permission_dict[this.dialog_label.visible_name]
                    }
                    if(this.dialog_label.is_new==true){
                        this.$post('/articles/LabelsModelViewSet/', transmit_data).then((res) => {
                            if(res.code==200){
                                this.getLabelData()
                                this.$message({message: '新增成功', type: 'success', showClose: true});
                                this.dialog_label.is_show = false
                            }else{
                                this.$message({message: res.msg, type: 'error', showClose: true});
                            }
                        })
                    }else{
                        this.$put('/articles/LabelsModelViewSet/'+this.dialog_label.id+'/', 
                        transmit_data).then((res) => {
                            if(res.code==200){
                                this.getLabelData()
                                this.$message({message: '编辑成功', type: 'success', showClose: true})
                                this.dialog_label.is_show = false
                            }else{
                                this.$message({message: res.msg, type: 'error', showClose: true})
                            }
                        })
                    }
				}
            })
        },
        addLabel(){
            this.dialog_label.is_show = true
            this.dialog_label = {
                is_show:true,
                is_new:true,
                label_name:"",
                visible_name:"所有人",
            }
        },
        getLabelData(){
            this.$get('/articles/LabelsModelViewSet/')
            .then((res) => {
                if(res.code==200){
                    this.label_data = res.data
                }
            })
        },
	},
}
</script>
