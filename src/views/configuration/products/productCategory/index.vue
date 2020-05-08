<template>
    <div class="xny-region">
        <div class="xny-search">
            <!-- v-model="deptName" -->
            <div class="xny-cover">
                <div class="xny-Manhole">
                    <span class="coverList">产品类型名称:</span>
                    <el-input
                        placeholder
                        size="small"
                        class="Manhole"
                        v-model="typeName"
                        clearable
                    />
                    <span class="coverList">创建时间:</span>
                    <el-date-picker
                        v-model="beginTime"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd"
                        align="center"
                        size="small"
                        style="width: 240px;"
                        class="Manhole"
                    ></el-date-picker>
                    <!-- @click="handleQuery" -->
                    <!-- -->
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        class="coverSearch"
                        @click="search"
                    >搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </div>
            </div>
            <div class="coverForm">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            plain
                            @click="handleAdd"
                            v-hasPermi="['configuration:productCategory:add']"
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
                            v-hasPermi="['configuration:productCategory:edit']"
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
                            v-hasPermi="['configuration:productCategory:remove']"
                        >删除</el-button>
                    </el-col>
                    <!-- <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-upload2"
              size="mini"
              plain
              @click="handleImport"
              v-hasPermi="['configuration:productCategory:import']"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              plain
              @click="handleExport"
              v-hasPermi="['configuration:productCategory:export']"
            >导出</el-button>
                    </el-col>-->
                </el-row>
                <!-- v-loading="loading" -->
                <el-table :data="typeList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="产品类型名称" align="center" prop="productTypeName" />
                    <el-table-column label="备注" align="center" prop="remark" />
                    <el-table-column label="创建日期" min-width="160" align="center" prop="createTime" />
                    <el-table-column label="操作" min-width="100">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['configuration:productCategory:edit']"
                            >修改</el-button>

                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['configuration:productCategory:remove']"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- @pagination="getList" -->
                <pagination
                    v-show="total>0"
                    :total="total"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    @pagination="2"
                />
            </div>
        </div>
        <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="产品类型名称: " prop="productTypeName">
                    <el-input
                        v-model="form.productTypeName"
                        placeholder="类型名称"
                        class="Manhole"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="deviceSensorTypeAdd">确 定</el-button>
                <el-button @click="open = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    deviceSensorType,
    search,
    deviceSensorTypeDelete,
    validate,
    deviceSensorTypeAdd,
    getType,
    updateType
} from "@/api/product/productCategory.js";
import { treeselect } from "@/api/system/dept";
import moment from "moment";
export default {
    components: {},
    data() {
        return {
            // 区域/分组
            fla: 0,
            //导航栏
            navBAr: 0,
            //设备ID:
            typeName: "",
            typeName1: "",
            //部件编号:
            defaultGateway: "",
            // 部门树选项
            deptOptions: [],
            deptOptions: [],

            defaultProps: {
                children: "children",
                label: "label"
            },
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
            // 井盖管理数据
            typeList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 状态数据字典
            statusOptions: [],
            // 日期范围
            dateRange: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10
            },
            //新增区域传参
            management: {
                id: "",
                label: ""
            },
            //分组传参
            managementGrouping: {
                id: "",
                label: ""
            },
            //备注
            textarea: "",
            //创建时间
            beginTime: "",
            pickerOptions: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                productTypeName: [
                    { required: true, message: "必填", trigger: "blur" },
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
                                    id: this.form.productTypeId,
                                    name: value
                                };
                                const { data } = await validate(params);
                                callback(
                                    data
                                        ? new Error("产品类型名称已被使用")
                                        : undefined
                                );
                            }
                        },
                        trigger: "blur"
                    }
                ]
            }
        };
    },

    mounted() {
        //   console.log(this.typeList.length);
        //井盖表格所有数据
        // this.getList();
        this.deviceSensorType();
        this.getDicts("sys_normal_disable").then(response => {
            this.statusOptions = response.data;
        });
    },
    methods: {
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.deptId = data.id;
            this.management.id = data.id;
            this.management.label = data.label;
            //   this.getList();
        },
        handleNodeClick1(data) {
            this.queryParams.deptId = data.id;

            this.managementGrouping.id = data.id;
            this.managementGrouping.label = data.label;
            //   this.getList();
        },
        deviceSensorType() {
            deviceSensorType().then(res => {
                console.log(res);

                this.typeList = res.rows;
                this.total = res.total;
            });
        },
        /** 重置按钮操作 */
        resetQuery() {
            //   this.dateRange = [];
            //   this.resetForm("queryForm");
            //   this.handleQuery();
        },
        //表单
        /** 查询 */
        search() {
            let productTypeName = this.typeName;
            let startDate =
                this.beginTime && this.beginTime[0]
                    ? moment(this.beginTime[0]).format("YYYY-MM-DD")
                    : undefined;
            let endTime =
                this.beginTime && this.beginTime[1]
                    ? moment(this.beginTime[1]).format("YYYY-MM-DD")
                    : undefined;
            let pageNum = this.queryParams.pageNum;
            let pageSize = this.queryParams.pageSize;
            let data = {
                productTypeName,
                startDate,
                endTime,
                pageNum,
                pageSize
            };
            search(data).then(response => {
                // console.log(response);
                this.typeList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },

        //添加
        deviceSensorTypeAdd() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.productTypeId != undefined) {
                        updateType(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess("修改成功");
                                this.open = false;
                                this.search();
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                    } else {
                        let productTypeName = this.form.productTypeName;
                        let remark = this.form.remark;
                        let data = {
                            productTypeName,
                            remark
                        };
                        deviceSensorTypeAdd(data).then(res => {
                            if (res.code === 200) {
                                this.msgSuccess("新增成功");
                                this.open = false;
                                this.search();
                            } else {
                                this.msgError(res.msg);
                            }
                        });
                    }
                }
            });
        },

        // 字典状态字典翻译
        statusFormat(row, column) {
            return this.selectDictLabel(this.statusOptions, row.status);
        },

        // 表单重置
        reset() {
            this.form = {
                productTypeId: undefined,
                productTypeName: undefined,
                dictType: undefined,
                status: "0",
                remark: undefined
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            //   this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            // console.log(selection);
            this.ids = selection.map(item => item.sensorTypeId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "新增传感器类型";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id =
                row && row.productTypeId ? row.productTypeId : this.ids[0];
            getType(id).then(res => {
                console.log(res);
                this.form = res.data;
                console.log(this.form);
                this.open = true;
                this.title = "修改传感器";
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids =
                row && row.productTypeId ? [row.productTypeId] : this.ids;
            this.$confirm("是否确认删除数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    // console.log("delete", ids);
                    return deviceSensorTypeDelete({ ids: ids });
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
            console.log(queryParams);

            this.$confirm("是否确认导出所有类型数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(function() {
                    return exportType(queryParams);
                    console.log(exportType(queryParams));
                })
                .then(response => {
                    this.download(response.msg);
                })
                .catch(function() {});
        },
        mapping(row, column, index) {
            let result = "";
            const property = column.property;
            if (["timestamp", "createTime"].includes(property)) {
                // console.log("key", property, row[property]);
                window.moment = moment;
                // result = moment(row[property]).format("YYYY-MM-DD HH:mm:ss");
            }
            return result;
        }
    }
};
</script>
<style lang="scss" scoped>
// F3F3F4
.xny-region {
    height: calc(100vh - 84px);
    width: 100%;
    background-color: #f3f3f4;
}
.Navigation {
    margin: 5px 0;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    background-color: #fff;
    .Monitor,
    .History {
        cursor: pointer;
        display: inline-block;
        padding: 0 15px;
    }
    .Monitor {
        margin-left: 20px;
    }

    //   1890FF
}
// 点击高亮
.xny_highlight {
    color: #1890ff;
    border-bottom: 2px solid #1890ff;
}
.region {
    float: left;
    width: 210px;
    min-height: calc(100vh - 84px);
    background-color: #fff;
}
.box-header {
    width: 100%;
    height: 42px;
    padding: 12px 10px 2px 15px;
    .tabBackground,
    .tabBackground2 {
        float: left;
        font-size: 13px;
        padding-top: 7px;
        padding-bottom: 7px;
        padding-right: 10px;
        border: 1px solid #e5e5e5;
        cursor: pointer;
        padding-left: 10px;
    }
}
.tabBackgrounddefault {
    background-color: #e5e5e5;
    border: 1px solid #e5e5e5;
    color: white;
    cursor: pointer;
}
.regionList {
    border-top: 1px solid #e5e5e5;
    margin-top: 15px;
}
.head-container {
    margin-left: 15px;
    margin-top: 15px;
}
.xny-search {
    width: 100%;
    // float: left;
    // width: calc(100% - 210px);
}
.xny-cover,
.coverForm {
    margin-left: 15px;
    margin-right: 20px;
    margin-top: 10px;
    padding: 5px 15px 13px 15px;
    background-color: #fff;
    border-radius: 8px;
    font-size: 13px;
}
.Manhole {
    width: 200px;
    height: 30px;
}
.textarea {
    width: 500px;
    vertical-align: top;
}
.xny-Manhole {
    margin-top: 10px;
}
.coverList {
    margin-left: 10px;
}
.coverSearch {
    margin-left: 20px;
}
//设备id样式
.viewData {
    color: #1c84c6;
    cursor: pointer;
}
//表单
.coverForm {
}
//新增井盖
</style>
<style >
.el-input--medium .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.el-input--small .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.managementList.el-input--small .el-input__inner {
    border-right: 0;
    border-radius: 4px 0 0 4px;
}
.managementList.el-input--small .el-input__inner:focus {
    border: 1px solid #dcdfe6;
    border-right: 0;
}
.el-select > .el-input {
    width: 200px;
}
.el-date-range-picker__time-header {
    display: none;
}
</style>