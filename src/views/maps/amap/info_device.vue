<template>
    <div class="infoWindow">
        <el-tabs v-model="activeName" @click="handleClick">
            <el-tab-pane label="基本信息" name="first">
                <div>
                <el-row>
                    <el-col :span="8">设备编号:</el-col>
                    <el-col :span="12">
                        <a
                            style="cursor: pointer; color: #1c84c6;"
                            @click="goto(data.deviceId)"
                        >{{ data.deviceCode }}</a>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">设备名称:</el-col>
                    <el-col :span="12">{{ data.deviceName || '-' }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">产品名称:</el-col>
                    <el-col :span="12">{{ data.productName }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">设备类型:</el-col>
                    <el-col :span="12">{{ data.deviceTypeName || '-' }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">部件编号:</el-col>
                    <el-col :span="12">{{ data.partsCode }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">所在区域:</el-col>
                    <el-col :span="12">{{ data.areaName }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">所属项目:</el-col>
                    <el-col :span="12">{{ data.projectName }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">状态:</el-col>
                    <el-col :span="12">
                        <label v-if="data.isAlert" class="danger"
                        >报警</label>
                        <label v-else
                            :class="{ 0: 'normal', 1: 'success', '-1': 'info' }[data.onlineStatus]"
                        >{{ { 0: '离线', 1: '在线', '-1': '未知' }[data.onlineStatus] }}</label>
                    </el-col>
                </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="实时情况" name="second">
                <div>
                    <x-table
                        :options="options"
                        :data="models"
                        size="mini"
                        :max-height="280"
                        :stripe="true"
                        border
                        :hasReset="true"
                        :isSelectable="false"
                        :isPaging="false"
                        :pagination="pagination"
                        @page-change="search"
                    ></x-table>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- <el-divider style="margin: 10px 0;"></el-divider> -->
    </div>
</template>
<script>
import { XTable, XForm, XTree, XDialog, XOrg } from "@/components";
import { Paginator } from "@/dtos/paginator";

export default {
    components: { XTable, XForm, XTree, XDialog, XOrg },
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    model: {
        prop: "data",
        event: "change"
    },
    data() {
        return {
            models: [],
            activeName: "first",
            pagination: new Paginator(),
            options: [
                {
                    prop: "deviceFieldNameCn",
                    label: "上传数据",
                    align: "center"
                },
                {
                    prop: "deviceFieldValue",
                    label: "最新数据",
                    align: "center"
                },
                { prop: "uploadDate", label: "更新时间", align: "center" }
            ]
        };
    },
    mounted() {
        console.log("mounted", this.data);
        this.search();
    },
    methods: {
        search() {
            const params = {
                deviceId: this.data.deviceId,
                pageNum: 1,
                pageSize: 10
            };
            this.$lamp
                .getUploadFieldByDeviceIdForList(params)
                .then(({ rows }) => {
                    this.models = rows;
                }, err=>{
                    this.models = [];
                });
        },
        change() {
            console.log("emit", this.data);
            this.$emit("change", this.data);
        },
        goto(id) {
            console.log(id);
            this.$router.push({ path: "/deviceDetails/" + id });
        },
        handleClick(){
            this.$emit('refresh');
        }
    }
};
</script> 
<style scoped>
.infoWindow span {
    display: block;
    width: 100%;
    margin: 0 0 5px 0;
    padding: 0.3em 0;
}
.infoWindow .el-row {
    margin: 10px;
}
</style>