<template>
<div>
<el-row>
	<el-col :span="4" class="detail_left">
		<div class="detail_collection_head">
			<i class="el-icon-notebook-1" style="color:#f0c674;padding-right:5px;"></i>
			文集<span v-if="article_list.length!=0">：{{ articleDetail.collection_info?articleDetail.collection_info.collection_name:'' }}</span>
		</div>
		<div v-if="article_list.length!=0">
			<div class="detail_collection_list" v-for="(item, key) in article_list" :key="key">
				<div @click="goOther(item.id)" v-if="item.id!=article_id" class="detail_collection_item">
					<span>{{ item.title }}</span>
				</div>
				<div v-else>
					<strong style="color:#303133;">{{ item.title }}</strong>
				</div>
			</div>
		</div>
		<div style="text-align:center;font-style: italic;color: #909399;" v-else>
			<p>文章暂无文集收集</p>
		</div>
	</el-col>
	<el-col :span="16" class="detail_main">
		<div class="detail_editor">
			<mavon-editor 
				v-model="articleDetail.body" 
				:toolbarsFlag="false"
				:subfield="false"
				:defaultOpen="'preview'"
				:boxShadow="false"
				id="markdown_show"
			/>
		</div>
		<div class="detail_button">
			<p class="text_muted">
				{{ articleDetail.read_count }}阅读 · {{ articleDetail.message_count }}评论 
				<el-popover
					v-if="is_login"
					placement="top"
					width="160"
					v-model="is_delete">
						<p>确定本篇文章删除吗？</p>
						<div style="text-align: right; margin: 0">
						<el-button size="mini" type="text" @click="is_delete = false">取消</el-button>
						<el-button type="primary" size="mini" @click="deleteArticle()">确定</el-button>
					</div>
					<el-tooltip effect="dark" content="删除文章" placement="top" slot="reference">
					<el-button type="primary" 
						icon="el-icon-delete" 
						circle size="small"
					></el-button>
					</el-tooltip>
				</el-popover>
				<el-tooltip effect="dark" content="前往编辑" placement="top" v-if="is_login">
					<el-button type="primary" 
						icon="el-icon-edit" 
						circle size="small"
						@click="goEdit()"
					></el-button>
				</el-tooltip>
			</p>
			<el-card shadow="never" class="detail_content_card">
				<div><span>本文标题： {{ articleDetail.title }}</span></div>
				<div><span>本文作者： {{ articleDetail.author }}</span></div>
				<div><span>原始链接： <a :href="presentUrl" target="_blank">{{ presentUrl }}</a></span></div>
				<div><span>发布时间： {{ articleDetail.create_time | date('YYYY-MM-DD HH:mm') }}</span></div>
				<div><span>更新时间： {{ articleDetail.update_time | date('YYYY-MM-DD HH:mm') }}</span></div>
			</el-card>
			<el-button-group>
				<el-tooltip effect="dark" :content="prev_article?prev_article.title:'已经第一篇了'" placement="top">
					<el-button type="primary" 
						@click="goOther(prev_article.id)"
						icon="el-icon-arrow-left" class="left">
						上一篇
					</el-button>
				</el-tooltip>
				<el-tooltip effect="dark" :content="next_article?next_article.title:'没有下一篇了'" placement="top">
					<el-button type="primary" class="right" @click="goOther(next_article.id)">
						下一篇<i class="el-icon-arrow-right el-icon--right"></i>
					</el-button>
				</el-tooltip>
			</el-button-group>
			<div>
				<p style="font-size:18px;">写留言：</p>
				<messageBoard @handleMessageData="handleMessageData1"></messageBoard>
			</div>
			<div class="detail_show_message" v-if="articleDetail.message_count">
				<el-card shadow="never">共有{{ articleDetail.message_count }}条评论</el-card>
				<div class="detail_message_content" 
					v-for="(item_detail, key_detail) in message_set" 
					:key="key_detail">
					<messageRow 
						:item_detail="item_detail"
						:floor_count="message_set.length-key_detail"
						:key_detail="key_detail"
						:is_login="is_login"
						@deleteMessage="deleteMessage"
						@goReply="goReply"
					></messageRow>
					<div class="detail_reply">
						<messageRow 
							v-for="(item_reply, key_reply) in item_detail.reply_set"
							:key="key_reply"
							:item_detail="item_reply"
							:key_detail="key_detail"
							:is_login="is_login"
							:reply_name="item_reply.reply_name"
							:is_reply="true"
							@deleteMessage="deleteMessage"
							@goReply="goReply"
						></messageRow>
						<div v-if="item_detail.is_show_reply">
							<hr style="background-color:#DCDFE6;height:1px;border:none;">
							<p style="font-size:14px;">回复 {{ item_detail.reply_name }}：</p>
							<messageBoard 
								@handleMessageData="handleMessageData2"
								@cancle="cancleMessage(item_detail, key_detail)"
								:reply_id="item_detail.id"
								:reply_name="item_detail.reply_name"
							></messageBoard>
						</div>
					</div>
				</div>
			</div>
		</div>
	</el-col>
	<el-col :span="4" class="detail_right">
		<el-card shadow="hover" class="detail_card article_detail_float" v-if="content_data.length!=0">
			目录：
			<p >
				<div v-for="(item, key) in content_data" :key="key" class="detail_content_list">
					<a :href="'#'+item.point_id" v-if="item.level==1">{{ item.point_title }}</a>
					<a :href="'#'+item.point_id" v-else style="margin-left:15px;">{{ item.point_title }}</a>
				</div>
			</p>
		</el-card>
		<el-card shadow="hover" class="detail_card" v-else>
			目录：
			<p style="text-align:center;font-style: italic;color: #909399;">文章暂无目录</p>
		</el-card>
	</el-col>
</el-row>
</div>

</template>

<script>
import Vue from 'vue'
import messageBoard from '../module/message_board'
import messageRow from '../module/message_row'

export default {
	name: 'articleDetail',
	data(){
		return{
			is_login:false,
			username:'',
			article_id:'',
			visible:false,
			is_delete:false,

			articleDetail:{},
			article_list:[],
			article_list_dict:{},
			next_article:'',
			prev_article:'',
			presentUrl:"",
			textarea2:"",
			messageData:{},
			message_rely:{
				article_info:'',
				nickname:'',
				email:'',
				message_body:'',
				is_reply:true,
				reply_id:'',
				is_author:'',
			},
			message_set:[],

			content_data:[],
		}
	},
	mounted(){
		this.article_id = this.$route.query.id
		this.articleAddReadCount(this.article_id)
		this.getArticleDetail(this.article_id)
		if(localStorage.token || sessionStorage.token){
			this.is_login = true
			this.username = localStorage.username?localStorage.username:sessionStorage.username
		}
	},
	methods:{
		createContents(){
			var element = document.getElementsByClassName('v-show-content')[0]
			var nodes = element.childNodes
			var one_level = ['H2']
			var tow_level = ['H3', 'H4', 'H5']
			var content_data = []
			for(var i=0; i<nodes.length; i++){
				var item_nodeName = nodes[i].nodeName
				if(one_level.indexOf(item_nodeName) != -1){
					content_data.push({ 'level':1, 
										'point_id':nodes[i].childNodes[0].id,
										'point_title':nodes[i].childNodes[1].data})
				}else if(tow_level.indexOf(item_nodeName) !=- 1){
					if(nodes[i].childNodes[1]!=undefined){
						content_data.push({ 'level':2, 
											'point_id':nodes[i].childNodes[0].id,
											'point_title':nodes[i].childNodes[1].data})
					}
				}
			}
			this.content_data = content_data
		},
		articleAddReadCount(article_id){
			this.$get('/articles/ArticlesModelViewSet/add_read_count/', {'id': article_id}).then((res) => {})
		},
		collectionAddReadCount(collection_id){
			this.$get('/articles/CollectionsModelViewSet/add_read_count/', {'id': collection_id}).then((res) => {})
		},
		cancleMessage(item_detail, key_detail){
			item_detail.is_show_reply = false
 			Vue.set(this.message_set, key_detail, item_detail)
		},
		goReply(data){
			this.message_set[data.key].is_show_reply = true
			this.message_set[data.key].reply_name = data.item_detail.nickname
			Vue.set(this.message_set, data.key, this.message_set[data.key])
		},
		deleteMessage(message_id){
            this.$del('/articles/MessagesModelViewSet/'+message_id+'/').then((res) => {
                if(res.code==200){
                    this.getArticleDetail(this.article_id)
                    this.$message({message: '删除成功', type: 'success', showClose: true})
                }else{
                    this.$message({message: res.msg, type: 'error', showClose: true})
                }
            })
		},
		goNewMessage(transmit_data){
			this.$post('/articles/MessagesModelViewSet/', transmit_data).then((res) => {
				if(res.code==200){
					this.getArticleDetail(this.article_id)
					this.$message({message: '留言成功', type: 'success', showClose: true})
				}else{
					this.$message({message: res.msg, type: 'error', showClose: true});
				}
			})
		},
		handleMessageData1(message_data){
			var message_new = {
				article_info:this.article_id,
				nickname:message_data.nickname,
				email:message_data.email,
				message_body:message_data.message_body,	
				is_reply:false,
				is_author:false,
			}
			if(this.is_login){
				if(this.username==message_new.nickname && this.username==this.articleDetail.author){
					message_new.is_author = true
				}
			}
			this.goNewMessage(message_new)
		},
		handleMessageData2(message_data){
			var message_reply = {
				article_info:this.article_id,
				nickname:message_data.nickname,
				email:message_data.email,
				message_body:message_data.message_body,	
				is_reply:true,
				is_author:false,
				reply_id:message_data.reply_id,
				reply_nickname:message_data.reply_name,
			}
			if(this.is_login){
				if(this.username==message_reply.nickname && this.username==this.articleDetail.author){
					message_reply.is_author = true
				}
			}
			this.goNewMessage(message_reply)
		},
		goOther(article_id){
			if(article_id == undefined){ return }
			this.getArticleDetail(article_id)
			this.$router.push({path:'/article_detail', query:{'id':article_id}})
		},
		deleteArticle(){
            this.$del('/articles/ArticlesModelViewSet/'+this.article_id+'/').then((res) => {
                if(res.code==200){
					this.$message({message: '删除成功', type: 'success', showClose: true})
					this.$router.push({path:'/article_list'})
                }else{
                    this.$message({message: res.msg, type: 'error', showClose: true})
                }
            })
			this.is_delete = false
		},
		getArticleList(collection_id){
			var transmit_data = { 'collection_id': collection_id }
			this.$get('/articles/ArticlesModelViewSet/get_by_collection/', transmit_data)
			.then((res) => {
				if(res.code==200){
					this.article_list = res.data.list_data
					var article_list_dict = res.data.list_dict
					var next_id = article_list_dict[this.article_id]['next_id']
					var prev_id = article_list_dict[this.article_id]['prev_id']
					this.next_article = next_id?article_list_dict[next_id]:''
					this.prev_article = prev_id?article_list_dict[prev_id]:''
				}else{
					this.$message({message: res.msg, type: 'error', showClose: true})
				}

			})
		},
		getArticleDetail(article_id){
			this.article_id = article_id
			var transmit_data = { 'id': article_id }
			this.$get('/articles/ArticlesModelViewSet/get_detail/', transmit_data)
			.then((res) => {
				if(res.code==200){
					this.articleDetail = res.data
					this.message_set = this.articleDetail.message_set
					this.presentUrl = this.articleDetail.original_link?this.articleDetail.original_link:window.location.href

					if(this.articleDetail.collection_info.collection_id){
						this.getArticleList(this.articleDetail.collection_info.collection_id)
						this.collectionAddReadCount(this.articleDetail.collection_info.collection_id)
						var _this = this
						setTimeout(function(){
							_this.createContents()
						}, 500)
					}
				}else{
					this.$message({message: res.msg, type: 'error', showClose: true})
				}
			})
		},
		reloadPresent(){
			this.$router.go(0)
		},
		goEdit(){
			this.$router.push({path:'/article_create', query:{'id':this.article_id}})
		},
	},
	components:{
		messageBoard,
		messageRow,
	},
}
</script>

<style>
.detail_main{
	border-left: 1px solid #dcdfe6;
	border-right: 1px solid #dcdfe6;
	padding:15px;
}

.detail_h1{
	font-size: 28px;
	color: #1f2f3d;

} 

.detail_left{
	padding:15px;
}

.detail_right{
	padding:15px;
}

.detail_card{
	margin-top:10px;
}

.text_muted {
    color: #6c757d;
    padding:10px 10px 5px 0;
}

.text_muted a{
	color: cornflowerblue;
	text-decoration: none;
    background-color: transparent;
    cursor: pointer;
    -moz-transition: all .3s ease; 
    -webkit-transition: all .3s ease; 
    transition: all .3s ease; 
}

.text_muted a:hover{
	margin-left:8px;
}

.text_muted .el-button{
	float:right;
	margin-right: 10px;
}

.detail_button .el-button-group{
	width:100%;
}

.detail_button .right{
	float:right;
}

.detail_content_card{
	margin-top:15px;
	margin-bottom:15px;
	background-color: #e2e3e5;
	border-color: #d6d8db;
	color: #6c757d;
    font-size: 14px;
    line-height: 20px;
}

.detail_content_card a{
	color: #6c757d;
	text-decoration: none;
}

.detail_content_card a:hover{
	text-decoration: underline;
}

.detail_editor  .v-note-panel{
	border:none !important;
}

.detail_editor .v-show-content{
	padding: 0 !important;
	background:none !important;
}

.detail_message_body,.detail_message_body .el-form-item__content{
	width: 100%;
	display: block !important;
}

.detail_show_message{
	margin-top: 20px;
	margin-bottom: 20px;
    text-align: left;
    font-size: 16px;
	
}

.detail_show_message .el-card{
    background-color:rgb(244, 244, 245); 
    border-radius:8px;
	
}

.detail_show_message .el-card__body{
	padding: 12px;
}

.detail_message_content{
	margin-top: 10px;
}

.detail_head_part .el-avatar{
	margin-right: 8px;
	float: left;
	width: 40px;
}

.detail_body_part{
	font-size: 14px;
}

.detail_body_part_man{
	height: 40px;
	
}

.detail_body_part_man p{
	margin: 0;
	color: #909399;
	font-size: 14px;
}

.detail_body_part_body{
	margin: 8px 0;
}

.detail_body_part_handle{
	color: #909399;
}

.detail_body_part_handle i{
	margin-right: 3px;
}

.detail_body_part_handle span:hover{
	color: #409EFF;
	cursor: pointer;
}
.detail_body_part_handle .el-button{
	padding: 5px;
}

.detail_reply, .detail_body_part{
	padding-left: 50px;
}

.detail_author_label{
	color: #409EFF;
	border:1px solid #409EFF;
	border-radius:5px;
}

.detail_collection_head{
	font-size: 18px;
	margin-bottom: 10px;
}

.detail_collection_list{
	padding: 4px 0px;
	font-size: 16px;
	line-height: 20px;
	color: #909399;
}

.detail_collection_list .detail_collection_item{
	cursor: pointer;
	-webkit-transition: margin-left .2s;
	-moz-transition: margin-left .2s;
	-o-transition: margin-left .2s;
}

.detail_collection_list .detail_collection_item:hover{
  margin-left: 10px;
  color: #606266;
  font-style: italic;
}

.detail_content_list a{
	text-decoration:none;
	color: #303133;
	line-height: 25px;
	-webkit-transition: padding-left .2s;
	-moz-transition: padding-left .2s;
	-o-transition: padding-left .2s;
}

.detail_content_list a:hover{
	color: #409EFF;
	font-style: italic;
	padding-left: 10px;
}

.article_detail_float{
	width: 14%;
	position: fixed;
	right: 1.8%;
	top: 10%;
	max-height: 70%;
	overflow: auto;
}
</style>
