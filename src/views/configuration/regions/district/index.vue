<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--部门数据-->
            <!-- <el-col :span="4" :xs="24">
                <x-tree
                    :data="treeOptions"
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
                            plain
                            @click="handleAdd"
                            v-hasPermi="['configuration:district:add']"
                        >新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            plain
                            :disabled="single"
                            @click="handleUpdate"
                            v-hasPermi="['configuration:district:edit']"
                        >修改</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-delete"
                            size="mini"
                            plain
                            :disabled="multiple"
                            @click="handleDelete()"
                            v-hasPermi="['configuration:district:remove']"
                        >删除</el-button>
                    </el-col>
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-upload2"
                            size="mini"
                            plain
@click="handleImport"
                            v-hasPermi="['configuration:district:import']"
                        >导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-download"
                            size="mini"
                            plain
                            @click="handleExport"
                            v-hasPermi="['configuration:district:export']"
                        >导出</el-button>
                    </el-col>-->
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
                        width="180"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
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

        <el-dialog :visible.sync="isDetailVisible"></el-dialog>
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

export default {
    components: { Treeselect, XTable, XForm, XTree, XDialog },
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
            treeOptions: undefined,
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
            current: {
                deptId: undefined
            },
            // 表单参数
            form: {},
            defaultProps: {
                children: "children",
                label: "label"
            },
            /** form ^ */
            /** 查询参数 */
            formData: {
                areaCode: '',
                areaName: '',
                areaAddr: ''
            },
            formOptions: FormOptions,
            formRules: {},
            /** form $ */
            /** table ^ */
            pagination: new Paginator(),
            options: [
                { prop: "areaCode", label: "区域编码" },
                { prop: "areaName", label: "区域名称" },
                { prop: "areaAddr", label: "区域地址" },
                { prop: "remark", label: "备注" }
            ],
            models: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {},
            dialogOptions: DialogOptions,
            dialogRules: {
                areaName: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ],
                areaCode: [
                    {
                        required: true,
                        message: "必填",
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
            isDetailVisible: false
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
            this.$area.search(params).then(({ rows, total }) => {
                this.loading = false;
                this.models = rows;
                this.pagination.all = total;
            });
        },
        /** 查询部门下拉树结构 */
        getTreeData() {
            this.$area.treeselect().then(response => {
                this.treeOptions = response.data;

                let node = this.dialogOptions.find(x => x.prop === "parentId");
                if (node) node.options = this.treeOptions;
                // let node = this..find(x => x.prop === "deptId");
                // if (node) node.options = this.treeOptions;
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
            this.ids = selection.map(item => item.areaId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleView(data) {
            console.log();
            this.isDetailVisible = true;
            this.current.node = data;
        },
        /** 新增按钮操作 */
        handleAdd(t) {
            this.dialogForm = {};
            this.dialogVisible = true;
            this.title = "新增";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row && row.areaId ? row.areaId : this.ids[0];
            const node = this.models.find(x => x.areaId == id);
            this.dialogForm = Object.assign({}, node);
            this.dialogVisible = true;
            this.title = "修改";
        },
        /** 提交按钮 */
        submitForm: function() {
            console.log("submit", this.dialogForm);
            if (this.dialogForm.areaId != undefined) {
                this.$area.update(this.dialogForm).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.dialogVisible = false;
                        this.getTreeData();
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            } else {
                this.$area.create(this.dialogForm).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("新增成功");
                        this.dialogVisible = false;
                        this.getTreeData();
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row && row.areaId ? [row.areaId] : this.ids;
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    console.log("delete", ids);
                    return this.$area.remove({ ids: ids });
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