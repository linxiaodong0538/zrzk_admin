<template>
    <div class="device-parabuiltins">
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
                            @click="handleAdd({ category: 'sensor' })"
                            v-hasPermi="['configuration:product:collect']"
                        >上传数据</el-button>
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
                                v-hasPermi="['configuration:product:collect']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['configuration:product:collect']"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </x-table>
            </el-col>
        </el-row>

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog
            :title="title"
            :visible.sync="isDialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            :destory-on-close="true"
            append-to-body
        >
            <el-row :gutter="10" style="margin-bottom: 20px;">
                <el-col :span="24">
                    <el-radio-group
                        v-model="dialogForm['sourceType']"
                        @change="swap"
                        :disabled="!!dialogForm['productFieldId']"
                    >
                        <el-radio label="0">设备自定义上传数据</el-radio>
                        <el-radio label="1">传感器上传数据</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-form
                ref="frm"
                :model="dialogForm"
                label-position="right"
                :rules="dialogRules"
                label-width="140px"
            >
                <el-row>
                    <el-form-item
                        label="传感器类型"
                        prop="sensorType"
                        size="mini"
                        v-if="dialogForm['sourceType'] == '1'"
                    >
                        <el-select
                            v-model="dialogForm['sensorType']"
                            filterable
                            clearable
                            @change="change({ category: 'sensorType', value: dialogForm['sensorType'], data: sensorTypeOptions.find(x=>x.value===dialogForm['sensorType']) })"
                        >
                            <el-option
                                v-for="item in sensorTypeOptions"
                                :key="item.key || item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled || undefined"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="传感器名称"
                        prop="sensorId"
                        size="mini"
                        v-if="dialogForm['sourceType'] == '1'"
                    >
                        <el-select
                            v-model="dialogForm['sensorId']"
                            filterable
                            clearable
                            @change="change({ category: 'sensorId', value: dialogForm['sensorId'], data: sensorOptions.find(x=>x.value===dialogForm['sensorId']) })"
                        >
                            <el-option
                                v-for="item in sensorOptions"
                                :key="item.key || item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled || undefined"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据名称" prop="productFieldNameCn" size="mini">
                        <el-input
                            type="text"
                            v-model="dialogForm['productFieldNameCn']"
                            :disabled=" dialogForm['sourceType'] == '1'"
                        />
                    </el-form-item>
                    <el-form-item label="数据标识" prop="productFieldName" size="mini">
                        <el-input
                            type="text"
                            v-model="dialogForm['productFieldName']"
                            :disabled=" dialogForm['sourceType'] == '1'"
                        />
                    </el-form-item>
                    <el-form-item label="数据类型" prop="productDataType" size="mini">
                        <el-select
                            v-model="dialogForm['productDataType']"
                            filterable
                            clearable
                            :disabled=" dialogForm['sourceType'] == '1'"
                            @change="change({ category: 'productDataType', value: dialogForm['productDataType'], data: dataTypeOptions.find(x=>x.value===dialogForm['productDataType']) })"
                        >
                            <el-option
                                v-for="item in dataTypeOptions"
                                :key="item.key || item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled || undefined"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="协议标识" prop="protocolFieldName" size="mini">
                        <el-input type="text" v-model="dialogForm['protocolFieldName']" />
                    </el-form-item>
                    <!-- <el-col :span="24" v-if="dialogForm['sourceType'] == '1'">
                        <el-row :gutter="10" style="margin-bottom: 20px;">
                            <el-col
                                :span="5"
                                :offset="2"
                            >数据类型: {{ cache.sensors[dialogForm['sensorId']]?cache.sensors[dialogForm['sensorId']].dataType:'' }}</el-col>
                            <el-col
                                :span="5"
                            >范围: {{ `${cache.sensors[dialogForm['sensorId']]?cache.sensors[dialogForm['sensorId']].minValue:''} - ${cache.sensors[dialogForm['sensorId']]?cache.sensors[dialogForm['sensorId']].maxValue:''}` }}</el-col>
                            <el-col
                                :span="5"
                            >偏差值: {{ cache.sensors[dialogForm['sensorId']]?cache.sensors[dialogForm['sensorId']].deviationValue:'' }}</el-col>
                            <el-col
                                :span="5"
                            >单位: {{ cache.sensors[dialogForm['sensorId']]?cache.sensors[dialogForm['sensorId']].unit:'' }}</el-col>
                        </el-row>
                    </el-col>-->
                    <el-form-item label="范围" prop="range" size="small">
                        <el-input
                            v-model="dialogForm['minValue']"
                            controls-position="right"
                            :controls="false"
                            clearable
                            style="width: 220px;"
                        ></el-input>
                        <span>-</span>
                        <el-input
                            v-model="dialogForm['maxValue']"
                            controls-position="right"
                            :controls="false"
                            clearable
                            style="width: 220px;"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="偏差值" prop="deviationValue" size="mini">
                        <el-input-number v-model="dialogForm['deviationValue']" :controls="false"></el-input-number>
                    </el-form-item>
                    <el-form-item label="单位" prop="unit" size="mini">
                        <el-input type="text" v-model="dialogForm['unit']" />
                    </el-form-item>
                    <el-form-item label="排序" prop="sort" size="mini">
                        <el-input-number v-model="dialogForm['sort']" :controls="false"></el-input-number>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit" size="small">确 定</el-button>
                <el-button @click="cancel" size="small">取 消</el-button>
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
import {
    BuiltinDialogOptions,
    FormOptions,
    SensorTableOptions,
    BuiltinTableOptions,
    SensorDialogOptions
} from "./collector.data";

export default {
    name: "firmware-collector",
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
            sensorOptions: [],
            /** 传感器类型选项 */
            sensorTypeOptions: [],
            /** 数据类型选项 */
            dataTypeOptions: [],
            current: {
                deptId: undefined
            },
            cache: {
                dataTypes: {},
                sensorTypes: {},
                sensors: {}
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
            options: SensorTableOptions,
            builtinOptions: BuiltinTableOptions,
            models: [],
            builtins: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {
                unit: "",
                minValue: null,
                maxValue: null,
                fieldName: null,
                fieldNameCn: null,
                deviationValue: null,
                productId: this.firmware.productId,
                sensorId: null,
                category: null
            },
            builtinDialogForm: {},
            sensorDialogOptions: SensorDialogOptions,
            builtinDialogOptions: BuiltinDialogOptions,
            dialogRules: {
                productFieldName: [
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
                                const count = this.models.filter(
                                    x =>
                                        x[field] === value &&
                                        (!this.dialogForm.productFieldId ||
                                            this.dialogForm.productFieldId !=
                                                x.productFieldId)
                                ).length;
                                console.log("#", field, count);
                                callback(
                                    count
                                        ? new Error("该数据标识已被添加")
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
                        trigger: "change"
                    }
                ],
                protocolFieldName: [
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
                                const count = this.models.filter(
                                    x =>
                                        x[field] === value &&
                                        (!this.dialogForm.productFieldId ||
                                            this.dialogForm.productFieldId !=
                                                x.productFieldId)
                                ).length;
                                console.log("#", field, count);
                                callback(
                                    count
                                        ? new Error("该协议标识已被添加")
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
                        trigger: "click,blur,change"
                    }
                ],
                sensorId: [
                    {
                        required: true,
                        message: "必选",
                        trigger: "click,blur,change"
                    },
                    {
                        validator: (rule, value, callback, source, options) => {
                            const field = rule.field;
                            if (!field) return callback();
                            console.log("validator", field, rule, value);
                            console.log(">>>", source, options);
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
                                console.log("#", field, count);
                                callback(
                                    count
                                        ? new Error("该传感器已被添加")
                                        : undefined
                                );
                            }
                        },
                        trigger: "change"
                    }
                ]
            },
            isDialogVisible: false,
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
            isParabuiltinVisible: false
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
        this.getTreeData();
        this.getDicts("sys_normal_disable").then(({ data }) => {
            this.statusOptions.push(
                ...data.map(x => ({
                    label: x.dictLabel,
                    value: x.dictValue
                }))
            );
            // let node = this.formOptions.find(x => x.prop === "status");
            // if (node) node.options = this.statusOptions;
            // node = this.dialogOptions.find(x => x.prop === "status");
            // if (node) node.options = this.statusOptions;
            // this.statusOptions = data.map(x => ({
            //     label: x.dictLabel,
            //     value: x.dictValue
            // }));
            // this.$forceUpdate();
        });
        this.$sensortype.get().then(({ rows }) => {
            this.cache.sensorTypes = rows.reduce(
                (p, c) => ((p[c.sensorTypeId] = c.sensorTypeName), p),
                {}
            );
            this.sensorTypeOptions = rows.map(x => ({
                label: x.sensorTypeName,
                value: x.sensorTypeId
            }));

            let node = this.sensorDialogOptions.find(
                x => x.prop === "sensorType"
            );
            if (node) node.options = this.sensorTypeOptions;
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
            let node = this.builtinDialogOptions.find(
                x => x.prop === "productDataType"
            );
            if (node) {
                node.options = this.dataTypeOptions;
                node.formatter = (row, column, index) => {
                    try {
                        return this.cache.dataTypes[row["productDataType"]];
                    } catch (error) {
                        return row["productDataType"];
                    }
                };
            }
        });

        this.search();
    },
    methods: {
        /** 查询用户列表 */
        search() {
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
            this.$product
                .getFieldsUploadByProductId({
                    productId: this.firmware.productId
                })
                .then(({ data, total }) => {
                    this.loading = false;
                    this.models = data;
                    this.pagination.all = total;
                });
        },
        /** 查询部门下拉树结构 */
        getTreeData() {
            //this.$area.treeselect()
            treeselect().then(response => {
                this.deptOptions = response.data;

                // let node = this.dialogOptions.find(x => x.prop === "deptId");
                // if (node) node.options = this.deptOptions;
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
            this.isDialogVisible = false;
            this.reset();
        },
        // 表单重置
        reset() {
            // this.form = {
            //     userId: undefined,
            //     deptId: 100,
            //     userName: undefined,
            //     nickName: undefined,
            //     password: undefined,
            //     phonenumber: undefined,
            //     email: undefined,
            //     sex: undefined,
            //     status: "0",
            //     remark: undefined,
            //     postIds: [],
            //     roleIds: []
            // };
            this.dialogForm = {
                sourceType: "0",
                minValue: null,
                maxValue: null,
                deviationValue: null,
                unit: ""
            };
            // this.resetForm("form");
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
            if (category === "parabuiltins") {
                this.isParabuiltinVisible = true;
                this.current.node = data;
            }
        },
        /** 新增按钮操作 */
        handleAdd({ category }) {
            this.dialogForm = {
                sourceType: "0",
                productId: this.firmware.productId,
                unit: ""
            };
            this.sensorOptions = [];
            this.isDialogVisible = true;
            this.title = "添加上传数据";
            this.$refs.frm && this.$refs.frm.clearValidate();
        },
        /** 修改按钮操作 */
        async handleUpdate(node) {
            let { data } = await this.$product.getFieldsUpload({
                productFieldId: node.productFieldId
            });
            this.dialogForm = Object.assign({}, data, {
                sensorType: Number(data.sensorType)
            });
            this.sensorOptions = [];
            this.isDialogVisible = true;
            this.title = "修改上传数据";
            this.change({
                category: "sensorType",
                value: data.sensorType
            });
            this.$refs.frm && this.$refs.frm.clearValidate();
        },
        submit() {
            this.$refs["frm"].validate(valid => {
                if (valid) {
                    this.$refs["frm"].clearValidate();
                    this.submitForm();
                }
            });
        },
        /** 提交按钮 */
        submitForm() {
            let sensor = this.cache.sensors[this.dialogForm["sensorId"]];
            const params = Object.assign({}, this.dialogForm, {
                productId: this.firmware.productId,
                type: 1
            });
            if (this.dialogForm.productFieldId == null) {
                this.$product.addFieldsUpload(params).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("添加成功");
                        this.isDialogVisible = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            } else {
                this.$product.updateFieldsUpload(params).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.isDialogVisible = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(node) {
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    return this.$product.removeFieldsUpload({
                        // productId: this.firmware.productId,
                        ids: [node.productFieldId]
                    });
                })
                .then(() => {
                    this.search();
                    this.msgSuccess("删除成功");
                })
                .catch(function(e) {
                    console.error(e);
                });
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
        change({ category, value }) {
            if (category === "sensorType") {
                this.$sensor
                    .getSensorsByTypeId({ sensorTypeId: value })
                    .then(({ data }) => {
                        this.cache.sensors = data.reduce(
                            (p, c) => ((p[c.sensorId] = c), p),
                            {}
                        );
                        let options = data.map(x => ({
                            label: x.sensorName,
                            value: x.sensorId
                        }));
                        this.sensorOptions = options;
                        let node = this.sensorDialogOptions.find(
                            x => x.prop === "sensorId"
                        );
                        if (node) {
                            node.options = options;
                        }
                    });
            }
            if (category === "sensorId") {
                const sensor = this.cache.sensors[value];
                if (!sensor) return;
                this.dialogForm.minValue = sensor.minValue;
                this.dialogForm.maxValue = sensor.maxValue;
                this.dialogForm.productDataType = sensor.dataType;
                this.dialogForm.productFieldName = sensor.fieldName;
                this.dialogForm.productFieldNameCn = sensor.fieldNameCn;
                this.dialogForm.unit = sensor.unit || "";
                this.dialogForm.deviationValue = sensor.deviationValue;
            }
        },
        select(v) {
            this.handleSelectionChange(v);
        },
        swap() {
            // if(this.dialogForm['sourceType']){}

            this.dialogForm = {
                productId: this.firmware.productId,
                sourceType: this.dialogForm["sourceType"],
                unit: ""
            };
            this.$refs.frm && this.$refs.frm.clearValidate();
        }
    }
};
</script>