<template>
    <div class="device-parameters">
        <el-row :gutter="0">
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
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                            v-hasPermi="['configuration:product:parameter']"
                        >新增</el-button>
                    </el-col>
                </el-row>

                <x-table
                    :options="options"
                    :data="models"
                    :loading="loading"
                    :hasReset="true"
                    :isSelectable="false"
                    :isPaging="false"
                    :pagination="pagination"
                    @page-change="search"
                    @selection-change="select"
                >
                    <el-table-column
                        label="操作"
                        align="center"
                        width="180"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['configuration:product:parameter']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['configuration:product:parameter']"
                            >删除</el-button>
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
            :show-close="false"
            @callback="submitForm"
            append-to-body
        ></x-dialog>

        <el-dialog :visible.sync="isDetailVisible"></el-dialog>

        <el-dialog :visible.sync="isParameterVisible" title="设备参数配置"></el-dialog>
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
import { DialogOptions, FormOptions } from "./parameter.data";

export default {
    name: "firmware-parameter",
    components: { Treeselect, XTable, XForm, XTree, XDialog },
    props: {
        firmware: {
            type: Object,
            required: true,
            default: () => ({})
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
            // 日期范围
            dateRange: [],
            // 状态数据字典
            statusOptions: [],
            // 岗位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
            dataTypeOptions: [],
            current: {
                deptId: undefined
            },
            cache: {
                dataTypes: {}
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
                { prop: "productFieldName", label: "数据标识" },
                { prop: "productFieldNameCn", label: "数据名称" },
                { prop: "productDataType", label: "数据类型" },
                { prop: "remark", label: "描述" },
                { prop: "isEmpty", label: "允许为空", formatter(row, column){ return row['isEmpty']?'否':'是' } }
            ],
            models: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {
                nickName: "",
                deptId: 100,
                phonenumber: "",
                email: "",
                userName: "",
                sex: "",
                status: "0",
                postIds: "",
                roleIds: "",
                remark: ""
            },
            dialogOptions: DialogOptions,
            dialogRules: {
                productFieldName: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    },
                    {
                        type: "string",
                        pattern: /^[a-zA-Z0-9_]+$/,
                        message: "只支持英文字母,数字,下划线",
                        trigger: "blur"
                    },
                    {
                        validator: (rule, value, callback, source, options) => {
                            const field = rule.field;
                            if (!field) return callback();
                            // console.log("validator", field, rule, value);
                            // console.log(">>>", source, options, this.models);
                            if (
                                value == "" ||
                                value == undefined ||
                                value == null
                            ) {
                                callback();
                            } else {
                                const count = this.models.filter(
                                    x =>
                                        x[field] === value &&
                                        (!this.dialogForm.productFieldId ||
                                            this.dialogForm.productFieldId !=
                                                x.productFieldId)
                                ).length; 
                                callback(
                                    count
                                        ? new Error("该数据标识已被使用")
                                        : undefined
                                );
                            }
                        },
                        trigger: "blur"
                    }
                ],
                productFieldNameCn: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ],
                productDataType: [
                    {
                        required: true,
                        message: "必选",
                        trigger: "blur"
                    }
                ],
                isEmpty: [
                    {
                        required: true,
                        message: "必选",
                        trigger: "blur"
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
            isParameterVisible: false
            /** view detail $ */
        };
    },
    watch: {
        // 根据名称筛选部门树
        deptName(val) {
            this.$refs.tree.filter(val);
        },
        firmware(val) {
            this.search();
        }
    },
    created() {
        this.getDicts("data_type").then(({ data }) => {
            this.dataTypeOptions = data.map(x => ({
                label: x.dictLabel,
                value: x.dictValue
            }));
            this.cache.dataTypes = data.reduce(
                (p, c) => ((p[c.dictValue] = c), p),
                {}
            );
            let node = this.dialogOptions.find(
                x => x.prop === "productDataType"
            );
            if (node) node.options = this.dataTypeOptions;
        });
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
        this.search();
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
                areaId: this.current.areaId,
                startDate: start,
                endDate: end
            });
            delete params.dateRange;
            this.loading = true;
            this.$product
                .getBuiltins({
                    productId: this.firmware.productId,
                    type: "3"
                })
                .then(({ data, total }) => {
                    this.loading = false;
                    this.models = data;
                    this.pagination.all = total;
                })
                .catch(x => console.error(x));
        },
        /** 查询部门下拉树结构 */
        getTreeData() {
            //this.$area.treeselect()
            treeselect().then(response => {
                this.deptOptions = response.data;

                let node = this.dialogOptions.find(x => x.prop === "deptId");
                if (node) node.options = this.deptOptions;
                // let node = this..find(x => x.prop === "deptId");
                // if (node) node.options = this.deptOptions;
            });
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
        getRoles() {
            listRole().then(response => {
                this.roleOptions = response.rows;
            });
        },
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
            this.form = {
                userId: undefined,
                deptId: 100,
                userName: undefined,
                nickName: undefined,
                password: undefined,
                phonenumber: undefined,
                email: undefined,
                sex: undefined,
                status: "0",
                remark: undefined,
                postIds: [],
                roleIds: []
            };
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
            this.ids = selection.map(item => item.userId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 设备参数按钮操作 */
        seek({ category, data }) {
            if (category === "parameters") {
                console.log();
                this.isParameterVisible = true;
                this.current.node = data;
            }
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.dialogForm = {};
            this.dialogVisible = true;
            this.title = "新增";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.dialogForm = Object.assign({}, row);
            this.dialogVisible = true;
            this.title = "修改";
        },
        /** 提交按钮 */
        submitForm: function() {
            const params = Object.assign({}, this.dialogForm, {
                productId: this.firmware.productId,
                type: 3
            });
            if (params.productFieldId == null) {
                this.$product.addBuiltin(params).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("新增成功");
                        this.dialogVisible = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            } else {
                this.$product.updateBuiltin(params).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.dialogVisible = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    return this.$product.removeBuiltin({
                        type: 3,
                        productId: this.firmware.productId,
                        ids: [row.productFieldId]
                    });
                })
                .then(() => {
                    this.search();
                    this.msgSuccess("删除成功");
                })
                .catch(function() {});
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;

            this.$confirm("是否确认导出所有用户数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(function() {
                    return exportUser(queryParams);
                })
                .then(response => {
                    this.download(response.msg);
                })
                .catch(function() {});
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