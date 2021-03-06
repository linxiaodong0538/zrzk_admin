<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="4" :xs="24">
                <x-tree
                    :data="deptOptions"
                    :filter-node-method="filterNode"
                    :isFilterable="true"
                    @node-click="handleNodeClick"
                ></x-tree>
            </el-col>
            <!--用户数据-->
            <el-col :span="20" :xs="24">
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
                        width="180"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-search"
                                @click="handleView(scope.row)"
                                v-hasPermi="['system:sensor:view']"
                            >查看</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['system:user:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['system:user:remove']"
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
            formData: {},
            formOptions: FormOptions,
            formRules: {},
            /** form $ */
            /** table ^ */
            pagination: new Paginator(),
            options: [
                { prop: "wisdomDeviceId", label: "设备编号" },
                { prop: "deviceNo", label: "设备名称" },
                { prop: "deviceType", label: "型号" },
                { prop: "areaName", label: "安装点" },
                { prop: "deviceGroupName", label: "分组" },
                {
                    prop: "lonlat",
                    label: "经纬度",
                    width: "120",
                    formatter: (row, column, value, index) => {
                        return `${row.longitude}, ${row.latitude}`;
                    }
                },
                { prop: "deviceId", label: "井盖编号" },
                {
                    prop: "status",
                    label: "状态",
                    formatter: (row, column, value, index) => {
                        let node = this.statusOptions.find(
                            x => x.value == value
                        );
                        return node ? node.label : value;
                    }
                },
                {
                    prop: "creationDate",
                    label: "创建时间",
                    formatter: (row, column, value, index) => {
                        return moment(value).format("YYYY-MM-DD");
                    }
                }
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
            dialogRules: {},
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
            listUser(params).then(({ rows, total }) => {
                this.loading = false;
                this.models = rows;
                this.pagination.all = total;
            });
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
        handleNodeClick({data}) { 
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
        /** 新增按钮操作 */
        handleView(data){
            console.log();
            this.isDetailVisible = true;
            this.current.node = data;
        },
        /** 新增按钮操作 */
        handleAdd(t) {
            console.log(t);
            this.reset();
            this.getTreeData();
            this.getPositions();
            this.getRoles();
            if (t == "open") this.open = true;
            else this.dialogVisible = true;
            this.title = "新增";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeData();
            this.getPositions();
            this.getRoles();
            const userId = row.userId || this.ids;
            getUser(userId).then(response => {
                this.form = response.data;
                this.form.postIds = response.postIds;
                this.form.roleIds = response.roleIds;
                this.dialogVisible = true;
                this.title = "修改";
                this.form.password = "";
            });
        },
        /** 提交按钮 */
        submitForm: function() {
            console.log("submit", this.dialogForm);
            if (this.form.userId != undefined) {
                this.$cover.update(this.form).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.open = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            } else {
                this.$cover.create(this.form).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("新增成功");
                        this.open = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const userIds = this.ids || [row.userId];
            this.$confirm(
                '是否确认删除用户编号为"' + userIds + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    console.log("delete", userIds);
                    return this.$cover.remove({ ids: userIds });
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