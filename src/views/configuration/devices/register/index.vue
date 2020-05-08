<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="4" :xs="24">
                <x-org
                    :filter-node-method="filterNode"
                    :isFilterable="true"
                    :default-expand-all="true"
                    @node-click="handleNodeClick"
                ></x-org>
            </el-col>
            <!--用户数据-->
            <el-col :span="20" :xs="24">
                <x-form
                    :options="formOptions"
                    :form="formData"
                    :rules="formRules"
                    labelWidth="100px"
                    @callback="search"
                    @change="formChange"
                ></x-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            plain
                            @click="handleAdd"
                            v-hasPermi="['configuration:device:add']"
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
                            v-hasPermi="['configuration:device:edit']"
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
                            v-hasPermi="['configuration:device:remove']"
                        >删除</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-upload2"
                            size="mini"
                            plain
                            @click="handleImport"
                            v-hasPermi="['configuration:device:import']"
                        >导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-download"
                            size="mini"
                            plain
                            @click="handleExport"
                            v-hasPermi="['configuration:device:export']"
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
                                @click="view({ category: 'detail', data: scope.row })"
                                v-hasPermi="['configuration:device:query']"
                            >详情</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['configuration:device:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['configuration:device:remove']"
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
                            <el-form-item size="mini" label="产品类型" prop="productTypeId">
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
                        <template v-for="(field,index) in fields">
                            <el-col :span="8" :key="index">
                                <el-form-item
                                    size="mini"
                                    :label="field.deviceFieldNameCn"
                                    :prop="`deviceFields_${index}_${field.deviceFieldName}`"
                                    :rules="field.rules||[]"
                                    style="margin-top: 1;"
                                >
                                    <!--  -->
                                    <el-input
                                        v-model="dialogForm.deviceFields[index]['deviceFieldValue']"
                                        @change="duplicate({ prop: `deviceFields_${index}_${field.deviceFieldName}`, index, data: dialogForm.deviceFields[index]['deviceFieldValue'] })"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </template>
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
                                    v-model="dialogForm['projectId']"
                                    filterable
                                    @change="change({ category: 'project', data: dialogForm['projectId']})"
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
                            <el-form-item size="mini" label="部件" prop="partsId">
                                <!-- <el-input
                                    v-model="dialogForm['partsId']"
                                    controls-position="right"
                                    :controls="false"
                                    clearable
                                    filterable
                                    placeholder="点击选择部件"
                                ></el-input>-->
                                <!-- <el-select
                                    v-model="dialogForm['partsId']"
                                    filterable
                                    clearable
                                    @change="change({ category: 'partsId', data: dialogForm['partsId'] })"
                                >
                                    <el-option
                                        v-for="item in partsOptions"
                                        :key="item.key || item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.disabled || undefined"
                                    ></el-option>
                                </el-select>-->

                                <el-cascader
                                    v-model="dialogForm['partsId']"
                                    :options="partsTreeOptions"
                                    clearable
                                    :props="{ value: 'id', multiple: false , emitPath: false,
                                    checkStrictly:  false 
                                  }"
                                    @change="change({category: 'partsId', data: dialogForm['partsId'] })"
                                ></el-cascader>
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
                            <el-form-item size="mini" label="所在区域" prop="areaId">
                                <el-cascader
                                    v-model="dialogForm['areaId']"
                                    clearable
                                    :disabled="true"
                                    :options="treeOptions"
                                    :props="{ emitPath: false, multiple: false, value: 'id', checkStrictly: true }"
                                ></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="经度" prop="longitude">
                                <el-input
                                    v-model="dialogForm['longitude']"
                                    controls-position="right"
                                    :controls="false"
                                    disabled
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="纬度" prop="latitude">
                                <el-input
                                    v-model="dialogForm['latitude']"
                                    controls-position="right"
                                    :controls="false"
                                    disabled
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="运营商">
                                <el-select
                                    v-model="dialogForm['serviceProvider']"
                                    filterable
                                    clearable
                                >
                                    <el-option
                                        v-for="item in vendorOptions"
                                        :key="item.key || item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.disabled || undefined"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item size="mini" label="运行状态">
                                <el-select
                                    v-model="dialogForm['runningState']"
                                    filterable
                                    clearable
                                >
                                    <el-option
                                        v-for="item in runningStateOptions"
                                        :key="item.key || item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.disabled || undefined"
                                    ></el-option>
                                </el-select>
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

        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
            <span>产品类型</span>
            <el-select
                v-model="productTypeOptionsValue"
                placeholder="请选择"
                class="productManhole"
                size="small"
                @change="ImportproductType"
            >
                <el-option
                    v-for="item in productTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <span class="xny_productName">产品名称</span>
            <el-select v-model="productNameValue" placeholder="请选择" class="productManhole" size="small">
                <el-option
                    v-for="item in ImportProductName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
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
                :data="productNameData"
                :before-upload="handleBefore"
                drag
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <!-- <div class="el-upload__tip" slot="tip">
                    <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                    <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
                </div>-->
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
import { XTable, XForm, XTree, XDialog, XOrg } from "@/components";
import { Paginator } from "@/dtos/paginator";
import moment from "moment";
import { DialogOptions, FormOptions, TableOptions } from "./options.data";
import { FieldDataRules } from "@/dtos/constants";
import { deviceRegister, deviceExport } from "@/api/homePage/parts.js";
import { getToken } from "@/utils/auth";

export default {
    components: { Treeselect, XTable, XForm, XTree, XDialog, XOrg },
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
            treeOptions: [],
            // 是否显示弹出层
            open: false,
            // 部门名称
            deptName: undefined,
            // 日期范围
            dateRange: [],
            /** 设备分组树 */
            groupTreeOptions: [],
            /** 产品类型 */
            productTypeOptions: [],
            productTypeOptionsValue: "",
            /** 产品 */
            //   导入产品名称
            ImportProductName: [],
            productNameValue: "",
            productOptions: [],
            // 状态数据字典
            statusOptions: [],
            // 岗位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
            runningStateOptions: [],

            partsTreeOptions: [],
            /** 参数列表 */
            fields: [],
            /** 部件选项 */
            partsOptions: [],
            vendorOptions: [],
            fieldDataRules: FieldDataRules,
            /** 项目列表 */
            projects: [],
            current: {
                groupId: undefined,
                areaId: undefined
            },
            cache: {
                onlineStatus: {},
                runningState: {},
                links: [],
                parts: {},
                vendors: {}
            },
            // 表单参数
            form: {},
            rule: {
                validator(rule, value, callback, source, options) {
                    const field = rule.field;
                    if (!field) return callback();
                    if (value === "" || value === undefined || value === null) {
                        callback(new Error("必填"));
                    } else {
                        callback();
                    }
                },
                trigger: "blur"
            },
            defaultProps: {
                children: "children",
                label: "label"
            },
            /** form ^ */
            /** 查询参数 */
            formData: {
                productId: undefined
            },
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
                                const params = {
                                    id: this.dialogForm.deviceId,
                                    code: value
                                };
                                this.$device
                                    .validate(params)
                                    .then(({ data }) => {
                                        callback(
                                            data
                                                ? new Error("设备编号已被使用")
                                                : undefined
                                        );
                                    });
                            }
                        },
                        trigger: "blur"
                    }
                ],
                productTypeId: [
                    {
                        required: true,
                        message: "必选",
                        trigger: "change"
                    }
                ],
                productId: [
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
                // url: process.env.VUE_APP_BASE_API + "/device/deviceRegister/importDataForDeviceSensor"
                // /device/deviceRegister/importData 导入设备导入
                url:
                    process.env.VUE_APP_BASE_API +
                    "/device/deviceRegister/importData"
            },
            productNameData: {
                productId: ""
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

        this.$parts.treeselect().then(({ data }) => {
            data.forEach(item => {
                if (item.children && item.children.length) {
                    item.children.forEach(son => {
                        if (son.children && son.children.length) {
                        } else {
                            son.disabled = true;
                        }
                    });
                } else {
                    item.disabled = true;
                }
            });
            this.partsTreeOptions = data;
        });

        this.getDicts("service_provider").then(response => {
            this.vendorOptions = response.data.map(x => ({
                label: x.dictLabel,
                value: x.dictValue
            }));
            this.cache.vendors = response.data.reduce(
                (p, c) => ((p[c.dictValue] = c.dictLabel), p),
                {}
            );
            let node = this.dialogOptions.find(
                x => x.prop === "serviceProvider"
            );
            if (node) {
                node.options = this.vendorOptions;
            }
        });

        this.getDicts("online_status").then(({ data }) => {
            this.cache.onlineStatus = data.reduce(
                (p, c) => ((p[c.dictValue] = c.dictLabel), p),
                {}
            );
        });
        this.getDicts("running_state").then(({ data }) => {
            this.runningStateOptions = data.map(x => ({
                label: x.dictLabel,
                value: x.dictValue
            }));
            this.cache.runningState = data.reduce(
                (p, c) => ((p[c.dictValue] = c.dictLabel), p),
                {}
            );
            console.log(this.cache.runningState);
        });
        this.$device.getParts().then(({ data }) => {
            this.partsOptions = data.map(x => ({
                label: x.partsName,
                value: x.partsId
            }));
            this.cache.parts = data.reduce(
                (p, c) => ((p[c.partsId] = c), p),
                {}
            );
        });

        this.$producttype.get().then(({ rows }) => {
            this.productTypeOptions = rows.map(x => ({
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

        this.options
            .filter(x => x.formatter)
            .forEach(x => {
                x.formatter = this.mapping;
            });
    },
    methods: {
        /** 查询用户列表 */
        search() {
            console.log("trigger search", this.formData);
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
                areaId: this.current.areaId,
                groupId: this.current.groupId,
                startDate: start,
                endDate: end
            });
            delete params.dateRange;
            this.loading = true;
            this.$device.search(params).then(
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
        handleNodeClick({ category, areaId, groupId, data }) {
            this.current.areaId = areaId;
            this.current.groupId = groupId;
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
            this.dialogVisible = false;
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
            this.ids = selection.map(item => item.deviceId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleView(data) {
            console.log();
            this.isDetailVisible = true;
            this.current.node = data;
        },
        view({ category, data }) {
            if (category === "detail") {
                this.$router.push({ path: "/deviceDetails/" + data.deviceId });
            }
        },
        /** 新增按钮操作 */
        handleAdd(row) {
            this.fields = [];
            this.dialogForm = {
                areaId: this.current.areaId,
                productTypeId: null,
                deviceCode: null,
                productId: null,
                deviceFields: []
            };
            this.dialogVisible = true;
            this.title = "设备登记";
        },
        /** 修改按钮操作 */
        async handleUpdate(row) {
            let id = row && row.deviceId ? row.deviceId : this.ids[0];
            let node = this.models.find(x => x.deviceId === id);
            // this.dialogForm = node;
            this.fields = [];
            try {
                const { data } = await this.$device.get({ id: id });
                this.dialogForm = data;
            } catch (error) {
                console.error(error);
                return;
            }
            try {
                let { data } = await this.$product.getProductsByTypeId({
                    productTypeId: node.productTypeId
                });

                this.productOptions = data.map(x => ({
                    label: x.productName,
                    value: x.productId
                }));
            } catch (error) {
                console.log(error);
                this.productOptions = [];
                return;
            }

            try {
                let { code, data } = await this.$product.getFields({
                    productId: node.productId
                });
                this.fields = data.map(x => {
                    x.rules = (
                        this.fieldDataRules[x.deviceDataType] || []
                    ).concat(
                        x.isEmpty
                            ? [
                                  {
                                      required: true,
                                      message: "必填",
                                      trigger: "blur"
                                  }
                              ]
                            : []
                    );
                    console.log(x.rules, x);
                    return x;
                });
                if (!this.dialogForm.deviceFields)
                    this.dialogForm.deviceFields = [];
                (this.fields || []).forEach(item => {
                    let index = this.dialogForm.deviceFields.findIndex(
                        x => x.deviceFieldName === item.deviceFieldName
                    );
                    let n = this.dialogForm.deviceFields[index];
                    if (!n) {
                        n = {
                            deviceFieldName: item.deviceFieldName,
                            deviceFieldNameCn: item.deviceFieldNameCn
                        };
                        this.dialogForm.deviceFields.push(n);
                    }else{
                        this.dialogForm[`deviceFields_${index}_${n.deviceFieldName}`] = n.deviceFieldValue;
                    }
                });
            } catch (error) {
                this.fields = [];
            }
            this.title = "设备修改";
            this.dialogVisible = true;
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["frmDevice"].validate(valid => {
                if (!valid) return valid;

                this.$refs["frmDevice"].clearValidate();

                console.log("submit", this.dialogForm);
                if (this.dialogForm.deviceId != undefined) {
                    this.$device.update(this.dialogForm).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess("修改成功");
                            this.dialogVisible = false;
                            this.search();
                        } else {
                            this.msgError(response.msg);
                        }
                    });
                } else {
                    this.$device.create(this.dialogForm).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess("新增成功");
                            this.dialogVisible = false;
                            this.search();
                        } else {
                            this.msgError(response.msg);
                        }
                    });
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row && row.deviceId ? [row.deviceId] : this.ids;
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    console.log("delete", ids);
                    return this.$device.remove({ ids: ids });
                })
                .then(() => {
                    this.search();
                    this.msgSuccess("删除成功");
                })
                .catch(function() {});
        },
        /** 导出按钮操作 */
        handleExport() {
            let start =
                this.formData.dateRange && this.formData.dateRange[0]
                    ? moment(this.formData.dateRange[0]).format("YYYY-MM-DD")
                    : undefined;
            let end =
                this.formData.dateRange && this.formData.dateRange[1]
                    ? moment(this.formData.dateRange[1]).format("YYYY-MM-DD")
                    : undefined;
            let params = Object.assign({}, this.formData, {
                // pageNum: this.pagination.index,
                // pageSize: this.pagination.size,
                // page: this.pagination.index,
                // areaId: this.current.areaId,
                // groupId: this.current.groupId,
                startDate: start,
                endDate: end
            });
            delete params.dateRange;

            this.$confirm("是否确认导出所有设备登记数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(function() {
                    return deviceExport(params);
                })
                .then(response => {
                    this.download(response.msg);
                })
                .catch(function() {});
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "设备登记导入";
            this.upload.open = true;
        },
        /** 下载模板操作 */
        importTemplate() {
            if (this.productNameValue == "") {
                this.$message({
                    message: "警告产品名称不能为空",
                    type: "warning"
                });
            } else {
                let productId = this.productNameValue;
                deviceRegister(productId).then(response => {
                    this.download(response.msg);
                });
            }
        },
        // 上传前的回调函数
        handleBefore(file) {
            const _vm = this;
            _vm.productNameData.productId = _vm.productNameValue;
            // console.log(_vm.productNameData.productId);
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
            if (this.productNameValue == "") {
                this.$message({
                    message: "警告产品名称不能为空",
                    type: "warning"
                });
            } else {
                this.$refs.upload.submit();
                
            }
        },
        select(v) {
            console.log("select", v);
            this.handleSelectionChange(v);
        },
        async change({ category, data }) {
            // if (!data) return;
            if (category === "productTypeId") {
                this.productOptions = [];
                this.fields = [];
                this.dialogForm.productId = null;
                this.$product.getProductsByTypeId({ productTypeId: data }).then(
                    ({ data }) => {
                        this.productOptions = data.map(x => ({
                            label: x.productName,
                            value: x.productId
                        }));
                    },
                    err => {
                        this.productOptions = [];
                    }
                );
            }
            if (category === "productId") {
                this.$product.getFields({ productId: data }).then(
                    ({ code, data }) => {
                        this.fields = data.map(x => {
                            x.rules = (
                                this.fieldDataRules[x.deviceDataType] || []
                            ).concat(
                                x.isEmpty
                                    ? [
                                          {
                                              required: true,
                                              message: "必填",
                                              trigger: "blur"
                                          }
                                      ]
                                    : []
                            );
                            console.log(x.rules);
                            return x;
                        });
                        this.dialogForm.deviceFields = (this.fields || []).map(
                            x => ({
                                deviceFieldName: x.deviceFieldName,
                                deviceFieldNameCn: x.deviceFieldNameCn,
                                deviceFieldValue: x.deviceFieldValue
                            })
                        );
                        console.log("fields", this.fields);
                    },
                    err => {
                        this.fields = [];
                    }
                );
            }
            if (category === "partsId") {
                try {
                    if (!data) {
                        throw "data is null";
                    }
                    const res = await this.$parts.get({ id: data });
                    let p = res.data || {};
                    this.dialogForm["areaId"] = p.areaId;
                    this.dialogForm["longitude"] = p.longitude;
                    this.dialogForm["latitude"] = p.latitude;
                } catch (error) {
                    this.dialogForm["areaId"] = null;
                    this.dialogForm["longitude"] = null;
                    this.dialogForm["latitude"] = null;
                    console.log(error);
                }
            }
        },
        formChange({ category, value }) {
            // if (!data) return;
            if (category === "productTypeId") {
                console.log("categoyr", category);
                this.formData.productId = undefined;
                this.$product
                    .getProductsByTypeId({ productTypeId: value })
                    .then(
                        ({ data }) => {
                            const options = data.map(x => ({
                                label: x.productName,
                                value: x.productId
                            }));
                            let node = this.formOptions.find(
                                x => x.prop === "productId"
                            );
                            if (node) node.options = options;
                        },
                        err => {
                            let node = this.formOptions.find(
                                x => x.prop === "productId"
                            );
                            if (node) node.options = [];
                        }
                    );
            }
            this.$forceUpdate();
        },
        unique(list) {
            if (!list) return [];
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
        },
        duplicate({ prop, index, data }) {
            console.log(prop, data);
            this.$set(this.dialogForm, prop, data);
        },
        mapping(row, column, index) {
            let result = "";
            const property = column.property;
            if (property === "onlineStatus") {
                result =
                    row[property] && this.cache.onlineStatus[row[property]]
                        ? this.cache.onlineStatus[row[property]]
                        : row[property] || "-";
            }
            if (property === "runningState") {
                result =
                    row[property] && this.cache.runningState[row[property]]
                        ? this.cache.runningState[row[property]]
                        : row[property] || "-";
            }
            return result;
        },
        ImportproductType() {
            let data = this.productTypeOptionsValue;
            this.$product.getProductsByTypeId({ productTypeId: data }).then(
                ({ data }) => {
                    this.ImportProductName = data.map(x => ({
                        label: x.productName,
                        value: x.productId
                    }));
                    this.productNameValue = "";
                },
                err => {
                    this.ImportProductName = [];
                }
            );
        }
    }
};
</script>
<style lang="scss" scoped>
.productManhole {
    width: 109px;
    height: 30px;
    margin-bottom: 20px;
}
.xny_productName {
    margin-left: 10px;
}
</style>
<style scoped>
.frm {
    max-height: 50vh;
    overflow-y: auto;
}
.el-input__inner {
    padding-right: 3%;
}
</style>
