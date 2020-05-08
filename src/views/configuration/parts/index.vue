<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="4" :xs="24">
                <x-tree
                    :data="areaOptions"
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
                    labelWidth="68px"
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
                            v-hasPermi="['configuration:parts:add']"
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
                            v-hasPermi="['configuration:parts:edit']"
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
                            v-hasPermi="['configuration:parts:remove']"
                        >删除</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-upload2"
                            size="mini"
                            plain
                            @click="handleImport"
                            v-hasPermi="['configuration:parts:import']"
                        >导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-download"
                            size="mini"
                            plain
                            @click="handleExport"
                            v-hasPermi="['configuration:parts:export']"
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
                                v-hasPermi="['system:parts:query']"
                            >详情</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-timer"
                                @click="handleHistory(scope.row)"
                                v-hasPermi="['system:parts:log']"
                            >操作记录</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['configuration:parts:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['configuration:parts:remove']"
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
            @change="change"
            @focus="onListen"
        >
            <template slot-scope="scope">
                <el-col :span="24">
                    <div>自定义：</div>
                </el-col>
                <el-col :span="12" v-for="(f,i) in fields || []" :key="i">
                    <el-form-item
                        :label="f.partsFieldNameCn"
                        :prop="f.partsFieldName"
                        :key="f.partsFieldName"
                        :rules="fieldDataRules[f.dataType]||[]"
                        size="mini"
                    >
                        <el-input v-model="scope.data[f.partsFieldName]">
                            <template slot="append">{{f.unit}}</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </template>
        </x-dialog>

        <el-dialog
            :visible.sync="isDetailVisible"
            :close-on-click-modal="false"
            width="70vw"
            title="部件详情"
        >
            <configuration-parts-detail :data="current.node"></configuration-parts-detail>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="isDetailVisible = false">关 闭</el-button>
            </span>
        </el-dialog>

        <el-dialog
            :visible.sync="isHistoryVisible"
            :close-on-click-modal="false"
            width="70vw"
            title="操作记录"
        >
            <configuration-parts-history :data="current.node"></configuration-parts-history>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="isHistoryVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="isBaiduMapDialogVisible" :append-to-body="true">
            <template>
                <el-amap
                    vid="amap"
                    ref="amap"
                    :zoom="zoom"
                    :center="center"
                    class="amap-demo"
                    :events="events"
                    style="height:50vh"
                    :plugin="plugin"
                >
                    <el-amap-marker
                        v-if="center && center.length"
                        :position="center"
                        :events="{ dragend: pick }"
                        :draggable="true"
                    ></el-amap-marker>
                </el-amap>
                <!-- <baidu-map
                    class="bm-view"
                    :center="anchor"
                    :zoom="16"
                    style="width: 100%; height: 50vh;"
                    ak="k1gYhyr8h8ksQN63Z1Mu0xNuhiZCr157"
                    :scroll-wheel-zoom="true"
                    :double-click-zoom="false"
                    @click="pick"
                    >
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                    <bm-view style="width: 100%; height:100%; flex: 1"></bm-view>
                    <bm-marker
                        v-if="current.point['lng'] && current.point['lat']"
                        :position="{lng: current.point['lng'], lat: current.point['lat'] }"
                        :dragging="true"
                        @dragend="pick"
                        animation="1BMAP_ANIMATION_BOUNCE"
                    >
                    </bm-marker>
                </baidu-map>-->
            </template>
            <div slot="footer" class="dialog-footer">
                <div style="float: left;">
                    <span>经度： {{ current.point['lng'] }}</span>
                    <span style="margin-left: 20px;">纬度： {{ current.point['lat'] }}</span>
                </div>
                <br />
                <div style="float: left;">
                    <span>地址： {{ current.addr }}</span>
                </div>
                <el-button
                    type="primary"
                    @click="pin({ point: current.point, addr: current.addr })"
                >确 定</el-button>
                <el-button @click="isBaiduMapDialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
            <span>部件主类</span>
            <el-select
                v-model="partsMainClassValue"
                placeholder="请选择"
                class="Manhole"
                size="small"
                @change="partsMain"
            >
                <el-option
                    v-for="item in clusterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <span class="xny_productName">部件子类</span>
            <el-select v-model="productNameValue" placeholder="请选择" class="Manhole" size="small">
                <el-option
                    v-for="item in productName"
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
                <div class="el-upload__tip" slot="tip">
                    <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
                    <!-- <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link> -->
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
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { XTable, XForm, XTree, XDialog, XOrg } from "@/components";
import { Paginator } from "@/dtos/paginator";
import moment from "moment";
import { DialogOptions, FormOptions } from "./options.data";
import { FieldDataRules } from "@/dtos/constants";
import ConfigurationPartsHistory from "./history.vue";
import ConfigurationPartsDetail from "./detail.vue";
import { getToken } from "@/utils/auth";
import { partsImportTemplate, partsExport } from "@/api/homePage/parts.js";
export default {
    components: {
        XTable,
        XForm,
        XTree,
        XDialog,
        XOrg,
        ConfigurationPartsDetail,
        ConfigurationPartsHistory
    },
    data() {
        return {
            zoom: 12,
            center: [119.32842, 26.08135],
            events: {
                click: e => {
                    console.log(e);

                    const { lng, lat } = e.lnglat;

                    if (lng && lat) {
                        this.center = [lng, lat];
                        this.current.point = { lng, lat };

                        // 通过经纬度获取地址
                        var geocoder = new AMap.Geocoder({
                            radius: 1000,
                            extensions: "all"
                        });
                        geocoder.getAddress(this.center, (status, result) => {
                            if (status === "complete" && result.info === "OK") {
                                if (result && result.regeocode) {
                                    this.current.addr =
                                        result.regeocode.formattedAddress;
                                    this.$nextTick();
                                }
                            }
                        });
                    }
                }
            },

            plugin: [
                {
                    pName: "Geolocation",
                    events: {
                        // init(o) {
                        //   // o 是高德地图定位插件实例
                        //   o.getCurrentPosition((status, result) => {
                        //     if (result && result.position) {
                        //       self.current.point.lng = result.position.lng;
                        //       self.current.point.lat = result.position.lat;
                        //       self.center = [
                        //         self.current.point.lng,
                        //         self.current.point.lat
                        //       ];
                        //       self.current.addr = result.formattedAddress;
                        //       self.loaded = true;
                        //       self.$nextTick();
                        //     }
                        //   });
                        // }
                    }
                }
            ],
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
            areaOptions: undefined,
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
            /** 区域选项 */
            areaOptions: [],
            /** 部件大类 */
            clusterOptions: [],
            /** 自定义字段 */
            fields: [],
            fieldDataRules: FieldDataRules,
            //部件子类
            partsTypeOptions: [],
            current: {
                node: {},
                point: {},
                areaId: undefined,
                groupId: undefined,
                addr: ""
            },
            cache: {
                areas: {},
                categories: {},
                parentType: {}
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
                partsTypeId: null
            },
            formOptions: FormOptions,
            formRules: {},
            categories: [],
            /** form $ */
            /** table ^ */
            pagination: new Paginator(),
            options: [
                { prop: "partsCode", label: "部件编号" },
                { prop: "parentName", label: "部件主类" },
                { prop: "partsTypeName", label: "部件子类" },
                { prop: "partsName", label: "部件名称" },
                { prop: "rfid", label: "智慧标签" },
                { prop: "areaName", label: "所在区域" },
                { prop: "longitude", label: "经度" },
                { prop: "latitude", label: "纬度" },
                {
                    prop: "project",
                    label: "关联项目",
                    formatter(row, column, index) {
                        return (row[column.property] || [])
                            .map(x => x.projectName)
                            .join(",");
                    }
                },
                { prop: "createTime", label: "创建日期" }
            ],
            models: [],
            /** 操作记录 */
            histories: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {},
            dialogOptions: DialogOptions,
            dialogRules: {
                // partsName: [
                //     {
                //         required: true,
                //         message: "必填",
                //         trigger: "blur"
                //     },
                //     {
                //         validator: async (
                //             rule,
                //             value,
                //             callback,
                //             source,
                //             options
                //         ) => {
                //             const field = rule.field;
                //             if (!field) return callback();
                //             if (
                //                 value == "" ||
                //                 value == undefined ||
                //                 value == null
                //             ) {
                //                 callback();
                //             } else {
                //                 const params = {
                //                     id: this.dialogForm.partsId,
                //                     name: value
                //                 };
                //                 const { data } = await this.$parts.validate(
                //                     params
                //                 );
                //                 callback(
                //                     data ? new Error("名称已被使用") : undefined
                //                 );
                //             }
                //         },
                //         trigger: "blur"
                //     }
                // ],
                partsCode: [
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
                                    id: this.dialogForm.partsId,
                                    code: value
                                };
                                const { data } = await this.$parts.validate(
                                    params
                                );
                                callback(
                                    data ? new Error("编号已被使用") : undefined
                                );
                            }
                        },
                        trigger: "blur"
                    }
                ],
                // partsTypeId: [
                //     {
                //         required: true,
                //         message: "必选",
                //         trigger: "blur"
                //     }
                // ],
                // areaId: [
                //     {
                //         required: true,
                //         message: "必选",
                //         trigger: "change"
                //     }
                // ],
                // parentType: [
                //     {
                //         required: true,
                //         message: "必选",
                //         trigger: "change"
                //     }
                // ],
                rfid: [
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
                                    id: this.dialogForm.partsId,
                                    rfid: value
                                };
                                const { data } = await this.$parts.validate(
                                    params
                                );
                                callback(
                                    data
                                        ? new Error("智慧标签已被使用")
                                        : undefined
                                );
                            }
                        },
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
            isHistoryVisible: false,
            isBaiduMapDialogVisible: false,
            /** view detail $ */
            // 部件主类
            partsMainClassValue: "",
            // 部件子类
            productName: [],
            productNameValue: "",
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
                url: process.env.VUE_APP_BASE_API + "/parts/importData"
            },
            productNameData: {
                partsTypeId: ""
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
        this.getDicts("app_parts_cluster").then(({ data }) => {
            this.clusterOptions = data.map(x => ({
                label: x.dictLabel,
                value: x.dictValue
            }));
            this.cache.parentType = data.reduce(
                (p, c) => ((p[c.dictValue] = c.dictLabel), p),
                {}
            );
            let node = this.formOptions.find(x => x.prop === "parentType");
            if (node) node.options = this.clusterOptions;
            node = this.dialogOptions.find(x => x.prop === "parentType");
            if (node) node.options = this.clusterOptions;
            //   console.log(this.clusterOptions);
        });
        // this.$partstype.search({}).then(({ rows }) => {
        //     this.partsTypeOptions = rows.map(x => ({
        //         label: x.partsTypeName,
        //         value: x.partsTypeId
        //     }));
        //     let node = this.dialogOptions.find(x => x.prop === "partsTypeId");
        //     if (node) node.options = this.partsTypeOptions;
        //     node = this.formOptions.find(x => x.prop === "partsTypeId");
        //     if (node) node.options = this.partsTypeOptions;
        //     //   console.log(this.partsTypeOptions);
        // });

        this.projects = (this.$store.state.app.projects || []).map(x => ({
            label: x.projectName,
            value: x.projectId
        }));
        let node = this.formOptions.find(x => x.prop == "projectId");
        if (node) node.options = this.projects;
        node = this.dialogOptions.find(x => x.prop === "projectIds");
        if (node) node.options = this.projects;
    },
    computed: {
        anchor() {
            if (this.dialogForm.longitude && this.dialogForm.latitude) {
                return [this.dialogForm.longitude, this.dialogForm.latitude];
            }
            return [119.28, 26.08];
            // if (this.cache.areas[this.dialogForm.areaId]) {
            //     return this.cache.areas[this.dialogForm.areaId].label;
            // }
            // return "福州";
        }
    },
    methods: {
        /** 查询用户列表 */
        search() {
            // console.log("trigger search", this.formData);
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
            //   console.log(params);

            this.loading = true;
            this.$parts.search(params).then(
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
                this.areaOptions = data;
                console.log("areas", data);
                this.cache.areas = this.calculate(data);
                console.log("trree", this.cache.areas);
                let node = this.dialogOptions.find(x => x.prop === "areaId");
                if (node) node.options = this.areaOptions;
                // let node = this..find(x => x.prop === "areaId");
                // if (node) node.options = this.areaOptions;
            });
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick({ category, data }) {
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
            this.ids = selection.map(item => item.partsId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 查看按钮操作 */
        handleView(data) {
            this.isDetailVisible = true;
            this.current.node = data;
        },
        /** 查看历史操作记录 */
        handleHistory(data) {
            this.isHistoryVisible = true;
            this.current.node = data;
        },
        /** 新增按钮操作 */
        handleAdd(t) {
            this.dialogForm = {
                areaId: this.current.areaId
            };
            this.dialogVisible = true;
            this.title = "新增";
        },
        pick({ point }) {
            console.log("pick", point);
            this.current.point["lng"] = point.lng;
            this.current.point["lat"] = point.lat;
            const geoCoder = new BMap.Geocoder();
            // getLocation() 类--利用坐标获取地址的详细信息
            // getPoint() 类--获取位置对应的坐标
            geoCoder.getLocation(point, res => {
                console.log("获取经纬度", point, "获取详细地址", res);
                const { address } = res;
                this.current.addr = address;
                // const addrComponent = res.addressComponents
                // const surroundingPois = res.surroundingPois
                // const province = addrComponent.province
                // const city = addrComponent.city
                // const district = addrComponent.district
                // let addr = addrComponent.street
                // if (surroundingPois.length > 0 && surroundingPois[0].title) {
                //   if (addr) {
                //     addr += `-${surroundingPois[0].title}`
                //   } else {
                //     addr += `${surroundingPois[0].title}`
                //   }
                // } else {
                //   addr += addrComponent.streetNumber
                // }
                // that.choosedLocation = { province, city, district, addr, ...that.center }
            });
            this.current.addr = "";
        },
        pin({ point, addr }) {
            this.$set(this.dialogForm, "longitude", point.lng);
            this.$set(this.dialogForm, "latitude", point.lat);
            this.$set(this.dialogForm, "addr", addr);
            this.isBaiduMapDialogVisible = false;
        },
        /** 修改按钮操作 */
        async handleUpdate(row) {
            let id = row && row.partsId ? row.partsId : this.ids[0];
            let node = this.models.find(x => x.partsId == id);
            // if(node.longitude && node.latitude){
            //     this.center = [node.longitude, node.latitude];
            // }
            if (node.partsTypeId) {
                let { rows } = await this.$partstype.getFields({
                    id: node.partsTypeId
                });
                this.fields = rows;
                (node.partsFields || []).forEach(x => {
                    this.$set(node, x.partsFieldName, x.partsFieldValue);
                });
            }
            if (node.project && node.project.length) {
                node.projectIds = node.project.map(x => x.projectId);
            }

            if (node.parentType) {
                try {
                    let { rows } = await this.$partstype.getPartsTypeByParentId(
                        {
                            id: node.parentType
                        }
                    );
                    const list = rows.map(x => ({
                        label: x.partsTypeName,
                        value: x.partsTypeId
                    }));
                    let opt = this.dialogOptions.find(
                        x => x.prop === "partsTypeId"
                    );
                    if (opt) opt.options = list;
                } catch (error) {}
            }
            this.dialogForm = Object.assign({}, node);
            this.dialogVisible = true;
            this.title = "修改";
            this.$nextTick(() => {});
            // this.$forceUpdate();
        },
        /** 提交按钮 */
        submitForm: function() {
            console.log("submit", this.dialogForm);
            let params = Object.assign({}, this.dialogForm);
            let partsFields = (this.fields || []).map(x => {
                let f = (this.dialogForm.partsFields || []).find(
                    pf => pf.partsFieldName == x.partsFieldName
                );
                let node = {
                    partsFieldRalId: f ? f.partsFieldRalId : undefined,
                    partsFieldName: x.partsFieldName,
                    partsFieldNameCn: x.partsFieldNameCn,
                    dataType: x.dataType,
                    unit: x.unit,
                    partsTypeId: x.partsTypeId,
                    partsId: this.dialogForm.partsId,
                    partsFieldValue: params[x.partsFieldName]
                };
                delete params[x.partsFieldName];
                return node;
            });
            params.partsFields = partsFields;
            if (params.partsId != undefined) {
                this.$parts.update(params).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.dialogVisible = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            } else {
                this.$parts.create(params).then(response => {
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
            const ids = row && row.partsId ? [row.partsId] : this.ids;
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    return this.$parts.remove({ ids: ids });
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
            // console.log(queryParams);
            let start = this.formData.dateRange
                ? moment(this.formData.dateRange[0]).format("YYYY-MM-DD")
                : undefined;
            let end = this.formData.dateRange
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
            //   console.log(params);

            this.$confirm("是否确认导出所有部件列表数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(function() {
                    return partsExport(params);
                })
                .then(response => {
                    this.download(response.msg);
                })
                .catch(function() {});
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "部件列表导入";
            this.upload.open = true;
        },
        /** 下载模板操作 */
        importTemplate() {
            if (this.productNameValue == "") {
                this.$message({
                    message: "警告部件子类不能为空",
                    type: "warning"
                });
            } else {
                let partsTypeId = this.productNameValue;
                partsImportTemplate(partsTypeId).then(response => {
                    this.download(response.msg);
                });
            }
        },
        // 上传前的回调函数
        handleBefore(file) {
            const _vm = this;
            _vm.productNameData.partsTypeId = _vm.productNameValue;
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
            // this.getList();
            this.search();
        },
        // 提交上传文件
        submitFileForm() {
            if (this.productNameValue == "") {
                this.$message({
                    message: "警告部件子类不能为空",
                    type: "warning"
                });
            } else {
                this.$refs.upload.submit();
            }
        },
        select(v) {
            this.handleSelectionChange(v);
        },
        change({ category, value }) {
            if (category === "partsTypeId") {
                if (!value) this.fields = [];
                this.$partstype.getFields({ id: value }).then(({ rows }) => {
                    this.fields = rows;
                });
            }
            if (category === "parentType") {
                this.dialogForm.partsTypeId = null;
                this.fields = [];
                this.$partstype
                    .getPartsTypeByParentId({ id: value })
                    .then(({ rows }) => {
                        const list = rows.map(x => ({
                            label: x.partsTypeName,
                            value: x.partsTypeId
                        }));
                        let node = this.dialogOptions.find(
                            x => x.prop === "partsTypeId"
                        );
                        if (node) node.options = list;
                    });
            }
        },
        formChange({ category, value }) {
            if (category === "parentType") {
                if (!value) {
                    // this.formData.partsTypeId = null;
                    return;
                }
                this.$partstype
                    .getPartsTypeByParentId({ id: value })
                    .then(({ rows }) => {
                        this.formData.partsTypeId = null;
                        const list = rows.map(x => ({
                            label: x.partsTypeName,
                            value: x.partsTypeId
                        }));
                        let node = this.formOptions.find(
                            x => x.prop === "partsTypeId"
                        );
                        if (node) node.options = list;
                    });
            }
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
        onListen({ category, value }) {
            if (["longitude", "latitude"].includes(category)) {
                this.isBaiduMapDialogVisible = true;
                if (
                    this.dialogForm["longitude"] &&
                    this.dialogForm["latitude"]
                ) {
                    this.center = [
                        this.dialogForm["longitude"],
                        this.dialogForm["latitude"]
                    ];
                    this.current.point = {
                        lng: this.dialogForm["longitude"],
                        lat: this.dialogForm["latitude"]
                    };
                }
                this.current.addr = this.dialogForm["addr"];
            }
        },
        partsMain() {
            let value = this.partsMainClassValue;
            this.$partstype
                .getPartsTypeByParentId({ id: value })
                .then(({ rows }) => {
                    this.productName = rows.map(x => ({
                        label: x.partsTypeName,
                        value: x.partsTypeId
                    }));
                    this.productNameValue = "";
                    // console.log(this.productNameValue);
                    //  let node = this.productNameValue.find(x => x.prop === "partsTypeId");
                    //     if (node) node.options = this.productName;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.Manhole {
    width: 109px;
    height: 30px;
    margin-bottom: 20px;
}
.xny_productName {
    margin-left: 10px;
}
</style>