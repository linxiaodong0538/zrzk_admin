<template>
  <div class="xny-xinzeng">
      <div>
        <span>任务名称：</span>
         <el-input placeholder="" size="small" class="Manhole" v-model="coverNumber" />
      </div>
      <div class="action">
        <p>动作</p>
        <p> <el-radio v-model="radio" label="1">开灯</el-radio></p>
        <p> <el-radio v-model="radio" label="2">关灯</el-radio></p>
        <p class="dimming"> <el-radio class="xnydimming" v-model="radio" label="3">调光</el-radio> <el-slider class="slider" v-model="value1"></el-slider></p>
        <p> <el-radio v-model="radio" label="4">读取信息</el-radio></p>
      </div>
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
        value1: 0,
         radio: '',
      // 是否显示弹出层
      open: true,
      // 搜索区域
      fla: false,
      //所在机构
      coverNumber:'',
      mechanism: "",
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
.Manhole {
 
  width: 200px;
  height: 30px;
}
.action{
  margin-left: 20px;
  padding-left: 20px;
}
.dimming{
   margin: 0;
  padding: 0;
  position: relative;
  height: 38px;
  vertical-align: middle;
  .xnydimming{
    line-height: 38px;
  }
}
.slider{
  // float: left;
  position: absolute;
  top: 0;
  left: 100px;
  width: 400px;
}
</style>