<template>
  <div class="dashboard-editor-container">
    <div class="overview">
      <p class="generalView">设备概览</p>
      <div id="equipment"></div>
      <div class="tuglie">
        <p>
          离线设备:
          <span style="color:#FF3366;">20</span>
        </p>
        <p>
          在线设备:
          <span style="color: #0096FA;">160</span>
        </p>
        <p>
          启用设备:
          <span class>180</span>
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
          <p>4220</p>
        </div>
      </div>
      <div class="totalAlarm">
        <img class="img" src="../assets/index/u249.png" alt />
        <div class="xny_totalAlarm">
          <span>今日报警</span>
          <p>61</p>
        </div>
      </div>
    </div>
    <div class="overview policeDoday">
      <p class="generalView">今日警情</p>
      <p class="viewMore">查看更多</p>
     <!-- v-loading="loading" -->
        <el-table :data="typeList" @selection-change="handleSelectionChange">
          <el-table-column label="报警编号" min-width="100" align="center" prop="deviceName" />
          <el-table-column label="设备ID" min-width="100">
            <template slot-scope="scope">
               <!-- @click="deviceInformation" -->
                <span class="viewData">{{scope.row.eviceID}}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" align="center" prop="region" />
          <el-table-column label="报警类型" align="center" prop="deviceState" />
          <el-table-column label="报警描述" align="center" prop="alarmView" />
          <el-table-column label="报警时间" align="center" prop="processing" />
          </el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  components: {},
  data() {
    return {
        // 井盖管理数据
      typeList: [
        {
          deviceName: "YC-15875745744", //设备名称
          eviceID: "55669988", //设备ID
          region: "井盖状态监测终端", //在线状态
          deviceState: "低电报警", //设备状态
          alarmView: "当前电量5%，低于设置阈值10%。", //报警查看
          processing: "2019-12-20 23:05:59", //一键处理
          voltage: "-", //电压
          current: "-", //电流
          activePower: "-", //有功功率
          reactivePower: "-", //有功功率
          powerFactor: "-", //功率因数
          temperature: "-", //温度
          signalIntensity: "-", //信号强度
          NB_IMSI: "-", //NB_IMSI
          apparentPower: "-", //视在电能
          runningTime: "-", //运行时间
          reportingTime: "-" ,//上报时间
         
        }
      ],
    };
  },
  mounted() {
    this.pieChart(); //饼图
    this.histogram(); //柱状图
  },
  methods: {
    pieChart() {
      var equipment = this.$echarts.init(document.getElementById("equipment"));
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
            center: ["25%", "40%"],
            data: [
              {
                value: 20,
                name: "离线",
                // #FF3366
                itemStyle: {
                  color: "#FF3366"
                }
              },
              {
                value: 160,
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
    },
    histogram() {
      var various = this.$echarts.init(document.getElementById("various"));
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
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          data: ["灯控器", "网关", "LED屏", "传感设备", "井盖状态", "井下液位"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "在线",
            type: "bar",
            stack: "总量",
            // label: {
            //     show: true,
            //     position: 'insideRight'
            // },
             itemStyle: {
                  color: "#0096FA"
                },
            data: [320, 302, 301, 334, 390, 330]
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
            data: [120, 132, 101, 134, 90, 230]
          }
        ]
      });
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
  .policeDoday{
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
.viewMore{
  padding: 0;
  margin: 0;
  position: absolute;
  right: 30px;
  top: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #0066FF;
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
