<template>
  <div class="xny-region">
    <div class="Navigation">
      <span class="Monitor" :class="{xny_highlight:navBAr==0}" @click="navBAr=0">对讲设备</span>
      <span class="History" :class="{xny_highlight:navBAr==1}" @click="navBAr=1">接警</span>

    </div>
    <div v-if="navBAr==0">
      <talkback></talkback>
    </div>
    <div v-if="navBAr==1">
      <alarm></alarm>
    </div>

  </div>
</template>
<script>

import alarm from './alarm'
import talkback from './talkback'
export default {
  components: { alarm,talkback },
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
