<template>
  <div class="xny-region">
    <div class="xny-search">
      <!-- v-model="deptName" -->
      <div class="xny-cover">
        <div class="xny-Manhole">
          <p class="information">基础信息</p>
          <ul>
            <li>
              <div>
                <span class="wisdom">ID：99887766</span>
                <span class="wisdom">（智慧井盖状态监测终端）</span>
              </div>
            </li>
            <li>
              <div>
                <span class="equipment">设备类型：监控类</span>
                <span class="equipment">型号：ds003</span>
                <span class="equipment">部件ID：336662</span>
              </div>
            </li>
            <li>
              <div>
                <span class="equipment">所在区域：福州市鼓楼区</span>
                <span class="equipment">项目：井盖项目1期</span>
                <span class="equipment">机构：机构1</span>
                <span class="equipment">分组：分组1</span>
              </div>
            </li>
            <li>
              <div>
                <span>接入协议：NB-IOT</span>
              </div>
            </li>
            <li>
              <div>
                <span class="equipment">IMEI：86803331487511877</span>
                <span class="equipment">IMSI：454891548717</span>
              </div>
            </li>
            <li>
              <div>
                <span>创建时间：2019.01.10 15:30:24</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="position">
          <p class="information">设备位置</p>
          <div id="allmap"></div>
        </div>
      </div>
      <div class="coverForm">
        <!-- v-loading="loading" -->
        <el-table :data="typeList">
          <el-table-column label="传感器名称" min-width="100" align="center" prop="deviceName" />
          <el-table-column label="最新数据" align="center" prop="alarmView" />
          <el-table-column label="更新时间" align="center" prop="region" />
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
      gatewayName: "",
      //部件编号:
      defaultGateway: "",
      // 部门树选项
      deptOptions: [],
      deptOptions: [],

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
        {
          deviceName: "剩余电量", //设备名称
          alarmView: "23%", //在线状态
          region: "2020.01.19 10:00:03" //设备ID
        },
        {
          deviceName: "剩余电量", //设备名称
          alarmView: "23%", //在线状态
          region: "2020.01.19 10:00:03" //设备ID
        },
        {
          deviceName: "剩余电量", //设备名称
          alarmView: "23%", //在线状态
          region: "2020.01.19 10:00:03" //设备ID
        },
        {
          deviceName: "剩余电量", //设备名称
          alarmView: "23%", //在线状态
          region: "2020.01.19 10:00:03" //设备ID
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
      }
    };
  },

  mounted() {
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.allmap();
  },
  methods: {
    // 引入百度地图
    allmap() {
      // 百度地图API功能
      var map = new BMap.Map("allmap"); // 创建Map实例
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
        })
      );
      map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
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

    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
<style lang="scss" scoped>
ul {
  list-style: none;
}
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

.tabBackgrounddefault {
  background-color: #e5e5e5;
  border: 1px solid #e5e5e5;
  color: white;
  cursor: pointer;
}

.head-container {
  margin-left: 15px;
  margin-top: 15px;
}
.xny-search {
  float: left;
  width: 100%;
}
.xny-cover {
  display: flex;
}
.xny-Manhole,
.coverForm,
.position {
  background-color: #fff;
  margin-left: 15px;
  margin-right: 20px;
  border-radius: 8px;
  margin-top: 10px;
  padding: 5px 15px 13px 15px;
  background-color: #fff;
  font-size: 13px;
}

.xny-Manhole {
  margin-top: 10px;
  // float: left;
  width: 47%;
  .information {
    margin: 0;
    padding: 0;
    margin-left: 20px;
    height: 40px;
    line-height: 40px;
    font-weight: 500;
    font-size: 24px;
    border-bottom: 1px solid #ccc;
  }
  ul {
    margin: 0;
    padding: 0;
    font-size: 18px;
    margin-left: 20px;
    li {
      margin-top: 20px;
    }
    .wisdom {
      font-weight: 600;
    }
    .equipment {
      margin-right: 20px;
    }
  }
}
// 设备位置
.position {
  width: 50%;
  .information {
    margin: 0;
    padding: 0;
    margin-left: 20px;
    height: 40px;
    line-height: 40px;
    font-weight: 500;
    font-size: 24px;
    border-bottom: 1px solid #ccc;
  }
}
// 引入百度地图
#allmap {
  width: 100%;
  height: calc(100% - 40px);
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
</style>