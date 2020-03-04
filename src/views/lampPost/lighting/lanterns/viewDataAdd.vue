<template>
  <div class="xny-xinzeng">
   <el-table :data="typeList" @selection-change="">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="电压(A)" align="center" prop="lanternsName" />
            <el-table-column label="电流(A)" align="center" prop="lanternsName" />
            <el-table-column label="有功功率(W)" min-width="100" align="center" prop="controllerAddress" />
            <el-table-column label="无功功率(Var)" min-width="120" align="center" prop="reportingTime" />
            <el-table-column label="频率" align="center" prop="reportingTime" />
            <el-table-column label="温度(℃)" align="center" prop="reportingTime" />
            <el-table-column label="亮度" align="center" prop="reportingTime" />
            <el-table-column label="开关状态" align="center" prop="reportingTime" />
          </el-table>
      <div slot="footer" class="dialog-footer layui-layer-btn">
      <el-button type="primary" size="mini">确 定</el-button>
      <el-button @click="cancel" size="mini">关 闭</el-button>
    </div>
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
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ]
      },
      // 是否显示弹出层
      open: true,
      // 搜索区域
      fla: false,
      //所在机构
      mechanism: "",
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
      this.$emit("cancel1", this.open);
    },
    searchArea() {
      this.fla = true;
      this.title = "新增井盖";
      this.getTreeselect();
    },
   
  }
};
</script>

<style lang="scss" scoped>
.layui-layer-btn{
  padding-right: 20px;
  margin-top: 20px;
}
.dialog-footer {
  // float: right;
  text-align: right;
}
</style>