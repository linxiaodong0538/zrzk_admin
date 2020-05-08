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
                    labelWidth="100px"
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
                            v-hasPermi="['configuration:sensor:add']"
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
                            v-hasPermi="['configuration:sensor:edit']"
                        >修改</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-delete"
                            size="mini"
                            plain
                            :disabled="multiple"
                            @click="handleDelete"
                            v-hasPermi="['configuration:sensor:remove']"
                        >删除</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-upload2"
                            size="mini"
                            plain
                            @click="handleImport"
                            v-hasPermi="['configuration:sensor:import']"
                        >导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-download"
                            size="mini"
                            plain
                            @click="handleExport"
                            v-hasPermi="['configuration:sensor:export']"
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
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['configuration:sensor:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['configuration:sensor:remove']"
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
        >
            <el-form-item slot="range" label="测量范围" prop="measure" size="small">
                <el-input-number
                    v-model="dialogForm['minValue']"
                    controls-position="right"
                    :controls="false"
                    clearable
                    style="width: 220px;"
                ></el-input-number>
                <span>-</span>
                <el-input-number
                    v-model="dialogForm['maxValue']"
                    controls-position="right"
                    :controls="false"
                    clearable
                    style="width: 220px;"
                ></el-input-number>
            </el-form-item>
        </x-dialog>

        <el-dialog :visible.sync="isDetailVisible"></el-dialog>

        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
            <el-upload
                ref="upload"
                :limit="1"
                accept=".xlsx, .xls"
                :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport"
                :disabled="upload.isUploading"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :auto-upload="false"
                drag
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    <!-- <el-checkbox v-model="upload.updateSupport" />是否下载传感器数据 -->
                </div>
                <div class="el-upload__tip" style="color:red" slot="tip">
                    提示：仅允许导入“xls”或“xlsx”格式文件！
                    <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="upload.open = false">取 消</el-button>
            </div>
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
// 导入模板接口importTemplate
import { deviceSensor, deviceSensorExport } from "@/api/homePage/parts";
import { getToken } from "@/utils/auth";

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
            /** 传感器类型选项 */
            typeOptions: [],
            /** 数据类型选项 */
            dataTypeOptions: [],
            current: {
                deptId: undefined
            },
            cache: {
                sensorTypes: {},
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
                { prop: "sensorName", label: "传感器名称" },
                { prop: "sensorTypeName", label: "传感器类型" },
                { prop: "fieldName", label: "数据标识" },
                { prop: "fieldNameCn", label: "数据名称" },
                {
                    prop: "dataType",
                    label: "数据类型",
                    formatter: this.mapping
                },
                { prop: "range", label: "范围", formatter: this.mapping },
                { prop: "unit", label: "单位" }
            ],
            models: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {},
            dialogOptions: DialogOptions,
            dialogRules: {
                sensorCode: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    },
                    {
                        validator: async (
                            rule,
                            value,
                            callback,
                            source,
                            options
                        ) => {
                            const field = rule.field;
                            if (!field) return callback();
                            if (
                                value == "" ||
                                value == undefined ||
                                value == null
                            ) {
                                callback();
                            } else {
                                const params = {
                                    id: this.dialogForm.sensorId,
                                    code: value
                                };
                                const { data } = await this.$sensor.validate(
                                    params
                                );
                                callback(
                                    data
                                        ? new Error("传感器编号已被使用")
                                        : undefined
                                );
                            }
                        },
                        trigger: "blur"
                    }
                ],
                sensorName: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    },
                    {
                        validator: async (
                            rule,
                            value,
                            callback,
                            source,
                            options
                        ) => {
                            const field = rule.field;
                            if (!field) return callback();
                            if (
                                value == "" ||
                                value == undefined ||
                                value == null
                            ) {
                                callback();
                            } else {
                                const params = {
                                    id: this.dialogForm.sensorId,
                                    name: value
                                };
                                const { data } = await this.$sensor.validate(
                                    params
                                );
                                callback(
                                    data
                                        ? new Error("传感器名称已被使用")
                                        : undefined
                                );
                            }
                        },
                        trigger: "blur"
                    }
                ],
                sensorType: [
                    {
                        required: true,
                        message: "必选",
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
                fieldName: [
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
                        validator: async (
                            rule,
                            value,
                            callback,
                            source,
                            options
                        ) => {
                            const field = rule.field;
                            if (!field) return callback();
                            if (
                                value == "" ||
                                value == undefined ||
                                value == null
                            ) {
                                callback();
                            } else {
                                const params = {
                                    id: this.dialogForm.sensorId,
                                    fieldName: value
                                };
                                const { data } = await this.$sensor.validate(
                                    params
                                );
                                callback(
                                    data
                                        ? new Error("数据标识已被使用")
                                        : undefined
                                );
                            }
                        },
                        trigger: "blur"
                    }
                ],
                fieldNameCn: [
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
            isDetailVisible: false,
            /** view detail $ */

            // 用户导入参数
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                // /deviceSensor/importData
                url: process.env.VUE_APP_BASE_API + "/deviceSensor/importData"
            }
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
        this.getDicts("data_type").then(({ data }) => {
            this.dataTypeOptions = data.map(x => ({
                label: x.dictLabel,
                value: x.dictValue
            }));
            this.cache.dataTypes = data.reduce(
                (p, c) => ((p[c.dictValue] = c), p),
                {}
            );
            console.log("==================", this.cache.dataTypes);
            let node = this.dialogOptions.find(x => x.prop === "dataType");
            if (node) node.options = this.dataTypeOptions;
        });
        this.$sensortype.get().then(({ rows }) => {
            console.log("            types", rows);
            this.typeOptions = rows.map(x => ({
                label: x.sensorTypeName,
                value: x.sensorTypeId
            }));
            this.cache.sensorTypes = rows.reduce(
                (p, c) => ((p[c.sensorTypeId] = c), p),
                {}
            );
            let node = this.dialogOptions.find(x => x.prop === "sensorType");
            if (node) node.options = this.typeOptions;
            node = this.formOptions.find(x => x.prop === "sensorType");
            if (node) node.options = this.typeOptions;
        });
        this.search();
    },
    methods: {
        /** 查询用户列表 */
        search() {
            console.log("trigger search", this.formData);
            // let start = this.formData.dateRange
            //     ? moment(this.formData.dateRange[0]).format("YYYY-MM-DD")
            //     : undefined;
            // let end = this.formData.dateRange
            //     ? moment(this.formData.dateRange[1]).format("YYYY-MM-DD")
            //     : undefined;
            let params = Object.assign({}, this.formData, {
                pageNum: this.pagination.index,
                pageSize: this.pagination.size,
                page: this.pagination.index
                // startDate: start,
                // endDate: end
            });
            delete params.dateRange;
            this.loading = true;
            this.$sensor.search(params).then(
                ({ rows, total }) => {
                    this.loading = false;
                    this.models = rows;
                    this.pagination.all = total;
                },
                err => {
                    this.loading = false;
                    this.models = [];
                    this.pagination.all = 0;
                }
            );
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
            this.ids = selection.map(item => item.sensorId);
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
        handleAdd() {
            // this.reset();
            // if (t == "open") this.open = true;
            this.dialogForm = {};
            this.dialogVisible = true;
            this.title = "新增传感器";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row && row.sensorId ? row.sensorId : this.ids[0];
            const node = this.models.find(x => x.sensorId == id);
            this.dialogForm = Object.assign({}, node);

            this.dialogVisible = true;
            this.title = "修改传感器";
        },
        /** 提交按钮 */
        submitForm: function() {
            console.log("submit", this.dialogForm);
            if (this.dialogForm.sensorId != undefined) {
                this.$sensor.update(this.dialogForm).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.dialogVisible = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            } else {
                this.$sensor.create(this.dialogForm).then(response => {
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
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row && row.sensorId ? [row.sensorId] : this.ids;
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    console.log("delete", ids);
                    return this.$sensor.remove({ ids: ids });
                })
                .then(() => {
                    this.search();
                    this.msgSuccess("删除成功");
                })
                .catch(function() {});
        },
        /** 导出按钮操作 */
        handleExport() {
            // const queryParams = this.queryParams;
            let params = Object.assign({}, this.formData, {
                // pageNum: this.pagination.index,
                // pageSize: this.pagination.size,
                // page: this.pagination.index
                // startDate: start,
                // endDate: end
            });
            delete params.dateRange;

            this.$confirm("是否确认导出所有传感器数据", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(function() {
                    return deviceSensorExport(params);
                })
                .then(response => {
                    this.download(response.msg);
                })
                .catch(function() {});
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "传感器导入";
            this.upload.open = true;
        },
        /** 下载模板操作 */
        importTemplate() {
            deviceSensor().then(response => {
                this.download(response.msg);
            });
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            this.$alert(response.msg, "导入结果", {
                dangerouslyUseHTMLString: true
            });
            this.search();
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        },
        select(v) {
            console.log("select", v);
            this.handleSelectionChange(v);
        },
        mapping(row, column, index) {
            let result = "";
            const property = column.property;
            if (property === "range") {
                result = `${row["minValue"]} - ${row["maxValue"]}`;
            }
            // if (property === "sensorType") {
            //     console.log(
            //         "mapping",
            //         row,
            //         row[property],
            //         this.cache.sensorTypes
            //     );
            //     result = row[property]
            //         ? this.cache.sensorTypes[row[property]].sensorTypeName
            //         : "";
            // }
            if (property === "dataType") {
                console.log(
                    "mapping data type",
                    property,
                    row,
                    row[property],
                    this.cache.dataTypes
                );
                result = row[property]
                    ? this.cache.dataTypes[row[property]].dictLabel
                    : "";
            }
            return result;
        }
    }
};
</script>