<template>
<div>
    <hr style="background-color:#DCDFE6;height:1px;border:none;">
    <div class="detail_head_part">
        <el-avatar icon="el-icon-s-custom"></el-avatar>
        <div class="detail_body_part_man">
            <p>
                {{ item_detail.nickname }} 
                <span class="detail_author_label" v-if="item_detail.is_author">作者</span>
                <span v-if="!is_reply">{{ floor_count }}楼</span>
                <span v-else> 回复 {{ item_detail.reply_nickname }}</span>
            </p>
            <p>{{ item_detail.create_time | date('YYYY-MM-DD HH:mm') }}</p>
        </div>
    </div>
    <div class="detail_body_part">
        <div class="detail_body_part_body">{{ item_detail.message_body }}</div>
        <div class="detail_body_part_handle">
            <span @click="goReply"><i class="el-icon-chat-line-round"></i>回复</span>
            <el-popover
                v-if="is_login"
                style="float:right;margin-right:8px;"
                placement="top"
                width="160"
                v-model="item_detail.visible">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="item_detail.visible=false">取消</el-button>
                    <el-button type="primary" size="mini" 
                        @click="item_detail.visible=false;deleteMessage(item_detail.id)">确定</el-button>
                </div>
                <el-button slot="reference">删除</el-button>
            </el-popover>
            <el-popover
                v-if="is_login"
                style="float:right;margin-right:8px;"
                placement="top"
                width="400"
                trigger="click">
                <div>
                    <p>昵称：{{ item_detail.nickname }}</p>
                    <p>Email：{{ item_detail.email }}</p>
                </div>
                <el-button slot="reference">楼主信息</el-button>
            </el-popover>
        </div>
    </div>

</div>

</template>

<script>
export default {
name: 'message_row',
data(){
    return{
        test:'',
    }
},
props:['item_detail', 'floor_count', 'is_login', 'key_detail', 'is_reply'],
methods:{
    deleteMessage(id){
        this.$emit('deleteMessage', id)
    },
    goReply(){
        this.$emit('goReply', {'item_detail':this.item_detail, 'key':this.key_detail})
    },
},
}
</script>
<style>
</style>
