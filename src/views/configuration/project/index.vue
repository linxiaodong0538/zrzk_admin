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
                            v-hasPermi="['configuration:project:add']"
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
                            v-hasPermi="['configuration:project:edit']"
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
                            v-hasPermi="['configuration:project:remove']"
                        >删除</el-button>
                    </el-col>
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-upload2"
                            size="mini"
                            plain
                            @click="handleImport"
                            v-hasPermi="['configuration:project:import']"
                        >导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-download"
                            size="mini"
                            plain
                            @click="handleExport"
                            v-hasPermi="['configuration:project:export']"
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
                                v-hasPermi="['configuration:project:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['configuration:project:remove']"
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
            @focus="onListen"
        ></x-dialog>

        <el-dialog :visible.sync="isDetailVisible"></el-dialog>
        <el-dialog :visible.sync="isBaiduMapDialogVisible" :append-to-body="true">
            <template>
                <baidu-map
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
                    <bm-view style="width: 100%; height:100%; flex: 1" @click="pick"></bm-view>
                    <bm-marker
                        v-if="current.point['lng'] && current.point['lat']"
                        :position="{lng: current.point['lng'], lat: current.point['lat'] }"
                        :dragging="true"
                        @dragend="pick"
                        animation="1BMAP_ANIMATION_BOUNCE"
                    ></bm-marker>
                </baidu-map>
            </template>
            <div slot="footer" class="dialog-footer">
                <div style="float: left;">
                    <span>经度： {{ current.point['lng'] }}</span>
                    <span style="margin-left: 20px;">纬度： {{ current.point['lat'] }}</span>
                </div>
                <el-button type="primary" @click="pin({ point: current.point })">确 定</el-button>
                <el-button @click="isBaiduMapDialogVisible = false">取 消</el-button>
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
            /** 传感器列表 */
            sensorOptions: [],
            // 岗位选项
            postOptions: [],
            // 区域选项
            areaOptions: [],
            current: {
                deptId: undefined,
                point: {}
            },
            cache: {
                areas: {}
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
                dateRange: []
            },
            formOptions: FormOptions,
            formRules: {},
            /** form $ */
            /** table ^ */
            pagination: new Paginator(),
            options: [
                // { prop: "projectId", label: "ID" },
                { prop: "projectName", label: "项目名称" },
                { prop: "areaName", label: "项目区域" },
                { prop: "longitude", label: "经度" },
                { prop: "latitude", label: "纬度" },
                { prop: "remark", label: "备注" },
                { prop: "createTime", label: "创建日期" }
            ],
            models: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {},
            dialogOptions: DialogOptions,
            dialogRules: {
                areaId: [
                    { required: true, message: "必选", trigger: "change" }
                ],
                projectName: [
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
                            console.log("validator", field, rule, value);
                            console.log(">>>", source, options);
                            if (
                                value == "" ||
                                value == undefined ||
                                value == null
                            ) {
                                callback();
                            } else {
                                const params = {
                                    id: this.dialogForm.projectId,
                                    name: value
                                };
                                const { data } = await this.$project.validate(
                                    params
                                );

                                // const count = this.models.filter(
                                //     x =>
                                //         x[field] === value &&
                                //         (!this.dialogForm.projectId ||
                                //             this.dialogForm.projectId !=
                                //                 x.projectId)
                                // ).length;
                                callback(
                                    data
                                        ? new Error("项目名称已被使用")
                                        : undefined
                                );
                            }
                        },
                        trigger: "blur"
                    }
                ]
            },
            dialogVisible: false,
            isBaiduMapDialogVisible: false,
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
        this.$area.treeselect().then(({ data }) => {
            this.areaOptions = data;
            this.cache.areas = this.calculate(data);
            let node = this.dialogOptions.find(x => x.prop === "areaId");
            if (node) node.options = this.areaOptions;
        });
    },
    computed: {
        anchor() {
            if (this.dialogForm.longitude && this.dialogForm.latitude) {
                return {
                    lng: this.dialogForm.longitude,
                    lat: this.dialogForm.latitude
                };
            }
            if (this.cache.areas[this.dialogForm.areaId]) {
                return this.cache.areas[this.dialogForm.areaId].label;
            }
            return "福州";
        }
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
                startDate: start,
                endDate: end
            });
            delete params.dateRange;
            this.loading = true;
            this.$project.search(params).then(
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
        onListen({ category, value }) {
            if (["longitude", "latitude"].includes(category)) {
                console.log(category, "clicked");
                this.current.point = {
                    lng: this.dialogForm["longitude"],
                    lat: this.dialogForm["latitude"]
                };
                this.isBaiduMapDialogVisible = true;
            }
        },
        pin({ point }) {
            this.$set(this.dialogForm, "longitude", point.lng);
            this.$set(this.dialogForm, "latitude", point.lat);
            this.isBaiduMapDialogVisible = false;
        },
        pick({ point }) {
            // console.log(BMap, map, arguments);
            // this.center.lng = 116.404;
            // this.center.lat = 39.915;
            // this.zoom = 15;
            this.current.point["lng"] = point.lng;
            this.current.point["lat"] = point.lat;
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
            this.ids = selection.map(item => item.projectId);
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
            this.current.point = {};
            this.dialogForm = {};
            this.dialogVisible = true;
            this.title = "新增";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row && row.projectId ? row.projectId : this.ids[0];
            const node = this.models.find(x => x.projectId == id);
            this.dialogForm = Object.assign({}, node);
            this.dialogVisible = true;
            this.title = "修改";
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
        /** 提交按钮 */
        submitForm() {
            console.log("submit", this.dialogForm);
            if (this.dialogForm.projectId != undefined) {
                this.$project.update(this.dialogForm).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.dialogVisible = false;
                        this.search();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            } else {
                this.$project.create(this.dialogForm).then(response => {
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
            // const ids = this.ids || [row.projectId];
            const ids = row && row.projectId ? [row.projectId] : this.ids;
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    console.log("delete", ids);
                    return this.$project.remove({ ids: ids });
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

            this.$confirm("是否确认导出数据项?", "警告", {
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