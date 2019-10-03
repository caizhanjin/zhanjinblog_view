<template>
<div class="collection_main">
  <el-row>
    <el-col :span="18" class="collection_list_card">
        <el-card shadow="hover" v-for="(item, key) in list_collection" :key="key">
            <div class="collection_list_header" @click="goDetail(item)">{{ item.collect_name }}</div>
            <div class="collection_list_describe" @click="goDetail(item)">{{ item.description }}</div>
            <div class="collection_list_icon">
                <span><i class="el-icon-view" style="color:lightskyblue;"></i>{{ item.read_count }}</span>
                <span><i class="el-icon-files" style="color:#FF6767;"></i>{{ item.article_count }}</span>
            </div>
        </el-card>
    </el-col>
    <el-col :span="6" class="">
        <recentView></recentView>
        <el-card shadow="hover" class="collection_label">
          <i class="el-icon-notebook-1" style="color:#f0c674;padding-right:5px;"></i>标签
          <div class="collection_label_set">
              <el-button type="info" 
                size="mini" 
                plain round
                v-for="(item, key) in list_label"
                :key="key"
                style="margin-right:3px"
                @click="goList(item)"
            >{{ item.label_name }}</el-button>
          </div>
       </el-card>
    </el-col>
  </el-row>
</div>

</template>

<script>
import recentView from '../module/recent'

export default {
	name: 'articleCollection',
	data(){
		return{
            test:[1, 2, 4, 5,1, 2, 4, 5],
            list_collection:[],
            list_label:[],
		}
    },
    created(){
        this.getCollectionData()
        this.getLabelData()
    },
	mounted(){

    },
    components:{
        recentView
    },
	methods:{
        goList(row){
            this.$emit('changeMenuIndex', '1')
            this.$router.push({path:'/article_list', query:{'label_id':row.id}})
        },
        getLabelData(){
			this.$get('/articles/LabelsModelViewSet/get_permission_list/').then((res) => {
                this.list_label = res.data
			})
        },
        getCollectionData(){
            this.$get('/articles/CollectionsModelViewSet/get_permission_list/'
            ).then((res) => {
                this.list_collection = res.data
			})
        },
        goDetail(row){
            if(row.first_article_id==''){
                this.$message({message: '该文集暂无文章', type: 'error', showClose: true})
            }else{
                this.$emit('changeMenuIndex', '')
                this.$router.push({path:'/article_detail', query:{'id':row.first_article_id}})
            }
        },
	},
}
</script>
<style scoped>
.collection_main{
    padding:20px 15% 20px 15%;
}

.collection_list_card .el-card{
    width: 31.5%;
    display: inline-block;
    margin: 2px 5px;
}

.collection_list_header{
    font-size: 18px;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis; 
    -o-text-overflow: ellipsis;
    white-space:nowrap;
}

.collection_list_describe{
    height: 60px;
    overflow: hidden;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    color: #909399;
}

.collection_list_header, .collection_list_describe{
    margin-bottom: 5px;
    cursor: pointer;
    -webkit-transition: margin-left .2s;
    -moz-transition: margin-left .2s;
    -o-transition: margin-left .2s;
}

.collection_list_header:hover, .collection_list_describe:hover{
    margin-left: 5px;
    font-style: italic;
}

.collection_label{
    margin-top: 20px;
}

.collection_label_set{
    margin-top: 1rem;
}

.collection_label_set .el-button{
    padding: 3px 6px;
    font-size: 14px;
    margin: 3px 0px;
}

.collection_list_icon i{
    margin-right: 3px;
}


</style>