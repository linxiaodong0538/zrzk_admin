<template>
  <div class="xny-xinzeng">
    <div class="xny-Manhole">
      <span>任务名称：</span>
      <el-input placeholder size="small" class="Manhole" v-model="coverNumber" />
    </div>
    <el-table :data="typeList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="策略名称" align="center" prop="lanternsName" />
      <el-table-column label="描述" align="center" prop="lanternsName" />
    </el-table>
    <div slot="footer" class="dialog-footer layui-layer-btn">
      <el-button type="primary" size="mini">确 定</el-button>
      <el-button @click="cancel" size="mini">关 闭</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["id", "label"],
  data() {
    return {
      // 表单参数
      form: {},
      typeList: [
        {
          lanternsName: "-", //灯具名称
          controllerAddress: "-", //灯控制器地址
          onlineState: "-", //在线状态
          deviceState: "-", //设备状态
          alarmView: "-", //报警查看
          processing: "-", //一键处理
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
          reportingTime: "-" //上报时间
        }
      ],
      // 是否显示弹出层
      open: true,
      // 搜索区域
      fla: false,
      coverNumber: "",
      longitude: "",
      latitude: "",
      wellDepth: "",
      title: ""
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.$emit("cancel2", this.open);
    }
  }
};
</script>

<style lang="scss" scoped>
.xny-Manhole{
  margin-bottom: 20px;
}
.layui-layer-btn {
  padding-right: 20px;
  margin-top: 20px;
}
.dialog-footer {
  // float: right;
  text-align: right;
}
.Manhole {
  width: 200px;
  height: 30px;
}
</style>