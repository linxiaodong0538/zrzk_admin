<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="4" :xs="24">
                <x-tree
                    :data="treeOptions"
                    :filter-node-method="filterNode"
                    :isFilterable="true"
                    :default-expand-all="true"
                    @node-click="handleNodeClick"
                ></x-tree>
            </el-col>
            <!--用户数据-->
            <el-col :span="20" :xs="24">
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
        <!-- <x-dialog
            :title="title"
            :form="dialogForm"
            :options="dialogOptions"
            :rules="dialogRules"
            :visible.sync="dialogVisible"
            @callback="submitForm"
        >
            <el-form-item size="mini" slot="measure" label="测量范围" prop="measure" size="small">
                <el-input-number
                    v-model="formData['minValue']"
                    controls-position="right"
                    :controls="false"
                    clearable
                    style="width: 220px;"
                ></el-input-number>
                <span>-</span>
                <el-input-number
                    v-model="formData['maxValue']"
                    controls-position="right"
                    :controls="false"
                    clearable
                    style="width: 220px;"
                ></el-input-number>
            </el-form-item>
        </x-dialog>-->
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :lock-scroll="true"
            width="70vw"
        >
            <el-form ref="frmDevice" :model="dialogForm" :rules="dialogRules" custom-class="frm">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item size="mini" label="设备编码" prop="deviceCode">
                            <el-input
                                v-model="dialogForm['deviceCode']"
                                controls-position="right"
                                :controls="false"
                                clearable
                                style="width: 220px;"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item size="mini" label="设备名称" prop="deviceName">
                            <el-input
                                v-model="dialogForm['deviceName']"
                                controls-position="right"
                                :controls="false"
                                clearable
                                style="width: 220px;"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>产品信息</span>
                        <!-- <el-button style="float: right; padding: 3px 0" type="text"></el-button> -->
                    </div>
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item size="mini" label="产品类型">
                                <el-select
                                    v-model="dialogForm['productTypeId']"
                                    filterable
                                    @change="change({ category: 'productTypeId', data: dialogForm['productTypeId']})"
                                >
                                    <el-option
                                        v-for="item in productTypeOptions"
                                        :key="item.key || item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.disabled || undefined"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="选择产品" prop="productId">
                                <el-select
                                    v-model="dialogForm['productId']"
                                    filterable
                                    @change="change({ category: 'productId', data: dialogForm['productId']})"
                                >
                                    <el-option
                                        v-for="item in productOptions"
                                        :key="item.key || item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.disabled || undefined"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="IMEI" prop="imei">
                                <el-input
                                    v-model="dialogForm['imei']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="IMSI">
                                <el-input
                                    v-model="dialogForm['imsi']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="网关地址">
                                <el-input
                                    v-model="dialogForm['gateway']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="TCP注册包">
                                <el-input
                                    v-model="dialogForm['id']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="回路数量">
                                <el-input
                                    v-model="dialogForm['id']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="网关ID">
                                <el-input
                                    v-model="dialogForm['id']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="所在回路">
                                <el-input
                                    v-model="dialogForm['id']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="地址">
                                <el-input
                                    v-model="dialogForm['id']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>安装信息</span>
                        <!-- <el-button style="float: right; padding: 3px 0" type="text"></el-button> -->
                    </div>

                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item size="mini" label="所属项目" prop="projectId">
                                <el-select
                                    v-model="formData['projectId']"
                                    filterable
                                    @change="change({ category: 'project', data: formData['productId']})"
                                >
                                    <el-option
                                        v-for="item in projects"
                                        :key="item.key || item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.disabled || undefined"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="设备分组" prop="groupIds">
                                <el-cascader
                                    v-model="dialogForm['groupIds']"
                                    :options="groupTreeOptions"
                                    :clearable="true"
                                    :collapse-tags="true"
                                    @change="unique"
                                    :props="{value: 'id', multiple: true, emitPath: false,checkStrictly: true}"
                                ></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="部件" prop="partsId">
                                <el-input
                                    v-model="formData['partsId']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                    placeholder="点击选择部件"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="所在区域">
                                <el-cascader
                                    v-model="formData['areaId']"
                                    clearable
                                    disabled
                                    :options="treeOptions"
                                    :prop="{ emitPath: false, value: 'id' }"
                                ></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="经度">
                                <el-input
                                    v-model="formData['id']"
                                    controls-position="right"
                                    :controls="false"
                                    disabled
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="纬度">
                                <el-input
                                    v-model="formData['id']"
                                    controls-position="right"
                                    :controls="false"
                                    disabled
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="运营商">
                                <el-input
                                    v-model="formData['serviceProvider']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="状态">
                                <el-input
                                    v-model="formData['onlineStatus']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm" size="mini">确 定</el-button>
                <el-button @click="cancel" size="mini">取 消</el-button>
            </span>
        </el-dialog>

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
import { DialogOptions, FormOptions, TableOptions } from "./options.data";

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
            // 默认密码
            initPassword: undefined,
            // 日期范围
            dateRange: [],
            /** 设备分组树 */
            groupTreeOptions: [],
            /** 产品类型 */
            productTypeOptions: [],
            /** 产品 */
            productOptions: [],
            // 状态数据字典
            statusOptions: [],
            // 性别状态字典
            sexOptions: [],
            // 岗位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
            /** 参数列表 */
            fields: [],
            /** 项目列表 */
            projects: [],
            current: {
                areaId: undefined
            },
            cache: {
                links: []
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
            options: TableOptions,
            models: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {
                productTypeId: null,
                productId: null
            },
            dialogOptions: DialogOptions,
            dialogRules: {
                deviceCode: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ],
                deviceName: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ],
                productId: [
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
            this.productTypeOptions = data.map(x => ({
                label: x.productTypeName,
                value: x.productTypeId
            }));
            let node = this.formOptions.find(x => x.prop == "productTypeId");
            if (node) node.options = this.productTypeOptions;
            node = this.dialogOptions.find(x => x.prop == "productTypeId");
            if (node) node.options = this.productTypeOptions;
        });
        this.projects = (this.$store.state.app.projects || []).map(x => ({
            label: x.projectName,
            value: x.projectId
        }));
        let node = this.formOptions.find(x => x.prop == "projectId");
        if (node) node.options = this.projects;
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
            this.$device.search(params).then(({ rows, total }) => {
                this.loading = false;
                this.models = rows;
                this.pagination.all = total;
            });
        },
        /** 查询部门下拉树结构 */
        getTreeData() {
            this.$area.treeselect().then(({ data }) => {
                this.treeOptions = data;

                let node = this.dialogOptions.find(x => x.prop === "areaId");
                if (node) node.options = this.treeOptions;
                // let node = this..find(x => x.prop === "areaId");
                // if (node) node.options = this.treeOptions;
            });
            this.organizations = this.$store.state.app.organizations || [];
            this.cache.tree = this.calculate(this.organizations, {});
            this.groupTreeOptions = this.organizations;
        },
        calculate(roots, result = {}) {
            for (let node of roots) {
                result[node.id] = node;
                if (node.children) {
                    this.calculate(node.children || [], result);
                }
            }
            return result;
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.current.areaId = data.id;
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
                areaId: 100,
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
        handleView(data) {
            console.log();
            this.isDetailVisible = true;
            this.current.node = data;
        },
        /** 新增按钮操作 */
        handleAdd(row) {
            this.dialogForm = {
                areaId: this.current.areaId
            };
            this.dialogVisible = true;
            this.title = "设备登记";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            let id = row && row.deviceId ? row.deviceId : this.ids[0];
            let node = this.models.find(x => x.deviceId === id);
            this.dialogForm = node;
            this.dialogVisible = true;
            this.title = "设备修改";
        },
        /** 提交按钮 */
        async submitForm() {
            let valid = await this.$refs["frmDevice"].validate();
            if (!valid) return valid;

            this.$refs["frmDevice"].clearValidate();

            console.log("submit", this.dialogForm);
            if (this.dialogForm.userId != undefined) {
                this.$device.update(this.dialogForm).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.open = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            } else {
                this.$device.create(this.dialogForm).then(response => {
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
        },
        change({ category, data }) {
            if (!data) return;
            if (category === "productTypeId") {
                this.$product
                    .getProductsByTypeId({ productTypeId: data })
                    .then(({ data }) => {
                        this.productOptions = data.map(x => ({
                            label: x.productName,
                            value: x.productId
                        }));
                    });
            }
            if (category === "productId") {
                this.$product.getFields({ id: data }).then(({ code, data }) => {
                    this.fields = data;
                    console.log("fields", this.fields);
                });
            }
        },
        unique(list) {
            // console.log("unique", list, this.cache.links);
            if (list.length < this.cache.links.length) {
                this.cache.links = list;
                return;
            }
            let cur = list.find(x => !this.cache.links.includes(x));
            let bloodlines = this.treelink(this.cache.tree[cur]);
            // console.log("lines", bloodlines);
            let pure = list.filter(x => !bloodlines.includes(x));
            this.cache.links = [...pure, cur];
            this.dialogForm.groupIds = [...pure, cur];
            return this.cache.links;
        },
        /**
         * 获取某节点的整条树id
         * node 树节点
         * isNeedPrev 是否需要找根节点
         */
        treelink(node, isNeedPrev = true) {
            if (!node) return [];
            let result = [];
            if (isNeedPrev) {
                while (node.parentId != "0") {
                    node = this.cache.tree[node.parentId];
                }
                result = this.treelink(node, false);
            } else {
                result = [node.id];
                if (node.children && node.children.length) {
                    for (let n of node.children) {
                        result.push(...this.treelink(n, false));
                    }
                }
            }
            return result;
        }
    }
};
</script>
<style scoped>
.frm {
    max-height: 50vh;
    overflow-y: auto;
}
.el-input__inner {
    padding-right: 3%;
}
</style>