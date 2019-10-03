<template>
<div class="manage_main">
<el-card shadow="hover">
    <el-collapse v-model="activeNames" accordion class="manage_collapse">

        <el-collapse-item title="文集" name="1">
            <tableCollection></tableCollection>
        </el-collapse-item>

        <el-collapse-item title="标签" name="2">
            <tableLabel></tableLabel>
        </el-collapse-item>

        <el-collapse-item title="文章" name="3">
            <tableArticle></tableArticle>
        </el-collapse-item>

    </el-collapse>
</el-card>
</div>

</template>

<script>
import tableCollection from './tables/table_collection'
import tableLabel from './tables/table_label'
import tableArticle from './tables/table_article'

export default {
	name: 'manageMain',
	data(){
		return{
            activeNames: [],
		}
	},
	mounted(){
    },
    components:{
        tableCollection,
        tableLabel,
        tableArticle
    },
	methods:{
	},
}
</script>
<style>
.manage_main{
	padding: 20px 18%;
    /* min-width: 1000px; */
}

.manage_collapse .el-collapse-item__header{
    font-size: 16px !important;
}


</style>
