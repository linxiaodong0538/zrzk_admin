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
                            v-hasPermi="['system:user:add']"
                        >传感器数据</el-button>
                    </el-col>
                </el-row>

                <x-table
                    :options="sensorOptions"
                    :data="sensors"
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
                                @click="handleUpdate({ category: 'sensor', data: scope.row})"
                                v-hasPermi="['configuration:collector:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete({ category: 'sensor', data: scope.row})"
                                v-hasPermi="['configuration:collector:remove']"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </x-table>
            </el-col>
        </el-row>
        <el-row :gutter="0" style="margin-top: 20px;">
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
                            @click="handleAdd({ category: 'builtin' })"
                            v-hasPermi="['system:user:add']"
                        >设备运维数据</el-button>
                    </el-col>
                </el-row>

                <x-table
                    :options="builtinOptions"
                    :data="builtins"
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
                                @click="handleUpdate({ category: 'builtin', data: scope.row})"
                                v-hasPermi="['configuration:collector:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete({ category: 'builtin', data: scope.row })"
                                v-hasPermi="['configuration:collector:remove']"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </x-table>
            </el-col>
        </el-row>

        <!-- 添加或修改参数配置对话框 -->
        <x-dialog
            :title="title"
            :form="sensorDialogForm"
            :options="sensorDialogOptions"
            :rules="sensorDialogRules"
            :visible.sync="isSensorDialogVisible"
            :show-close="false"
            @callback="submitForm"
            append-to-body
            @change="handleDialogChange"
        >
            <template slot="range">
                <el-row :gutter="10" style="margin-bottom: 20px;">
                    <el-col
                        :span="5"
                        :offset="2"
                    >数据类型: {{ cache.sensors[sensorDialogForm['sensorId']]?cache.sensors[sensorDialogForm['sensorId']].dataType:'' }}</el-col>
                    <el-col
                        :span="5"
                    >范围: {{ `${cache.sensors[sensorDialogForm['sensorId']]?cache.sensors[sensorDialogForm['sensorId']].minValue:''} - ${cache.sensors[sensorDialogForm['sensorId']]?cache.sensors[sensorDialogForm['sensorId']].maxValue:''}` }}</el-col>
                    <el-col
                        :span="5"
                    >偏差值: {{ cache.sensors[sensorDialogForm['sensorId']]?cache.sensors[sensorDialogForm['sensorId']].deviationValue:'' }}</el-col>
                    <el-col
                        :span="5"
                    >单位: {{ cache.sensors[sensorDialogForm['sensorId']]?cache.sensors[sensorDialogForm['sensorId']].unit:'' }}</el-col>
                </el-row>

                <el-form-item label="应用范围" prop="range" size="small">
                    <el-input-number
                        v-model="sensorDialogForm['minValue']"
                        controls-position="right"
                        :controls="false"
                        clearable
                        style="width: 220px;"
                    ></el-input-number>
                    <span>-</span>
                    <el-input-number
                        v-model="sensorDialogForm['maxValue']"
                        controls-position="right"
                        :controls="false"
                        clearable
                        style="width: 220px;"
                    ></el-input-number>
                </el-form-item>
            </template>
        </x-dialog>
        <x-dialog
            :title="title"
            :form="builtinDialogForm"
            :options="builtinDialogOptions"
            :rules="builtinDialogRules"
            :visible.sync="isBuiltinDialogVisible"
            :show-close="false"
            @callback="submitForm"
            append-to-body
        >
            <el-form-item slot="measure" label="测量范围" prop="measure" size="small">
                <el-input-number
                    v-model="builtinDialogForm['minValue']"
                    controls-position="right"
                    :controls="false"
                    clearable
                    style="width: 220px;"
                ></el-input-number>
                <span>-</span>
                <el-input-number
                    v-model="builtinDialogForm['maxValue']"
                    controls-position="right"
                    :controls="false"
                    clearable
                    style="width: 220px;"
                ></el-input-number>
            </el-form-item>
        </x-dialog>
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
            sensorOptions: SensorTableOptions,
            builtinOptions: BuiltinTableOptions,
            sensors: [],
            builtins: [],
            /** table $ */
            /** dialog ^ */
            sensorDialogForm: {
                unit: "",
                minValue: null,
                maxValue: null,
                fieldName: null,
                fieldNameCn: null,
                deviationValue: null,
                productId: this.firmware.productId,
                sensorId: null
            },
            builtinDialogForm: {},
            sensorDialogOptions: SensorDialogOptions,
            builtinDialogOptions: BuiltinDialogOptions,
            sensorDialogRules: {
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
                                const count = this.sensors.filter(
                                    x =>
                                        x[field] === value &&
                                        (!this.sensorDialogForm
                                            .productFieldId ||
                                            this.sensorDialogForm
                                                .productFieldId !=
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
            builtinDialogRules: {
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
                            console.log("validator", field, rule, value);
                            console.log(">>>", source, options);
                            if (
                                value == "" ||
                                value == undefined ||
                                value == null
                            ) {
                                callback();
                            } else {
                                const count = this.builtins.filter(
                                    x =>
                                        x[field] === value &&
                                        (!this.builtinDialogForm
                                            .productFieldId ||
                                            this.builtinDialogForm
                                                .productFieldId !=
                                                x.productFieldId)
                                ).length;
                                console.log("#", field, count); 
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
                        trigger: "change"
                    }
                ]
            },
            isSensorDialogVisible: false,
            isBuiltinDialogVisible: false,
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
            if (node) node.options = this.dataTypeOptions;
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
                .getSensors({ productId: this.firmware.productId })
                .then(({ data, total }) => {
                    this.loading = false;
                    this.sensors = data;
                    this.pagination.all = total;
                });
            this.$product
                .getBuiltins({
                    productId: this.firmware.productId,
                    type: "1"
                })
                .then(({ data, total }) => {
                    this.loading = false;
                    this.builtins = data;
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
            this.open = false;
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
            this.sensorDialogForm = {
                minValue: null,
                maxValue: null,
                deviationValue: null,
                unit: null
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
            if (category === "sensor") {
                // this.reset();
                // this.getTreeData();
                // this.getPositions();
                // this.getRoles();
                this.sensorDialogForm = {
                    productId: this.firmware.productId,
                    unit: ""
                };
                this.isSensorDialogVisible = true;
                this.title = "添加传感器";
            }
            if (category === "builtin") {
                // this.reset();
                // this.getTreeData();
                // this.getPositions();
                // this.getRoles();
                this.builtinDialogForm = {
                    productId: this.firmware.productId,
                    unit: ""
                };
                this.isBuiltinDialogVisible = true;
                this.title = "添加运维数据";
            }
        },
        /** 修改按钮操作 */
        handleUpdate({ category, data }) {
            if (category === "sensor") {
                this.sensorDialogForm = Object.assign({}, data);
                this.isSensorDialogVisible = true;
                this.handleDialogChange({
                    category: "sensorType",
                    value: data.sensorType
                });
                this.title = "修改传感器";
                console.log(data);
            } else if (category === "builtin") {
                this.builtinDialogForm = Object.assign({}, data);
                this.isBuiltinDialogVisible = true;
                this.title = "修改运维数据";
            }
        },
        /** 提交按钮 */
        submitForm() {
            if (this.isSensorDialogVisible) {
                let sensor = this.cache.sensors[
                    this.sensorDialogForm["sensorId"]
                ];
                const params = Object.assign({}, this.sensorDialogForm, {
                    dataName: sensor.dataName,
                    dataType: sensor.dataType
                });
                if (this.sensorDialogForm.productSensorId == null) {
                    this.$product.addSensor(params).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess("添加传感器成功");
                            this.isSensorDialogVisible = false;
                            this.search();
                        } else {
                            this.msgError(response.msg);
                        }
                    });
                } else {
                    this.$product.updateSensor(params).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess("修改传感器成功");
                            this.isSensorDialogVisible = false;
                            this.search();
                        } else {
                            this.msgError(response.msg);
                        }
                    });
                }
            } else if (this.isBuiltinDialogVisible) {
                const params = Object.assign({}, this.builtinDialogForm, {
                    type: 1
                });
                if (params.productFieldId == null) {
                    this.$product.addBuiltin(params).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess("添加运维数据成功");
                            this.isBuiltinDialogVisible = false;
                            this.search();
                        } else {
                            this.msgError(response.msg);
                        }
                    });
                } else {
                    this.$product.updateBuiltin(params).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess("修改运维数据成功");
                            this.isBuiltinDialogVisible = false;
                            this.search();
                        } else {
                            this.msgError(response.msg);
                        }
                    });
                }
            }
        },
        /** 删除按钮操作 */
        handleDelete({ category, data }) {
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    if (category === "sensor") {
                        return this.$product.removeSensor({
                            // productId: this.firmware.productId,
                            ids: [data.productSensorId]
                        });
                    } else if (category === "builtin") {
                        return this.$product.removeBuiltin({
                            type: 1,
                            ids: [data.productFieldId]
                        });
                    }
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
        handleDialogChange({ category, value }) {
            if (category === "sensorType") {
                this.$sensor
                    .getSensorsByTypeId({ sensorTypeId: value })
                    .then(({ data }) => {
                        this.cache.sensors = data.reduce(
                            (p, c) => ((p[c.sensorId] = c), p),
                            {}
                        );
                        let sensors = data.map(x => ({
                            label: x.sensorName,
                            value: x.sensorId
                        }));
                        let node = this.sensorDialogOptions.find(
                            x => x.prop === "sensorId"
                        );
                        if (node) {
                            node.options = sensors;
                        }
                    });
            }
            if (category === "sensorId") {
                const sensor = this.cache.sensors[value];
                if (!sensor) return;
                this.sensorDialogForm.minValue = sensor.minValue;
                this.sensorDialogForm.maxValue = sensor.maxValue;
                this.sensorDialogForm.fieldName = sensor.fieldName;
                this.sensorDialogForm.fieldNameCn = sensor.fieldNameCn;
                this.sensorDialogForm.unit = sensor.unit;
                this.sensorDialogForm.deviationValue = sensor.deviationValue;
            }
        },
        select(v) {
            this.handleSelectionChange(v);
        }
    }
};
</script>