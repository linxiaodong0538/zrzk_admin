<template>
    <div>
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
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                            v-hasPermi="['configuration:partsCategory:add']"
                        >自定义参数</el-button>
                    </el-col>
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="success"
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleUpdate"
                            v-hasPermi="['configuration:partsCategory:edit']"
                        >修改</el-button>
                    </el-col>-->
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                            v-hasPermi="['configuration:partsCategory:remove']"
                        >删除</el-button>
                    </el-col>-->
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="info"
                            icon="el-icon-upload2"
                            size="mini"
                            plain
@click="handleImport"
                            v-hasPermi="['configuration:partsCategory:import']"
                        >导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="info"
                            icon="el-icon-download"
                            size="mini"
                            plain
                            @click="handleExport"
                            v-hasPermi="['configuration:partsCategory:export']"
                        >导出</el-button>
                    </el-col>-->
                </el-row>

                <x-table
                    :options="options"
                    :data="data"
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
                            <!-- <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-search"
                                @click="handleView(scope.row)"
                                v-hasPermi="['system:sensor:view']"
                            >查看</el-button>-->
                            <el-button 
                                v-if="scope.row.partsTypeId"
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['configuration:partsCategory:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['configuration:partsCategory:remove']"
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
            append-to-body
            :show-close="false"
        >
            <template slot="fields"></template>
        </x-dialog>
    </div>
</template>

<script>
import { XTable, XForm, XTree, XDialog } from "@/components";
import { Paginator } from "@/dtos/paginator";
import moment from "moment";
import { DialogOptions, FormOptions } from "./fields.data";

export default {
    name: "x-fields",
    components: { XTable, XForm, XTree, XDialog },
    props: {
        data: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    data() {
        return {
            // 遮罩层
            loading: false,
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
            /** 数据类型选项 */
            dataTypeOptions: [],
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
            cache: {
                dataTypes: {}
            },
            // 表单参数
            defaultProps: {
                children: "children",
                label: "label"
            },
            /** form ^ */
            /** 查询参数 */

            /** form $ */
            /** table ^ */
            pagination: new Paginator(),
            options: [
                { prop: "partsFieldName", label: "数据标识" },
                { prop: "partsFieldNameCn", label: "数据名称" },
                { prop: "dataType", label: "数据类型" },
                { prop: "unit", label: "单位" }
            ],
            models: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {},
            dialogOptions: DialogOptions,
            dialogRules: {
                partsFieldNameCn: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ],
                dataType: [
                    {
                        required: true,
                        message: "必选",
                        trigger: "change"
                    }
                ],
                unit: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ],
                partsFieldName: [
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
                            if (
                                value == "" ||
                                value == undefined ||
                                value == null
                            ) {
                                callback();
                            } else {
                                const count = this.data.filter(
                                    x =>
                                        x[field] === value &&
                                        (!this.dialogForm.partsTypeFieldId ||
                                            this.dialogForm.partsTypeFieldId !=
                                                x.partsTypeFieldId)
                                ).length;
                                console.log('value', value, source, count);
                                callback(
                                    count
                                        ? new Error("该数据标识已被使用")
                                        : undefined
                                );
                            }
                        },
                        trigger: "blur"
                    }
                    // {
                    //     validator: (rule, value, callback) => {
                    //         const reg = /^[_a-zA-Z0-9]+$/;
                    //         if (
                    //             value == "" ||
                    //             value == undefined ||
                    //             value == null
                    //         ) {
                    //             callback();
                    //         } else {
                    //             if (!reg.test(value)) {
                    //                 callback(
                    //                     new Error(
                    //                         "只能输入英文字母，数字以及下划线"
                    //                     )
                    //                 );
                    //             } else {
                    //                 callback();
                    //             }
                    //         }
                    //     },
                    //     trigger: "blur"
                    // }
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

        this.getDicts("data_type").then(({ data }) => {
            this.dataTypeOptions = data.map(x => ({
                label: x.dictLabel,
                value: x.dictValue
            }));
            this.cache.dataTypes = data.reduce(
                (p, c) => ((p[c.dictValue] = c), p),
                {}
            );
            let node = this.dialogOptions.find(x => x.prop === "dataType");
            if (node) node.options = this.dataTypeOptions;
        });
        this.search();
    },
    methods: {
        /** 查询用户列表 */
        search() {
            // this.loading = true;
            // this.$partstype.search( ).then(({ rows, total }) => {
            //     // this.loading = false;
            //     // this.models = rows;
            //     this.pagination.all = total;
            // });
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
            this.ids = selection.map(item => item.partsTypeFieldId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleView(data) {
            this.isDetailVisible = true;
            this.current.node = data;
        },
        /** 新增按钮操作 */
        handleAdd(t) {
            this.dialogForm = {};
            this.dialogVisible = true;
            this.title = "新增";
            let node = this.dialogOptions.find(
                x => x.prop === "partsFieldName"
            );
            if (node) delete node.disabled;
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const node = this.data.find(
                x => x.partsFieldName == row.partsFieldName
            );
            this.dialogForm = Object.assign({}, node);
            this.dialogVisible = true;
            let opt = this.dialogOptions.find(x => x.prop === "partsFieldName");
            if (opt) opt.disabled = !!this.dialogForm.partsTypeFieldId;
            this.title = "修改";
        },
        /** 提交按钮 */
        submitForm: function() {
            // let index = this.data.findIndex(
            //     x => x.partsFieldName == this.dialogForm.partsFieldName
            // );
            // this.data.splice(index, index ? 1 : 0, this.dialogForm);
            // console.log("submit", this.dialogForm);
            if (this.dialogForm.partsTypeFieldId == undefined) {
                this.data.push(
                    Object.assign({}, this.dialogForm, {
                        __status__: "add"
                    })
                );
            } else {
                let index = this.data.findIndex(
                    x =>
                        x.partsTypeFieldId ==
                            this.dialogForm.partsTypeFieldId ||
                        x.partsFieldName == this.dialogForm.partsFieldName
                );
                this.data.splice(index, 1, this.dialogForm);
            }
            this.dialogVisible = false;
            // if (this.form.userId != undefined) {
            //     this.$cover.update(this.form).then(response => {
            //         if (response.code === 200) {
            //             this.msgSuccess("修改成功");
            //             this.open = false;
            //             this.search();
            //         } else {
            //             this.msgError(response.msg);
            //         }
            //     });
            // } else {
            // this.$partstype.create(this.dialogForm).then(response => {
            //     if (response.code === 200) {
            //         this.msgSuccess("新增成功");
            //         this.dialogVisible = false;
            //         this.search();
            //     } else {
            //         this.msgError(response.msg);
            //     }
            // });
            // }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let index = this.data.findIndex(
                        x => x.partsFieldName === row.partsFieldName
                    );
                    this.data.splice(index, 1);
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
            this.handleSelectionChange(v);
        }
    }
};
</script>