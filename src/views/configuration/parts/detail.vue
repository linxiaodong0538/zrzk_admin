<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <el-row class="parts-detail-info">
                    <el-col :span="6">部件类型: {{ model.partsTypeName }}</el-col>
                    <el-col :span="6">部件编号：{{ model.partsCode }}</el-col>
                    <el-col :span="6">部件名称：{{ model.partsName }}</el-col>
                    <el-col :span="6">创建日期: {{ (model.createTime||"").substr(0, 10) }}</el-col>
                </el-row>
                <el-row class="parts-detail-info">
                    <el-col :span="6">区域位置: {{ model.areaName }}</el-col>
                    <el-col :span="6">经度：{{ model.longitude }}</el-col>
                    <el-col :span="6">纬度：{{ model.latitude }}</el-col>
                    <el-col
                        v-for="field in (model.partsFields ||[])"
                        :key="field.partsFieldName"
                        :span="6"
                    >{{ field.partsFieldNameCn }}: {{ field.partsFieldValue }}{{ field.partsFieldValue != null?field.unit:''}}</el-col>
                </el-row>
                <el-divider v-if="images.length"></el-divider>
                <el-row v-if="images.length">
                    <el-col>
                        <el-image
                            v-for="(img, i) in images.slice(0, 3)"
                            :key="i"
                            :style="{ 'width': '80px', 'height': '80px', 'margin-left': '20px' }"
                            :src="img"
                            :preview-src-list="images"
                        ></el-image>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                <h4>绑定设备：</h4>
                <x-table
                    :options="options"
                    :data="models"
                    border
                    :loading="loading"
                    :hasReset="true"
                    :isSelectable="false"
                    :isPaging="false"
                    :pagination="pagination"
                    @page-change="search"
                    @selection-change="select"
                ></x-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { XTable, XForm, XTree, XDialog, XOrg } from "@/components";
import { Paginator } from "@/dtos/paginator";
import moment from "moment";
import { DialogOptions, FormOptions } from "./detail.data";
import { FieldDataRules } from "@/dtos/constants";

export default {
    components: { XTable, XForm, XTree, XDialog, XOrg },
    name: "configuration-parts-detail",
    props: {
        data: {
            type: Object,
            required: true,
            default: () => ({})
        }
    },
    watch: {
        data(val) {
            this.search();
        }
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 弹出层标题
            title: "",
            /** 部件大类 */
            clusterOptions: [],
            /** 自定义字段 */
            fields: [],
            fieldDataRules: FieldDataRules,
            partsTypeOptions: [],
            status: [],
            model: {},
            current: {},
            cache: {
                status: {}
            },
            // 表单参数
            form: {},
            /** form ^ */
            /** 查询参数 */
            formData: {},
            formOptions: FormOptions,
            formRules: {},
            /** form $ */
            /** table ^ */
            pagination: new Paginator(),
            options: [
                { prop: "deviceCode", label: "设备编号", align: "center" },
                { prop: "productName", label: "产品名称", align: "center" },
                { prop: "deviceTypeName", label: "产品类型", align: "center" },
                {
                    prop: "runningState",
                    label: "在线状态",
                    align: "center",
                    formatter: (row, column, index) => {
                        if (!row) return "";
                        let v = row["runningState"];
                        if (!v) return v;
                        if (!this.cache.status) return v;
                        return this.cache.status[v] || v;
                    }
                },
                { prop: "registerTime", label: "绑定日期", align: "center" }
            ],
            models: [],
            /** 操作记录 */
            histories: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {},
            dialogOptions: DialogOptions,
            dialogRules: {
                partsName: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ],
                partsCode: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ],
                partsTypeId: [
                    {
                        required: true,
                        message: "必选",
                        trigger: "blur"
                    }
                ],
                areaId: [
                    {
                        required: true,
                        message: "必选",
                        trigger: "change"
                    }
                ]
            },
            dialogVisible: false,
            /** dialog $ */
            // 表单校验
            rules: {
                userName: [
                    {
                        required: true,
                        message: "用户名称不能为空",
                        trigger: "blur"
                    }
                ],
                nickName: [
                    {
                        required: true,
                        message: "用户昵称不能为空",
                        trigger: "blur"
                    }
                ],
                areaId: [
                    {
                        required: true,
                        message: "归属部门不能为空",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "用户密码不能为空",
                        trigger: "blur"
                    }
                ],
                email: [
                    {
                        type: "email",
                        message: "'请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                phonenumber: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.getDicts("online_status").then(({ data }) => {
            this.status = data.map(x => ({
                label: x.dictLabel,
                value: x.dictValue
            }));
            this.cache.status = data.reduce(
                (p, c) => ((p[c.dictValue] = c.dictLabel), p),
                {}
            );
            console.log("dict", data, this.cache.status);
        });
        this.search();
    },
    computed: {
        images() {
            if (!this.model) return [];
            if (!this.model.imgList) return [];
            return this.model.imgList.map(x => x.img);
        }
    },
    methods: {
        /** 查询用户列表 */
        search() {
            let start =
                this.formData.dateRange && this.formData.dateRange[0]
                    ? moment(this.formData.dateRange[0]).format("YYYY-MM-DD")
                    : undefined;
            let end =
                this.formData.dateRange && this.formData.dateRange[1]
                    ? moment(this.formData.dateRange[1]).format("YYYY-MM-DD")
                    : undefined;
            let params = Object.assign({}, this.formData, {
                pageNum: this.pagination.index,
                pageSize: this.pagination.size,
                page: this.pagination.index,
                partsId: this.data.partsId,
                beginTime: start,
                endTime: end
            });
            delete params.dateRange;
            this.loading = true;
            this.$parts.get({ id: this.data.partsId }).then(res => {
                this.model = res.data || {};
                console.log("current", this.model);
                this.isLoading = false;
            });
            this.$parts
                .getSelectDeviceByPartsId({ partsId: this.data.partsId })
                .then(({ rows, total }) => {
                    this.loading = false;
                    this.models = rows;
                    console.log("current", this.models);
                    this.pagination.all = total;
                });
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick({ category, data }) {
            this.current.areaId = data.id;
            this.search();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.partsId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd(t) {
            this.dialogForm = {
                areaId: this.current.areaId
            };
            this.dialogVisible = true;
            this.title = "新增";
        },
        select(v) {
            console.log("select", v);
            this.handleSelectionChange(v);
        }
    }
};
</script>
<style>
.parts-detail-info > .el-col {
    margin: 10px auto;
}
</style>