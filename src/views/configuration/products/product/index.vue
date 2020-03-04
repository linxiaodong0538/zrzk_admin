<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--部门数据-->
            <!-- <el-col :span="4" :xs="24">
                <x-tree
                    :data="deptOptions"
                    :filter-node-method="filterNode"
                    :isFilterable="true"
                    @node-click="handleNodeClick"
                ></x-tree>
            </el-col>-->
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <x-form
                    :options="formOptions"
                    :form="formData"
                    :rules="formRules"
                    labelWidth="68px"
                    @callback="search"
                ></x-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                            v-hasPermi="['system:user:add']"
                        >新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="success"
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleUpdate"
                            v-hasPermi="['system:user:edit']"
                        >修改</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                            v-hasPermi="['system:user:remove']"
                        >删除</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="info"
                            icon="el-icon-upload2"
                            size="mini"
                            @click="handleImport"
                            v-hasPermi="['system:user:import']"
                        >导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="warning"
                            icon="el-icon-download"
                            size="mini"
                            @click="handleExport"
                            v-hasPermi="['system:user:export']"
                        >导出</el-button>
                    </el-col>
                </el-row>

                <x-table
                    :options="options"
                    :data="models"
                    :loading="loading"
                    :hasReset="true"
                    :isSelectable="true"
                    :isPaging="true"
                    :pagination="pagination"
                    @page-change="search"
                    @selection-change="select"
                >
                    <el-table-column
                        label="操作"
                        align="center"
                        width="280px"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleCollect(scope.row)"
                                v-hasPermi="['configuration:region:edit']"
                            >上传数据</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleTransmit(scope.row)"
                                v-hasPermi="['configuration:region:edit']"
                            >下发数据</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="seek({ category: 'parameters', data: scope.row})"
                                v-hasPermi="['configuration:region:edit']"
                            >设备参数</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['configuration:region:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['configuration:region:remove']"
                            >删除</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-copy"
                                @click="handleCopy(scope.row)"
                                v-hasPermi="['configuration:region:remove']"
                            >复制</el-button>
                        </template>
                    </el-table-column>
                </x-table>
            </el-col>
        </el-row>

        <!-- 添加或修改参数配置对话框 -->
        <x-dialog
            :title="title"
            :form="dialogForm"
            :options="dialogOptions"
            :rules="dialogRules"
            :visible.sync="dialogVisible"
            @callback="submitForm"
        ></x-dialog>
        <x-dialog
            :title="title"
            :form="dialogForm"
            :options="dialogOptions"
            :rules="dialogRules"
            :visible.sync="isCopyDialogVisible"
            @callback="copyForm"
        ></x-dialog>

        <el-dialog :visible.sync="isDetailVisible"></el-dialog>

        <el-dialog
            :visible.sync="isParameterVisible"
            title="设备参数配置"
            width="70%"
            :close-on-click-modal="false"
        >
            <Parameter :firmware="current.firmware"></Parameter>
        </el-dialog>
        <el-dialog
            :visible.sync="isFirmwareCollectorVisible"
            title="上传数据配置"
            width="70%"
            :close-on-click-modal="false"
        >
            <Collector :firmware="current.firmware"></Collector>
        </el-dialog>
        <el-dialog
            :visible.sync="isFirmwareTransmitterVisible"
            title="下发数据"
            width="70%"
            :close-on-click-modal="false"
        >
            <Transmitter :firmware="current.firmware"></Transmitter>
        </el-dialog>
    </div>
</template>
<script>
import {
    listUser,
    getUser,
    delUser,
    addUser,
    updateUser,
    exportUser,
    resetUserPwd,
    changeUserStatus
} from "@/api/system/user";
import { treeselect, region } from "@/api/system/dept";
import { listPost } from "@/api/system/post";
import { listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { XTable, XForm, XTree, XDialog } from "@/components";
import { Paginator } from "@/dtos/paginator";
import moment from "moment";
import { DialogOptions, FormOptions } from "./options.data";
import { default as Parameter } from "./firmware.parameter.vue";
import { default as Collector } from "./firmware.collector.vue";
import { default as Transmitter } from "./firmware.transmitter.vue";

export default {
    components: {
        Treeselect,
        XTable,
        XForm,
        XTree,
        XDialog,
        Parameter,
        Collector,
        Transmitter
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
            // 总条数
            total: 0,
            // 用户表格数据
            userList: null,
            // 弹出层标题
            title: "",
            // 部门树选项
            deptOptions: undefined,
            // 是否显示弹出层
            open: false,
            // 部门名称
            deptName: undefined,
            // 默认密码
            initPassword: undefined,
            // 日期范围
            dateRange: [],
            // 状态数据字典
            statusOptions: [],
            // 性别状态字典
            sexOptions: [],
            /** 产品类型 */
            productTypes: [],
            /** 产品列表 */
            products: [],
            // 岗位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
            current: {
                deptId: undefined,
                firmware: undefined
            },
            // 表单参数
            form: {},
            defaultProps: {
                children: "children",
                label: "label"
            },
            /** form ^ */
            /** 查询参数 */
            formData: {},
            formOptions: FormOptions,
            formRules: {},
            /** form $ */
            /** table ^ */
            pagination: new Paginator(),
            options: [
                { prop: "imageUrl", label: "产品图片", image: true },
                { prop: "productCode", label: "产品编码" },
                { prop: "productName", label: "产品名称" },
                { prop: "productTypeName", label: "产品类型" },
                { prop: "manufacturer", label: "生产厂商" },
                { prop: "accessProtocol", label: "接入协议" },
                { prop: "agreementVersionNo", label: "协议版本" },
                { prop: "createTime", label: "创建日期" }
            ],
            models: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {},
            dialogOptions: DialogOptions,
            dialogRules: {
                productTypeId: [
                    { required: true, message: "必选", trigger: "blur" }
                ],
                productName: [
                    { required: true, message: "必填", trigger: "blur" }
                ],
                productCode: [
                    { required: true, message: "必填", trigger: "blur" }
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
                deptId: [
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
            },

            /** view detail ^ */
            isDetailVisible: false,
            isParameterVisible: false,
            isFirmwareCollectorVisible: false,
            isFirmwareTransmitterVisible: false,
            isCopyDialogVisible: false
            /** view detail $ */
        };
    },
    watch: {
        // 根据名称筛选部门树
        deptName(val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {
        console.log(
            this.formOptions
                .map(x => {
                    return `${x.prop}: ''`;
                })
                .join(",")
        );
        this.search();
        this.getTreeData();
        this.getDicts("sys_normal_disable").then(({ data }) => {
            this.statusOptions.push(
                ...data.map(x => ({
                    label: x.dictLabel,
                    value: x.dictValue
                }))
            );
            let node = this.formOptions.find(x => x.prop === "status");
            if (node) node.options = this.statusOptions;
            node = this.dialogOptions.find(x => x.prop === "status");
            if (node) node.options = this.statusOptions;
            // this.statusOptions = data.map(x => ({
            //     label: x.dictLabel,
            //     value: x.dictValue
            // }));
            // this.$forceUpdate();
        });
        this.getDicts("sys_user_sex").then(response => {
            this.sexOptions = response.data;
            let node = this.dialogOptions.find(x => x.prop === "sex");
            if (node) {
                node.options = this.sexOptions.map(x => ({
                    label: x.dictLabel,
                    value: x.dictValue
                }));
            }
        });
        this.getConfigKey("sys.user.initPassword").then(response => {
            this.initPassword = response.data;
        });
        this.$producttype.getTypeList().then(({ data }) => {
            this.productTypes = data.map(x => ({
                label: x.productTypeName,
                value: x.productTypeId
            }));
            let node = this.dialogOptions.find(x => x.prop === "productTypeId");
            if (node) node.options = this.productTypes;
        });
    },
    methods: {
        /** 查询用户列表 */
        search() {
            console.log("trigger search", this.formData);
            let start = this.formData.dateRange
                ? moment(this.formData.dateRange[0]).format("YYYY-MM-DD")
                : undefined;
            let end = this.formData.dateRange
                ? moment(this.formData.dateRange[1]).format("YYYY-MM-DD")
                : undefined;
            let params = Object.assign({}, this.formData, {
                pageNum: this.pagination.index,
                pageSize: this.pagination.size,
                page: this.pagination.index,
                startDate: start,
                endDate: end
            });
            delete params.dateRange;
            this.loading = true;
            this.$product.search(params).then(({ rows, total }) => {
                this.loading = false;
                this.models = rows;
                this.pagination.all = total;
            });
        },
        /** 查询部门下拉树结构 */
        getTreeData() {
            //this.$area.treeselect()
            // treeselect().then(response => {
            //     this.deptOptions = response.data;
            //     let node = this.dialogOptions.find(x => x.prop === "deptId");
            //     if (node) node.options = this.deptOptions;
            //     // let node = this..find(x => x.prop === "deptId");
            //     // if (node) node.options = this.deptOptions;
            // });
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.current.deptId = data.id;
            this.search();
        },
        /** 查询岗位列表 */
        getPositions() {
            listPost().then(response => {
                this.postOptions = response.rows;
            });
        },
        /** 查询角色列表 */
        // 用户状态修改
        handleStatusChange(row) {
            let text = row.status === "0" ? "启用" : "停用";
            this.$confirm(
                '确认要"' + text + '""' + row.userName + '"用户吗?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(function() {
                    return changeUserStatus(row.userId, row.status);
                })
                .then(() => {
                    this.msgSuccess(text + "成功");
                })
                .catch(function() {
                    row.status = row.status === "0" ? "1" : "0";
                });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {};
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.page = 1;
            this.search();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.productId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        async hanldeProductTypeChange({ category, value }) {
            if (category === "productTypeId") {
                let { data } = await this.$product.getProductsByTypeId({
                    productTypeId: value
                });
                this.products = data.map(x => ({
                    label: x.productName,
                    value: x.productId,
                    code: x.productCode
                }));
                let node = this.dialogOptions.find(x => x.prop === "productId");
                if (node) {
                    node.options = this.products;
                }
            }
        },
        /** 设备参数按钮操作 */
        seek({ category, data }) {
            if (category === "parameters") {
                console.log();
                this.isParameterVisible = true;
                this.current.node = data;
                this.current.firmware = data;
            }
        },
        /** 数据上传 */
        handleCollect(meter) {
            this.isFirmwareCollectorVisible = true;
            this.current.firmware = meter;
        },
        /** 数据下发 */
        handleTransmit(meter) {
            this.isFirmwareTransmitterVisible = true;
            this.current.firmware = meter;
        },
        /** 新增按钮操作 */
        handleAdd(node) {
            this.dialogForm = {};
            this.dialogVisible = true;
            this.title = "新增";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            let id = row && row.productId ? row.productId : this.ids[0];
            this.dialogForm = this.models.find(x => x.productId == id);
            this.dialogVisible = true;
            this.title = "修改";
        },
        handleCopy(row) {
            this.dialogForm = row;
            this.isCopyDialogVisible = true;
            this.title = "复制";
        },
        /** 提交按钮 */
        submitForm() {
            console.log("submit", this.dialogForm);
            if (this.dialogForm.productId != undefined) {
                this.$product.update(this.dialogForm).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.dialogVisible = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            } else {
                this.$product.create(this.dialogForm).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("新增成功");
                        this.dialogVisible = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            }
        },
        copyForm() {
            console.log("submit", this.dialogForm);
            this.$product.create(this.dialogForm).then(response => {
                if (response.code === 200) {
                    this.msgSuccess("复制成功");
                    this.isCopyDialogVisible = false;
                    this.search();
                } else {
                    this.msgError(response.msg);
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row && row.productId ? [row.productId] : this.ids;
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    console.log("delete", ids);
                    return this.$product.remove({ ids: ids });
                })
                .then(() => {
                    this.search();
                    this.msgSuccess("删除成功");
                })
                .catch(function() {});
        },
        /** 导出按钮操作 */
        handleExport() {
            let start = this.formData.dateRange
                ? moment(this.formData.dateRange[0]).format("YYYY-MM-DD")
                : undefined;
            let end = this.formData.dateRange
                ? moment(this.formData.dateRange[1]).format("YYYY-MM-DD")
                : undefined;
            let params = Object.assign({}, this.formData, {
                pageNum: this.pagination.index,
                pageSize: this.pagination.size,
                page: this.pagination.index,
                startDate: start,
                endDate: end
            });
            delete params.dateRange;
            console.log("exprot", params);
            this.$confirm("是否确认导出所有数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    return this.$product.download(params);
                })
                .then(response => {
                    this.download(response.msg);
                })
                .catch(e => {
                    console.error(e);
                });
        },
        /** 导入按钮操作 */
        handleImport() {
            var a = document.createElement("input");
            a.type = "file";
            a.accept =
                "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            a.onchange = (g, e) => {
                var file = e.target.files[0];
                console.log("file", file);
            };
            a.click();
        },
        select(v) {
            console.log("select", v);
            this.handleSelectionChange(v);
        }
    }
};
</script>