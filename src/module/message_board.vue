<template>
<div>
    <el-form :inline="true" :model="message_new" ref="message_new">
        <el-form-item class="detail_message_body"
            prop="message_body"
            :rules="{ required:true, message:'留言内容不能为空', trigger: 'blur' }"
        >
            <el-input
                @focus="is_show_other=true"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入内容"
                maxlength="200"
                v-model="message_new.message_body">
            </el-input>
        </el-form-item>
        <el-form-item label="昵称"
            prop="nickname"
            :rules="{ required:true, message:'昵称不能为空', trigger: 'blur' }"
            v-if="is_show_other"
        >
            <el-input v-model="message_new.nickname" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
            v-if="is_show_other"
            prop="email"
            :rules="[{ required:true, message:'邮箱不能为空', trigger: 'blur' },
                    { type:'email', message:'邮箱地址不合法', trigger: 'blur' }]"
        >
            <el-input v-model="message_new.email" clearable></el-input>
        </el-form-item>
    </el-form>
    <div v-if="is_show_other">
        <el-button type="primary" round size="small" @click="handleMessageData(2)">发表留言</el-button>
        <el-button type="info" plain round size="small" @click="is_show_other=false;clearData();cancle()">取消</el-button>
    </div>
</div>

</template>

<script>
export default {
name: 'message_board',
data(){
    return{
        test:'',
        is_show_other:false,
        message_new:{
            nickname:'',
            email:'',
            message_body:'',
        },
    }
},
props:['reply_id', 'reply_name', 'reply_name'],
methods:{
    handleMessageData(){
        if(this.reply_id){
            this.message_new['reply_id'] = this.reply_id
            this.message_new['reply_name'] = this.reply_name
        }
        this.$refs.message_new.validate((valid)=>{
            if(valid){
                this.$emit('handleMessageData', this.message_new)
                this.is_show_other = false
                this.cancle()
                this.clearData()
            }
        })
    },
    clearData(){
        this.message_new.nickname = ''
        this.message_new.email = ''
        this.message_new.message_body = ''
    },
    cancle(){
        this.$emit('cancle')
    },
},
}
</script>
<style>
.detail_message_body,.detail_message_body .el-form-item__content{
	width: 100%;
	display: block !important;
}
</style>
