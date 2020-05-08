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
      <!-- v-model="deptName" -->
      <div class="xny-cover">
        <div class="xny-Manhole">
          <span class="coverList">所属项目:</span>
          <el-select v-model="value" placeholder  class="Manhole">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              size="small"
            ></el-option>
          </el-select>
          <span class="coverList">设备编号:</span>
            <el-input placeholder size="small" class="Manhole" v-model="gatewayName" />
            <span class="coverList">部件编号:</span>
            <el-input placeholder size="small" class="Manhole" v-model="defaultGateway" />
          <!-- @click="handleQuery" -->
          <!-- -->
          <el-button type="primary" icon="el-icon-search" size="mini" class="coverSearch">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </div>
      </div>
      <div class="coverForm">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:dict:export']"
            >导出</el-button>
          </el-col>
        </el-row>
        <!-- v-loading="loading" -->
        <el-table :data="typeList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="设备名称" align="center" prop="lanternsName" />
          <el-table-column label="设备编号" align="center" prop="controllerAddress" />
          <el-table-column label="区域" align="center" prop="onlineState" />
          <el-table-column label="部件编号" align="center" prop="deviceState" />
          <el-table-column label="运行状态" align="center" prop="alarmView" />
          <el-table-column label="在线状态" align="center" prop="processing" />
          <el-table-column label="剩余电量" align="center" prop="voltage" />
          <el-table-column label="信号强度" align="center" prop="current" />
          <el-table-column label="氧气（O2）" min-width="100" align="center" prop="activePower" />
          <el-table-column label="一氧化碳（CO）" align="center" prop="reactivePower" />
          <el-table-column label="甲烷（CH4）" min-width="100" align="center" prop="powerFactor" />
          <el-table-column label="二氧化硫（SO2）" align="center" prop="powerFactor" />
          <el-table-column label="硫化氢（H2S）" align="center" prop="powerFactor" />
          <el-table-column label="更新时间" align="center" prop="temperature" />
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
  </div>
</template>
<script>
//   wellGroup
import { region, coverForm } from "@/api/system/cover/coverManagement";
import { treeselect } from "@/api/system/dept";
export default {
  components: {},
  data() {
    return {
      // 区域/分组
      fla: 0,
      //导航栏
      navBAr: 0,
      //设备ID:
      gatewayName:'',
      //部件编号:
      defaultGateway:'',
      // 部门树选项
      deptOptions: [],
      deptOptions: [],

      defaultProps: {
        children: "children",
        label: "label"
      },
      //创建时间
      creationTime: "",
      options: [
        {
          value: "1",
          label: "所有"
        },
        {
          value: "2",
          label: "项目5"
        },
        {
          value: "3",
          label: "项目6"
        },
        {
          value: "4",
          label: "项目4"
        },
        {
          value: "5",
          label: "项目3"
        }
      ],
      value: "所有",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      //   total: 0,
      total: 10,
      // 井盖管理数据
      typeList: [
       
      ],
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
    //   console.log(this.typeList.length);

    //区域
    this.getTreeselect();
    //井盖表格所有数据
    // this.getList();

    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 区域 */
    getTreeselect() {
      //   region().then(response => {
      //     this.deptOptions = response.data;
      //     this.management.id = this.deptOptions[0].id;
      //     this.management.label = this.deptOptions[0].label;
      //     console.log(this.management.id);
      //   });

      //这是静态页面的修改
      treeselect().then(response => {
        this.deptOptions = response.data;
        this.management.id = this.deptOptions[0].id;
        this.management.label = this.deptOptions[0].label;
        // console.log(this.management.id);
      });
    },
    //区域
    region() {
      this.fla = 0;
      //   region().then(response => {
      //     this.deptOptions = response.data;
      //     this.management.id = this.deptOptions[0].id;
      //     this.management.label = this.deptOptions[0].label;
      //   });
      //这是静态页面的修改
      treeselect().then(response => {
        this.deptOptions = response.data;
        this.management.id = this.deptOptions[0].id;
        this.management.label = this.deptOptions[0].label;
        // console.log(this.management.id);
      });
    },
    // 分组
    coverGroup() {
      this.fla = 1;
      //   wellGroup().then(response => {
      //     this.deptOptions = response.data;
      //     this.managementGrouping.id = this.deptOptions[0].id;
      //     this.managementGrouping.label = this.deptOptions[0].label;
      //   });
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
      //   this.dateRange = [];
      //   this.resetForm("queryForm");
      //   this.handleQuery();
    },
    //表单
    /** 查询井盖管理 */
    // getList() {
    //   //  //井盖编号
    //   // coverNumber: "",
    //   // //创建时间
    //   // creationTime:"",
    //   let areaId = this.management.id;
    //   let deviceGroupId = this.managementGrouping.id;
    //   let coverNumber = this.coverNumber;
    //   let creationTime = this.creationTime;
    //   this.loading = true;

    //   coverForm(this.addDateRange(this.queryParams, this.dateRange)).then(
    //     response => {
    //       // console.log(response);
    //       this.typeList = response.rows;
    //       this.total = response.total;
    //       this.loading = false;
    //     }
    //   );
    // },
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
      // console.log(selection);

      this.ids = selection.map(item => item.dictId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
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
  float: left;
  width: calc(100% - 210px);
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
.xny-Manhole {
  margin-top: 10px;
}
.coverList {
  margin-left: 10px;
}
.coverSearch {
  margin-left: 20px;
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
</style>