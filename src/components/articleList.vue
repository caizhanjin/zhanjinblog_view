<template>
<div class="main_content">
  <el-row>
    <el-col :span="18" class="main_list height_control">
      <div class="list_condition">
        <div>
          <el-button type="primary" v-if="current_label_id==''">综合</el-button>
          <el-button type="primary" plain v-else @click="searchByLabel('', 1)">综合</el-button>
          <span v-for="(item, key) in list_label" :key="key">
            <el-button type="info" size="mini" v-if="current_label_id==item.id">{{ item.label_name }}</el-button>
            <el-button type="info" plain v-else @click="searchByLabel(item.id, 1)">{{ item.label_name }}</el-button>
          </span>
        </div>
        <div class="list_late_or_hot">
          <strong style="margin-right:10px;" v-if="search_data.order_by==''">最近</strong>
          <a style="margin-left:0px;" @click="changeOrder('')" v-else>最近</a>/
          <strong style="margin-left:10px;" v-if="search_data.order_by=='read_count'">热门</strong>
          <a style="margin-left:10px;" @click="changeOrder('read_count')" v-else>热门</a>
        </div>
      </div>
      <el-card shadow="hover" 
        v-for="(item, key) in list_article" 
        :key="key" 
        class="list_card">
        <h2 class="item_title" @click="goDetailByList(item.id)">{{ item.title }}</h2>
        <div class="list_set_bar">
          <span class="list_label_icon">
            <el-button 
              type="info" size="mini" plain round
              v-for="(item_label, key_label) in item.article_set"
              :key="key_label"
               @click="searchByLabel(item_label.id, 1)"
              style="margin-right:3px"
            >{{ item_label.label_name }}</el-button>
          </span>
          <span class="list_notebook" 
            @click="goDetailByCollection(item.collection_info)"
            v-if="item.collection_info.collection_name">
            <i class="el-icon-notebook-1" style="color:#f0c674;"></i>
            {{ item.collection_info.collection_name }}
          </span>
        </div>
        <div class="list_icon">
          <span><i class="el-icon-view" style="color:lightskyblue;"></i>{{ item.read_count }}</span>
          <span><i class="el-icon-chat-line-square" style="color:yellowgreen;"></i>{{ item.message_count }}</span>
          <span><i class="el-icon-time" style="color:pink;"></i>
            {{ item.update_time | date('YYYY-MM-DD HH:mm') }}
          </span>
        </div>
      </el-card>
      <div v-if="list_article.length==0" class="article_list_none">暂无文章</div>
      <div class="list_page">
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
    </el-col>
    <el-col :span="6" class="nav_class height_control">
      <recentView></recentView>
      <el-card shadow="hover" class="article_list_collection">
        <i class="el-icon-notebook-1" style="color:#f0c674;padding-right:5px;"></i>文集
        <ul class="list_set_ul">
          <li v-for="(item, key) in list_collection" 
            :key="key"
            @click="goDetailByCollection(item)">{{ item.collect_name }}</li>
        </ul>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
import recentView from '../module/recent'

export default {
  name: 'articleList',
  data () {
    return {
      current_label_id:'',

      list_article:[],
      list_collection:[],
      list_label:[],

      search_data:{
        total:10,
        page_size:10,
        current_index:1,

        label_id:'',
        order_by:'',
      },
    }
  },
  mounted(){
		if(this.$route.query.label_id){
			this.searchByLabel(this.$route.query.label_id)
		}else{
      this.getArticleData('', '')
    }
    this.getCollectionData()
    this.getLabelData()
  },
  components:{
    recentView
  },
  methods:{
    searchByLabel(label_id, is_current){
      if(is_current==1){
        if(label_id){
          this.$router.push({path:'/article_list', query:{'label_id':label_id}})
        }else{
          this.$router.push({path:'/article_list'})
        }
      }
      this.search_data.label_id = label_id
      this.search_data.current_index = 1
      this.getArticleData('', '')
    },
    changeOrder(order){
      this.search_data.order_by = order
      this.getArticleData('', '')
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
        this.list_article = res.data.list_data
        this.search_data.total = res.data.page_info.total
        this.search_data.page_size = res.data.page_info.page_size
        this.search_data.current_index = res.data.page_info.current_index
      })
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
    goDetailByCollection(row){
      if(row.first_article_id==''){
        this.$message({message: '该文集暂无文章', type: 'error', showClose: true})
      }else{
        this.$emit('changeMenuIndex', '')
        this.$router.push({path:'/article_detail', query:{'id':row.first_article_id}})
      }
    },
    goDetailByList(article_id){
      this.$emit('changeMenuIndex', '')
      this.$router.push({path:'/article_detail', query:{'id':article_id}})
    },
  },
}
</script>

<style scoped>
.main_content{
  padding:0 15%;
}

.main_list{
  padding:0 20px 20px 0px;

}

.main_list .list_card{
  margin:10px 0;
}

.height_control{
  margin-top: 0px;
  height:100%;
}

.nav_class{
  padding:20px 0;
}

.nav_class .el-card{
  margin-bottom:20px;
}

.item_title{
  cursor: pointer;
  font-size: 18px;
  line-height: 18px;
  margin: 0 0 10px 0;
  -webkit-transition: margin-left .2s;
  -moz-transition: margin-left .2s;
  -o-transition: margin-left .2s;
}

.item_title:hover{
  margin-left: 10px;
  color: #409EFF;
  font-style: italic;
}

.list_page .el-pagination{
  text-align: center;
}

.list_icon span{
  margin-right:5px;
}

.list_icon i{
  margin-right:3px;
}

.list_notebook{
  cursor: pointer;
  -webkit-transition: margin-left .2s;
  -moz-transition: margin-left .2s;
  -o-transition: margin-left .2s;
}

.list_notebook:hover{
  color: #409EFF;
  margin-left: 10px;
  font-style: italic;
}

.list_label_icon .el-button{
  padding: 2px 5px;
  font-size: 14px;
  margin: 0px;
}

.list_set_bar{
  margin-bottom: 3px;
}

.list_condition{
  padding: 20px 20px 10px 0px;
}

.list_condition .el-button{
  font-size: 15px;
  padding: 4px 8px;
  margin: 3px;
}

.list_late_or_hot{
  padding-top: 10px;
  font-size: 15px;
}

.list_late_or_hot a{
  margin: 0 10px;
  cursor: pointer;
}

.list_late_or_hot a:hover{
  color: #409EFF;
}

.list_state_date{
  text-align:right;
}

.list_set_ul{
  list-style:none;
}

.list_set_ul li{
  margin-bottom: 5px;
  cursor: pointer;
  -webkit-transition: margin-left .2s;
  -moz-transition: margin-left .2s;
  -o-transition: margin-left .2s;
}

.list_set_ul li:hover{
  color: #409EFF;
  margin-left: 10px;
  font-style: italic;
}

.article_list_collection{
    margin-top: 20px;
}
</style>
