<template>
  <div class="xny-region">
    <div class="Navigation">
      <span class="Monitor" :class="{xny_highlight:navBAr==0}" @click="navBAr=0">设备信息</span>
      <span class="History" :class="{xny_highlight:navBAr==1}" @click="navBAr=1">操作记录</span>
      <span class="History" :class="{xny_highlight:navBAr==2}" @click="navBAr=2">设备参数</span>
    </div>
    <div v-if="navBAr==0">
    <deviceInformation></deviceInformation>
    </div>
    <div v-if="navBAr==1">
     <operationRecord></operationRecord>
    </div>
    <div v-if="navBAr==2">
      <parameters></parameters>
    </div>
    <div v-if="navBAr==3">
    </div>
  </div>
</template>
<script>
import deviceInformation from './deviceInformation';//设备信息
import operationRecord from './operationRecord';//操作记录
import parameters from './parameters/index';//设备参数
export default {
  
  components: {deviceInformation,operationRecord,parameters},
  data() {
    return {
   
      //导航栏
      navBAr: 0,
    }
  },
  created() {
      const dictId = this.$route.params && this.$route.params.dictId;//获取id传参
      
  },
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


</style>
