<template>
  <div class="xny-region">
    <div class="xny-search">
      <!-- v-model="deptName" -->
      <div class="xny-cover">
        <div class="xny-Manhole">
          <span class="coverList">报警类型:</span>
          <el-select v-model="alarmTypeValue" placeholder class="Manhole">
            <el-option
              v-for="item in alarmType"
              :key="item.value"
              :label="item.dictLabel"
              :value="item.dictValue"
              size="small"
            ></el-option>
          </el-select>
          <span class="coverList">报警名称:</span>
          <el-input placeholder size="small" class="Manhole" v-model="alarmName" />
          <!-- <span class="coverList">所属项目:</span>
          <el-select v-model="projectValue" placeholder="全部" class="Manhole">-->
          <!-- <el-option
              v-for="item in project"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId"
              size="small"
            ></el-option>
          </el-select>-->
          <span class="coverList">产品:</span>
          <el-select
            v-model="productTypeOptionsValue"
            placeholder="产品类型"
            class="Manhole"
            @change="ImportproductType"
          >
            <el-option
              v-for="item in productTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              size="small"
              class="Manhole"
            ></el-option>
          </el-select>
          <el-select v-model="productNameValue" placeholder="产品名称" class="Manhole">
            <el-option
              v-for="item in ImportProductName"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              size="small"
              class="Manhole"
            ></el-option>
          </el-select>
          <span class="coverList">设备编号:</span>
          <el-input placeholder="全部" size="small" class="Manhole" v-model="deviceCode" clearable />
          <span class="coverList">报警时间:</span>
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
          <span class="coverList">处理状态:</span>
          <el-select v-model="processinStateValue" placeholder="全部" class="Manhole" clearable>
            <el-option
              v-for="item in processinState"
              :key="item.value"
              :label="item.dictLabel"
              :value="item.dictValue"
              size="small"
            ></el-option>
          </el-select>
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
              size="mini"
              v-hasPermi="['system:dict:export']"
              :disabled="multiple"
              @click="releaseAlarm"
            >批量处理</el-button>
          </el-col>
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
        <el-table :data="typeList" v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="报警名称" min-width="150" align="center" prop="alert" />
          <el-table-column label="报警类型" min-width="100" align="center" prop="alertType" />
          <el-table-column label="设备编号" min-width="100" align="center" prop="deviceCode" />
          <el-table-column label="产品名称" min-width="160" align="center" prop="productName" />
          <el-table-column label="位置" min-width="160" align="center" prop="addr" />
          <el-table-column label="处理状态" min-width="100" align="center" prop="processingStatus" />
          <!-- <el-table-column label="报警状态" align="center" prop="dataException" /> -->
          <el-table-column
            label="报警时间"
            min-width="160"
            align="center"
            prop="time"
            :formatter="mapping"
          />
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="viewData" @click="releaseAlarm(scope.row.alertId)">处理</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- @pagination="getList" -->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="search"
        />
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="open" width="400px">
      <div class="alarmp-processing">
        <el-radio
          v-model="radio"
          :label="item.dictValue"
          v-for="item in processinState"
        >{{item.dictLabel}}</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">提 交</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//   wellGroup
import { region, wellGroup, items } from "@/api/system/cover/coverManagement";
import { search, releaseAlarm, operator } from "@/api/alarm/alarm"; //报警啊api接口
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
      deviceCode: "",
      //部件编号:
      defaultGateway: "",
      // 部门树选项
      deptOptions: [],
      deptOptions: [],
      // 项目
      // project: [],
      // projectValue: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      //创建时间
      creationTime: "",
      //报警类型
      alarmType: [],
      alarmTypeValue: "",
      //报警名称
      alarmName: "",
      // 产品
      productTypeOptions: [],
      productTypeOptionsValue: "",
      /** 产品类型 */
      ImportProductName: [],
      productNameValue: "",
      //报警时间
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      //处理状态
      processinState: [],
      processinStateValue: "",
      dataException: "",
      beginTime: "",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: "",
      asd: "",
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
      },
      radio: ""
    };
  },

  mounted() {
    //   console.log(this.typeList.length);

    //区域
    this.getTreeselect();

    //井盖表格所有数据
    this.search();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    //报警类型
    this.getDicts("alert_type").then(res => {
      this.alarmType = res.data;
      let typeList = this.typeList;
      this.alarmType.map(p => {
        typeList.map(x => {
          if (p.dictValue == x.alertType) {
            x.alertType = p.dictLabel;
          }
        });
      });
    });
    //处理状态
    this.getDicts("sys_processing_status").then(res => {
      this.processinState = res.data;
      let typeList = this.typeList;
      this.processinState.map(p => {
        typeList.map(x => {
          if (p.dictValue == x.processingStatus) {
            x.processingStatus = p.dictLabel;
          }
        });
      });
    });
    this.$producttype.get().then(({ rows }) => {
      this.productTypeOptions = rows.map(x => ({
        label: x.productTypeName,
        value: x.productTypeId
      }));
    });
  },
  methods: {
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
    search() {
      let alarmType = this.alarmTypeValue; //报警状态
      let alarmName = this.alarmName; //报警状态

      let deviceCode = this.deviceCode; //设备编号
      let startData = this.beginTime
        ? moment(this.beginTime[0]).format("YYYY-MM-DD")
        : undefined;
      let endData = this.beginTime
        ? moment(this.beginTime[1]).format("YYYY-MM-DD")
        : undefined;
      let extProductId = this.productNameValue; //产品
      let processinState = this.processinStateValue; //处理状态

      let pageNum = this.queryParams.pageNum;
      let pageSize = this.queryParams.pageSize;

      var data = {
        alarmType,
        alarmName,
        deviceCode, //设备编号
        startData, //开始事件
        endData, //结束时间
        extProductId, //产品
        processinState, //处理状态
        pageSize,
        pageNum
      };
      this.loading = true;
      search(data).then(res => {
        this.typeList = res.rows;
        let alarmType = this.alarmType;
        let processinState = this.processinState;
        this.typeList.forEach(x => {
          x.alert = x.data.alert;
          x.time = x.data.time;
          if (x.dataException == 0) {
            x.dataException = "否";
          } else if (x.dataException == 1) {
            x.dataException = "是";
          }
          alarmType.map(p => {
            if (p.dictValue == x.alertType) {
              x.alertType = p.dictLabel;
            }
          });
          processinState.map(p => {
            if (p.dictValue == x.processingStatus) {
              x.processingStatus = p.dictLabel;
            }
          });
        });
        this.total = res.total;
        this.loading = false;
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
      this.managementGrouping.id = "";
      // console.log(this.management.id);
      this.search();
    },
    handleNodeClick1(data) {
      this.queryParams.deptId = data.id;
      this.managementGrouping.id = data.id;
      this.managementGrouping.label = data.label;
      this.management.id = "";
      // console.log(this.managementGrouping.id);

      this.search();
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
      this.ids = selection.map(item => item.alertId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;

      this.$confirm("是否确认导出所有类型数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportType(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    // 解除报警
    releaseAlarm(row) {
      this.asd = [row];
      this.open = true;
      this.title = "报警处理";
    },
    //批量处理
    submitFileForm() {
      let alertIds = this.ids || this.asd;
      console.log(alertIds);

      let processingStatus = this.radio;
      let data = {
        alertIds,
        processingStatus
      };
      if (processingStatus == "") {
        this.$message({
          showClose: true,
          message: "未选择,请选择处理状态",
          type: "error"
        });
      } else {
        operator(data).then(res => {
          this.msgSuccess("报警处理成功");
          this.search();
          this.open = false;
        });
      }
    },
    release(row) {
      let alertIds = [row.alertId];
      var data = {
        alertIds
      };
      releaseAlarm(data).then(res => {
        // console.log(res);
      });
    },
    mapping(row, column, index) {
      let result = "";
      const property = column.property;
      // console.log(property);
      if (["timestamp", "time"].includes(property)) {
        // console.log("key", property, row[property]);
        window.moment = moment;
        result = moment(row[property], "YYMMDDHHmm").format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      return result;
    },
    ImportproductType() {
      let data = this.productTypeOptionsValue;
      this.$product.getProductsByTypeId({ productTypeId: data }).then(
        ({ data }) => {
          // console.log(data);
          this.ImportProductName = data.map(x => ({
            label: x.productName,
            value: x.extProductId
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
  width: 100%;
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
  margin-top: 15px;
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
.alarmp-processing {
  text-align: center;
}
//设备id样式
.viewData {
  color: #1c84c6;
  cursor: pointer;
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
.el-table .el-table__header-wrapper th {
  text-align: center;
}
.el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
.el-date-range-picker__time-header {
  display: none;
}
</style>