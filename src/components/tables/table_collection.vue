<template>
<div>
    <div style="text-align:right;">
        <el-button type="primary" size="medium" 
            @click="addCollection()"
            style="margin-bottom:10px;">新增文集</el-button>
    </div>

    <div style="border:1px solid #DCDFE6;border-radius:3px;">
        <el-table :data="collection_data" style="width: 100%">
        <el-table-column
            prop="collect_name"
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
            width="280px"
            align="center">
            <template slot-scope="scope">
                <el-button slot="reference" size="medium" plain type="primary" @click="getArticleList(scope.row)">
                    文章顺序
                </el-button>
                <el-button slot="reference" size="medium" plain type="primary" 
                    @click="editCollection(scope.row)" style="margin-left:0;">
                    编辑
                </el-button>
                <el-popover
                    placement="top"
                    width="160"
                    v-model="scope.row.is_delete">
                    <p>确定删除吗？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope.row.is_delete = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="deleteCollection(scope.row)">确定</el-button>
                    </div>
                    <el-button slot="reference" size="medium" plain type="danger">删除</el-button>
                </el-popover>
            </template>
        </el-table-column>
        </el-table>
    </div>
    <!-- 新增文集 -->
    <el-dialog
        :title="dialog_collection.is_new?'新增文集':'编辑文集'"
        :visible.sync="dialog_collection.is_show"
        width="650px">
        <div>
            <el-form ref="dialog_collection" :model="dialog_collection" label-width="100px">
                <el-form-item label="文集名称：" 
                    prop="collect_name"
                    :rules="{ required:true, message:'文集名称不能为空', trigger: 'blur' }">
                    <el-input v-model="dialog_collection.collect_name" placeholder="请填写文集名称"></el-input>
                </el-form-item>
                <el-form-item label="文集描述："
                    prop="description"
                    :rules="{ required:true, message:'文集描述不能为空', trigger: 'blur' }">
                    <el-input type="textarea" v-model="dialog_collection.description" placeholder="请填写文集描述"></el-input>
                </el-form-item>
                <el-form-item label="可见权限："
                    prop="visible_name"
                    :rules="{ required:true, message:'可见权限不能为空', trigger: 'blur' }">
                    <el-radio-group v-model="dialog_collection.visible_name">
                        <el-radio label="所有人"></el-radio>
                        <el-radio label="普通用户"></el-radio>
                        <el-radio label="管理员"></el-radio>
                        <el-radio label="超级管理员"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialog_collection.is_show = false">取 消</el-button>
            <el-button type="primary" @click="saveCollection()">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 调整文章顺序 -->
    <el-dialog
        title="调整文章顺序"
        :visible.sync="is_show_order"
        width="650px">
        <div>
            <SortableList lockAxis="y" v-model="article_list" @input="listChange">
                <SortableItem 
                    v-for="(item, index) in article_list" 
                    :index="index" 
                    :key="index" 
                    :item="item.title"
                />
            </SortableList>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="is_show_order = false">取 消</el-button>
            <el-button type="primary" @click="saveArticleOrder()">保 存</el-button>
        </span>
    </el-dialog>
</div>

</template>

<script>
import Vue from 'vue';
import { ContainerMixin, ElementMixin } from 'vue-slicksort';

const SortableList = {
  mixins: [ContainerMixin],
  template: `
    <ul class="t_c_list">
      <slot />
    </ul>
  `,
};

const SortableItem = {
  mixins: [ElementMixin],
  props: ['item'],
  template: `
    <li class="t_c_list_item">{{item}}</li>
  `,
};

export default {
	name: 'tabel_collections',
	data(){
		return{
            permission_array:["-", "超级管理员","管理员","普通用户","所有人"],
            permission_dict:{
                "超级管理员":1,
                "管理员":2,
                "普通用户":3,
                "所有人":4,
            },

            collection_data:[],
            dialog_collection:{
                is_show:false,
                is_new:false,
                collect_name:"",
                description:"",
                visible_name:"",
            },

            article_list:[],
            new_article_list:[],
            is_show_order:false,
		}
	},
	mounted(){
        this.getCollectionData()
    },
	components:{
		SortableItem,
		SortableList,
	},
	methods:{
        saveArticleOrder(){
            if(this.new_article_list.length==0){
                this.$message({message: '文章顺序没有做修改', type: 'error', showClose: true})
                return
            }
            var new_article_array = []
            this.new_article_list.forEach(element => {
                new_article_array.push(element.id)
            });
			this.$put('/articles/ArticlesModelViewSet/change_collection_order/', new_article_array)
			.then((res) => {
				if(res.code==200){
                    this.is_show_order = false
                    this.$message({message: '文章顺序更新成功', type: 'success', showClose: true})
				}else{
					this.$message({message: res.msg, type: 'error', showClose: true})
				}
			})
        },
		getArticleList(row_data){
			var transmit_data = { 'collection_id': row_data.id }
			this.$get('/articles/ArticlesModelViewSet/get_by_collection/', transmit_data)
			.then((res) => {
				if(res.code==200){
                    this.article_list = res.data.list_data
                    if(this.article_list.length==0){
                        this.$message({message: '该文集暂无文章', type: 'error', showClose: true})
                        return
                    }
                    this.is_show_order = true
                    this.new_article_list = []
				}else{
					this.$message({message: res.msg, type: 'error', showClose: true})
				}

			})
		},
        listChange(new_list){
            this.new_article_list = new_list
        },
        addCollection(){
            this.dialog_collection = {
                is_show:true,
                is_new:true,
                collect_name:"",
                description:"",
                visible_name:"所有人",
            }
        },
        getCollectionData(){
            this.$get('/articles/CollectionsModelViewSet/')
            .then((res) => {
                if(res.code==200){
                    this.collection_data = res.data
                }
            })
        },
        editCollection(row_data){
            this.dialog_collection = {
                id:row_data.id,
                is_show:true,
                is_new:false,
                collect_name:row_data.collect_name,
                description:row_data.description,
                visible_name:this.permission_array[row_data.visible_permission],
            }
        },
        deleteCollection(row_data){
            this.$del('/articles/CollectionsModelViewSet/'+row_data.id+'/').then((res) => {
                if(res.code==200){
                    this.getCollectionData()
                    this.$message({message: '删除成功', type: 'success', showClose: true})
                }else{
                    this.$message({message: res.msg, type: 'error', showClose: true})
                }
            })
            row_data.is_delete = false
        },
        saveCollection(){
			this.$refs.dialog_collection.validate((valid)=>{
				if(valid){
                    var transmit_data = {
                        'collect_name': this.dialog_collection.collect_name,
                        'description': this.dialog_collection.description,
                        'visible_permission': this.permission_dict[this.dialog_collection.visible_name]
                    }
                    if(this.dialog_collection.is_new==true){
                        this.$post('/articles/CollectionsModelViewSet/', transmit_data).then((res) => {
                            if(res.code==200){
                                this.getCollectionData()
                                this.$message({message: '新增成功', type: 'success', showClose: true});
                                this.dialog_collection.is_show = false
                            }else{
                                this.$message({message: res.msg, type: 'error', showClose: true});
                            }
                        })
                    }else{
                        this.$put('/articles/CollectionsModelViewSet/'+this.dialog_collection.id+'/', 
                        transmit_data).then((res) => {
                            if(res.code==200){
                                this.getCollectionData()
                                this.$message({message: '编辑成功', type: 'success', showClose: true})
                                this.dialog_collection.is_show = false
                            }else{
                                this.$message({message: res.msg, type: 'error', showClose: true})
                            }
                        })
                    }
				}
            })
        },
	},
}
</script>

<style>
.t_c_list{
    max-height: 400px;
    list-style: none; 
    font-size: 14px;
    margin: 0 auto;
    padding: 0;
    overflow: auto;
    background-color: #f3f3f3;
    border: 1px solid #efefef;
}

.t_c_list_item{
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    list-style: none;
    background-color: #fff;
    border-bottom: 1px solid #efefef;
    box-sizing: border-box;
    z-index: 9999;
}
</style>
