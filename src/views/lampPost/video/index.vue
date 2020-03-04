<template>
  <div class="xny-region">
    <div class="Navigation">
      <span class="Monitor" :class="{xny_highlight:navBAr==0}" @click="navBAr=0">外网监控</span>
      <span class="History" :class="{xny_highlight:navBAr==1}" @click="navBAr=1">内网监控</span>
      <span class="History" :class="{xny_highlight:navBAr==2}" @click="navBAr=2">视频回放</span>
      <span class="History" :class="{xny_highlight:navBAr==3}" @click="navBAr=3">视频管理</span>
    </div>
    <div v-if="navBAr==0">
    <extranet></extranet>
    </div>
    <div v-if="navBAr==1">
      <Intranet></Intranet>
    </div>
    <div v-if="navBAr==2">
      <playback></playback>
    </div>
    <div v-if="navBAr==3">
      <administration></administration>
    </div>
  </div>
</template>
<script>
import extranet from './extranet'//外网监控
import Intranet from './Intranet'//内网监控
import playback from './playback'//视频回放
import administration from './administration'//视频管理

export default {
  components: { extranet,Intranet,playback,administration },
  data() {
    return {
   
      //导航栏
      navBAr: 0,
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


</style>
