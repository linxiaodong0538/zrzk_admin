<template>
  <div class="xny-region">
    <div class="region">
      <div class="box-header">
        <div class="tabBackground" :class="{tabBackgrounddefault:fla==0}" @click="region">区域</div>
        <div class="tabBackground2" :class="{tabBackgrounddefault:fla==1}" @click="coverGroup">分组</div>
      </div>
      <div v-show="fla == 0" class="regionList">
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </div>
      <div v-show="fla == 1" class="regionList">
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick1"
          />
        </div>
      </div>
    </div>

    <div class="xny-search">
      <x-form
        :options="formOptions"
        :form="formData"
        labelWidth="100px"
        @callback="search"
      ></x-form>
      <!-- <div class="xny-cover">
        <span class="coverList">所属项目:</span>
        <el-select v-model="value" placeholder>
          <el-option
            v-for="item in project"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId"
            size="small"
            class="Manhole"
          ></el-option>
        </el-select>

        <span class="coverList">产品类型:</span>
        <el-select v-model="value1" placeholder>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value1="item.value"
            size="small"
            class="Manhole"
          ></el-option>
        </el-select>

        <span class="coverList">产品名称:</span>
        <el-select v-model="value1" placeholder>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value1="item.value"
            size="small"
            class="Manhole"
          ></el-option>
        </el-select>
        <span class="coverList">设备编号:</span>
        <el-input placeholder size="small" class="Manhole"  v-model="equipmentNum"/>

        <el-button type="primary" icon="el-icon-search" size="mini" class="coverSearch">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </div>-->
      <div class="coverForm">
        <el-row :gutter="10" class="mb8">
          <el-col :span="4">
            <el-button type="primary" size="mini" @click="handleIssuedControl">下发控制</el-button>
            <el-button type="primary" size="mini" @click="handleSelectAll">全选</el-button>
          </el-col>
          <span>已选择{{ids.length}}台设备</span>
        </el-row>

        <x-table
          ref="multipleTable"
          :options="tableheader"
          :data="models"
          :pagination="pagination"
          :isSelectable="true"
          :isPaging="true"
          @page-change="search"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="viewData" @click="handleCurRowControl(scope.row)">下发控制</span>
            </template>
          </el-table-column>
        </x-table>

        <el-dialog title="下发控制" :visible.sync="dialogTableVisible" top="10vh">
          <el-row>
            <span>产品名称:</span>
            <el-select v-model="value2" placeholder disabled style="width:20vh">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="offset">已选择{{ids.length}}台设备</span>
          </el-row>
          <el-row class="table-wrap">
            <span class="title">下发参数</span>

            <el-table
              :data="issuedData"
              border
              class="teble"
              @selection-change="handleIssuedSelect"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="deviceFieldNameCn" label="数据名称" span="12"></el-table-column>
              <el-table-column prop="dataValue" label="数据值" span="12">
                <template slot-scope="scope">
                  <input type="text" class="input" v-model="scope.row.deviceFieldValue" />
                  <el-button size="mini" @click="handleDefaultValue(scope)">填入默认值</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
//
import {
  region,
  coverForm,
  wellGroup,
  items
} from "@/api/system/cover/coverManagement";
import { list, issuedData, submitControl } from "@/api/basic_data/strategy";
import { XTable, XForm } from "@/components";
import { treeselect } from "@/api/system/dept";
import { isRepeatKey } from "@/utils";
import { Paginator } from "@/dtos/paginator";

export default {
  components: { XTable,XForm },
  data() {
    return {
      equipmentNum: "",
      options: [],
      formOptions: [
        {
          prop: "projectId",
          label: "项目",
          type: "select",
          clearable: true,
          options: []
        },
        {
          prop: "productTypeId",
          label: "产品类型",
          type: "select",
          clearable: true,
          options: []
        },
        {
          prop: "projectId",
          label: "项目",
          type: "select",
          clearable: true,
          options: []
        },
        {
          prop: "productTypeId",
          label: "产品类型",
          type: "select",
          clearable: true,
          options: []
        }
      ],

      tableheader: [
        { prop: "deviceId", label: "设备编码" },
        { prop: "productName", label: "产品名称" },
        { prop: "productType", label: "产品类型" },
        { prop: "partsId", label: "部件编号" },
        { prop: "deviceName", label: "名称" },
        { prop: "onlineStatus", label: "在线状态" }
      ],
      formData:{},
      models: [],
      pagination: new Paginator(),
      //下发参数
      issuedData: [],
      //下发控制选中
      arrIssuedSelect: [],
      //表格选中的多选框
      arrSelection: [],
      value2: "",
      tableData: [],
      //显示下发控制框
      dialogTableVisible: false,
      // 区域/分组
      fla: 0,
      // 部门树选项
      deptOptions: [],
      deptOptions: [],
      //所属项目
      project: [],
      value: "所有",

      value1: "所有",
      defaultProps: {
        children: "children",
        label: "label"
      },
      //创建时间
      creationTime: "",

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,

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
        pageSize: 10,
        dictName: "",
        dictType: "",
        status: ""
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
      }
    };
  },

  mounted() {
    //区域
    this.getTreeselect();
    this.subordinate();
    //获取列表
    this.search();
  },

  methods: {
    /** 查询列表 */
    search() {
      let params = Object.assign(
        {},
        {
          pageNum: this.pagination.index,
          pageSize: this.pagination.size,
          page: this.pagination.index
        }
      );
      this.loading = true;
      list(params).then(({ rows, total }) => {
        this.loading = false;
        this.models = rows;
        this.pagination.all = total;
      });
    },

    //下发控制
    async handleIssuedControl() {
      if (!this.arrSelection.length) {
        return this.$message("请选择");
      }
      console.log(this.arrSelection);

      const arr = this.arrSelection.map(item => {
        return item.productName;
      });
      for (let item of arr) {
        if (arr[0] !== item) return this.$message("请选择相同的产品");
      }

      this.dialogTableVisible = true;
      this.value2 = this.arrSelection[0].productName;

      let res = await issuedData(this.arrSelection[0].productId);
      this.issuedData = res.data;
      this.issuedData2 = JSON.parse(JSON.stringify(res.data));
    },

    //全选
    handleSelectAll() {
      this.$refs.multipleTable.handleSelectAll();
    },
    /** 区域 */
    getTreeselect() {
      region().then(response => {
        this.deptOptions = response.data;
        this.management.id = this.deptOptions[0].id;
        this.management.label = this.deptOptions[0].label;
      });
    },
    //区域
    region() {
      this.fla = 0;
      region().then(response => {
        this.deptOptions = response.data;
        this.management.id = this.deptOptions[0].id;
        this.management.label = this.deptOptions[0].label;
      });
    },
    // 分组
    coverGroup() {
      this.fla = 1;
      wellGroup().then(response => {
        this.deptOptions = response.data;
        this.managementGrouping.id = this.deptOptions[0].id;
        this.managementGrouping.label = this.deptOptions[0].label;
      });
    },
    /**项目 */
    subordinate() {
      items().then(res => {
        this.project = res.rows;
      });
    },
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

    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },

    // 表单重置
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
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
      this.arrSelection = selection;
      this.ids = selection.map(item => item.dictId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    deviceInformation() {
      this.typeList.forEach(val => {
        let id = val.equipmentNumber;
        this.$router.push({ path: "/deviceDetails/" + id });
      });
    },

    //下发控制多选框变化
    handleIssuedSelect(selection) {
      this.arrIssuedSelect = selection;
    },
    //重置默认值
    handleDefaultValue(e) {
      this.issuedData[e.$index].deviceFieldValue = this.issuedData2[
        e.$index
      ].deviceFieldValue;
    },

    //当前行下发控制
    async handleCurRowControl(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      this.dialogTableVisible = true;
      this.value2 = row.productName;
      const res = await issuedData(row.productId);
      this.issuedData = res.data;
      this.issuedData2 = JSON.parse(JSON.stringify(res.data));
    },

    //提交
    async handleSubmit() {
      console.log(this.arrIssuedSelect);
      if (!this.arrIssuedSelect.length) {
        return this.$message("请选择");
      }

      const deviceIds = this.arrSelection.map(item => {
        return item.deviceId;
      });

      const data = {
        deviceFieldIssueds: this.arrIssuedSelect,
        deviceIds
      };
      let res = await submitControl(data);
      if (res.code == 200) {
        this.$message({
          message: "下发成功",
          type: "success"
        });
        this.$refs.multipleTable.clearSelection();
        this.dialogTableVisible = false;
      }
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
  float: left;
  width: calc(100% - 210px);
}
.xny-cover,
.coverForm {
  margin-left: 15px;
  margin-right: 20px;
  margin-top: 10px;
  // padding: 0px 15px 13px 0px;
  background-color: #fff;
  border-radius: 8px;
  font-size: 13px;
  line-height: 70px;
  .mb8 {
    padding-left: 10px;
    height: 60px;
    line-height: 60px;
  }
}
.Manhole {
  margin-bottom: 20px;
  width: 200px;
  height: 30px;
}
.offset {
  padding-left: 20px;
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
//新增井盖
</style>
<style  lang="scss" scoped>
.el-input--medium .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.el-input--small .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.el-input-number,
.el-select,
.el-cascader {
  width: 200px;
}
.managementList.el-input--small .el-input__inner {
  border-right: 0;
  border-radius: 4px 0 0 4px;
}
.managementList.el-input--small .el-input__inner:focus {
  border: 1px solid #dcdfe6;
  border-right: 0;
}

.el-table .el-table__header-wrapper th {
  text-align: center;
}
.el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
.table-wrap {
  .teble {
    margin-top: 6px;
  }
  .input {
    height: 100%;
    width: 60%;
    margin-right: 10px;
  }
}
</style>