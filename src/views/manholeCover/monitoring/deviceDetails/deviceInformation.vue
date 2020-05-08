<template>
  <div class="xny-region1">
    <div class="xny-search">
      <!-- v-model="deptName" -->
      <el-row type="flex" justify="space-around" :gutter="20">
        <el-col :span="14">
          <el-card>
            <div slot="header" class="clearfix">
              <span>基础信息</span>
            </div>
            <el-row class="infos">
              <el-col :span="3" style="text-align: center; font-weight: bolder;">编号:</el-col>
              <el-col :span="21">
                <span style="font-weight: bolder">{{basicInformation.deviceCode}}</span>
                <span
                  style="font-weight: bolder; margin-left: 10px;"
                >[{{basicInformation.productName}}]</span>
              </el-col>
            </el-row>

            <el-row class="infos">
              <el-col :span="3">在线状态：</el-col>
              <el-col :span="5">
                <label v-if="basicInformation.onlineStatus == '1'" style="color: #67C23A">在线</label>
                <label v-else style="color: #F56C6C">离线</label>
              </el-col>
              <el-col :span="3">告警状态：</el-col>
              <el-col :span="5">
                {{basicInformation.alertListStr}}
                <!-- <label
                                    v-if="basicInformation.onlineStatus == '1'"
                                    style="color: #67C23A"
                                >在线</label>
                <label v-else style="color: #F56C6C">离线</label>-->
              </el-col>
              <el-col :span="3">启用状态：</el-col>
              <el-col :span="5">
                <label v-if="basicInformation.runningState == '1'" style="color: #67C23A">启用</label>
                <label v-else style="color: #909399">未启用</label>
              </el-col>
            </el-row>

            <el-row class="infos">
              <el-col :span="3">产品名称：</el-col>
              <el-col :span="5">{{basicInformation.deviceTypeName || '-'}}</el-col>
              <el-col :span="3">产品类型：</el-col>
              <el-col :span="5">{{basicInformation.deviceTypeName || '-'}}</el-col>
              <el-col :span="3">创建时间：</el-col>
              <el-col :span="5">{{basicInformation.registerTime || '-'}}</el-col>
            </el-row>
            <el-row class="infos">
              <el-col :span="3">所属项目：</el-col>
              <el-col :span="5">{{basicInformation.projectName || '-'}}</el-col>
              <el-col :span="3">所在分组：</el-col>
              <el-col :span="5">{{basicInformation.groupName || '-'}}</el-col>
              <el-col :span="3">所在区域：</el-col>
              <el-col :span="5">{{basicInformation.areaName || '-'}}</el-col>
            </el-row>

            <el-row class="infos">
              <el-col :span="3">关联部件：</el-col>
              <el-col
                :span="5"
                :title="basicInformation.partsName"
              >{{basicInformation.partsCode || '-'}}</el-col>
              <el-col :span="3">详细地址：</el-col>
              <el-col :span="13">{{basicInformation.groupName || '-'}}</el-col>
            </el-row>

            <el-row class="infos">
              <template v-for="(item, index) in custom">
                <el-col :span="3">{{item.deviceFieldNameCn}}：</el-col>
                <el-col :span="5">{{item.deviceFieldValue}}</el-col>
              </template>
            </el-row>
          </el-card>
        </el-col>
        <el-col type="flex" :span="10">
          <!-- <div class="position">
                        <p class="information">设备位置</p>
                        <div id="allmap"></div>
          </div>-->
          <el-card>
            <div slot="header" class="clearfix">
              <span>设备位置</span>
            </div>
            <div id="allmap"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>最新数据</span>
            </div>
            <!-- v-loading="loading" -->
            <el-table :data="typeList" v-loading="loading">
              <el-table-column
                label="上传数据"
                min-width="100"
                align="center"
                prop="deviceFieldNameCn"
              />
              <el-table-column label="最新数据" align="center" prop="deviceFieldValue" />
              <el-table-column label="更新时间" align="center" prop="uploadDate" />
            </el-table>
            <!-- @pagination="getList" -->
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="pageNum"
              :limit.sync="pageSize"
              @pagination="2"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { queryDevice, sensor } from "@/api/system/cover/coverManagement";
import { treeselect } from "@/api/system/dept";
export default {
  props: ["deviceId"],
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
      total: 0,
      // 井盖管理数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      basicInformation: [], //基础信息
      custom: [], //基础信息自定义
      // 日期范围
      dateRange: [],

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
      //分页
      pageNum: 1,
      pageSize: 10,
      productId: "",
      // 经度
      latitude: "",
      // 纬度
      longitude: ""
    };
  },

  mounted() {
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.allmap();
    this.product();
  },
  methods: {
    // 引入百度地图
    allmap() {
      // 百度地图API功能
      var map = new BMap.Map("allmap"); // 创建Map实例
      map.centerAndZoom(new BMap.Point(119.28, 26.08), 13); // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
        })
      );
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      var latitude = this.latitude;
      var longitude = this.longitude;
      var deviceId = this.deviceId;

      queryDevice(deviceId).then(res => {
        this.basicInformation = res.data;
        this.custom = res.data.deviceFields;
        if (
          res.data.latitude != null &&
          res.data.longitude != null &&
          res.data.longitude != "" &&
          res.data.latitude !== ""
        ) {
          latitude = res.data.latitude; //经度
          longitude = res.data.longitude; ///纬度
          var marker = new BMap.Marker(new BMap.Point(longitude, latitude));
          marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

          map.addOverlay(marker);
        }
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
      //   this.dateRange = [];
      //   this.resetForm("queryForm");
      //   this.handleQuery();
    },

    //产品id
    product() {
      var deviceId = this.deviceId;
      var pageNum = this.pageNum;
      var pageSize = this.pageSize;
      var data = {
        pageNum,
        pageSize,
        deviceId
      };
      this.loading = true;
      sensor(data).then(res => {
        this.typeList = res.rows;
        this.total = res.total;
        this.loading = false;
        // console.log(this.typeList);
      });
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
  width: 100%;
  .information {
    margin: 0;
    padding: 0;
    margin-left: 20px;
    height: 40px;
    line-height: 40px;
    font-weight: 500;
    font-size: 18px;
    border-bottom: 1px solid #ccc;
  }
  ul {
    margin: 0;
    padding: 0;
    font-size: 16px;
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
  width: 100%;
  .information {
    height: 100%;
    margin: 0;
    padding: 0;
    margin-left: 20px;
    height: 40px;
    line-height: 40px;
    font-weight: 500;
    font-size: 18px;
    border-bottom: 1px solid #ccc;
  }
}
// 引入百度地图
#allmap {
  width: 100%;
  height: 100%;
  min-height: 23vh;
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
.infos .el-col {
  font-size: 14px;
  padding: 10px 6px;
}
.infos .el-col:first-child,
.infos .el-col:nth-child(3),
.infos .el-col:nth-child(5) {
  text-align: right;
}
</style>