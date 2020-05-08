<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="6" :xs="6">
                <el-tree
                    :data="deptOptions"
                    :filter-node-method="filterNode"
                    :isFilterable="true"
                    :expand-on-click-node="false"
                    :default-expand-all="true"
                    @node-click="handleNodeClick"
                >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span class="tree-tools">
                            <i
                                v-if="!data.isRoot"
                                class="el-icon-edit"
                                @click="pinTree({ category: 'edit', node, data })"
                            ></i>
                            <i
                                class="el-icon-circle-plus-outline"
                                @click="pinTree({ category: 'add', node, data })"
                            ></i>
                            <i
                                v-if="!data.isRoot"
                                class="el-icon-remove-outline"
                                @click="pinTree({ category: 'delete', node, data })"
                            ></i>
                            <!-- <i class="el-icon-rank"></i> -->
                            <!-- <el-button type="text" size="mini" @click="() => append(data)">Append</el-button>
                            <el-button
                                type="text"
                                size="mini"
                                @click="() => remove(node, data)"
                            >Delete</el-button>-->
                        </span>
                    </span>
                </el-tree>
            </el-col>
            <!--用户数据-->
            <el-col :span="18" :xs="18">
                <x-form
                    :options="formOptions"
                    :form="formData"
                    :rules="formRules"
                    labelWidth="100px"
                    @callback="search"
                ></x-form>

                <el-row :gutter="10" class="mb8">
                    <el-col v-if="!current.groupId" :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-connection"
                            size="mini"
                            plain
                            @click="handleDistribute()"
                            :disabled="multiple"
                            v-hasPermi="['configuration:deviceGroup:add']"
                        >批量分组</el-button>
                    </el-col>
                    <el-col v-else :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-delete"
                            size="mini"
                            plain
                            @click="handleRemoveDistribute"
                            :disabled="multiple"
                            v-hasPermi="['configuration:deviceGroup:add']"
                        >批量移出分组</el-button>
                    </el-col>
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleDistribute"
                            v-hasPermi="['configuration:deviceGroup:edit']"
                        >修改</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                            v-hasPermi="['configuration:deviceGroup:remove']"
                        >删除</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-upload2"
                            size="mini"
                            plain
@click="handleImport"
                            v-hasPermi="['configuration:deviceGroup:import']"
                        >导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-download"
                            size="mini"
                            plain
                            @click="handleExport"
                            v-hasPermi="['configuration:deviceGroup:export']"
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
                                icon="el-icon-connection"
                                @click="handleDistribute(scope.row)"
                                v-hasPermi="['configuration:deviceGroup:edit']"
                            >修改分组</el-button>
                            <el-button
                                v-if="current.groupId"
                                size="mini"
                                type="text"
                                icon="el-icon-connection"
                                @click="handleRemoveDistribute(scope.row)"
                                v-hasPermi="['configuration:deviceGroup:remove']"
                            >删除分组</el-button>
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
            <div
                v-if="ids.length"
                style="text-align: center; margin-bottom: 15px;"
            >{{ '已选择' + ids.length + '台设备' }}</div>

            <el-form-item label="分配至" prop="groupIds" size="small">
                <el-cascader
                    v-model="dialogForm['groupIds']"
                    :options="deptOptions"
                    @change="unique"
                    :props="{ value: 'id', multiple: true, emitPath: false,checkStrictly: true  }"
                ></el-cascader>
            </el-form-item>
        </x-dialog>

        <x-dialog
            :visible.sync="isTreeOperateVisible"
            :title="treeTitle"
            :form="treeForm"
            :options="treeOptions"
            :rules="treeRules"
            @callback="saveTree"
        ></x-dialog>
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
import { listPost } from "@/api/system/post";
import { listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { XTable, XForm, XTree, XDialog } from "@/components";
import { Paginator } from "@/dtos/paginator";
import moment from "moment";
import {
    DialogOptions,
    FormOptions,
    TableOptions,
    TreeOptions
} from "./options.data";

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
            treeTitle: "",
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
            productTypeOptions: [],
            // 岗位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
            current: {
                groupId: undefined
            },
            /** 缓存 */
            cache: {
                tree: {},
                /** 旧的选中分组 */
                links: []
            },
            // 表单参数
            form: {},
            defaultProps: {
                children: "children",
                label: "label"
            },
            projects: [],
            /** form ^ */
            /** 查询参数 */
            formData: {},
            formOptions: FormOptions,
            formRules: {},
            /** form $ */
            /** table ^ */
            pagination: new Paginator(),
            options: [
                { prop: "deviceCode", label: "设备编码" },
                { prop: "productName", label: "产品名称" },
                { prop: "productTypeName", label: "产品类型" },
                {
                    prop: "deviceGroupRals",
                    label: "所在分组",
                    html: true,
                    formatter: this.mapping
                }
            ],
            models: [],
            /** table $ */
            /** dialog ^ */
            dialogForm: {
                ids: undefined
            },
            dialogOptions: [], //DialogOptions,
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
                groupId: [
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
            treeOptions: TreeOptions,
            treeForm: {
                id: "",
                parentId: "",
                label: ""
            },
            treeRules: {
                groupName: [
                    {
                        required: true,
                        message: "必填",
                        trigger: "blur"
                    }
                ]
            },
            /** view detail ^ */
            isDetailVisible: false,
            isTreeOperateVisible: false
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

        this.$producttype.get().then(({ rows }) => {
            this.productTypeOptions = rows.map(x => ({
                label: x.productTypeName,
                value: x.productTypeId
            }));
            let node = this.formOptions.find(x => x.prop === "productTypeId");
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
            // console.log("trigger search", this.formData);
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
                groupId: this.current.groupId,
                startDate: start,
                endDate: end
            });
            delete params.dateRange;
            this.loading = true;
            this.$organization.search(params).then(
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
            this.$organization.treeselect().then(({ data }) => {
                data.splice(0, 0, { id: "", label: "全部" });
                data[0] && (data[0].isRoot = true);
                this.cache.tree = this.calculate(data, {}); // data.reduce((p, c) => ((p[c.id] = c), p), {});
                // console.log("tree", this.cache.tree);
                this.deptOptions = data;
                console.log(this.deptOptions);

                let node = this.dialogOptions.find(x => x.prop === "groupId");
                if (node) node.options = this.deptOptions;
                // let node = this..find(x => x.prop === "groupId");
                // if (node) node.options = this.deptOptions;
            });
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
            this.current.groupId = data.id;
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
                groupId: 100,
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
            // console.log();
            this.isDetailVisible = true;
            this.current.node = data;
        },
        /** 新增按钮操作 */
        handleDistribute(row) {
            this.dialogForm = {
                deviceIds:
                    row && row.deviceId ? [row.deviceId] : this.ids || [],
                groupIds: []
            };
            if (row && row.deviceId) {
                this.dialogForm.groupIds = (row.deviceGroupRals || [])
                    .map(x => Number(x.groupId))
                    .filter(x => Boolean(x));
            }
            this.cache.links = this.dialogForm.groupIds.slice();
            console.log("groupids", this.dialogForm.groupIds, this.cache.links);
            this.dialogVisible = true;
            this.title = row && row.deviceId ? "修改分组" : "批量分组";
        },
        pinTree({ category, node, data }) {
            // console.log(category, node, data);
            switch (category) {
                case "add":
                    this.treeForm = {
                        parentId: data.id,
                        groupName: ""
                    };
                    this.treeTitle = "新增子分组";
                    this.isTreeOperateVisible = true;
                    break;
                case "edit":
                    this.treeForm = {
                        groupId: data.id,
                        groupName: data.label
                    };
                    this.treeTitle = "修改分组";
                    this.isTreeOperateVisible = true;
                    break;
                case "delete":
                    // this.treeTitle = "";
                    // this.isTreeOperateVisible = true;
                    this.handleTreeDelete(data);
                    break;
                default:
                    break;
            }
        },
        /** 提交按钮 */
        submitForm() {
            // console.log("submit", this.dialogForm);
            this.$organization.updateGroups(this.dialogForm).then(response => {
                if (response.code === 200) {
                    this.msgSuccess("操作成功");
                    this.dialogVisible = false;
                    this.search();
                } else {
                    this.msgError(response.msg);
                }
            });
        },
        saveTree() {
            if (this.treeForm.groupId != undefined) {
                this.$organization.update(this.treeForm).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("修改成功");
                        this.isTreeOperateVisible = false;
                        this.getTreeData();
                    } else {
                        this.msgError(response.msg);
                    }
                });
            } else {
                this.$organization.create(this.treeForm).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess("新增成功");
                        this.isTreeOperateVisible = false;
                        this.getTreeData();
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
                    // console.log("delete", userIds);
                    return this.$cover.remove({ ids: userIds });
                })
                .then(() => {
                    this.search();
                    this.msgSuccess("删除成功");
                })
                .catch(function() {});
        },
        /** 删除按钮操作 */
        handleTreeDelete(row) {
            // console.log("tree data", row);
            const ids = [row.id];
            this.$confirm("是否确认删除分组项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    // console.log("delete", ids);
                    return this.$organization.remove({ ids: ids });
                })
                .then(() => {
                    this.getTreeData();
                    this.msgSuccess("删除成功");
                })
                .catch(function() {});
        },
        handleRemoveDistribute(row) {
            let links = this.treelink(this.cache.tree[this.current.groupId]);
            const params = {
                deviceIds: row && row.deviceId ? [row.deviceId] : this.ids,
                groupIds: links
            };

            this.$confirm("确认删除从分组中移除设备?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    // console.log("delete", params);
                    return this.$organization.removeGroup(params);
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
                // console.log("file", file);
            };
            a.click();
        },
        select(v) {
            // console.log("select", v);
            this.handleSelectionChange(v);
        },
        unique(list) {
            console.log("unique", list, this.cache.links);
            if (list.length < this.cache.links.length) {
                this.cache.links = list;
                return;
            }
            let cur = list.find(x => !this.cache.links.includes(x));
            let bloodlines = this.treelink(this.cache.tree[cur]);
            console.log("lines", bloodlines);
            let pure = list.filter(x => !bloodlines.includes(x));
            this.cache.links = [...pure, cur];
            this.dialogForm.groupIds = [...pure, cur];
            return this.cache.links;
        },
        mapping(row, column, index) {
            let result = "";
            let property = column.property;
            if (property === "deviceGroupRals") {
                result = (row[property] || [])
                    .map(x => this.trace(this.cache.tree[x.groupId]))
                    .join(" ; ");

                // console.log("mapping ", result);
                // result = (row[property] || []).map(x => x.groupId);
            }
            return result;
        },
        trace(node, path = "") {
            if (!node) return path;
            if (node) {
                path = `${node.label}${path ? "/" + path : ""}`;
            }
            if (node.parentId != "0") {
                path = this.trace(this.cache.tree[node.parentId], path);
            }
            return path;
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
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.tree-tools > i {
    padding: 2px;
    border: solid 1px transparent;
    border-radius: 2px;
}
.tree-tools > i:hover {
    border: solid 1px sandybrown;
}
</style>