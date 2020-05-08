<template>
  <div class="dashboard-editor-container">
    <div class="overview">
      <p class="generalView">设备概览</p>
      <div id="equipment"></div>
      <div class="tuglie">
        <p>
          离线设备:
          <span style="color:#FF3366;">{{countNumForOffStatus[0]}}</span>
        </p>
        <p>
          在线设备:
          <span style="color: #0096FA;">{{countNumForOnlineStatus[0]}}</span>
        </p>
        <p>
          启用设备:
          <span class>{{countNumForOpenRunningStatus[0]}}</span>
        </p>
      </div>
    </div>
    <div class="overview statistics">
      <p class="generalView">各类型下设备数量统计</p>
      <div id="various"></div>
    </div>
    <div class="overview event">
      <p class="generalView">事件统计</p>
      <div class="totalAlarm">
        <img class="img" src="../assets/index/u246.png" alt />
        <div class="xny_totalAlarm">
          <span>报警总数</span>
          <p>{{alarmToday.alertNumForSum}}</p>
        </div>
      </div>
      <div class="totalAlarm">
        <img class="img" src="../assets/index/u249.png" alt />
        <div class="xny_totalAlarm">
          <span>今日报警</span>
          <p>{{alarmToday.alertNumForToday}}</p>
        </div>
      </div>
    </div>
    <div class="overview policeDoday">
      <p class="generalView">今日警情</p>
      <router-link to="/callPolice/equipmentException">
        <p class="viewMore">查看更多</p>
      </router-link>
      <!--  @selection-change="handleSelectionChange" -->
      <el-table :data="typeList" v-loading="loading" height="300">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="报警名称" min-width="145" align="center" prop="alert" />
        <!-- <el-table-column label="报警类型" min-width="100" align="center" prop="messageType" /> -->
        <el-table-column label="设备编号" min-width="100" align="center" prop="deviceCode" />
        <el-table-column label="产品名称" min-width="125" align="center" prop="productName" />
        <!-- <el-table-column label="处理状态" min-width="100" align="center" prop="exceptionDesc" /> -->
        <!-- <el-table-column label="报警状态" align="center" prop="dataException" /> -->
        <!-- <el-table-column label="解除人" align="center" prop="relieveBy" /> -->
        <el-table-column
          label="报警时间"
          min-width="150"
          align="center"
          prop="time"
          :formatter="mapping"
        />
        <!-- <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <span class="viewData" @click="release(scope.row)">解除警报</span>
            </template>
        </el-table-column>-->
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  statistics,
  eventStatistics,
  statisticalOverview
} from "@/api/homePage/homePage";
import { search } from "@/api/alarm/alarm"; //报警啊api接口
import moment from "moment";

export default {
  name: "Index",
  components: {},
  data() {
    return {
      // 井盖管理数据
      countNumForOnlineStatus: [], //在线
      countNumForOffStatus: [], //离线
      countNumForOpenRunningStatus: [], //开启
      typeList: [],
      alarmToday: "", //事件统计
      // 查询参数
      pageNum: 1,
      pageSize: 10,

      loading: true
    };
  },
  mounted() {
    this.pieChart(); //饼图
    this.histogram(); //柱状图
    this.eventStatistics(); //事件统计
    this.deviceAlarm(); //事件统计
  },
  methods: {
    pieChart() {
      var equipment = this.$echarts.init(document.getElementById("equipment"));
      statisticalOverview().then(res => {
        // console.log(res.data);
        var arr = res.data;
        let countNumForOnlineStatus = this.countNumForOnlineStatus;
        let countNumForOffStatus = this.countNumForOffStatus;
        let countNumForOpenRunningStatus = this.countNumForOpenRunningStatus;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].status == "countNumForOnlineStatus") {
            countNumForOnlineStatus.push(arr[i].countNum);
          } else if (arr[i].status == "countNumForOffStatus") {
            countNumForOffStatus.push(arr[i].countNum);
          } else if (arr[i].status == "countNumForOpenRunningStatus") {
            countNumForOpenRunningStatus.push(arr[i].countNum);
          }
        }
        equipment.setOption({
          title: {},
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: ["离", "在"]
            // selected: {
            //   "离线": false,
            //   "在线": false
            //   //不想显示的都设置成false
            // }
          },
          series: [
            {
              name: "访问来源",
              type: "pie",
              radius: "70%",
              center: ["30%", "50%"],
              data: [
                {
                  value: countNumForOffStatus,
                  name: "离线",
                  // #FF3366
                  itemStyle: {
                    color: "#FF3366"
                  }
                },
                {
                  value: countNumForOnlineStatus, //
                  name: "在线",
                  // #0096FA
                  itemStyle: {
                    color: "#0096FA"
                  }
                }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        });
      });
    },
    histogram() {
      var various = this.$echarts.init(document.getElementById("various"));
      let dataName = [];
      let dataoffLine = []; //在线
      let dataonLine = []; //离线
      statistics().then(res => {
        var p = res.data;
        console.log(p);

        for (let i = 0; i < p.length; i++) {
          if (p[i].onlineStatus == 1) {
            // dataonLine[i] = p[i].count
            dataonLine.push(p[i].count);
          } else if (p[i].onlineStatus == 0) {
            dataoffLine.push(p[i].count);
          }
          if (
            p[i].productTypeName != "" &&
            p[i].productTypeName != null &&
            dataName.indexOf(p[i].productTypeName) == -1
          ) {
            dataName.push(p[i].productTypeName);
            // console.log(dataName);
          }
        }
        various.setOption({
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ["在线", "离线"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            data: dataName
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "在线",
              type: "bar",
              stack: "总量",

              itemStyle: {
                color: "#0096FA"
              },
              data: dataonLine
            },
            {
              name: "离线",
              type: "bar",
              stack: "总量",
              // label: {
              //     show: true,
              //     position: 'insideRight'
              // },
              itemStyle: {
                color: "#FF3366"
              },
              data: dataoffLine
            }
          ]
        });
      });
    },
    eventStatistics() {
      eventStatistics().then(res => {
        this.alarmToday = res.data;
      });
    },
    deviceAlarm() {
      this.loading = true;
      // pageNum: 1,
      // pageSize: 10,
      let pageNum = this.pageNum;
      let pageSize = this.pageSize;
      let startDate = moment().format("YYYY-MM-DD ");
      let endDate = moment().format("YYYY-MM-DD ");
      let data = {
        pageNum,
        pageSize,
        startDate,
        endDate
      };
      search(data).then(res => {
        console.log(res);
        this.typeList = res.rows;
        this.typeList.forEach(x => {
          x.alert = x.data.alert;
          x.time = x.data.time;
          if (x.dataException == 1) {
            x.dataException = "是";
            return;
          } else if (x.dataException == 0) {
            x.dataException = "否";
            return;
          }
        });
        // this.total = res.total;
        this.loading = false;
      });
    },
    mapping(row, column, index) {
      let result = "";
      const property = column.property;
      if (["timestamp", "time"].includes(property)) {
        // console.log("key", property, row[property]);
        window.moment = moment;
        result = moment(row[property], "YYMMDDHHmm").format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  overflow: hidden;
  .overview {
    position: relative;
    width: 49%;
    float: left;
    height: 334px;
    background-color: #fff;
  }
  .statistics {
    margin-left: 20px;
  }
  .event {
    margin-top: 20px;
  }
  .policeDoday {
    margin-top: 20px;
    margin-left: 20px;
  }
}
.generalView {
  margin: 0;
  height: 39px;
  line-height: 39px;
  padding-left: 15px;
  border-bottom: 1px solid #ccc;
}
.viewMore {
  padding: 0;
  margin: 0;
  position: absolute;
  right: 30px;
  top: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #0066ff;
}
.tuglie {
  position: absolute;
  top: 30%;
  right: 10%;
  font-size: 20px;
}
//报警总数
.totalAlarm {
  position: relative;
  float: left;
  margin-left: 20px;
  margin-top: 20px;
  width: 236px;
  height: 221px;
  background: inherit;
  background-color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(242, 242, 242, 1);
  border-radius: 4px;
  .img {
    width: 77px;
    height: 77px;
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
  .xny_totalAlarm {
    position: absolute;
    right: 30px;
    font-size: 20px;
    top: 40%;
    text-align: center;
    // transform: translateY(-50%);
    p {
      padding: 0;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
  }
}

//设备概览饼图
#equipment,
#various {
  width: 100%;
  height: calc(100% - 40px);
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
