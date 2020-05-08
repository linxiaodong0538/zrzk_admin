<template>
  <div class="xny-region">
    <div class="xny-search">
      <!-- v-model="deptName" -->
      <div class="xny-cover">
        <div class="xny-Manhole">
          <span class="coverList">设备编号:</span>
          <el-input placeholder size="small" class="Manhole" v-model="deviceCode" />
          <span class="coverList">采集时间:</span>
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
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:dict:export']"
            >导出</el-button>
          </el-col>
        </el-row>
        <!-- v-loading="loading" -->
        <el-table :data="models" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="采集时间"
            min-width="140"
            align="center"
            prop="time"
            :formatter="mapping"
          />
          <el-table-column
            label="上报时间"
            min-width="140"
            align="center"
            prop="time"
            :formatter="mapping"
          />
          <!-- <el-table-column label="设备状态" align="center" prop="onlineState" /> -->
          <template v-for="opt in fields">
            <el-table-column
              :label="opt.productFieldNameCn"
              :prop="opt.productFieldName"
              :key="opt.productFieldName"
            />
          </template>
          <!-- <el-table-column label="亮度" align="center" prop="deviceState" />
                    <el-table-column label="电压(V)" align="center" prop />
                    <el-table-column label="电流" align="center" prop />
                    <el-table-column label="有功功率" align="center" prop />
                    <el-table-column label="无功功率" align="center" prop />
                    <el-table-column label="功率因数" align="center" prop />
                    <el-table-column label="温度(℃)" align="center" prop />
                    <el-table-column label="信号强度" align="center" prop />
          <el-table-column label="视在电能" align="center" prop />-->
        </el-table>
        <!-- @pagination="getList" -->
        <!-- @pagination="search" -->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="search"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { treeselect } from "@/api/system/dept";
import { Paginator } from "@/dtos/paginator";
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
      deviceCode: this.$route.query.deviceCode,
      //部件编号:
      defaultGateway: "",
      // 部门树选项
      deptOptions: [],
      deptOptions: [],

      defaultProps: {
        children: "children",
        label: "label"
      },
      //创建时间
      creationTime: "",

      // 遮罩层
      loading: true,

      /** 设备 */
      device: null,
      /** 设备的扩展字段 */
      fields: [],
      /** 历史数据 */
      models: [],

      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      //   total: 0,
      total: 0,
      // 井盖管理数据
      typeList: [
        {
          lanternsName: "2020.01.17 15：33", //灯具名称
          controllerAddress: "2020.01.17 15：33", //灯控制器地址
          onlineState: "60%", //在线状态
          deviceState: "1.4" //设备状态
        }
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
      },
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
      beginTime: ""
    };
  },
  async created() {
    let deviceId = this.$route.query.deviceId;
    // console.log(this.$route);
    // console.log(this.$route.query.deviceId);
    
    if (!deviceId) {
      this.$message.error("参数异常");
      return;
    }
    let { data } = await this.$device.get({ id: deviceId });
    console.log("device", data);
    this.device = data;
    this.search();
    await this.$lamp
      .getFields({
        productId: this.device.productId,
        type: 1
      })
      .then(({ data }) => {
        this.fields = data;
      });
    // console.log("list", data);

    console.log(
      "pamas",
      this.$route.params,
      this.$route.queryParams,
      this.$route.query
    );
  },
  mounted() {
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    search() {
      let deviceCode = this.deviceCode;
      let startDate = this.beginTime
        ? moment(this.beginTime[0]).format("YYYY-MM-DD")
        : undefined;
      let endDate = this.beginTime
        ? moment(this.beginTime[1]).format("YYYY-MM-DD")
        : undefined;
      const params = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        deviceId: this.device.deviceId,
        deviceCode,
        startDate,
        endDate
      };
      this.$lamp.searchHistory(params).then(({ rows, total }) => {
        // var models = this.models;
        // console.log(rows);

        let list = [];
        var q = rows;
        q.forEach(i => {
          list.push(i.data);
        });
        // console.log(list);
        this.models = list.map(x => {
          x = Object.assign({}, x.payload, x);
          delete x.payload;
          return x;
        });
        // console.log(this.models);
        this.total = total;
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
      this.deviceCode = "";
      this.beginTime = "";
      
      //   this.resetForm("queryForm");
      //   this.handleQuery();
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
    handleSizeChange(size) {
      // if (!this.pager) {
      //   this.pager = new Paginator();
      // }
      // this.pager.size = size;
      // const count = Math.ceil(this.pager.all / size);
      // this.pager.count = count;
      // this.pager.index = 1;
      // this.search();
    },
    handleCurrentChange(index) {
      this.search();
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
      // console.log(queryParams);

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
      if (["timestamp", "time"].includes(property)) {
        // console.log("key", property, row[property]);
        window.moment = moment;
        result = moment(row[property], "YYMMDDhhmm").format(
          "YYYY-MM-DD HH:mm:ss"
        );
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
.el-date-range-picker__time-header{
  display:none;
}
</style>